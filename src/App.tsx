import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Calendar } from 'lucide-react';
import TimelineApp from './pages/TimelineApp';
import NewTimelineModal from './components/NewTimelineModal';
import './App.css'
import './styles/TimelineApp.css'

function HomePage() {
  const [isNewTimelineModalOpen, setIsNewTimelineModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateTimeline = (title: string, startYear: number, endYear: number) => {
    // Create timeline data and navigate
    const timelineData = {
      title,
      startYear,
      endYear,
      created: Date.now()
    };
    
    // Store in sessionStorage for the timeline app to pick up
    sessionStorage.setItem('newTimelineData', JSON.stringify(timelineData));
    
    setIsNewTimelineModalOpen(false);
    navigate('/timeline');
  };

  return (
    <>
      <motion.div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '80vh',
          textAlign: 'center'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <motion.h1 
            style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem',
              color: '#b4a7d6'
            }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Timeline Creator
          </motion.h1>
          <motion.p 
            style={{ 
              fontSize: '1.2rem', 
              marginBottom: '2rem',
              color: '#a5a5a5'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            A modern React web application for creating beautiful timelines
          </motion.p>
          <motion.div 
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <button 
              onClick={() => setIsNewTimelineModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 2rem',
                background: '#b4a7d6',
                color: '#2d3748',
                border: 'none',
                borderRadius: '1rem',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Calendar size={20} />
              New Timeline
            </button>
          </motion.div>
        </div>
      </motion.div>

      <NewTimelineModal
        isOpen={isNewTimelineModalOpen}
        onClose={() => setIsNewTimelineModalOpen(false)}
        onCreateTimeline={handleCreateTimeline}
      />
    </>
  );
}

function AppContent() {
  const location = useLocation();
  const isTimelinePage = location.pathname === '/timeline';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', color: 'white' }}>
      {!isTimelinePage && (
        <nav style={{ padding: '1rem', backgroundColor: '#2a2a2a', display: 'flex', gap: '1rem' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', backgroundColor: '#3a3a3a', borderRadius: '0.5rem' }}>
            <Home size={20} style={{ marginRight: '0.5rem' }} />
            Home
          </Link>
        </nav>
      )}
      
      <main style={{ flex: 1, padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/timeline" element={<TimelineApp />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
