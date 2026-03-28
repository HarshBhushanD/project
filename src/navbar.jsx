import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, LogOut, Users, CalendarDays, Shield, Code2 } from 'lucide-react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserRole(null);
        setUserEmail(null);
        return;
      }
      setUserEmail(user.email || null);
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          setUserRole(snap.data().role || null);
        }
      } catch (err) {
        console.error('Error loading user role for navbar:', err);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: '/dashboard',
      visible: true,
    },
    {
      name: 'Projects',
      icon: <FolderKanban className="h-5 w-5" />,
      path: '/projects',
      visible: true,
    },
    {
      name: 'Users',
      icon: <Users className="h-5 w-5" />,
      path: '/users',
      visible: true,
    },
    {
      name: 'Leave',
      icon: <CalendarDays className="h-5 w-5" />,
      path: '/leave',
      visible: true,
    },
    {
      name: 'Compiler',
      icon: <Code2 className="h-5 w-5" />,
      path: '/compiler',
      visible: true,
    },
    {
      name: 'Admin',
      icon: <Shield className="h-5 w-5" />,
      path: '/admin',
      visible: userRole === 'admin' || userRole === 'manager',
    },
    {
      name: 'Super Admin',
      icon: <Shield className="h-5 w-5" />,
      path: '/superadmin',
      visible: userEmail === 'harshbhushandixit@gmail.com' || userRole === 'ceo',
    },
  ].filter(item => item.visible);

  return (
    <nav className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800/80 bg-slate-900 shadow-soft-lg">
      <div className="flex h-16 items-center border-b border-slate-800 px-5">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/25">
            DC
          </span>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white">Developers Cohort</h1>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Workspace</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all
              ${location.pathname.startsWith(item.path)
                ? 'bg-indigo-500/15 text-white shadow-inner ring-1 ring-indigo-400/30'
                : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'}`}
          >
            <span className={location.pathname.startsWith(item.path) ? 'text-indigo-400' : 'text-slate-500'}>
              {item.icon}
            </span>
            <span>{item.name}</span>
          </button>
        ))}
      </div>

      <div className="border-t border-slate-800 p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;