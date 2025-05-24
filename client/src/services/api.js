import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:54542/',
});

export default api;