import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
// Remove this line since you're not using it yet:
// import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  // Remove this line:
  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register({ name, email, studentId, password });
        // After successful registration
        setError('🎉 Registration successful! Please sign in.');
        setIsRegister(false);
        // Clear form
        setName('');
        setEmail('');
        setStudentId('');
        setPassword('');
      } else {
        const result = await login(email, password);
        console.log('Login result:', result);
        
        // The page will automatically redirect due to auth state change
        // Or you can force reload to update the app state
        window.location.reload();
      }
    } catch (error) {
      setError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
      fontFamily: 'Segoe UI, system-ui, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '440px', 
        width: '100%',
        background: 'rgba(30, 30, 46, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '40px 30px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '32px' 
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
          }}>
            ☔
          </div>
          <h1 style={{ 
            color: '#ffffff', 
            margin: '0 0 8px',
            fontSize: '28px',
            fontWeight: '700'
          }}>
            Umbrella Borrow
          </h1>
          <p style={{ 
            color: '#94a3b8',
            margin: 0,
            fontSize: '16px'
          }}>
            {isRegister ? 'Create your account' : 'Welcome back!'}
          </p>
        </div>
        
        {/* Error Message */}
        {error && (
          <div style={{
            padding: '16px',
            marginBottom: '24px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            color: '#f87171',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '18px' }}>⚠️</span>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: '#e2e8f0',
                  fontSize: '14px'
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  placeholder="Enter your full name"
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: '#e2e8f0',
                  fontSize: '14px'
                }}>
                  Student ID
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  placeholder="Enter your student ID"
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>
            </>
          )}
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#e2e8f0',
              fontSize: '14px'
            }}>
              {isRegister ? 'Email Address' : 'Email or Student ID'}
            </label>
            <input
              type={isRegister ? "email" : "text"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              placeholder={isRegister ? "Enter your email" : "Enter your email or student ID"}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#e2e8f0',
              fontSize: '14px'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              placeholder="Enter your password"
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading 
                ? 'linear-gradient(135deg, #4a5568 0%, #718096 100%)' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  border: '2px solid transparent', 
                  borderTop: '2px solid white', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite' 
                }} />
                Processing...
              </span>
            ) : (
              isRegister ? '🎉 Create Account' : '🔑 Sign In'
            )}
          </button>
        </form>

        {/* Toggle between Login/Register */}
        <p style={{ 
          marginTop: '24px', 
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: '14px'
        }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              color: '#667eea',
              fontWeight: '600',
              fontSize: '14px',
              textDecoration: 'underline'
            }}
          >
            {isRegister ? 'Sign in here' : 'Create account'}
          </button>
        </p>

        {/* Test Credentials */}
        <div style={{ 
          marginTop: '32px', 
          padding: '20px',
          background: 'rgba(102, 126, 234, 0.1)',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '20px', 
            marginBottom: '8px',
            color: '#667eea'
          }}>
            💡
          </div>
          <h4 style={{ 
            margin: '0 0 8px',
            color: '#e2e8f0',
            fontSize: '16px'
          }}>
            Test Credentials
          </h4>
          <p style={{ 
            fontSize: '14px', 
            margin: 0,
            color: '#94a3b8'
          }}>
            {isRegister ? 'Use your student ID and email to register' : 'Login with email or student ID'}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;