// src/component/VacationResolutionPage.jsx
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
      loadVacationRequests();
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
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusBadge = (resolution) => {
    if (!resolution) {
      return <span className="status-badge status-pending">Pending</span>;
    }
    return resolution.decision ?
      <span className="status-badge status-approved">Approved</span> :
      <span className="status-badge status-rejected">Rejected</span>;
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading vacation requests...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
      <div className="page-header">
        <h2>Vacation Requests Resolution</h2>
        <button
          onClick={loadVacationRequests}
          className="btn btn-primary btn-small"
        >
          Refresh
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('✅') ? 'message-success' : 'message-error'}`}>
          {message}
        </div>
      )}

      <div className="requests-grid">
        {vacationRequests.length === 0 ? (
          <div className="empty-state">
            <p>No vacation requests found.</p>
          </div>
        ) : (
          vacationRequests.map(request => (
            <div key={request.id} className="vacation-card">
              <div className="vacation-card-header">
                <div>
                  <h3 className="vacation-card-title">
                    {request.employeeName}
                  </h3>
                  <div className="vacation-card-details">
                    <div>
                      <strong>Dates:</strong> {formatDate(request.firstDay)} - {formatDate(request.lastDay)}
                    </div>
                    <div>
                      <strong>Duration:</strong> {calculateDuration(request.firstDay, request.lastDay)} days
                    </div>
                    <div>
                      <strong>Submitted:</strong> {formatDateTime(request.createdAt)}
                    </div>
                    <div>
                      <strong>Status:</strong> {getStatusBadge(request.resolution)}
                    </div>
                  </div>
                </div>

                {!request.resolution && (
                  <button
                    onClick={() => handleResolveClick(request.id)}
                    className="btn btn-warning btn-small"
                  >
                    Resolve
                  </button>
                )}
              </div>

              {request.note && (
                <div className="employee-note">
                  <strong>Employee Note:</strong>
                  <div className="note-content">
                    {request.note}
                  </div>
                </div>
              )}

              {request.resolution && (
                <div className={`resolution-section ${request.resolution.decision ? 'resolution-approved' : 'resolution-rejected'}`}>
                  <div>
                    <div className="resolution-info">
                      <strong>Resolved by:</strong> {request.resolution.resolverName || 'N/A'}
                    </div>
                    <div className="resolution-info">
                      <strong>Resolution Note:</strong> {request.resolution.note || 'No note provided'}
                    </div>
                    <div className="resolution-status">
                      {request.resolution.decision ? '✅ Approved' : '❌ Rejected'}
                    </div>
                  </div>
                </div>
              )}

              {resolvingId === request.id && (
                <div className="resolution-form">
                  <h4>Resolve Vacation Request</h4>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="decision"
                          checked={resolutionForm.decision}
                          onChange={handleResolutionChange}
                          className="checkbox-input"
                        />
                        <span className={`decision-text ${resolutionForm.decision ? 'decision-approve' : 'decision-reject'}`}>
                          {resolutionForm.decision ? 'Approve' : 'Reject'}
                        </span>
                      </label>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Resolver Name: *
                      </label>
                      <input
                        type="text"
                        name="resolverName"
                        value={resolutionForm.resolverName}
                        onChange={handleResolutionChange}
                        required
                        className="form-input"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Resolution Note (Optional):
                      </label>
                      <textarea
                        name="note"
                        value={resolutionForm.note}
                        onChange={handleResolutionChange}
                        rows="3"
                        className="form-textarea"
                        placeholder="Add any notes about this resolution..."
                      />
                    </div>

                    <div className="form-actions">
                      <button
                        onClick={() => submitResolution(request.id)}
                        disabled={!resolutionForm.resolverName.trim()}
                        className={`btn ${resolutionForm.decision ? 'btn-success' : 'btn-danger'}`}
                      >
                        Submit Resolution
                      </button>
                      <button
                        onClick={cancelResolution}
                        className="btn btn-secondary"
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