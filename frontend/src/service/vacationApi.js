// src/service/vacationApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/vacations';

export const vacationApi = {
  createVacationRequest: (data) =>
    axios.post('http://localhost:8080/api/vacation-requests', data).then(res => res.data),

  getAllVacationRequests: () =>
    axios.get(API_BASE_URL).then(res => res.data),

  resolveVacationRequest: (id, resolutionData) =>
    axios.post(`${API_BASE_URL}/${id}/resolve`, resolutionData).then(res => res.data)
};