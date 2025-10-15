// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import VacationRequestForm from './component/VacationRequestForm';
import VacationResolutionPage from './component/VacationResolutionPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav style={{
          backgroundColor: '#2c5aa0',
          padding: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            gap: '2rem'
          }}>
            <Link
              to="/"
              style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Submit Vacation Request
            </Link>
            <Link
              to="/resolve"
              style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Resolve Requests
            </Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<VacationRequestForm />} />
          <Route path="/resolve" element={<VacationResolutionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;