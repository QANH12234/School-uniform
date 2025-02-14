// Import necessary modules and components
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../Context/AuthContext';
import './CSS/LoginSignup.css'
import schoolLogo from '../Components/Assets/logo.png';

// Define the LoginSignup component
const LoginSignup = () => {
  // Hook to navigate programmatically
  const navigate = useNavigate();

  // Destructure login function from AuthContext
  const { login: authLogin } = useAuth();

  // State to manage the current form state (Login or Sign Up)
  const [state, setState] = useState("Login");

  // State to store form data
  const [formData, setFormData] = useState({
    email: "", // User's email
    password: "", // User's password
    name: "" // User's name (only for Sign Up)
  });

  // State to manage loading state
  const [loading, setLoading] = useState(false);

  // State to manage error messages
  const [error, setError] = useState("");

  // Handle input change in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  // Validate form data before submission
  const validateForm = () => {
    const { email, password, name } = formData;

    if (!email || !password) {
      setError("Please fill in all required fields");
      return false;
    }

    if (state === "Sign Up" && !name) {
      setError("Please provide your name");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError("");

    const endpoint = state === "Login" ? 'login' : 'signup';
    console.log('Attempting auth:', { endpoint, formData });

    try {
      const response = await fetch(`http://localhost:4000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.success) {
        // Store token and user data
        localStorage.setItem('auth-token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update auth context
        await authLogin(data.user, data.token);
        
        toast.success(`${state} successful!`);
        navigate('/');
      } else {
        const errorMessage = data.error || `${state} failed`;
        console.error('Auth error:', errorMessage);
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error(`${state} error:`, error);
      setError('Could not connect to server. Please try again.');
      toast.error('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>British International School</h1>
        <h2>Uniform Store - {state}</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="loginsignup-fields">
            {state === "Sign Up" && (
              <input
                type="text"
                placeholder="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={state === "Sign Up"}
                autoComplete="name"
              />
            )}
            
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
            
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete={state === "Login" ? "current-password" : "new-password"}
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className={`submit-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? "Please wait..." : state}
          </button>
        </form>

        <div className="loginsignup-toggle">
          {state === "Login" ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setState("Sign Up");
                  setError("");
                  setFormData({ email: "", password: "", name: "" });
                }}
                disabled={loading}
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setState("Login");
                  setError("");
                  setFormData({ email: "", password: "", name: "" });
                }}
                disabled={loading}
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
      
      <div className="logo-container">
        <img src={schoolLogo} alt="School Logo" />
      </div>
    </div>
  );
};

// Export the LoginSignup component
export default LoginSignup;