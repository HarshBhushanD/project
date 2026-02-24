import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, getDoc, query, where, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  FolderOpen, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  Loader2
} from 'lucide-react';
import Navbar from './navbar';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!mounted || !user) {
        if (!user && mounted) setLoading(false);
        return;
      }
      try {
        const userSnap = await getDoc(doc(db, 'users', user.uid));
        const companyName = userSnap.exists() ? (userSnap.data().companyName || null) : null;
        await fetchProjects(companyName);
      } catch (err) {
        console.error('Error loading dashboard:', err);
        if (mounted) setError('Failed to load dashboard data');
      } finally {
        if (mounted) setLoading(false);
      }
    });
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const fetchProjects = async (companyName) => {
    try {
      if (!companyName || !companyName.trim()) {
        setProjects([]);
        return;
      }
      const q = query(
        collection(db, 'projects'),
        where('companyName', '==', companyName.trim()),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const projectsData = querySnapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setProjects(projectsData);
    } catch (err) {
      console.error('Error fetching projects:', err);
      if (err.code === 'firestore/index-not-found' || err.message?.includes('index')) {
        setError('Dashboard index is being set up. Please try again in a moment.');
      } else {
        setError('Failed to load dashboard data');
      }
      setProjects([]);
    }
  };

  const getProjectStats = () => {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'active').length;
    const completed = projects.filter(p => p.status === 'completed').length;
    return { total, active, completed };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const stats = getProjectStats();

  return (
  <>
  <Navbar/>
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back! Here's an overview of your projects.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Projects</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {projects.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No projects found. Create your first project to get started.
              </div>
            ) : (
              projects.map(project => (
                <div 
                  key={project.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${project.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              project.status === 'active' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-gray-100 text-gray-800'}`}
                        >
                          {project.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {project.description || 'No description provided'}
                      </p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                        {project.deadline && (
                          <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      {project.priority === 'high' && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View All Projects
          </button>
        </div>
      </div>
    </div>
        </>
  );
};

export default Dashboard;