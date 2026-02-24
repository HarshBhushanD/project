// import React, { useState } from 'react';
// import { auth, db } from './firebase';
// import { collection, addDoc } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';

// const LeaveApplicationPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [formData, setFormData] = useState({
//     leaveType: '',
//     startDate: '',
//     endDate: '',
//     reason: ''
//   });

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

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     // Check if user is logged in
//     if (!auth.currentUser) {
//       setError('You must be logged in to apply for leave');
//       setLoading(false);
//       console.error('No user is logged in');
//       return;
//     }

//     console.log('Current user:', auth.currentUser);

//     const startDate = new Date(formData.startDate);
//     const endDate = new Date(formData.endDate);

//     if (endDate < startDate) {
//       setError('End date cannot be before start date');
//       setLoading(false);
//       return;
//     }

//     try {
//       const leaveApplication = {
//         userId: auth.currentUser.uid,
//         userName: auth.currentUser.displayName || 'Anonymous',
//         leaveType: formData.leaveType,
//         startDate: formData.startDate,
//         endDate: formData.endDate,
//         reason: formData.reason,
//         status: 'pending',
//         appliedOn: new Date().toISOString()
//       };

//       console.log('Attempting to save leave application:', leaveApplication);

//       // Get reference to the collection
//       const leaveCollectionRef = collection(db, 'leaveApplications');
//       console.log('Collection reference created');

//       // Add the document
//       const docRef = await addDoc(leaveCollectionRef, leaveApplication);
//       console.log('Document written with ID:', docRef.id);

//       alert('Leave application submitted successfully!');
//       navigate('/dashboard');
//     } catch (err) {
//       console.error('Detailed error submitting leave application:', err);
//       setError(`Failed to submit leave application: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-2xl mx-auto">
//         <div className="bg-white rounded-lg shadow-md p-8">
//           <h2 className="text-2xl font-bold mb-6">Apply for Leave</h2>

//           {error && (
//             <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
//               {error}
//             </div>
//           )}

//           {/* Form UI remains the same */}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Type of Leave
//               </label>
//               <select
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={formData.leaveType}
//                 onChange={(e) => {
//                   console.log('Leave type selected:', e.target.value);
//                   setFormData({ ...formData, leaveType: e.target.value });
//                 }}
//                 disabled={loading}
//               >
//                 <option value="">Select leave type</option>
//                 {leaveTypes.map((type) => (
//                   <option key={type} value={type}>
//                     {type}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Start Date
//                 </label>
//                 <input
//                   type="date"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={formData.startDate}
//                   onChange={(e) => {
//                     console.log('Start date selected:', e.target.value);
//                     setFormData({ ...formData, startDate: e.target.value });
//                   }}
//                   min={new Date().toISOString().split('T')[0]}
//                   disabled={loading}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   End Date
//                 </label>
//                 <input
//                   type="date"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={formData.endDate}
//                   onChange={(e) => {
//                     console.log('End date selected:', e.target.value);
//                     setFormData({ ...formData, endDate: e.target.value });
//                   }}
//                   min={formData.startDate || new Date().toISOString().split('T')[0]}
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Reason for Leave
//               </label>
//               <textarea
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
//                 value={formData.reason}
//                 onChange={(e) => {
//                   console.log('Reason updated');
//                   setFormData({ ...formData, reason: e.target.value });
//                 }}
//                 placeholder="Please provide a detailed reason for your leave request..."
//                 disabled={loading}
//               />
//             </div>

//             <div className="flex items-center justify-end space-x-4">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? 'Submitting...' : 'Submit Application'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeaveApplicationPage;

// import React, { useState, useEffect } from 'react';
// import { auth, db } from './firebase';
// import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';

// // Custom Alert Component
// const Alert = ({ children, variant = 'default', className = '' }) => {
//   const baseStyles = "p-4 rounded-md mb-4";
//   const variants = {
//     default: "bg-blue-50 text-blue-900",
//     destructive: "bg-red-50 text-red-900",
//     success: "bg-green-50 text-green-900"
//   };
  
//   return (
//     <div className={`${baseStyles} ${variants[variant]} ${className}`}>
//       {children}
//     </div>
//   );
// };

// const LeaveApplicationPage = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [leaveBalance, setLeaveBalance] = useState({
//     sickLeave: 12,
//     casualLeave: 14
//   });
//   const [usedLeave, setUsedLeave] = useState({
//     sickLeave: 0,
//     casualLeave: 0
//   });

//   const [formData, setFormData] = useState({
//     leaveType: '',
//     startDate: '',
//     endDate: '',
//     reason: ''
//   });

//   const leaveTypes = [
//     { value: 'sickLeave', label: 'Sick Leave', total: 12 },
//     { value: 'casualLeave', label: 'Casual Leave', total: 14 },
//     'Annual Leave',
//     'Maternity Leave',
//     'Paternity Leave',
//     'Study Leave',
//     'Unpaid Leave',
//     'Bereavement Leave'
//   ];

//   useEffect(() => {
//     fetchUsedLeave();
//   }, []);

//   const fetchUsedLeave = async () => {
//     if (!auth.currentUser) return;

//     try {
//       const leaveQuery = query(
//         collection(db, 'leaveApplications'),
//         where('userId', '==', auth.currentUser.uid),
//         where('status', 'in', ['pending', 'approved'])
//       );

//       const querySnapshot = await getDocs(leaveQuery);
//       let sickLeaveCount = 0;
//       let casualLeaveCount = 0;

//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         const startDate = new Date(data.startDate);
//         const endDate = new Date(data.endDate);
//         const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

//         if (data.leaveType === 'Sick Leave') {
//           sickLeaveCount += days;
//         } else if (data.leaveType === 'Casual Leave') {
//           casualLeaveCount += days;
//         }
//       });

//       setUsedLeave({
//         sickLeave: sickLeaveCount,
//         casualLeave: casualLeaveCount
//       });
//     } catch (err) {
//       console.error('Error fetching used leave:', err);
//     }
//   };

//   const calculateRequestedDays = () => {
//     if (!formData.startDate || !formData.endDate) return 0;
//     const start = new Date(formData.startDate);
//     const end = new Date(formData.endDate);
//     return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     if (!auth.currentUser) {
//       setError('You must be logged in to apply for leave');
//       setLoading(false);
//       return;
//     }

//     const startDate = new Date(formData.startDate);
//     const endDate = new Date(formData.endDate);
//     const requestedDays = calculateRequestedDays();

//     if (endDate < startDate) {
//       setError('End date cannot be before start date');
//       setLoading(false);
//       return;
//     }

//     // Check leave balance for sick and casual leave
//     if (formData.leaveType === 'sickLeave') {
//       if (usedLeave.sickLeave + requestedDays > leaveBalance.sickLeave) {
//         setError(`Insufficient sick leave balance. You have ${leaveBalance.sickLeave - usedLeave.sickLeave} days remaining`);
//         setLoading(false);
//         return;
//       }
//     } else if (formData.leaveType === 'casualLeave') {
//       if (usedLeave.casualLeave + requestedDays > leaveBalance.casualLeave) {
//         setError(`Insufficient casual leave balance. You have ${leaveBalance.casualLeave - usedLeave.casualLeave} days remaining`);
//         setLoading(false);
//         return;
//       }
//     }

//     try {
//       const leaveApplication = {
//         userId: auth.currentUser.uid,
//         userName: auth.currentUser.displayName || 'Anonymous',
//         leaveType: formData.leaveType === 'sickLeave' ? 'Sick Leave' : 
//                   formData.leaveType === 'casualLeave' ? 'Casual Leave' : 
//                   formData.leaveType,
//         startDate: formData.startDate,
//         endDate: formData.endDate,
//         reason: formData.reason,
//         status: 'pending',
//         appliedOn: new Date().toISOString(),
//         numberOfDays: requestedDays
//       };

//       const leaveCollectionRef = collection(db, 'leaveApplications');
//       await addDoc(leaveCollectionRef, leaveApplication);

//       alert('Leave application submitted successfully!');
//       navigate('/dashboard');
//     } catch (err) {
//       console.error('Error submitting leave application:', err);
//       setError(`Failed to submit leave application: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-2xl mx-auto">
//         <div className="bg-white rounded-lg shadow-md p-8">
//           <h2 className="text-2xl font-bold mb-6">Apply for Leave</h2>

//           <div className="mb-6 grid grid-cols-2 gap-4">
//             <Alert className="bg-blue-50">
//               <div className="font-semibold mb-1">Sick Leave Balance</div>
//               <p className="text-sm">
//                 Available: {leaveBalance.sickLeave - usedLeave.sickLeave} / {leaveBalance.sickLeave} days
//               </p>
//             </Alert>
//             <Alert className="bg-green-50">
//               <div className="font-semibold mb-1">Casual Leave Balance</div>
//               <p className="text-sm">
//                 Available: {leaveBalance.casualLeave - usedLeave.casualLeave} / {leaveBalance.casualLeave} days
//               </p>
//             </Alert>
//           </div>

//           {error && (
//             <Alert variant="destructive">
//               {error}
//             </Alert>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Type of Leave
//               </label>
//               <select
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={formData.leaveType}
//                 onChange={(e) => {
//                   setFormData({ ...formData, leaveType: e.target.value });
//                 }}
//                 disabled={loading}
//               >
//                 <option value="">Select leave type</option>
//                 {leaveTypes.map((type) => (
//                   <option 
//                     key={typeof type === 'string' ? type : type.value} 
//                     value={typeof type === 'string' ? type : type.value}
//                   >
//                     {typeof type === 'string' ? type : type.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Start Date
//                 </label>
//                 <input
//                   type="date"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={formData.startDate}
//                   onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
//                   min={new Date().toISOString().split('T')[0]}
//                   disabled={loading}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   End Date
//                 </label>
//                 <input
//                   type="date"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={formData.endDate}
//                   onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
//                   min={formData.startDate || new Date().toISOString().split('T')[0]}
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             {formData.startDate && formData.endDate && (
//               <div className="text-sm text-gray-600">
//                 Requesting {calculateRequestedDays()} day(s)
//               </div>
//             )}

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Reason for Leave
//               </label>
//               <textarea
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
//                 value={formData.reason}
//                 onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
//                 placeholder="Please provide a detailed reason for your leave request..."
//                 disabled={loading}
//               />
//             </div>

//             <div className="flex items-center justify-end space-x-4">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? 'Submitting...' : 'Submit Application'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeaveApplicationPage;

import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Alert = ({ children, variant = 'default', className = '' }) => {
  const baseStyles = "p-4 rounded-md mb-4";
  const variants = {
    default: "bg-blue-50 text-blue-900",
    destructive: "bg-red-50 text-red-900",
    success: "bg-green-50 text-green-900"
  };
  
  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const LeaveApplicationPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [leaveBalance, setLeaveBalance] = useState({
    sickLeave: 12,
    casualLeave: 14,
    earnedLeave: 30,
    vacationLeave: 15
  });
  const [usedLeave, setUsedLeave] = useState({
    sickLeave: 0,
    casualLeave: 0,
    earnedLeave: 0,
    vacationLeave: 0
  });

  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const leaveTypes = [
    { value: 'sickLeave', label: 'Sick Leave', total: 12 },
    { value: 'casualLeave', label: 'Casual Leave', total: 14 },
    { value: 'earnedLeave', label: 'Earned Leave', total: 30 },
    { value: 'vacationLeave', label: 'Vacation Leave', total: 15 },
    'Annual Leave',
    'Maternity Leave',
    'Paternity Leave',
    'Study Leave',
    'Unpaid Leave',
    'Bereavement Leave'
  ];

  const getCurrentSemester = () => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1; // JavaScript months are 0-based
    
    if (month >= 1 && month <= 5) {
      return 'even';
    } else if (month >= 7 && month <= 11) {
      return 'odd';
    } else {
      return 'break'; // December or June
    }
  };

  const checkVacationLeaveValidity = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const semester = getCurrentSemester();
    
    // Check if the leave period spans across semesters
    const startSemester = new Date(start).getMonth() + 1;
    const endSemester = new Date(end).getMonth() + 1;
    
    if (semester === 'break') {
      return { valid: false, message: 'Vacation leave cannot be applied during semester breaks' };
    }

    // Check if dates cross semester boundaries
    if ((startSemester <= 5 && endSemester > 5) || (startSemester <= 11 && endSemester > 11)) {
      return { valid: false, message: 'Vacation leave cannot span across semesters' };
    }

    return { valid: true };
  };

  useEffect(() => {
    fetchUsedLeave();
  }, []);

  const fetchUsedLeave = async () => {
    if (!auth.currentUser) return;

    try {
      const leaveQuery = query(
        collection(db, 'leaveApplications'),
        where('userId', '==', auth.currentUser.uid),
        where('status', 'in', ['pending', 'approved'])
      );

      const querySnapshot = await getDocs(leaveQuery);
      let sickLeaveCount = 0;
      let casualLeaveCount = 0;
      let earnedLeaveCount = 0;
      let vacationLeaveCount = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

        switch (data.leaveType) {
          case 'Sick Leave':
            sickLeaveCount += days;
            break;
          case 'Casual Leave':
            casualLeaveCount += days;
            break;
          case 'Earned Leave':
            earnedLeaveCount += days;
            break;
          case 'Vacation Leave':
            vacationLeaveCount += days;
            break;
        }
      });

      setUsedLeave({
        sickLeave: sickLeaveCount,
        casualLeave: casualLeaveCount,
        earnedLeave: earnedLeaveCount,
        vacationLeave: vacationLeaveCount
      });
    } catch (err) {
      console.error('Error fetching used leave:', err);
    }
  };

  const calculateRequestedDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!auth.currentUser) {
      setError('You must be logged in to apply for leave');
      setLoading(false);
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const requestedDays = calculateRequestedDays();

    if (endDate < startDate) {
      setError('End date cannot be before start date');
      setLoading(false);
      return;
    }

    // Check vacation leave validity
    if (formData.leaveType === 'vacationLeave') {
      const validityCheck = checkVacationLeaveValidity(formData.startDate, formData.endDate);
      if (!validityCheck.valid) {
        setError(validityCheck.message);
        setLoading(false);
        return;
      }
    }

    // Check leave balances
    const leaveTypeMap = {
      'sickLeave': 'Sick Leave',
      'casualLeave': 'Casual Leave',
      'earnedLeave': 'Earned Leave',
      'vacationLeave': 'Vacation Leave'
    };

    if (leaveTypeMap[formData.leaveType]) {
      const balance = leaveBalance[formData.leaveType];
      const used = usedLeave[formData.leaveType];
      
      if (used + requestedDays > balance) {
        setError(`Insufficient ${leaveTypeMap[formData.leaveType]} balance. You have ${balance - used} days remaining`);
        setLoading(false);
        return;
      }
    }

    try {
      const leaveApplication = {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Anonymous',
        leaveType: leaveTypeMap[formData.leaveType] || formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        status: 'pending',
        appliedOn: new Date().toISOString(),
        numberOfDays: requestedDays,
        semester: getCurrentSemester()
      };

      const leaveCollectionRef = collection(db, 'leaveApplications');
      await addDoc(leaveCollectionRef, leaveApplication);

      alert('Leave application submitted successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error submitting leave application:', err);
      setError(`Failed to submit leave application: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Apply for Leave</h2>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <Alert className="bg-blue-50">
              <div className="font-semibold mb-1">Sick Leave Balance</div>
              <p className="text-sm">
                Available: {leaveBalance.sickLeave - usedLeave.sickLeave} / {leaveBalance.sickLeave} days
              </p>
            </Alert>
            <Alert className="bg-green-50">
              <div className="font-semibold mb-1">Casual Leave Balance</div>
              <p className="text-sm">
                Available: {leaveBalance.casualLeave - usedLeave.casualLeave} / {leaveBalance.casualLeave} days
              </p>
            </Alert>
            <Alert className="bg-yellow-50">
              <div className="font-semibold mb-1">Earned Leave Balance</div>
              <p className="text-sm">
                Available: {leaveBalance.earnedLeave - usedLeave.earnedLeave} / {leaveBalance.earnedLeave} days
                <br />
                <span className="text-xs text-gray-600">Accumulated balance carries forward</span>
              </p>
            </Alert>
            <Alert className="bg-purple-50">
              <div className="font-semibold mb-1">Vacation Leave Balance</div>
              <p className="text-sm">
                Available: {leaveBalance.vacationLeave - usedLeave.vacationLeave} / {leaveBalance.vacationLeave} days
                <br />
                <span className="text-xs text-gray-600">Lapses at end of semester</span>
              </p>
            </Alert>
          </div>

          {error && (
            <Alert variant="destructive">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type of Leave
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.leaveType}
                onChange={(e) => {
                  setFormData({ ...formData, leaveType: e.target.value });
                }}
                disabled={loading}
              >
                <option value="">Select leave type</option>
                {leaveTypes.map((type) => (
                  <option 
                    key={typeof type === 'string' ? type : type.value} 
                    value={typeof type === 'string' ? type : type.value}
                  >
                    {typeof type === 'string' ? type : type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  disabled={loading}
                />
              </div>
            </div>

            {formData.startDate && formData.endDate && (
              <div className="text-sm text-gray-600">
                Requesting {calculateRequestedDays()} day(s)
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Leave
              </label>
              <textarea
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Please provide a detailed reason for your leave request..."
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-end space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplicationPage;