import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Purchases from './components/Purchases';
import Transfers from './components/Transfers';
import AssignmentsExpenditures from './components/AssignmentsExpenditures';

// RBAC ProtectedRoute: Checks authentication and allowed roles
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={user?.role === 'LOGISTICS' ? '/purchases' : '/dashboard'} replace />;
  }

  return children;
};

// RBAC Responsive Navigation Bar with Hamburger Menu
const Navigation = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!isAuthenticated) return null;

  const role = user?.role;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <span className="nav-brand">
          🛡️ Military Management
        </span>

        {/* Hamburger Toggle Button */}
        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Navigation"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {/* Nav Links & User Actions */}
        <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <div className="nav-links">
            {(role === 'ADMIN' || role === 'COMMANDER') && (
              <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            )}

            {(role === 'ADMIN' || role === 'COMMANDER' || role === 'LOGISTICS') && (
              <Link to="/purchases" className="nav-link" onClick={() => setMenuOpen(false)}>Purchases</Link>
            )}

            {(role === 'ADMIN' || role === 'COMMANDER' || role === 'LOGISTICS') && (
              <Link to="/transfers" className="nav-link" onClick={() => setMenuOpen(false)}>Transfers</Link>
            )}

            {(role === 'ADMIN' || role === 'COMMANDER') && (
              <Link to="/assignments" className="nav-link" onClick={() => setMenuOpen(false)}>Assignments & Expenditures</Link>
            )}
          </div>

          <div className="nav-user">
            <span>
              User: <strong>{user?.username}</strong> ({user?.role} {user?.baseId ? `- Base #${user.baseId}` : ''})
            </span>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'COMMANDER']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/purchases"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'COMMANDER', 'LOGISTICS']}>
                <Purchases />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transfers"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'COMMANDER', 'LOGISTICS']}>
                <Transfers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/assignments"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'COMMANDER']}>
                <AssignmentsExpenditures />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
