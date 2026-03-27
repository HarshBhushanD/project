import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where, doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import Navbar from './navbar';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyName, setCompanyName] = useState(null);

  useEffect(() => {
    let unsubscribeUsers = null;

    const loadForCurrentUser = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setLoading(false);
          return;
        }

        const userSnap = await getDoc(doc(db, 'users', currentUser.uid));
        const company = userSnap.exists() ? (userSnap.data().companyName || null) : null;
        setCompanyName(company);

        if (!company || !company.trim()) {
          setUsers([]);
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, 'users'),
          where('companyName', '==', company.trim())
        );

        unsubscribeUsers = onSnapshot(q, (querySnapshot) => {
          const usersList = [];
          querySnapshot.forEach((d) => {
            usersList.push({ id: d.id, ...d.data() });
          });
          setUsers(usersList);
          setLoading(false);
        }, (error) => {
          console.error("Error fetching users:", error);
          setLoading(false);
        });
      } catch (err) {
        console.error('Error loading users for company:', err);
        setLoading(false);
      }
    };

    loadForCurrentUser();

    return () => {
      if (unsubscribeUsers) unsubscribeUsers();
    };
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen pl-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </>
    );
  }

  return (
    <>
    <Navbar />
    <div className="p-6 pl-64">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">User Management Dashboard</h1>
            {companyName && (
              <p className="text-sm text-gray-500 mt-1">
                Company: {companyName}
              </p>
            )}
          </div>
          <span className="text-gray-600">Total Users: {users.length}</span>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : user.role === 'lead'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'}`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString()
                      : 'N/A'
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* No Users Message */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default UsersList;