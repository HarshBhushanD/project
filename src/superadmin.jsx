// import React, { useState, useEffect } from 'react';
// import { collection, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore';
// import { db } from './firebase';
// import { Search, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

// const SuperAdminDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
//       const userData = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setUsers(userData);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const updateUserRole = async (userId, newRole) => {
//     try {
//       const userRef = doc(db, 'users', userId);
//       await updateDoc(userRef, {
//         role: newRole,
//         lastUpdated: new Date().toISOString()
//       });
//     } catch (error) {
//       console.error('Error updating user role:', error);
//     }
//   };

//   const getRoleBadge = (role) => {
//     const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
//     switch (role) {
//       case 'superadmin':
//         return (
//           <span className={`${baseClasses} bg-purple-100 text-purple-800`}>
//             <ShieldAlert className="w-4 h-4 mr-1" /> Super Admin
//           </span>
//         );
//       case 'admin':
//         return (
//           <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
//             <ShieldCheck className="w-4 h-4 mr-1" /> Admin
//           </span>
//         );
//       default:
//         return (
//           <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
//             <Shield className="w-4 h-4 mr-1" /> User
//           </span>
//         );
//     }
//   };

//   const filteredUsers = users.filter(user => 
//     user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     user.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-6xl mx-auto space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">User Access Management</h1>
//         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
//           Super Admin Panel
//         </span>
//       </div>

//       <div className="relative">
//         <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
//         <input
//           type="text"
//           placeholder="Search users by name or email..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//         />
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Role</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredUsers.map((user) => (
//               <tr key={user.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="font-medium text-gray-900">{user.displayName || 'N/A'}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {getRoleBadge(user.role)}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <select
//                     value={user.role || 'user'}
//                     onChange={(e) => updateUserRole(user.id, e.target.value)}
//                     className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="user">User</option>
//                     <option value="admin">Admin</option>
//                     <option value="superadmin">Super Admin</option>
//                   </select>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {user.lastUpdated ? new Date(user.lastUpdated).toLocaleDateString() : 'Never'}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="bg-blue-50 p-4 rounded-lg">
//         <h2 className="font-medium text-blue-800 mb-2">Role Permissions:</h2>
//         <ul className="space-y-2 text-sm text-blue-700">
//           <li className="flex items-center gap-2">
//             <ShieldAlert className="w-4 h-4" /> Super Admin: Full access, can manage other admins
//           </li>
//           <li className="flex items-center gap-2">
//             <ShieldCheck className="w-4 h-4" /> Admin: Can manage users and content
//           </li>
//           <li className="flex items-center gap-2">
//             <Shield className="w-4 h-4" /> User: Basic access only
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default SuperAdminDashboard;

import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db,auth } from './firebase';
import { Search, Users, Shield, Award } from 'lucide-react';
import Navbar from './navbar';

const RoleBasedDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const userData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUserRole = async (userId, newRole) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: newRole,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const filterUsersByRole = (role) => {
    return users.filter(user => 
      user.role === role && 
      (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const UserTable = ({ users }) => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Role</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change Role</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {users.map((user) => (
          <tr key={user.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="font-medium text-gray-900">{user.displayName || 'N/A'}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <RoleBadge role={user.role} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <select
                value={user.role || 'user'}
                onChange={(e) => updateUserRole(user.id, e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="user">User</option>
                <option value="lead">Lead</option>
                <option value="admin">Admin</option>
              </select>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {user.lastUpdated ? new Date(user.lastUpdated).toLocaleDateString() : 'Never'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const RoleBadge = ({ role }) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (role) {
      case 'admin':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <Shield className="w-4 h-4 mr-1" /> Admin
          </span>
        );
      case 'lead':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            <Award className="w-4 h-4 mr-1" /> Lead
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <Users className="w-4 h-4 mr-1" /> User
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management Dashboard</h1>
        <div className="flex space-x-2">
          <span className="text-sm text-gray-500">
            Total Users: {users.length}
          </span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-2 px-4 focus:outline-none ${
            activeTab === 'all' 
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`py-2 px-4 focus:outline-none ${
            activeTab === 'admin'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Admins ({filterUsersByRole('admin').length})
        </button>
        <button
          onClick={() => setActiveTab('lead')}
          className={`py-2 px-4 focus:outline-none ${
            activeTab === 'lead'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Leads ({filterUsersByRole('lead').length})
        </button>
        <button
          onClick={() => setActiveTab('user')}
          className={`py-2 px-4 focus:outline-none ${
            activeTab === 'user'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Users ({filterUsersByRole('user').length})
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <UserTable users={
          activeTab === 'all' 
            ? users.filter(user => 
                user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : filterUsersByRole(activeTab)
        } />
      </div>
    </div>
    </>
  );
};

export default RoleBasedDashboard;