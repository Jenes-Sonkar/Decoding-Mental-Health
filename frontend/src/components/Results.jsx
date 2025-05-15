import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Results.css';

const Results = () => {
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [depressionScore, setDepressionScore] = useState(0);
  const [depressionLevel, setDepressionLevel] = useState('');
  const [prediction, setPrediction] = useState('');

  useEffect(() => {
    const data = localStorage.getItem('assessmentData');
    
    if (!data) {
      navigate('/form');
      return;
    }
    
    try {
      const parsedData = JSON.parse(data);
      setAssessmentData(parsedData);

      // Calculate score first
      calculateDepressionScore(parsedData);

      // Then fetch prediction
      fetchPrediction(parsedData);
      
    } catch (error) {
      console.error('Error parsing assessment data:', error);
      navigate('/form');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Dynamic GET request with form data as query parameters
  const fetchPrediction = async (data) => {
    const params = new URLSearchParams({
      age: data.age,
      gender: data.gender,
      stress: data.stress,
      sleep: data.sleep,
      appetite: data.appetite,
      sadness: data.sadness,
      concentration: data.concentration,
      social: data.social
    });

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/result/?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Error fetching prediction:', errorMessage);
        throw new Error(`Failed to fetch prediction: ${response.status} - ${errorMessage}`);
      }

      const result = await response.json();

      if (result.prediction) {
        setPrediction(result.prediction);
      } else {
        console.error('Backend did not return prediction');
        setPrediction('There was an error fetching the prediction.');
      }
    } catch (error) {
      console.error('Error fetching prediction:', error.message);
      setPrediction('There was an error fetching the prediction.');
    }
  };

  const calculateDepressionScore = (data) => {
    const levelValues = {
      low: 1,
      medium: 2,
      high: 3,
      good: 1,
      bad: 3
    };

    let score = 0;
    score += levelValues[data.stress] * 2;
    score += levelValues[data.sleep];
    score += data.appetite === 'low' ? 2 : (data.appetite === 'medium' ? 1 : 0);
    score += levelValues[data.sadness] * 3;
    score += levelValues[data.concentration];
    score += data.social === 'low' ? 2 : (data.social === 'medium' ? 1 : 0);

    setDepressionScore(score);

    if (score <= 8) {
      setDepressionLevel('Low risk');
    } else if (score <= 12) {
      setDepressionLevel('Moderate risk');
    } else {
      setDepressionLevel('High risk');
    }
  };

  const handleRetakeAssessment = () => {
    navigate('/form');
  };

  if (loading) {
    return (
      <div className="results-container">
        <div className="loading-container">
          <div className="loading-spinner-large"></div>
          <p>Processing your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="results-wrapper">
        <div className="results-card">
          <div className="results-background">
            <div className="results-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
              <div className="shape shape-4"></div>
            </div>
          </div>

          <div className="results-content">
            <div className="results-header">
              <div className="results-logo">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1>Your Assessment Results</h1>
              <p>Based on your responses, we've generated the following insights</p>
            </div>

            <div className="assessment-summary">
              <div className="score-display">
                <div className={`score-circle ${depressionLevel.toLowerCase().replace(' ', '-')}`}>
                  <span>{depressionScore}</span>
                </div>
                <div className="score-label">
                  <h2>{depressionLevel}</h2>
                  <p>Depression Risk Level</p>
                </div>
              </div>

              <div className="response-summary">
                <h3>Your Responses</h3>
                <div className="response-grid">
                  <div className="response-item">
                    <span className="response-label">Age</span>
                    <span className="response-value">{assessmentData.age}</span>
                  </div>
                  <div className="response-item">
                    <span className="response-label">Gender</span>
                    <span className="response-value capitalize">{assessmentData.gender}</span>
                  </div>
                  <div className="response-item">
                    <span className="response-label">Stress Level</span>
                    <span className={`response-value level-indicator ${assessmentData.stress}`}>
                      {assessmentData.stress}
                    </span>
                  </div>
                  <div className="response-item">
                    <span className="response-label">Sleep Quality</span>
                    <span className={`response-value level-indicator ${assessmentData.sleep}`}>
                      {assessmentData.sleep}
                    </span>
                  </div>
                  <div className="response-item">
                    <span className="response-label">Appetite</span>
                    <span className={`response-value level-indicator ${assessmentData.appetite}`}>
                      {assessmentData.appetite}
                    </span>
                  </div>
                  <div className="response-item">
                    <span className="response-label">Sadness Level</span>
                    <span className={`response-value level-indicator ${assessmentData.sadness}`}>
                      {assessmentData.sadness}
                    </span>
                  </div>
                  <div className="response-item">
                    <span className="response-label">Concentration</span>
                    <span className={`response-value level-indicator ${assessmentData.concentration}`}>
                      {assessmentData.concentration}
                    </span>
                  </div>
                  <div className="response-item">
                    <span className="response-label">Social Activity</span>
                    <span className={`response-value level-indicator ${assessmentData.social}`}>
                      {assessmentData.social}
                    </span>
                  </div>
                </div>
              </div>

              {/* Prediction Section */}
              <div className="prediction">
                <h3>Prediction</h3>
                <p>{prediction}</p>
              </div>

              <div className="disclaimer">
                <p>
                  <strong>Important:</strong> This assessment is not a diagnostic tool. It's designed to help you understand potential risk factors. For accurate diagnosis and treatment, please consult with a qualified healthcare professional.
                </p>
              </div>

              <button 
                className="retake-btn"
                onClick={handleRetakeAssessment}
              >
                Retake Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
