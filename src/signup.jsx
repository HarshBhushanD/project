// import React, { useState } from 'react';
// import { Mail, Lock, Loader2, User } from 'lucide-react';
// import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
// import { auth } from './firebase';
// import { useNavigate } from 'react-router-dom';
// import Navbar from './navbar';

// const SignupPage = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     if (password !== confirmPassword) {
//       setError('Passwords do not match');
//       setLoading(false);
//       return;
//     }

//     if (password.length < 6) {
//       setError('Password must be at least 6 characters long');
//       setLoading(false);
//       return;
//     }

//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);

//       // Update profile with name if provided
//       if (name) {
//         await updateProfile(userCredential.user, {
//           displayName: name
//         });
//       }

//       console.log('User created:', userCredential.user);
//       navigate('/dashboard');
//     } catch (err) {
//       console.error('Signup error:', err);
//       setError(
//         err.code === 'auth/email-already-in-use' ? 'Email already in use' :
//           err.code === 'auth/invalid-email' ? 'Invalid email address' :
//             err.code === 'auth/weak-password' ? 'Password is too weak' :
//               'Failed to create account. Please try again.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

  
  


//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen flex items-center justify-center bg-white p-4">
//         <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
//           <div className="text-center mb-8">
//             <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
//             <p className="text-gray-600 mt-2">Enter your details to get started</p>
//           </div>

//           <form onSubmit={handleSignup} className="space-y-6">
//             <div className="relative">
//               <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//               />
//             </div>

//             <div className="relative">
//               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//               />
//             </div>

//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//               />
//             </div>

//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <input
//                 type="password"
//                 placeholder="Confirm Password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//               />
//             </div>

//             {error && (
//               <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm">
//                 {error}
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
//                   Creating account...
//                 </>
//               ) : (
//                 'Create account'
//               )}
//             </button>

//             <div className="relative my-6">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="bg-white px-2 text-gray-500">
//                   Already have an account?
//                 </span>
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={() => navigate('/')}
//               className="w-full bg-white text-gray-700 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all"
//             >
//               Sign in instead
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SignupPage;
import React, { useState } from 'react';
import { Mail, Lock, Loader2, User, Building2, Briefcase } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { auth, db } from './firebase'; // Import db for Firestore
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (name) {
        await updateProfile(user, {
          displayName: name,
        });
      }

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name || null,
        email: user.email,
        companyName: companyName.trim() || null,
        role: role.trim() || null,
        createdAt: new Date().toISOString(),
      });

      console.log('User created and data saved to Firestore:', user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      setError(
        err.code === 'auth/email-already-in-use'
          ? 'Email already in use'
          : err.code === 'auth/invalid-email'
          ? 'Invalid email address'
          : err.code === 'auth/weak-password'
          ? 'Password is too weak'
          : 'Failed to create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="ui-page-main ml-64 flex min-h-screen">
        <div className="relative hidden w-2/5 flex-col justify-between overflow-hidden border-r border-slate-200/60 bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950 p-10 text-white lg:flex">
          <div className="pointer-events-none absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/90">Join the cohort</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight">Create your workspace profile</h2>
            <p className="mt-3 max-w-sm text-sm text-slate-300">
              Company, role, and secure credentials—same experience across the app.
            </p>
          </div>
          <p className="relative z-10 text-xs text-slate-500">Encrypted · Firebase</p>
        </div>

        <div className="flex flex-1 items-center justify-center p-6 sm:p-8">
          <div className="ui-card w-full max-w-md p-8 sm:p-10">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create an account</h2>
              <p className="mt-2 text-sm text-slate-600">Enter your details to get started</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="ui-input-icon"
                />
              </div>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="ui-input-icon"
                />
              </div>

              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="ui-input-icon"
                />
              </div>

              <div className="relative">
                <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Role in Company"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="ui-input-icon"
                />
              </div>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="ui-input-icon"
                />
              </div>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="ui-input-icon"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="ui-btn-primary mt-2 w-full py-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs font-medium">
                  <span className="bg-white/90 px-3 text-slate-500">Already registered?</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="ui-btn-secondary w-full py-3"
              >
                Sign in instead
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
