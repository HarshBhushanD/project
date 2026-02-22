// import React, { useState, useEffect } from 'react';
// import { db } from './firebase';
// import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
// import { Loader2, Plus, Trash2, FolderOpen } from 'lucide-react';
// import Navbar from './navbar';

// const ProjectsPage = () => {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [newProjectName, setNewProjectName] = useState('');
//   const [isAddingProject, setIsAddingProject] = useState(false);

//   // Fetch projects on component mount
//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, 'projects'));
//       const projectsData = querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setProjects(projectsData);
//       setError('');
//     } catch (err) {
//       console.error('Error fetching projects:', err);
//       setError('Failed to load projects');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddProject = async (e) => {
//     e.preventDefault();
//     if (!newProjectName.trim()) return;

//     setLoading(true);
//     try {
//       const docRef = await addDoc(collection(db, 'projects'), {
//         name: newProjectName,
//         createdAt: new Date().toISOString(),
//         status: 'active'
//       });
      
//       setProjects([...projects, {
//         id: docRef.id,
//         name: newProjectName,
//         createdAt: new Date().toISOString(),
//         status: 'active'
//       }]);
      
//       setNewProjectName('');
//       setIsAddingProject(false);
//     } catch (err) {
//       console.error('Error adding project:', err);
//       setError('Failed to add project');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteProject = async (projectId) => {
//     if (!window.confirm('Are you sure you want to delete this project?')) return;

//     setLoading(true);
//     try {
//       await deleteDoc(doc(db, 'projects', projectId));
//       setProjects(projects.filter(project => project.id !== projectId));
//     } catch (err) {
//       console.error('Error deleting project:', err);
//       setError('Failed to delete project');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && projects.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4">
//         <div className="flex items-center justify-center h-64">
//           <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//     <Navbar/>
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
//           <button
//             onClick={() => setIsAddingProject(true)}
//             className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             <Plus className="h-5 w-5" />
//             <span>New Project</span>
//           </button>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
//             {error}
//           </div>
//         )}

//         {/* Add Project Form */}
//         {isAddingProject && (
//           <form onSubmit={handleAddProject} className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <div className="flex items-center space-x-4">
//               <input
//                 type="text"
//                 value={newProjectName}
//                 onChange={(e) => setNewProjectName(e.target.value)}
//                 placeholder="Enter project name"
//                 className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                 required
//               />
//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Add Project
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setIsAddingProject(false)}
//                 className="text-gray-600 hover:text-gray-800 transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         )}

//         {/* Projects Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {projects.map((project) => (
//             <div
//               key={project.id}
//               className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
//             >
//               <div className="flex items-start justify-between">
//                 <div className="flex items-center space-x-3">
//                   <FolderOpen className="h-6 w-6 text-blue-600" />
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900">
//                       {project.name}
//                     </h3>
//                     <p className="text-sm text-gray-500">
//                       Created: {new Date(project.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => handleDeleteProject(project.id)}
//                   className="text-gray-400 hover:text-red-600 transition-colors"
//                 >
//                   <Trash2 className="h-5 w-5" />
//                 </button>
//               </div>
              
//               <div className="mt-4">
//                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                   {project.status}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Empty State */}
//         {projects.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
//             <p className="text-gray-500">Create a new project to get started</p>
//           </div>
//         )}
//       </div>
//     </div>
//     </>
//   );
// };

// export default ProjectsPage;

// import React, { useState, useEffect } from 'react';
// import { db } from './firebase';
// import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
// import { Loader2, Plus, Trash2, FolderOpen, Users } from 'lucide-react';
// import Navbar from './navbar';

// const ProjectsPage = () => {
//   const [projects, setProjects] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [isAddingProject, setIsAddingProject] = useState(false);
  
//   // Form state
//   const [newProject, setNewProject] = useState({
//     name: '',
//     description: '',
//     leadId: '',
//     members: []
//   });

//   // Fetch projects and users on component mount
//   useEffect(() => {
//     fetchProjects();
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, 'users'));
//       const usersData = querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setUsers(usersData);
//     } catch (err) {
//       console.error('Error fetching users:', err);
//     }
//   };

//   const fetchProjects = async () => {
//     try {
//       const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
//       const querySnapshot = await getDocs(q);
//       const projectsData = querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setProjects(projectsData);
//       setError('');
//     } catch (err) {
//       console.error('Error fetching projects:', err);
//       setError('Failed to load projects');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddProject = async (e) => {
//     e.preventDefault();
//     if (!newProject.name.trim() || !newProject.leadId) return;

//     setLoading(true);
//     try {
//       const docRef = await addDoc(collection(db, 'projects'), {
//         name: newProject.name,
//         description: newProject.description,
//         leadId: newProject.leadId,
//         members: newProject.members,
//         createdAt: new Date().toISOString(),
//         status: 'active'
//       });
      
//       setProjects([{
//         id: docRef.id,
//         ...newProject,
//         createdAt: new Date().toISOString(),
//         status: 'active'
//       }, ...projects]);
      
//       setNewProject({
//         name: '',
//         description: '',
//         leadId: '',
//         members: []
//       });
//       setIsAddingProject(false);
//     } catch (err) {
//       console.error('Error adding project:', err);
//       setError('Failed to add project');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteProject = async (projectId) => {
//     if (!window.confirm('Are you sure you want to delete this project?')) return;

//     setLoading(true);
//     try {
//       await deleteDoc(doc(db, 'projects', projectId));
//       setProjects(projects.filter(project => project.id !== projectId));
//     } catch (err) {
//       console.error('Error deleting project:', err);
//       setError('Failed to delete project');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getUserName = (userId) => {
//     const user = users.find(u => u.uid === userId);
//     return user ? user.displayName || user.email : 'Unknown User';
//   };

//   if (loading && projects.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4">
//         <div className="flex items-center justify-center h-64">
//           <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Navbar/>
//       <div className="min-h-screen bg-gray-50 p-4">
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
//             <button
//               onClick={() => setIsAddingProject(true)}
//               className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               <Plus className="h-5 w-5" />
//               <span>New Project</span>
//             </button>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
//               {error}
//             </div>
//           )}

//           {/* Add Project Form */}
//           {isAddingProject && (
//             <form onSubmit={handleAddProject} className="bg-white p-6 rounded-lg shadow-md mb-6">
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Project Name
//                   </label>
//                   <input
//                     type="text"
//                     value={newProject.name}
//                     onChange={(e) => setNewProject({...newProject, name: e.target.value})}
//                     placeholder="Enter project name"
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Description
//                   </label>
//                   <textarea
//                     value={newProject.description}
//                     onChange={(e) => setNewProject({...newProject, description: e.target.value})}
//                     placeholder="Enter project description"
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                     rows="3"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Project Lead
//                   </label>
//                   <select
//                     value={newProject.leadId}
//                     onChange={(e) => setNewProject({...newProject, leadId: e.target.value})}
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                     required
//                   >
//                     <option value="">Select a lead</option>
//                     {users.map(user => (
//                       <option key={user.uid} value={user.uid}>
//                         {user.displayName || user.email}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Team Members
//                   </label>
//                   <select
//                     multiple
//                     value={newProject.members}
//                     onChange={(e) => setNewProject({
//                       ...newProject,
//                       members: Array.from(e.target.selectedOptions, option => option.value)
//                     })}
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                   >
//                     {users.map(user => (
//                       <option key={user.uid} value={user.uid}>
//                         {user.displayName || user.email}
//                       </option>
//                     ))}
//                   </select>
//                   <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple members</p>
//                 </div>

//                 <div className="flex justify-end space-x-4">
//                   <button
//                     type="button"
//                     onClick={() => setIsAddingProject(false)}
//                     className="text-gray-600 hover:text-gray-800 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     Create Project
//                   </button>
//                 </div>
//               </div>
//             </form>
//           )}

//           {/* Projects Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {projects.map((project) => (
//               <div
//                 key={project.id}
//                 className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
//               >
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-center space-x-3">
//                     <FolderOpen className="h-6 w-6 text-blue-600" />
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-900">
//                         {project.name}
//                       </h3>
//                       <p className="text-sm text-gray-500">
//                         Created: {new Date(project.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => handleDeleteProject(project.id)}
//                     className="text-gray-400 hover:text-red-600 transition-colors"
//                   >
//                     <Trash2 className="h-5 w-5" />
//                   </button>
//                 </div>
                
//                 <p className="mt-2 text-gray-600 text-sm">
//                   {project.description}
//                 </p>

//                 <div className="mt-4 space-y-2">
//                   <div className="flex items-center space-x-2">
//                     <Users className="h-4 w-4 text-gray-400" />
//                     <span className="text-sm text-gray-600">
//                       Lead: {getUserName(project.leadId)}
//                     </span>
//                   </div>
                  
//                   {project.members?.length > 0 && (
//                     <div className="text-sm text-gray-600">
//                       Team: {project.members.map(memberId => getUserName(memberId)).join(', ')}
//                     </div>
//                   )}
//                 </div>

//                 <div className="mt-4">
//                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                     {project.status}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Empty State */}
//           {projects.length === 0 && !loading && (
//             <div className="text-center py-12">
//               <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
//               <p className="text-gray-500">Create a new project to get started</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default ProjectsPage;



import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, where, updateDoc, getDoc } from 'firebase/firestore';
import { Loader2, Plus, Trash2, FolderOpen, Users, CheckCircle2, XCircle } from 'lucide-react';
import Navbar from './navbar';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [userCompanyName, setUserCompanyName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    leadId: '',
    assignedTo: '',
    members: []
  });

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    status: 'pending'
  });

  useEffect(() => {
    let mounted = true;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!mounted) return;
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const userSnap = await getDoc(doc(db, 'users', user.uid));
        const companyName = userSnap.exists() ? (userSnap.data().companyName || null) : null;
        if (mounted) setUserCompanyName(companyName);
        await fetchUsers(companyName);
        await fetchProjects(companyName);
      } catch (err) {
        console.error('Error loading user or data:', err);
        if (mounted) setError('Failed to load data');
      } finally {
        if (mounted) setLoading(false);
      }
    });
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchTasks(selectedProject.id);
    }
  }, [selectedProject]);

  const fetchUsers = async (companyName) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      let usersData = querySnapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      if (companyName) {
        usersData = usersData.filter(u => (u.companyName || '').trim() === companyName.trim());
      }
      setUsers(usersData);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchProjects = async (companyName) => {
    try {
      let q;
      if (companyName && companyName.trim()) {
        q = query(
          collection(db, 'projects'),
          where('companyName', '==', companyName.trim()),
          orderBy('createdAt', 'desc')
        );
      } else {
        q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      }
      const querySnapshot = await getDocs(q);
      const projectsData = querySnapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      if (companyName && companyName.trim()) {
        setProjects(projectsData);
      } else {
        setProjects([]);
      }
      setError('');
    } catch (err) {
      console.error('Error fetching projects:', err);
      if (err.code === 'firestore/index-not-found' || err.message?.includes('index')) {
        setError('Projects index is being set up. Please try again in a moment or create the Firestore index for companyName + createdAt.');
      } else {
        setError('Failed to load projects');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const q = query(
        collection(db, 'tasks'),
        where('projectId', '==', projectId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const tasksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.name.trim() || !newProject.leadId || !newProject.assignedTo) return;
    if (!userCompanyName || !userCompanyName.trim()) {
      setError('Your account has no company set. Please update your profile with a company name to create projects.');
      return;
    }

    setLoading(true);
    try {
      const projectData = {
        name: newProject.name,
        description: newProject.description,
        leadId: newProject.leadId,
        assignedTo: newProject.assignedTo,
        members: newProject.members,
        companyName: userCompanyName.trim(),
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      const docRef = await addDoc(collection(db, 'projects'), projectData);
      
      setProjects([{
        id: docRef.id,
        ...newProject,
        ...projectData
      }, ...projects]);
      
      setNewProject({
        name: '',
        description: '',
        leadId: '',
        assignedTo: '',
        members: []
      });
      setIsAddingProject(false);
    } catch (err) {
      console.error('Error adding project:', err);
      setError('Failed to add project');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.assignedTo || !selectedProject) return;

    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...newTask,
        projectId: selectedProject.id,
        createdAt: new Date().toISOString()
      });
      
      setTasks([{
        id: docRef.id,
        ...newTask,
        projectId: selectedProject.id,
        createdAt: new Date().toISOString()
      }, ...tasks]);
      
      setNewTask({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        status: 'pending'
      });
      setIsAddingTask(false);
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      setProjects(projects.filter(project => project.id !== projectId));
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleUpdateTaskStatus = async (taskId, currentStatus) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      
      await updateDoc(taskRef, {
        status: newStatus
      });
      
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.uid === userId);
    return user ? (user.name || user.email) : 'Unknown User';
  };

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
            {error}
          </div>
        )}

        {!loading && userCompanyName === null && (
          <div className="bg-amber-50 text-amber-800 p-4 rounded-md mb-4">
            Your account has no company set. You can only view and create projects after your profile includes a company name.
          </div>
        )}
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <button
            onClick={() => setIsAddingProject(true)}
            disabled={!userCompanyName || !userCompanyName.trim()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Project
          </button>
        </div>
  
        {isAddingProject && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <form onSubmit={handleAddProject}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Name</label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Lead</label>
                  <select
                    value={newProject.leadId}
                    onChange={(e) => setNewProject({ ...newProject, leadId: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  >
                    <option value="">Select Lead</option>
                    {users.map(user => (
                      <option key={user.uid} value={user.uid}>
                        {user.name || user.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                  <select
                    value={newProject.assignedTo}
                    onChange={(e) => setNewProject({ ...newProject, assignedTo: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  >
                    <option value="">Select User</option>
                    {users.map(user => (
                      <option key={user.uid} value={user.uid}>
                        {user.name || user.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddingProject(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        )}
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            {projects.map(project => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`p-4 bg-white rounded-lg shadow cursor-pointer ${
                  selectedProject?.id === project.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{getUserName(project.leadId)}</span>
                </div>
              </div>
            ))}
          </div>
  
          <div className="md:col-span-2">
            {selectedProject ? (
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedProject.name} - Tasks
                  </h2>
                  <button
                    onClick={() => setIsAddingTask(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    New Task
                  </button>
                </div>
  
                {isAddingTask && (
                  <div className="mb-6">
                    <form onSubmit={handleAddTask}>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Task Title</label>
                          <input
                            type="text"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            rows="3"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                          <select
                            value={newTask.assignedTo}
                            onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                          >
                            <option value="">Select User</option>
                            {users.map(user => (
                              <option key={user.uid} value={user.uid}>
                                {user.displayName || user.email}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Due Date</label>
                          <input
                            type="date"
                            value={newTask.dueDate}
                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setIsAddingTask(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Add Task
                        </button>
                      </div>
                    </form>
                  </div>
                )}
  
                <div className="space-y-4">
                  {tasks.map(task => (
                    <div key={task.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleUpdateTaskStatus(task.id, task.status)}
                            className={`mr-3 ${
                              task.status === 'completed' ? 'text-green-500' : 'text-gray-400'
                            }`}
                          >
                            {task.status === 'completed' ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <XCircle className="h-5 w-5" />
                            )}
                          </button>
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{task.title}</h4>
                            <p className="text-sm text-gray-500">{task.description}</p>
                            <div className="mt-1 text-sm text-gray-500">
                              Assigned to: {getUserName(task.assignedTo)}
                            </div>
                            {task.dueDate && (
                              <div className="mt-1 text-sm text-gray-500">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-12 rounded-lg border-2 border-dashed border-gray-300 text-center">
                <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No project selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a project from the list to view its tasks
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;