import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Form.css';

const Form = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        age: '',
        gender: 'male',
        stress: 'medium',
        sleep: 'good',
        appetite: 'medium',
        sadness: 'medium',
        concentration: 'medium',
        social: 'medium'
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const token = localStorage.getItem('token');
        console.log("token:", token);

        try {
            // Validate age is a number
            if (isNaN(formData.age) || formData.age <= 0 || formData.age > 120) {
                throw new Error('Please enter a valid age between 1 and 120');
            }

            // Dummy API call for form submission
            const response = await axios.post('http://127.0.0.1:5000/api/form/submit', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Assessment submitted:', response.data);

            // Store the assessment data in localStorage
            localStorage.setItem('assessmentData', JSON.stringify(formData));

            // Redirect to results page
            navigate('/results');

        } catch (err) {
            setError(err.message || 'Failed to submit assessment. Please try again.');
            console.error('Submission error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container">
            <div className="form-wrapper">
                <div className="form-card">
                    <div className="form-background">
                        <div className="form-shapes">
                            <div className="shape shape-1"></div>
                            <div className="shape shape-2"></div>
                            <div className="shape shape-3"></div>
                            <div className="shape shape-4"></div>
                        </div>
                    </div>

                    <div className="form-content">
                        <div className="form-header">
                            <div className="form-logo">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 14L4 9L9 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M20 20V13C20 11.9391 19.5786 10.9217 18.8284 10.1716C18.0783 9.42143 17.0609 9 16 9H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h1>Mental Health Assessment</h1>
                            <p>Please answer the following questions honestly</p>
                        </div>

                        <form className="assessment-form" onSubmit={handleSubmit}>
                            {/* Age Field */}
                            <div className="form-group">
                                <label htmlFor="age">Age</label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    min="1"
                                    max="120"
                                    value={formData.age}
                                    onChange={handleChange}
                                    placeholder="Enter your age"
                                    required
                                />
                            </div>

                            {/* Gender Field */}
                            <div className="form-group">
                                <label htmlFor="gender">Gender</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            {/* Stress Level */}
                            <div className="form-group">
                                <label htmlFor="stress">Stress Level</label>
                                <select
                                    id="stress"
                                    name="stress"
                                    value={formData.stress}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            {/* Sleep Quality */}
                            <div className="form-group">
                                <label htmlFor="sleep">Sleep Quality</label>
                                <select
                                    id="sleep"
                                    name="sleep"
                                    value={formData.sleep}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="good">Good</option>
                                    <option value="medium">Medium</option>
                                    <option value="bad">Bad</option>
                                </select>
                            </div>

                            {/* Appetite */}
                            <div className="form-group">
                                <label htmlFor="appetite">Appetite</label>
                                <select
                                    id="appetite"
                                    name="appetite"
                                    value={formData.appetite}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            {/* Sadness Level */}
                            <div className="form-group">
                                <label htmlFor="sadness">Sadness Level</label>
                                <select
                                    id="sadness"
                                    name="sadness"
                                    value={formData.sadness}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            {/* Concentration Level */}
                            <div className="form-group">
                                <label htmlFor="concentration">Concentration Level</label>
                                <select
                                    id="concentration"
                                    name="concentration"
                                    value={formData.concentration}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            {/* Social Activity */}
                            <div className="form-group">
                                <label htmlFor="social">Social Activity</label>
                                <select
                                    id="social"
                                    name="social"
                                    value={formData.social}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="loading-spinner"></span>
                                ) : (
                                    'Submit Assessment'
                                )}
                            </button>
                        </form>

                        {error && <div className="error-message">{error}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form;
