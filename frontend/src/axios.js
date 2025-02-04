import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000',  // Your backend URL
  timeout: 10000,  // Optional: set a timeout for requests
});

export default instance;