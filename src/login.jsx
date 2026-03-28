import React, { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in user:', userCredential.user);
      navigate('/dashboard'); 
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.code === 'auth/user-not-found' ? 'No account found with this email' :
        err.code === 'auth/wrong-password' ? 'Incorrect password' :
        err.code === 'auth/invalid-email' ? 'Invalid email address' :
        'Failed to log in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      setError('');
    } catch (err) {
      console.error('Password reset error:', err);
      setError(
        err.code === 'auth/user-not-found' ? 'No account found with this email' :
        err.code === 'auth/invalid-email' ? 'Invalid email address' :
        'Failed to send reset email. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="ui-page-main ml-64 flex min-h-screen">
        <div className="relative hidden w-2/5 flex-col justify-between overflow-hidden border-r border-slate-200/60 bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900 p-10 text-white lg:flex">
          <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300/90">Developers Cohort</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight">Ship projects faster with your team.</h2>
            <p className="mt-3 max-w-sm text-sm text-slate-300">
              One place for projects, people, leave, and collaboration.
            </p>
          </div>
          <p className="relative z-10 text-xs text-slate-500">Secure sign-in · Firebase Auth</p>
        </div>

        <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
          <div className="ui-card w-full max-w-md p-8 sm:p-10">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-600">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
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

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {resetEmailSent && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  Password reset email sent! Please check your inbox.
                </div>
              )}

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-medium text-indigo-600 transition hover:text-indigo-800"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="ui-btn-primary w-full py-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs font-medium">
                  <span className="bg-white/90 px-3 text-slate-500">New here?</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="ui-btn-secondary w-full py-3"
              >
                Create an account
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;