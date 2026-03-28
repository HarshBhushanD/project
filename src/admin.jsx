import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, query, getDocs, updateDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Navbar from './navbar';

const AdminDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});
  const navigate = useNavigate();

  const tabs = [
    { id: 'all', label: 'All Leaves' },
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' }
  ];

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const fetchLeaves = async () => {
    try {
      const leavesCollection = collection(db, 'leaveApplications');
      const leavesSnapshot = await getDocs(leavesCollection);
      const leavesData = leavesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setLeaves(leavesData.sort((a, b) => 
        new Date(b.appliedOn).getTime() - new Date(a.appliedOn).getTime()
      ));
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentChange = (leaveId, comment) => {
    setComments(prev => ({
      ...prev,
      [leaveId]: comment
    }));
  };

  const handleStatusUpdate = async (leaveId, newStatus) => {
    try {
      const leaveRef = doc(db, 'leaveApplications', leaveId);
      const comment = comments[leaveId] || '';

      await updateDoc(leaveRef, {
        status: newStatus,
        approverComment: comment,
        updatedAt: new Date().toISOString()
      });
      
      setLeaves(leaves.map(leave => 
        leave.id === leaveId 
          ? { ...leave, status: newStatus, approverComment: comment }
          : leave
      ));
      
      setComments(prev => {
        const updated = { ...prev };
        delete updated[leaveId];
        return updated;
      });

      alert(`Leave ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating leave status:', error);
      alert('Failed to update leave status');
    }
  };

  const filteredLeaves = leaves.filter(leave => {
    if (activeTab === 'all') return true;
    return leave.status === activeTab;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="ui-page-main min-h-screen">
      <Navbar />
      <header className="border-b border-slate-200/80 bg-white/90 pl-64 shadow-soft backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Admin</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Leave management</h1>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-slate-800"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl py-8 pl-64 pr-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex gap-1 border-b border-slate-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-3 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
          </div>
        ) : (
          <div className="ui-card overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeaves.map((leave) => (
                  <tr key={leave.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{leave.userName}</div>
                      <div className="text-sm text-gray-500">{leave.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{leave.leaveType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {leave.duration} {leave.duration === 1 ? 'day' : 'days'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs break-words">
                        {leave.reason || 'No reason provided'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(leave.status)}`}>
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(leave.appliedOn)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {leave.status === 'pending' && (
                        <div className="space-y-2">
                          <textarea
                            placeholder="Add a comment (optional)"
                            className="w-full px-2 py-1 text-sm border rounded"
                            value={comments[leave.id] || ''}
                            onChange={(e) => handleCommentChange(leave.id, e.target.value)}
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStatusUpdate(leave.id, 'approved')}
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(leave.id, 'rejected')}
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      )}
                      {leave.status !== 'pending' && leave.approverComment && (
                        <div className="text-sm text-gray-600">
                          <strong>Comment:</strong> {leave.approverComment}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
// import React, { useState, useEffect } from 'react';
// import { db } from './firebase';
// import { collection, query, getDocs, updateDoc, doc } from 'firebase/firestore';

// const AdminDashboard = () => {
//   const [leaves, setLeaves] = useState([]);
//   const [activeTab, setActiveTab] = useState('all');
//   const [loading, setLoading] = useState(true);
//   const [comment, setComment] = useState('');

//   const tabs = [
//     { id: 'all', label: 'All Leaves' },
//     { id: 'pending', label: 'Pending' },
//     { id: 'approved', label: 'Approved' },
//     { id: 'rejected', label: 'Rejected' }
//   ];

//   useEffect(() => {
//     fetchLeaves();
//   }, []);

//   const fetchLeaves = async () => {
//     try {
//       const leavesCollection = collection(db, 'leaveApplications');
//       const leavesSnapshot = await getDocs(leavesCollection);
//       const leavesData = leavesSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
      
//       setLeaves(leavesData.sort((a, b) => 
//         new Date(b.appliedOn).getTime() - new Date(a.appliedOn).getTime()
//       ));
//     } catch (error) {
//       console.error('Error fetching leaves:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusUpdate = async (leaveId, newStatus) => {
//     try {
//       const leaveRef = doc(db, 'leaveApplications', leaveId);
//       await updateDoc(leaveRef, {
//         status: newStatus,
//         approverComment: comment
//       });
      
//       setLeaves(leaves.map(leave => 
//         leave.id === leaveId 
//           ? { ...leave, status: newStatus, approverComment: comment }
//           : leave
//       ));
      
//       setComment('');
//       alert(`Leave ${newStatus} successfully!`);
//     } catch (error) {
//       console.error('Error updating leave status:', error);
//       alert('Failed to update leave status');
//     }
//   };

//   const filteredLeaves = leaves.filter(leave => {
//     if (activeTab === 'all') return true;
//     return leave.status === activeTab;
//   });

//   const getStatusBadgeClass = (status) => {
//     switch (status) {
//       case 'approved':
//         return 'bg-green-100 text-green-800';
//       case 'rejected':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-yellow-100 text-yellow-800';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold mb-8">Leave Management Dashboard</h1>

//         <div className="flex space-x-4 mb-6 border-b">
//           {tabs.map(tab => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`py-2 px-4 ${
//                 activeTab === tab.id
//                   ? 'border-b-2 border-blue-500 text-blue-600'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {loading ? (
//           <div className="text-center py-8">Loading...</div>
//         ) : (
//           <div className="bg-white rounded-lg shadow">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Employee
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Leave Type
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Duration
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Applied On
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredLeaves.map((leave) => (
//                     <tr key={leave.id}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">{leave.userName}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{leave.leaveType}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {new Date(leave.startDate).toLocaleDateString()} - 
//                           {new Date(leave.endDate).toLocaleDateString()}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(leave.status)}`}>
//                           {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {new Date(leave.appliedOn).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         {leave.status === 'pending' && (
//                           <div className="space-y-2">
//                             <textarea
//                               placeholder="Add a comment (optional)"
//                               className="w-full px-2 py-1 text-sm border rounded"
//                               value={comment}
//                               onChange={(e) => setComment(e.target.value)}
//                             />
//                             <div className="flex space-x-2">
//                               <button
//                                 onClick={() => handleStatusUpdate(leave.id, 'approved')}
//                                 className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
//                               >
//                                 Approve
//                               </button>
//                               <button
//                                 onClick={() => handleStatusUpdate(leave.id, 'rejected')}
//                                 className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
//                               >
//                                 Reject
//                               </button>
//                             </div>
//                           </div>
//                         )}
//                         {leave.status !== 'pending' && leave.approverComment && (
//                           <div className="text-sm text-gray-600">
//                             <strong>Comment:</strong> {leave.approverComment}
//                           </div>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


// import React, { useState, useEffect } from 'react';
// import { db } from './firebase';
// import { collection, query, getDocs, updateDoc, doc, where } from 'firebase/firestore';

// interface LeaveApplication {
//   id: string;
//   userId: string;
//   userName: string;
//   leaveType: string;
//   startDate: string;
//   endDate: string;
//   reason: string;
//   status: 'pending' | 'approved' | 'rejected';
//   appliedOn: string;
//   approverComment?: string;
// }

// const AdminDashboard: React.FC = () => {
//   const [leaves, setLeaves] = useState([]);
//   const [activeTab, setActiveTab] = useState<string>('all');
//   const [loading, setLoading] = useState(true);
//   const [comment, setComment] = useState<string>('');

//   const tabs = [
//     { id: 'all', label: 'All Leaves' },
//     { id: 'pending', label: 'Pending' },
//     { id: 'approved', label: 'Approved' },
//     { id: 'rejected', label: 'Rejected' }
//   ];

//   const leaveTypes = [
//     'Annual Leave',
//     'Sick Leave',
//     'Personal Leave',
//     'Maternity Leave',
//     'Paternity Leave',
//     'Study Leave',
//     'Unpaid Leave',
//     'Bereavement Leave'
//   ];

//   useEffect(() => {
//     fetchLeaves();
//   }, []);

//   const fetchLeaves = async () => {
//     try {
//       const leavesCollection = collection(db, 'leaveApplications');
//       const leavesSnapshot = await getDocs(leavesCollection);
//       const leavesData = leavesSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       })) as LeaveApplication[];
      
//       setLeaves(leavesData.sort((a, b) => 
//         new Date(b.appliedOn).getTime() - new Date(a.appliedOn).getTime()
//       ));
//     } catch (error) {
//       console.error('Error fetching leaves:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusUpdate = async (leaveId: string, newStatus: 'approved' | 'rejected') => {
//     try {
//       const leaveRef = doc(db, 'leaveApplications', leaveId);
//       await updateDoc(leaveRef, {
//         status: newStatus,
//         approverComment: comment
//       });
      
//       // Update local state
//       setLeaves(leaves.map(leave => 
//         leave.id === leaveId 
//           ? { ...leave, status: newStatus, approverComment: comment }
//           : leave
//       ));
      
//       setComment('');
//       alert(`Leave ${newStatus} successfully!`);
//     } catch (error) {
//       console.error('Error updating leave status:', error);
//       alert('Failed to update leave status');
//     }
//   };

//   const filteredLeaves = leaves.filter(leave => {
//     if (activeTab === 'all') return true;
//     return leave.status === activeTab;
//   });

//   const getStatusBadgeClass = (status: string) => {
//     switch (status) {
//       case 'approved':
//         return 'bg-green-100 text-green-800';
//       case 'rejected':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-yellow-100 text-yellow-800';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold mb-8">Leave Management Dashboard</h1>

//         {/* Tabs */}
//         <div className="flex space-x-4 mb-6 border-b">
//           {tabs.map(tab => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`py-2 px-4 ${
//                 activeTab === tab.id
//                   ? 'border-b-2 border-blue-500 text-blue-600'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {loading ? (
//           <div className="text-center py-8">Loading...</div>
//         ) : (
//           <div className="bg-white rounded-lg shadow">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Employee
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Leave Type
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Duration
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Applied On
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredLeaves.map((leave) => (
//                     <tr key={leave.id}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">{leave.userName}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{leave.leaveType}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {new Date(leave.startDate).toLocaleDateString()} - 
//                           {new Date(leave.endDate).toLocaleDateString()}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(leave.status)}`}>
//                           {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {new Date(leave.appliedOn).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         {leave.status === 'pending' && (
//                           <div className="space-y-2">
//                             <textarea
//                               placeholder="Add a comment (optional)"
//                               className="w-full px-2 py-1 text-sm border rounded"
//                               value={comment}
//                               onChange={(e) => setComment(e.target.value)}
//                             />
//                             <div className="flex space-x-2">
//                               <button
//                                 onClick={() => handleStatusUpdate(leave.id, 'approved')}
//                                 className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
//                               >
//                                 Approve
//                               </button>
//                               <button
//                                 onClick={() => handleStatusUpdate(leave.id, 'rejected')}
//                                 className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
//                               >
//                                 Reject
//                               </button>
//                             </div>
//                           </div>
//                         )}
//                         {leave.status !== 'pending' && leave.approverComment && (
//                           <div className="text-sm text-gray-600">
//                             <strong>Comment:</strong> {leave.approverComment}
//                           </div>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;