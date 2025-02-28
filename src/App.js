import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SurveyForm from './components/SurveyForm';
import ThankYouPage from './components/THXPage';
import Later from './components/Later';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SurveyForm />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/later" element={<Later />} />
      </Routes>
    </Router>
  );
};

export default App;