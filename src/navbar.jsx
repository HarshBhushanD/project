import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, LogOut, Users, CalendarDays, Shield } from 'lucide-react';
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
    <nav className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg flex flex-col z-50">
      {/* Logo/Brand */}
      <div className="h-16 flex items-center px-6 border-b">
        <h1 className="text-xl font-bold text-red-600">Developers Cohort</h1>
      </div>

      {/* Navigation items */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors
              ${location.pathname.startsWith(item.path)
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </div>

      {/* Sign out button at bottom */}
      <div className="border-t px-4 py-4">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-start space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;