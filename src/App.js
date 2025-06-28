import React from 'react';
import {Link,Routes,Route, BrowserRouter } from 'react-router-dom';
import SignupPage from './signup';
import Login from './login';
import ProjectsPage from './project';
import Dashboard from './dashboard';
import SuperAdminDashboard from './superadmin';
import RoleBasedDashboard from './superadmin';
import UsersList from './user';


function App(){ 
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
    </Routes>
   </BrowserRouter>
    )
}
export default App;