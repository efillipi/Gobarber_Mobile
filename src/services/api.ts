import axios from 'axios';

const api = axios.create({
  baseURL: 'https://f2e4-191-8-188-155.ngrok.io',
});

export default api;
