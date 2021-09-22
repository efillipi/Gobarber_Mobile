import axios from 'axios';

const api = axios.create({
  baseURL: 'https://4762-179-125-28-243.ngrok.io',
});

export default api;
