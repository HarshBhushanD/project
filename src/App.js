import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import SignupPage from './signup';
import Login from './login';
import ProjectsPage from './project';
import Dashboard from './dashboard';
import SuperAdminDashboard from './superadmin';
import RoleBasedDashboard from './superadmin';
import UsersList from './user';
import LeaveApplicationPage from './leave';
import AdminPage from './admin';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from './firebase';
// import { LoadingSpinner } from './loading';
import Lobby from './lobby';
import Room from './room';  



function App(){ 
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  const SuperAdminRoute = ({ children }) => {
    if (loading) return <LoadingSpinner />;
    return user?.email === 'harshbhushandixit@gmail.com' ? children : <Navigate to="/dashboard" replace />;
  };

  const AdminRoute = ({ children, allowLead }) => {
    if (loading) return <LoadingSpinner />;
    if (userRole === 'admin' || (allowLead && userRole === 'lead')) return children;
    return <Navigate to="/dashboard" replace />;
  };

  const ProtectedRoute = ({ children }) => {
    if (loading) return <LoadingSpinner />;
    return user ? children : <Navigate to="/" replace />;
  };
  const PublicRoute = ({ children }) => {
    if (loading) return <LoadingSpinner />;
    return user ? <Navigate to="/dashboard" replace /> : children;
  };

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/users" element={<UsersList />} />
      <Route path="/papaofall" element={<RoleBasedDashboard/>} />  
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/projects" element={<ProjectsPage/>} />
      <Route path="/superadmin" element={<SuperAdminDashboard />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/project" element={ <AdminRoute allowLead><ProjectsPage /></AdminRoute>}/>
      <Route  path="/signup" element={ <PublicRoute> <SignupPage /></PublicRoute>}/>
      <Route path="/"element={ <PublicRoute> <Login /></PublicRoute>} />
      <Route path="/leave" element={<ProtectedRoute> <LeaveApplicationPage /></ProtectedRoute>} />
      <Route path="/admin" element={ <AdminRoute> <AdminPage /> </AdminRoute>}/>
      <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> }/>
      <Route path="/superadmin" element={ <SuperAdminRoute> <RoleBasedDashboard /></SuperAdminRoute>}/>
      <Route path="/lobby" element={<Lobby />} />
      <Route path="/room/:roomId" element={<Room />} />
    </Routes>
   </BrowserRouter>
    )
}
export default App;