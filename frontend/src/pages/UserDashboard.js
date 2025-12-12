import React, { useState, useEffect } from 'react';
import { stationsAPI, borrowAPI, umbrellasAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [stations, setStations] = useState([]);
  const [currentBorrow, setCurrentBorrow] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [availableUmbrellas, setAvailableUmbrellas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [view, setView] = useState('stations'); // 'stations', 'umbrellas', 'return'

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [stationsResponse, borrowResponse] = await Promise.all([
        stationsAPI.getAll(),
        borrowAPI.getCurrent()
      ]);
      
      setStations(stationsResponse.data.data);
      setCurrentBorrow(borrowResponse.data.data);
    } catch (error) {
      setMessage('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleStationSelect = async (station) => {
    setSelectedStation(station);
    setLoading(true);
    try {
      const response = await umbrellasAPI.getByStation(station._id);
      setAvailableUmbrellas(response.data.data);
      setView('umbrellas');
    } catch (error) {
      setMessage('Error loading umbrellas');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (umbrella) => {
    try {
      setMessage('');
      await borrowAPI.borrow(umbrella._id, selectedStation._id);
      setMessage('🎉 Umbrella borrowed successfully!');
      setView('stations');
      await loadData();
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Borrow failed'));
    }
  };

  const handleReturn = async (station) => {
    try {
      setMessage('');
      await borrowAPI.return(currentBorrow.umbrella._id, station._id);
      setMessage('✅ Umbrella returned successfully!');
      setView('stations');
      await loadData();
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Return failed'));
    }
  };

  const handleBackToStations = () => {
    setSelectedStation(null);
    setView('stations');
  };

  if (loading && view === 'stations') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#e2e8f0',
        fontSize: '18px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '24px', 
            height: '24px', 
            border: '3px solid transparent', 
            borderTop: '3px solid #667eea', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite' 
          }} />
          Loading your dashboard...
        </div>
      </div>
    );
  }

  const Card = ({ children, style }) => (
    <div style={{
      background: 'rgba(30, 30, 46, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '24px',
      backdropFilter: 'blur(20px)',
      ...style
    }}>
      {children}
    </div>
  );

  const ActionButton = ({ onClick, disabled, children, variant = 'primary' }) => {
    const variants = {
      primary: {
        background: disabled 
          ? 'rgba(100, 116, 139, 0.3)' 
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      },
      success: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white'
      },
      warning: {
        background: 'rgba(245, 158, 11, 0.2)',
        color: '#fbbf24',
        border: '1px solid rgba(245, 158, 11, 0.3)'
      },
      secondary: {
        background: 'rgba(255, 255, 255, 0.05)',
        color: '#e2e8f0',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          padding: '12px 20px',
          ...variants[variant],
          border: 'none',
          borderRadius: '12px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          fontSize: '14px',
          transition: 'all 0.3s ease',
          opacity: disabled ? 0.6 : 1
        }}
        onMouseEnter={(e) => !disabled && (e.target.style.transform = 'translateY(-2px)')}
        onMouseLeave={(e) => !disabled && (e.target.style.transform = 'translateY(0)')}
      >
        {children}
      </button>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '24px',
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      color: '#e2e8f0'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <Card style={{ 
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ 
              margin: '0 0 8px',
              color: '#ffffff',
              fontSize: '32px',
              fontWeight: '700'
            }}>
              User Dashboard
            </h1>
            <p style={{ 
              margin: 0,
              color: '#94a3b8',
              fontSize: '16px'
            }}>
              Welcome back, <strong style={{ color: '#667eea' }}>{user?.name}</strong>! 🌟
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '12px 24px',
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.3)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.2)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            🚪 Logout
          </button>
        </Card>

        {/* Message */}
        {message && (
          <Card style={{ 
            marginBottom: '24px',
            background: message.includes('❌') 
              ? 'rgba(239, 68, 68, 0.1)' 
              : 'rgba(34, 197, 94, 0.1)',
            borderColor: message.includes('❌') 
              ? 'rgba(239, 68, 68, 0.3)' 
              : 'rgba(34, 197, 94, 0.3)',
            color: message.includes('❌') ? '#f87171' : '#4ade80'
          }}>
            {message}
          </Card>
        )}

        {/* Current Borrow Section */}
        {currentBorrow && view === 'stations' && (
          <Card style={{ 
            marginBottom: '24px',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(245, 158, 11, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                📦
              </div>
              <div>
                <h3 style={{ 
                  margin: '0 0 4px',
                  color: '#ffffff',
                  fontSize: '20px'
                }}>
                  Currently Borrowing
                </h3>
                <p style={{ 
                  margin: 0,
                  color: '#fbbf24',
                  fontSize: '14px'
                }}>
                  You have an umbrella checked out
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div>
                <p style={{ 
                  margin: '0 0 4px',
                  color: '#94a3b8',
                  fontSize: '14px'
                }}>
                  Umbrella
                </p>
                <p style={{ 
                  margin: 0,
                  color: '#ffffff',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    padding: '4px 8px',
                    background: 'rgba(102, 126, 234, 0.2)',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}>
                    {currentBorrow.umbrella.umbrellaId}
                  </span>
                  {currentBorrow.umbrella.color} • {currentBorrow.umbrella.size}
                </p>
              </div>
              <div>
                <p style={{ 
                  margin: '0 0 4px',
                  color: '#94a3b8',
                  fontSize: '14px'
                }}>
                  Borrowed From
                </p>
                <p style={{ 
                  margin: 0,
                  color: '#ffffff',
                  fontWeight: '600'
                }}>
                  🏪 {currentBorrow.borrowStation.name}
                </p>
              </div>
            </div>

            <ActionButton
              onClick={() => setView('return')}
              variant="warning"
            >
              📍 Return Umbrella
            </ActionButton>
          </Card>
        )}

        {/* Stations List View */}
        {view === 'stations' && (
          <Card>
            <h2 style={{ 
              margin: '0 0 24px',
              color: '#ffffff',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              🏪 Available Stations ({stations.length})
            </h2>
            
            {stations.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: '#94a3b8'
              }}>
                🏪 No stations available
              </div>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '20px'
              }}>
                {stations.map(station => (
                  <Card key={station._id} style={{ padding: '20px' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      justifyContent: 'space-between',
                      marginBottom: '16px'
                    }}>
                      <div>
                        <h3 style={{ 
                          margin: '0 0 8px',
                          color: '#ffffff',
                          fontSize: '18px',
                          fontWeight: '600'
                        }}>
                          {station.name}
                        </h3>
                        <p style={{ 
                          margin: '0 0 8px',
                          color: '#94a3b8',
                          fontSize: '14px'
                        }}>
                          📍 {station.location}
                        </p>
                        <p style={{ 
                          margin: 0,
                          color: '#94a3b8',
                          fontSize: '14px'
                        }}>
                          🏠 {station.address}
                        </p>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        background: station.isActive 
                          ? 'rgba(34, 197, 94, 0.2)' 
                          : 'rgba(239, 68, 68, 0.2)',
                        color: station.isActive ? '#4ade80' : '#f87171',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {station.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <ActionButton
                      onClick={() => handleStationSelect(station)}
                      disabled={!station.isActive || currentBorrow}
                      variant="primary"
                    >
                      {currentBorrow ? (
                        <>📦 Already Borrowing</>
                      ) : !station.isActive ? (
                        <>🚫 Station Inactive</>
                      ) : (
                        <>☔ Browse Umbrellas</>
                      )}
                    </ActionButton>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Umbrellas List View */}
        {view === 'umbrellas' && (
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <ActionButton onClick={handleBackToStations} variant="secondary">
                ← Back to Stations
              </ActionButton>
              <div>
                <h2 style={{ 
                  margin: '0 0 4px',
                  color: '#ffffff',
                  fontSize: '24px'
                }}>
                  Available Umbrellas
                </h2>
                <p style={{ 
                  margin: 0,
                  color: '#94a3b8',
                  fontSize: '14px'
                }}>
                  at {selectedStation.name} • {selectedStation.location}
                </p>
              </div>
            </div>

            {loading ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: '#94a3b8'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    border: '2px solid transparent', 
                    borderTop: '2px solid #667eea', 
                    borderRadius: '50%', 
                    animation: 'spin 1s linear infinite' 
                  }} />
                  Loading umbrellas...
                </div>
              </div>
            ) : availableUmbrellas.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: '#94a3b8'
              }}>
                😔 No umbrellas available at this station
              </div>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px'
              }}>
                {availableUmbrellas.map(umbrella => (
                  <Card key={umbrella._id} style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      margin: '0 auto 16px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px'
                    }}>
                      ☔
                    </div>
                    
                    <h3 style={{ 
                      margin: '0 0 8px',
                      color: '#ffffff',
                      fontSize: '18px'
                    }}>
                      {umbrella.umbrellaId}
                    </h3>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      gap: '12px',
                      marginBottom: '16px'
                    }}>
                      <span style={{
                        padding: '4px 8px',
                        background: 'rgba(102, 126, 234, 0.2)',
                        color: '#667eea',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {umbrella.color}
                      </span>
                      <span style={{
                        padding: '4px 8px',
                        background: 'rgba(34, 197, 94, 0.2)',
                        color: '#4ade80',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {umbrella.size}
                      </span>
                    </div>

                    <ActionButton
                      onClick={() => handleBorrow(umbrella)}
                      variant="primary"
                    >
                      ✅ Borrow This Umbrella
                    </ActionButton>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Return Station Selection View */}
        {view === 'return' && (
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <ActionButton onClick={() => setView('stations')} variant="secondary">
                ← Back to Dashboard
              </ActionButton>
              <div>
                <h2 style={{ 
                  margin: '0 0 4px',
                  color: '#ffffff',
                  fontSize: '24px'
                }}>
                  Return Umbrella
                </h2>
                <p style={{ 
                  margin: 0,
                  color: '#94a3b8',
                  fontSize: '14px'
                }}>
                  Select a station to return your umbrella
                </p>
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <Card style={{ 
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}>
                <h3 style={{ 
                  margin: '0 0 12px',
                  color: '#fbbf24',
                  fontSize: '18px'
                }}>
                  Current Umbrella
                </h3>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>ID:</span>
                    <span style={{ color: '#ffffff', fontWeight: '600' }}>
                      {currentBorrow.umbrella.umbrellaId}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Color:</span>
                    <span style={{ color: '#ffffff', fontWeight: '600' }}>
                      {currentBorrow.umbrella.color}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Size:</span>
                    <span style={{ color: '#ffffff', fontWeight: '600' }}>
                      {currentBorrow.umbrella.size}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            <h3 style={{ 
              margin: '0 0 16px',
              color: '#ffffff',
              fontSize: '20px'
            }}>
              Available Return Stations
            </h3>

            {stations.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: '#94a3b8'
              }}>
                🏪 No stations available for return
              </div>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '16px'
              }}>
                {stations.map(station => (
                  <Card key={station._id} style={{ padding: '20px' }}>
                    <h4 style={{ 
                      margin: '0 0 8px',
                      color: '#ffffff',
                      fontSize: '16px'
                    }}>
                      {station.name}
                    </h4>
                    <p style={{ 
                      margin: '0 0 12px',
                      color: '#94a3b8',
                      fontSize: '14px'
                    }}>
                      📍 {station.location}
                    </p>
                    <ActionButton
                      onClick={() => handleReturn(station)}
                      variant="success"
                    >
                      📍 Return Here
                    </ActionButton>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;