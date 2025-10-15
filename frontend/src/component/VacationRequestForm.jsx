import React, { useState } from 'react';
import { vacationApi } from '../service/vacationApi';
import { useVacationValidation } from '../hooks/useVacationValidation';

function VacationRequestForm() {
  const [formData, setFormData] = useState({
    employeeName: '',
    firstDay: '',
    lastDay: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [duration, setDuration] = useState(0);

  const { validateVacation } = useVacationValidation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const validateForm = () => {
    // Basic required field validation
    if (!formData.employeeName.trim()) {
      setValidationErrors(['Employee name is required']);
      return false;
    }

    if (!formData.firstDay || !formData.lastDay) {
      setValidationErrors(['Both start date and end date are required']);
      return false;
    }

    // Use the validation hook
    const validationResult = validateVacation(formData.firstDay, formData.lastDay);

    if (!validationResult.isValid) {
      setValidationErrors(validationResult.errors);
      return false;
    }

    setDuration(validationResult.duration);
    setValidationErrors([]);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setValidationErrors([]);

    // Validate before submitting
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const savedRequest = await vacationApi.createVacationRequest(formData);
      setMessage(`✅ Vacation request created successfully! ID: ${savedRequest.id}`);

      // Reset form
      setFormData({
        employeeName: '',
        firstDay: '',
        lastDay: '',
        note: ''
      });
      setDuration(0);
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Real-time validation when both dates are filled
  React.useEffect(() => {
    if (formData.firstDay && formData.lastDay) {
      const validationResult = validateVacation(formData.firstDay, formData.lastDay);
      if (!validationResult.isValid) {
        setValidationErrors(validationResult.errors);
      } else {
        setValidationErrors([]);
        setDuration(validationResult.duration);
      }
    }
  }, [formData.firstDay, formData.lastDay, validateVacation]);

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Submit Vacation Request</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Employee Name:
          </label>
          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: `1px solid ${validationErrors.some(err => err.includes('name')) ? '#f44336' : '#ccc'}`,
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            First Day:
          </label>
          <input
            type="date"
            name="firstDay"
            value={formData.firstDay}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: `1px solid ${validationErrors.some(err => err.includes('Start date')) ? '#f44336' : '#ccc'}`,
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Last Day:
          </label>
          <input
            type="date"
            name="lastDay"
            value={formData.lastDay}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: `1px solid ${validationErrors.some(err => err.includes('End date') || err.includes('Vacation cannot')) ? '#f44336' : '#ccc'}`,
              borderRadius: '4px'
            }}
          />
        </div>

        {/* Duration Display */}
        {duration > 0 && (
          <div style={{
            marginBottom: '15px',
            padding: '8px',
            backgroundColor: '#e3f2fd',
            border: '1px solid #2196f3',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            <strong>Duration: {duration} day(s)</strong>
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Note (Optional):
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows="3"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div style={{
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: '#f7e0e0',
            border: '1px solid #f44336',
            borderRadius: '4px'
          }}>
            <strong>Please fix the following errors:</strong>
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || validationErrors.length > 0}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: (loading || validationErrors.length > 0) ? '#ccc' : '#2c5aa0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (loading || validationErrors.length > 0) ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Submitting...' : 'Submit Vacation Request'}
        </button>
      </form>

      {message && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: message.includes('✅') ? '#e0f7e0' : '#f7e0e0',
          border: `1px solid ${message.includes('✅') ? '#4caf50' : '#f44336'}`,
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default VacationRequestForm;