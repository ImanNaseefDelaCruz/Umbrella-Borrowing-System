import React, { useState, useEffect } from 'react';
import { adminAPI, umbrellasAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stations, setStations] = useState([]);
  const [umbrellas, setUmbrellas] = useState([]);
  const [users, setUsers] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('umbrellas');
  const [showCreateUmbrella, setShowCreateUmbrella] = useState(false);

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
      const [stationsResponse, umbrellasResponse, usersResponse, recordsResponse, activeResponse] = await Promise.all([
        adminAPI.getAllStations(),
        adminAPI.getAllUmbrellas(),
        adminAPI.getAllUsers(),
        adminAPI.getBorrowRecords(),
        adminAPI.getActiveBorrows()
      ]);
      
      setStations(stationsResponse.data.data);
      setUmbrellas(umbrellasResponse.data.data);
      setUsers(usersResponse.data.data);
      setBorrowRecords(recordsResponse.data.data);
      setActiveBorrows(activeResponse.data.data);
    } catch (error) {
      setMessage('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUmbrella = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const umbrellaData = {
      umbrellaId: formData.get('umbrellaId'),
      station: formData.get('station'),
      color: formData.get('color'),
      size: formData.get('size')
    };

    try {
      setMessage('');
      await adminAPI.createUmbrella(umbrellaData);
      setMessage('✅ Umbrella created successfully!');
      e.target.reset();
      setShowCreateUmbrella(false);
      await loadData();
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Failed to create umbrella'));
    }
  };

  const handleUpdateUmbrella = async (umbrellaId, updates) => {
    try {
      setMessage('');
      await adminAPI.updateUmbrella(umbrellaId, updates);
      setMessage('✅ Umbrella updated successfully!');
      await loadData();
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Failed to update umbrella'));
    }
  };

  const handleDeleteUmbrella = async (umbrellaId) => {
    if (window.confirm('Are you sure you want to delete this umbrella?')) {
      try {
        setMessage('');
        await umbrellasAPI.delete(umbrellaId);
        setMessage('✅ Umbrella deleted successfully!');
        await loadData();
      } catch (error) {
        setMessage('❌ ' + (error.response?.data?.message || 'Failed to delete umbrella'));
      }
    }
  };

  const handleResetUser = async (userId) => {
    try {
      setMessage('');
      await adminAPI.resetUser(userId);
      setMessage('🔄 User status reset successfully!');
      await loadData();
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Failed to reset user'));
    }
  };

  // Initialize stations with umbrellas
  const initializeStationsAndUmbrellas = async () => {
    try {
      setMessage('');
      await adminAPI.initializeData();
      setMessage('🎉 Stations and umbrellas initialized successfully!');
      await loadData();
    } catch (error) {
      setMessage('❌ Error initializing data: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
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
          Loading Admin Dashboard...
        </div>
      </div>
    );
  }

  const TabButton = ({ active, onClick, children, icon }) => (
    <button
      onClick={onClick}
      style={{
        padding: '12px 24px',
        marginRight: '12px',
        background: active 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
          : 'rgba(255, 255, 255, 0.05)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      {icon} {children}
    </button>
  );

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

  const ActionButton = ({ onClick, disabled, children, variant = 'primary', size = 'medium' }) => {
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
      danger: {
        background: 'rgba(239, 68, 68, 0.2)',
        color: '#f87171',
        border: '1px solid rgba(239, 68, 68, 0.3)'
      },
      secondary: {
        background: 'rgba(255, 255, 255, 0.05)',
        color: '#e2e8f0',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }
    };

    const sizes = {
      small: { padding: '8px 16px', fontSize: '12px' },
      medium: { padding: '12px 20px', fontSize: '14px' },
      large: { padding: '16px 24px', fontSize: '16px' }
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          ...variants[variant],
          ...sizes[size],
          border: 'none',
          borderRadius: '12px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontWeight: '600',
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

  const getUmbrellasByStation = (stationId) => {
    return umbrellas.filter(umbrella => umbrella.station?._id === stationId);
  };

  const getAvailableUmbrellasCount = (stationId) => {
    return getUmbrellasByStation(stationId).filter(u => u.status === 'available').length;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '24px',
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      color: '#e2e8f0'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
              Admin Dashboard
            </h1>
            <p style={{ 
              margin: 0,
              color: '#94a3b8',
              fontSize: '16px'
            }}>
              Welcome back, <strong style={{ color: '#667eea' }}>{user?.name}</strong>! 👋
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {stations.length === 0 && (
              <ActionButton onClick={initializeStationsAndUmbrellas} variant="success">
                🎉 Initialize Data
              </ActionButton>
            )}
            <ActionButton onClick={handleLogout} variant="danger">
              🚪 Logout
            </ActionButton>
          </div>
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

        {/* Tabs */}
        <div style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <TabButton 
            active={activeTab === 'umbrellas'} 
            onClick={() => setActiveTab('umbrellas')}
            icon="☔"
          >
            Umbrella Management
          </TabButton>
          <TabButton 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')}
            icon="👥"
          >
            User Management
          </TabButton>
          <TabButton 
            active={activeTab === 'borrows'} 
            onClick={() => setActiveTab('borrows')}
            icon="📊"
          >
            Borrow Records
          </TabButton>
        </div>

        {/* Umbrella Management Tab */}
        {activeTab === 'umbrellas' && (
          <div>
            {/* Create Umbrella Button */}
            <Card style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ 
                  margin: 0,
                  color: '#ffffff',
                  fontSize: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  ☔ Umbrella Management
                </h2>
                <ActionButton 
                  onClick={() => setShowCreateUmbrella(!showCreateUmbrella)}
                  variant="success"
                >
                  {showCreateUmbrella ? '✕ Cancel' : '➕ Add Umbrella'}
                </ActionButton>
              </div>

              {/* Create Umbrella Form */}
              {showCreateUmbrella && (
                <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
                  <h3 style={{ margin: '0 0 16px', color: '#ffffff', fontSize: '18px' }}>Create New Umbrella</h3>
                  <form onSubmit={handleCreateUmbrella}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#e2e8f0', fontSize: '14px' }}>
                          Umbrella ID
                        </label>
                        <input
                          type="text"
                          name="umbrellaId"
                          placeholder="e.g., UMB-001"
                          required
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            color: '#ffffff',
                            fontSize: '14px'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#e2e8f0', fontSize: '14px' }}>
                          Station
                        </label>
                        <select
                          name="station"
                          required
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            color: '#ffffff',
                            fontSize: '14px'
                          }}
                        >
                          <option value="">Select Station</option>
                          {stations.map(station => (
                            <option key={station._id} value={station._id}>
                              {station.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#e2e8f0', fontSize: '14px' }}>
                          Color
                        </label>
                        <select
                          name="color"
                          required
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            color: '#ffffff',
                            fontSize: '14px'
                          }}
                        >
                          <option value="">Select Color</option>
                          <option value="Blue">Blue</option>
                          <option value="Red">Red</option>
                          <option value="Green">Green</option>
                          <option value="Black">Black</option>
                          <option value="Transparent">Transparent</option>
                          <option value="Yellow">Yellow</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#e2e8f0', fontSize: '14px' }}>
                          Size
                        </label>
                        <select
                          name="size"
                          required
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            color: '#ffffff',
                            fontSize: '14px'
                          }}
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>
                      <ActionButton type="submit" variant="primary">
                        Create
                      </ActionButton>
                    </div>
                  </form>
                </div>
              )}
            </Card>

            {/* Stations and Umbrellas List */}
            <div style={{ display: 'grid', gap: '24px' }}>
              {stations.map(station => {
                const stationUmbrellas = getUmbrellasByStation(station._id);
                const availableCount = getAvailableUmbrellasCount(station._id);
                
                return (
                  <Card key={station._id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                      <div>
                        <h3 style={{ 
                          margin: '0 0 8px',
                          color: '#ffffff',
                          fontSize: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          {station.name}
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
                        </h3>
                        <p style={{ 
                          margin: '0 0 4px',
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
                        <p style={{ 
                          margin: '8px 0 0',
                          color: '#667eea',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          ☔ {availableCount}/{stationUmbrellas.length} umbrellas available
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ 
                          margin: '0 0 8px',
                          color: '#94a3b8',
                          fontSize: '14px'
                        }}>
                          Total Slots: {station.totalSlots}
                        </p>
                        <div style={{
                          height: '8px',
                          width: '200px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          marginBottom: '8px'
                        }}>
                          <div style={{
                            height: '100%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            width: `${(stationUmbrellas.length / station.totalSlots) * 100}%`,
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                        <p style={{ 
                          margin: 0,
                          color: '#94a3b8',
                          fontSize: '12px'
                        }}>
                          Capacity: {stationUmbrellas.length}/{station.totalSlots}
                        </p>
                      </div>
                    </div>

                    {/* Umbrellas Grid */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                      gap: '12px'
                    }}>
                      {stationUmbrellas.map(umbrella => (
                        <Card key={umbrella._id} style={{ 
                          padding: '16px',
                          background: umbrella.status === 'available' 
                            ? 'rgba(34, 197, 94, 0.1)' 
                            : umbrella.status === 'borrowed'
                            ? 'rgba(245, 158, 11, 0.1)'
                            : 'rgba(100, 116, 139, 0.1)',
                          borderColor: umbrella.status === 'available' 
                            ? 'rgba(34, 197, 94, 0.3)' 
                            : umbrella.status === 'borrowed'
                            ? 'rgba(245, 158, 11, 0.3)'
                            : 'rgba(100, 116, 139, 0.3)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div>
                              <h4 style={{ 
                                margin: '0 0 4px',
                                color: '#ffffff',
                                fontSize: '16px',
                                fontWeight: '600'
                              }}>
                                {umbrella.umbrellaId}
                              </h4>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{
                                  padding: '2px 8px',
                                  background: 'rgba(102, 126, 234, 0.2)',
                                  color: '#667eea',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: '600'
                                }}>
                                  {umbrella.color}
                                </span>
                                <span style={{
                                  padding: '2px 8px',
                                  background: 'rgba(139, 92, 246, 0.2)',
                                  color: '#a78bfa',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: '600'
                                }}>
                                  {umbrella.size}
                                </span>
                              </div>
                            </div>
                            <span style={{
                              padding: '2px 8px',
                              background: umbrella.status === 'available' 
                                ? 'rgba(34, 197, 94, 0.3)' 
                                : umbrella.status === 'borrowed'
                                ? 'rgba(245, 158, 11, 0.3)'
                                : 'rgba(100, 116, 139, 0.3)',
                              color: umbrella.status === 'available' 
                                ? '#4ade80' 
                                : umbrella.status === 'borrowed'
                                ? '#fbbf24'
                                : '#94a3b8',
                              borderRadius: '6px',
                              fontSize: '10px',
                              fontWeight: '600'
                            }}>
                              {umbrella.status}
                            </span>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <ActionButton 
                              onClick={() => handleUpdateUmbrella(umbrella._id, { 
                                status: umbrella.status === 'available' ? 'maintenance' : 'available' 
                              })}
                              variant="warning"
                              size="small"
                            >
                              {umbrella.status === 'available' ? '🔧 Maintenance' : '✅ Activate'}
                            </ActionButton>
                            <ActionButton 
                              onClick={() => handleDeleteUmbrella(umbrella._id)}
                              variant="danger"
                              size="small"
                            >
                              🗑️ Delete
                            </ActionButton>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {stationUmbrellas.length === 0 && (
                      <div style={{ 
                        textAlign: 'center', 
                        padding: '40px',
                        color: '#94a3b8'
                      }}>
                        ☔ No umbrellas at this station
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card>
            <h2 style={{ 
              margin: '0 0 20px',
              color: '#ffffff',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              👥 User Management ({users.length})
            </h2>
            {users.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: '#94a3b8'
              }}>
                👥 No users found
              </div>
            ) : (
              <div style={{ 
                display: 'grid', 
                gap: '16px'
              }}>
                {users.map(user => (
                  <Card key={user._id} style={{ padding: '20px' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <div>
                        <h4 style={{ 
                          margin: '0 0 4px',
                          color: '#ffffff',
                          fontSize: '18px'
                        }}>
                          {user.name}
                        </h4>
                        <p style={{ 
                          margin: 0,
                          color: '#94a3b8',
                          fontSize: '14px'
                        }}>
                          {user.email}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          padding: '4px 12px',
                          background: user.role === 'admin' 
                            ? 'rgba(139, 92, 246, 0.2)' 
                            : 'rgba(59, 130, 246, 0.2)',
                          color: user.role === 'admin' ? '#a78bfa' : '#60a5fa',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {user.role}
                        </span>
                        <span style={{
                          padding: '4px 12px',
                          background: user.currentBorrow 
                            ? 'rgba(245, 158, 11, 0.2)' 
                            : 'rgba(34, 197, 94, 0.2)',
                          color: user.currentBorrow ? '#fbbf24' : '#4ade80',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {user.currentBorrow ? 'Borrowing' : 'Available'}
                        </span>
                      </div>
                    </div>
                    
                    {user.currentBorrow && (
                      <ActionButton
                        onClick={() => handleResetUser(user._id)}
                        variant="warning"
                      >
                        🔄 Reset Borrowing Status
                      </ActionButton>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Borrow Records Tab */}
        {activeTab === 'borrows' && (
          <div style={{ display: 'grid', gap: '24px' }}>
            {/* Active Borrows */}
            <Card>
              <h3 style={{ 
                margin: '0 0 20px',
                color: '#ffffff',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🔥 Active Borrows ({activeBorrows.length})
              </h3>
              {activeBorrows.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px',
                  color: '#94a3b8'
                }}>
                  📭 No active borrows
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {activeBorrows.map(record => (
                    <div key={record._id} style={{
                      padding: '16px',
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      borderRadius: '12px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ margin: '0 0 4px', color: '#ffffff', fontWeight: '600' }}>
                            👤 {record.user?.name} ({record.user?.email})
                          </p>
                          <p style={{ margin: '0 0 4px', color: '#fbbf24', fontSize: '14px' }}>
                            ☔ {record.umbrella?.umbrellaId} • 🏪 {record.borrowStation?.name}
                          </p>
                          <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px' }}>
                            ⏰ Borrowed: {new Date(record.borrowTime).toLocaleString()}
                          </p>
                        </div>
                        <span style={{
                          padding: '4px 12px',
                          background: 'rgba(245, 158, 11, 0.3)',
                          color: '#fbbf24',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* All Borrow Records */}
            <Card>
              <h3 style={{ 
                margin: '0 0 20px',
                color: '#ffffff',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📊 All Borrow Records ({borrowRecords.length})
              </h3>
              {borrowRecords.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px',
                  color: '#94a3b8'
                }}>
                  📋 No borrow records found
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
                  {borrowRecords.slice(0, 20).map(record => (
                    <div key={record._id} style={{
                      padding: '12px 16px',
                      background: record.status === 'active' 
                        ? 'rgba(245, 158, 11, 0.1)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid',
                      borderColor: record.status === 'active' 
                        ? 'rgba(245, 158, 11, 0.2)' 
                        : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: '0 0 4px', color: '#ffffff', fontSize: '14px' }}>
                            <strong>{record.user?.name}</strong> borrowed <strong>{record.umbrella?.umbrellaId}</strong> from <strong>{record.borrowStation?.name}</strong>
                          </p>
                          <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px' }}>
                            {new Date(record.borrowTime).toLocaleString()}
                            {record.returnTime && ` → Returned: ${new Date(record.returnTime).toLocaleString()}`}
                            {record.returnStation && ` at ${record.returnStation.name}`}
                          </p>
                        </div>
                        <span style={{
                          padding: '4px 8px',
                          background: record.status === 'active' 
                            ? 'rgba(245, 158, 11, 0.3)' 
                            : 'rgba(34, 197, 94, 0.3)',
                          color: record.status === 'active' ? '#fbbf24' : '#4ade80',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          {record.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
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

export default AdminDashboard;