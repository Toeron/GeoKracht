<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
=======
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
>>>>>>> 65ed1db70b5b9c2be34b4c015e1ae6575c4e948b
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import Workout from './pages/Workout';
import WorkoutTemplates from './pages/WorkoutTemplates';
import Progress from './pages/Progress';
import History from './pages/History';
<<<<<<< HEAD
import { Auth } from './components/Auth';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-black uppercase text-2xl animate-pulse">
        Loading Session...
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout session={session} />}>
=======

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
>>>>>>> 65ed1db70b5b9c2be34b4c015e1ae6575c4e948b
          <Route index element={<Dashboard />} />
          <Route path="workout" element={<Workout />} />
          <Route path="templates" element={<WorkoutTemplates />} />
          <Route path="progress" element={<Progress />} />
          <Route path="history" element={<History />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;