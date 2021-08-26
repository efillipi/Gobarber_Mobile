import axios from 'axios';

const api = axios.create({
  baseURL: 'http://4a81-191-8-188-155.ngrok.io',
});

export default api;
