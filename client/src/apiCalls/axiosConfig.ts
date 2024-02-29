import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://real-estate-marketplace-mern-production.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default instance;
