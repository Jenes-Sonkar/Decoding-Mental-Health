import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Auth = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/auth/login', loginData);
      const { token } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => navigate('/form'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!signupData.email || !signupData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/auth/signup', signupData);
      setSuccess('Account created successfully! Please log in.');
      setTimeout(() => {
        setSignupData({ email: '', password: '' });
        setIsLogin(true);
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-background">
            <div className="auth-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
              <div className="shape shape-4"></div>
            </div>
          </div>

          <div className="auth-content">
            <div className="auth-header">
              <div className="auth-logo">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" />
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" />
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <h1>{isLogin ? 'Welcome Back' : 'Join Us Today'}</h1>
              <p>{isLogin ? 'Sign in to continue to your account' : 'Create an account to get started'}</p>
            </div>

            {isLogin ? (
              <form className="auth-form" onSubmit={handleLogin}>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder="Email address"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="Password"
                    required
                  />
                </div>

                <div className="forgot-password">
                  <a href="#">Forgot password?</a>
                </div>

                <button className="submit-btn" type="submit" disabled={isLoading}>
                  {isLoading ? <span className="loading-spinner"></span> : 'Sign In'}
                </button>

                <div className="auth-toggle">
                  <p>
                    Don't have an account?{' '}
                    <span className="toggle-link" onClick={toggleForm}>Create new account</span>
                  </p>
                </div>
              </form>
            ) : (
              <form className="auth-form" onSubmit={handleSignup}>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    placeholder="Email address"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    placeholder="Create a password"
                    required
                  />
                </div>

                <div className="terms-agreement">
                  <label className="checkbox-container">
                    <input type="checkbox" required />
                    <span className="checkmark"></span>
                    I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                  </label>
                </div>

                <button className="submit-btn" type="submit" disabled={isLoading}>
                  {isLoading ? <span className="loading-spinner"></span> : 'Create Account'}
                </button>

                <div className="auth-toggle">
                  <p>
                    Already have an account?{' '}
                    <span className="toggle-link" onClick={toggleForm}>Sign in</span>
                  </p>
                </div>
              </form>
            )}

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
