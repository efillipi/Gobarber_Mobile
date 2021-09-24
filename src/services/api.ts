import axios from 'axios';

const api = axios.create({
  baseURL: 'https://7530-191-8-188-155.ngrok.io',
});

export default api;
