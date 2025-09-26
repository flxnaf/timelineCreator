import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Home, Timeline } from 'lucide-react';
import Guidelines from './pages/Guidelines';
import TimelineApp from './pages/TimelineApp';
import './App.css'
import './styles/Guidelines.css'
import './styles/TimelineApp.css'

function HomePage() {
  return (
    <motion.div 
      className="home-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="home-content">
        <motion.h1 
          className="home-title"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Timeline Creator
        </motion.h1>
        <motion.p 
          className="home-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          A modern React web application for creating beautiful timelines
        </motion.p>
        <motion.div 
          className="home-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link to="/timeline" className="action-button primary">
            <Timeline size={20} />
            Open Timeline
          </Link>
          <Link to="/guidelines" className="action-button secondary">
            <BookOpen size={20} />
            View Guidelines
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

function AppContent() {
  const location = useLocation();
  const isTimelinePage = location.pathname === '/timeline';

  return (
    <div className="app">
      {!isTimelinePage && (
        <nav className="nav">
          <Link to="/" className="nav-link">
            <Home size={20} />
            Home
          </Link>
          <Link to="/timeline" className="nav-link">
            <Timeline size={20} />
            Timeline
          </Link>
          <Link to="/guidelines" className="nav-link">
            <BookOpen size={20} />
            Guidelines
          </Link>
        </nav>
      )}
      
      <main className={`main-content ${isTimelinePage ? 'full-height' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/timeline" element={<TimelineApp />} />
          <Route path="/guidelines" element={<Guidelines />} />
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
