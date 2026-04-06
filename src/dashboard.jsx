// import React, { useState, useEffect } from 'react';
// import { db, auth } from './firebase';
// import { onAuthStateChanged } from 'firebase/auth';
// import { collection, getDocs, doc, getDoc, query, where, orderBy } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';
// import { 
//   FolderOpen, 
//   Clock, 
//   AlertCircle, 
//   CheckCircle2,
//   Loader2
// } from 'lucide-react';
// import Navbar from './navbar';

// const Dashboard = () => {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const navigate = useNavigate();

//   useEffect(() => {
//     let mounted = true;
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (!mounted || !user) {
//         if (!user && mounted) setLoading(false);
//         return;
//       }
//       try {
//         const userSnap = await getDoc(doc(db, 'users', user.uid));
//         const companyName = userSnap.exists() ? (userSnap.data().companyName || null) : null;
//         await fetchProjects(companyName);
//       } catch (err) {
//         console.error('Error loading dashboard:', err);
//         if (mounted) setError('Failed to load dashboard data');
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     });
//     return () => {
//       mounted = false;
//       unsubscribe();
//     };
//   }, []);

//   const fetchProjects = async (companyName) => {
//     try {
//       if (!companyName || !companyName.trim()) {
//         setProjects([]);
//         return;
//       }
//       const q = query(
//         collection(db, 'projects'),
//         where('companyName', '==', companyName.trim()),
//         orderBy('createdAt', 'desc')
//       );
//       const querySnapshot = await getDocs(q);
//       const projectsData = querySnapshot.docs.map(d => ({
//         id: d.id,
//         ...d.data()
//       }));
//       setProjects(projectsData);
//     } catch (err) {
//       console.error('Error fetching projects:', err);
//       if (err.code === 'firestore/index-not-found' || err.message?.includes('index')) {
//         setError('Dashboard index is being set up. Please try again in a moment.');
//       } else {
//         setError('Failed to load dashboard data');
//       }
//       setProjects([]);
//     }
//   };

//   const getProjectStats = () => {
//     const total = projects.length;
//     const active = projects.filter(p => p.status === 'active').length;
//     const completed = projects.filter(p => p.status === 'completed').length;
//     return { total, active, completed };
//   };

//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <div className="ui-page-main ml-64 flex min-h-screen items-center justify-center">
//           <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
//         </div>
//       </>
//     );
//   }

//   const stats = getProjectStats();
//   const filteredProjects = statusFilter === 'all' 
//     ? projects 
//     : projects.filter(p => p.status === statusFilter);

//   return (
//   <>
//   <Navbar/>
//     <div className="ui-page-main ml-64 p-4 sm:p-6 lg:p-8">
//       <div className="mx-auto max-w-7xl">
//         <div className="ui-card mb-8 overflow-hidden p-6 sm:p-8">
//           <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
//             <div>
//               <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Overview</p>
//               <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Dashboard</h1>
//               <p className="mt-2 max-w-xl text-sm text-slate-600">
//                 Welcome back! Here&apos;s an overview of your projects.
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           <div className="ui-card p-6">
//             <div className="flex items-start justify-between gap-3">
//               <div>
//                 <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total</p>
//                 <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">{stats.total}</p>
//                 <p className="mt-1 text-sm text-slate-600">All projects</p>
//               </div>
//               <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
//                 <FolderOpen className="h-6 w-6" />
//               </span>
//             </div>
//           </div>

//           <div className="ui-card p-6">
//             <div className="flex items-start justify-between gap-3">
//               <div>
//                 <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Active</p>
//                 <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">{stats.active}</p>
//                 <p className="mt-1 text-sm text-slate-600">In progress</p>
//               </div>
//               <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
//                 <Clock className="h-6 w-6" />
//               </span>
//             </div>
//           </div>

//           <div className="ui-card p-6">
//             <div className="flex items-start justify-between gap-3">
//               <div>
//                 <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Completed</p>
//                 <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">{stats.completed}</p>
//                 <p className="mt-1 text-sm text-slate-600">Shipped</p>
//               </div>
//               <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
//                 <CheckCircle2 className="h-6 w-6" />
//               </span>
//             </div>
//           </div>
//         </div>

//         {error && (
//           <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
//             {error}
//           </div>
//         )}

//         <div className="ui-card overflow-hidden">
//           <div className="flex flex-col gap-4 border-b border-slate-200/80 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
//             <h2 className="text-lg font-semibold text-slate-900">Recent projects</h2>
//             <div className="flex flex-wrap gap-2 text-sm">
//               <button
//                 onClick={() => setStatusFilter('all')}
//                 className={`rounded-full border px-3 py-1.5 font-medium transition ${
//                   statusFilter === 'all'
//                     ? 'border-indigo-200 bg-indigo-50 text-indigo-800'
//                     : 'border-slate-200 text-slate-600 hover:bg-slate-50'
//                 }`}
//               >
//                 All
//               </button>
//               <button
//                 onClick={() => setStatusFilter('active')}
//                 className={`rounded-full border px-3 py-1.5 font-medium transition ${
//                   statusFilter === 'active'
//                     ? 'border-amber-200 bg-amber-50 text-amber-900'
//                     : 'border-slate-200 text-slate-600 hover:bg-slate-50'
//                 }`}
//               >
//                 Active
//               </button>
//               <button
//                 onClick={() => setStatusFilter('completed')}
//                 className={`rounded-full border px-3 py-1.5 font-medium transition ${
//                   statusFilter === 'completed'
//                     ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
//                     : 'border-slate-200 text-slate-600 hover:bg-slate-50'
//                 }`}
//               >
//                 Completed
//               </button>
//             </div>
//           </div>
//           <div className="divide-y divide-slate-100">
//             {filteredProjects.length === 0 ? (
//               <div className="p-8 text-center text-sm text-slate-500">
//                 {projects.length === 0
//                   ? 'No projects found. Create your first project to get started.'
//                   : 'No projects match this filter.'}
//               </div>
//             ) : (
//               filteredProjects.map(project => (
//                 <div 
//                   key={project.id}
//                   className="cursor-pointer p-6 transition-colors hover:bg-slate-50/80"
//                   onClick={() => navigate(`/projects/${project.id}`)}
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-center space-x-3">
//                         <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
//                         <span 
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
//                             ${project.status === 'completed' ? 'bg-green-100 text-green-800' : 
//                               project.status === 'active' ? 'bg-yellow-100 text-yellow-800' : 
//                               'bg-gray-100 text-gray-800'}`}
//                         >
//                           {project.status}
//                         </span>
//                       </div>
//                       <p className="mt-1 text-sm text-gray-500">
//                         {project.description || 'No description provided'}
//                       </p>
//                       <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
//                         <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
//                         {project.deadline && (
//                           <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
//                         )}
//                       </div>
//                     </div>
//                     <div className="ml-4">
//                       {project.priority === 'high' && (
//                         <AlertCircle className="h-5 w-5 text-red-500" />
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         <div className="mt-8 flex justify-end">
//           <button
//             onClick={() => navigate('/projects')}
//             className="ui-btn-primary px-5 py-2.5"
//           >
//             View all projects
//           </button>
//         </div>
//       </div>
//     </div>
//         </>
//   );
// };

// export default Dashboard;
import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
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
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!mounted || !user) {
        if (!user && mounted) setLoading(false);
        return;
      }

      try {
        await fetchProjects();
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

  const fetchProjects = async () => {
    try {
      const q = query(
        collection(db, 'projects'),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);

      const projectsData = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));

      setProjects(projectsData);
      setError('');
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load dashboard data');
      setProjects([]);
    }
  };

  const getProjectStats = () => {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'active').length;
    const completed = projects.filter(p => p.status === 'completed').length;
    return { total, active, completed };
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';

    try {
      if (dateValue?.toDate) {
        return dateValue.toDate().toLocaleDateString();
      }
      return new Date(dateValue).toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="ui-page-main ml-64 flex min-h-screen items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        </div>
      </>
    );
  }

  const stats = getProjectStats();
  const filteredProjects = statusFilter === 'all' 
    ? projects 
    : projects.filter(p => p.status === statusFilter);

  return (
    <>
      <Navbar />
      <div className="ui-page-main ml-64 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="ui-card mb-8 overflow-hidden p-6 sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Overview</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Dashboard</h1>
                <p className="mt-2 max-w-xl text-sm text-slate-600">
                  Welcome back! Here&apos;s an overview of your projects.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="ui-card p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total</p>
                  <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">{stats.total}</p>
                  <p className="mt-1 text-sm text-slate-600">All projects</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                  <FolderOpen className="h-6 w-6" />
                </span>
              </div>
            </div>

            <div className="ui-card p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Active</p>
                  <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">{stats.active}</p>
                  <p className="mt-1 text-sm text-slate-600">In progress</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <Clock className="h-6 w-6" />
                </span>
              </div>
            </div>

            <div className="ui-card p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Completed</p>
                  <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">{stats.completed}</p>
                  <p className="mt-1 text-sm text-slate-600">Shipped</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-6 w-6" />
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="ui-card overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-slate-200/80 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Recent projects</h2>
              <div className="flex flex-wrap gap-2 text-sm">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`rounded-full border px-3 py-1.5 font-medium transition ${
                    statusFilter === 'all'
                      ? 'border-indigo-200 bg-indigo-50 text-indigo-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`rounded-full border px-3 py-1.5 font-medium transition ${
                    statusFilter === 'active'
                      ? 'border-amber-200 bg-amber-50 text-amber-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatusFilter('completed')}
                  className={`rounded-full border px-3 py-1.5 font-medium transition ${
                    statusFilter === 'completed'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredProjects.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  {projects.length === 0
                    ? 'No projects found. Create your first project to get started.'
                    : 'No projects match this filter.'}
                </div>
              ) : (
                filteredProjects.map(project => (
                  <div 
                    key={project.id}
                    className="cursor-pointer p-6 transition-colors hover:bg-slate-50/80"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
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
                          <span>Created: {formatDate(project.createdAt)}</span>
                          {project.deadline && (
                            <span>Deadline: {formatDate(project.deadline)}</span>
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
              className="ui-btn-primary px-5 py-2.5"
            >
              View all projects
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;