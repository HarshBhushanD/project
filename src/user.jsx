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
        <div className="ui-page-main ml-64 flex h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
        </div>
      </>
    );
  }

  return (
    <>
    <Navbar />
    <div className="ui-page-main ml-64 p-6 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="ui-card mb-8 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Directory</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Users</h1>
            {companyName && (
              <p className="mt-1 text-sm text-slate-600">
                Company: <span className="font-medium text-slate-800">{companyName}</span>
              </p>
            )}
          </div>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            Total: {users.length}
          </span>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="ui-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="ui-card overflow-hidden">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/90">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Date Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="transition hover:bg-slate-50/80">
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
            <div className="py-10 text-center text-sm text-slate-500">
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