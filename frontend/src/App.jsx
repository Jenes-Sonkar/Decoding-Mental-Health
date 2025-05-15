import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Form from './components/Form';
import Results from './components/Results'; // Include only if you have this component

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect root to /auth */}
        <Route path="/" element={<Navigate to="/auth" />} />
        
        {/* Auth route */}
        <Route path="/auth" element={<Auth />} />
        
        {/* Questionnaire form */}
        <Route path="/form" element={<Form />} />
        
        {/* Optional results page */}
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
};

export default App;
