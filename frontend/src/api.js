import axios from 'axios';

// Create a configured axios instance
const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Point to your Spring Boot API
    withCredentials: true // IMPORTANT: Sends the Session Cookie (Login status) with every request
});

export default api;