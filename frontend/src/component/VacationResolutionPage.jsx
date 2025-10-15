// src/components/VacationResolutionPage.js
import React, { useState, useEffect } from 'react';
import { vacationApi } from '../service/vacationApi';

function VacationResolutionPage() {
  const [vacationRequests, setVacationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [resolvingId, setResolvingId] = useState(null);
  const [resolutionForm, setResolutionForm] = useState({
    decision: true,
    resolverName: '',
    note: ''
  });

  useEffect(() => {
    loadVacationRequests();
  }, []);

  const loadVacationRequests = async () => {
    try {
      setLoading(true);
      const requests = await vacationApi.getAllVacationRequests();
      setVacationRequests(requests);
    } catch (error) {
      setMessage(`❌ Error loading vacation requests: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveClick = (requestId) => {
    setResolvingId(requestId);
    setResolutionForm({
      decision: true,
      resolverName: '',
      note: ''
    });
  };

  const handleResolutionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setResolutionForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const submitResolution = async (requestId) => {
    if (!resolutionForm.resolverName.trim()) {
      setMessage('❌ Resolver name is required');
      return;
    }

    try {
      await vacationApi.resolveVacationRequest(requestId, resolutionForm);
      setMessage('✅ Vacation request resolved successfully!');
      setResolvingId(null);
      loadVacationRequests(); // Refresh the list
    } catch (error) {
      setMessage(`❌ Error resolving request: ${error.response?.data?.message || error.message}`);
    }
  };

  const cancelResolution = () => {
    setResolvingId(null);
    setResolutionForm({
      decision: true,
      resolverName: '',
      note: ''
    });
  };

  const calculateDuration = (firstDay, lastDay) => {
    const start = new Date(firstDay);
    const end = new Date(lastDay);
    const diffTime = end - start;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (resolution) => {
    if (!resolution) {
      return <span style={{ padding: '4px 8px', backgroundColor: '#ff9800', color: 'white', borderRadius: '12px', fontSize: '12px' }}>Pending</span>;
    }
    return resolution.decision ?
      <span style={{ padding: '4px 8px', backgroundColor: '#4caf50', color: 'white', borderRadius: '12px', fontSize: '12px' }}>Approved</span> :
      <span style={{ padding: '4px 8px', backgroundColor: '#f44336', color: 'white', borderRadius: '12px', fontSize: '12px' }}>Rejected</span>;
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px', textAlign: 'center' }}>
        <h2>Loading vacation requests...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Vacation Requests Resolution</h2>
        <button
          onClick={loadVacationRequests}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh
        </button>
      </div>

      {message && (
        <div style={{
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: message.includes('✅') ? '#e0f7e0' : '#f7e0e0',
          border: `1px solid ${message.includes('✅') ? '#4caf50' : '#f44336'}`,
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gap: '20px' }}>
        {vacationRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <p>No vacation requests found.</p>
          </div>
        ) : (
          vacationRequests.map(request => (
            <div
              key={request.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#fff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                    {request.employeeName}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '10px 20px', fontSize: '14px', color: '#666' }}>
                    <div>
                      <strong>Dates:</strong> {formatDate(request.firstDay)} - {formatDate(request.lastDay)}
                    </div>
                    <div>
                      <strong>Duration:</strong> {calculateDuration(request.firstDay, request.lastDay)} days
                    </div>
                    <div>
                      <strong>Submitted:</strong> {new Date(request.createdAt).toLocaleString()}
                    </div>
                    <div>
                      <strong>Status:</strong> {getStatusBadge(request.resolution)}
                    </div>
                  </div>
                </div>

                {!request.resolution && (
                  <button
                    onClick={() => handleResolveClick(request.id)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#ff9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Resolve
                  </button>
                )}
              </div>

              {request.note && (
                <div style={{ marginBottom: '15px' }}>
                  <strong>Employee Note:</strong>
                  <div style={{
                    padding: '10px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    marginTop: '5px',
                    borderLeft: '3px solid #2196f3'
                  }}>
                    {request.note}
                  </div>
                </div>
              )}

              {request.resolution && (
                <div style={{
                  padding: '15px',
                  backgroundColor: request.resolution.decision ? '#e8f5e8' : '#ffe8e8',
                  borderRadius: '4px',
                  borderLeft: `3px solid ${request.resolution.decision ? '#4caf50' : '#f44336'}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>Resolved by:</strong> {request.resolution.resolverName}
                      <br />
                      <strong>Resolution Note:</strong> {request.resolution.note || 'No note provided'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {new Date(request.resolution.resolvedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Resolution Form */}
              {resolvingId === request.id && (
                <div style={{
                  marginTop: '20px',
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}>
                  <h4 style={{ marginTop: 0, marginBottom: '15px' }}>Resolve Vacation Request</h4>

                  <div style={{ display: 'grid', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <input
                          type="checkbox"
                          name="decision"
                          checked={resolutionForm.decision}
                          onChange={handleResolutionChange}
                          style={{ width: 'auto' }}
                        />
                        <span style={{ fontWeight: 'bold', color: resolutionForm.decision ? '#4caf50' : '#f44336' }}>
                          {resolutionForm.decision ? 'Approve' : 'Reject'}
                        </span>
                      </label>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Resolver Name: *
                      </label>
                      <input
                        type="text"
                        name="resolverName"
                        value={resolutionForm.resolverName}
                        onChange={handleResolutionChange}
                        required
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ccc',
                          borderRadius: '4px'
                        }}
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Resolution Note (Optional):
                      </label>
                      <textarea
                        name="note"
                        value={resolutionForm.note}
                        onChange={handleResolutionChange}
                        rows="3"
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ccc',
                          borderRadius: '4px'
                        }}
                        placeholder="Add any notes about this resolution..."
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => submitResolution(request.id)}
                        disabled={!resolutionForm.resolverName.trim()}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: resolutionForm.decision ? '#4caf50' : '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: resolutionForm.resolverName.trim() ? 'pointer' : 'not-allowed'
                        }}
                      >
                        Submit Resolution
                      </button>
                      <button
                        onClick={cancelResolution}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default VacationResolutionPage;