import axios from 'axios';

const api = axios.create({
  baseURL: 'https://3bde-179-125-29-9.ngrok.io',
});

export default api;
