import axios from 'axios';

const api = axios.create({
  baseURL: 'https://93a8-2804-431-cfc8-b6a7-45b6-69e3-c6-ebfa.ngrok.io',
});

export default api;
