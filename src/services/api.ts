import axios from 'axios';

const api = axios.create({
  baseURL: 'https://e8e1-179-125-28-243.ngrok.io',
});

export default api;
