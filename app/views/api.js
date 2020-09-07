const axios = require('axios');

const baseURL = '/api';
const api = axios.create({
    baseURL,
    headers: {
        "Content-type": "application/json"
    }
});

api.interceptors.request.use(request => {
    console.log('Request:', request);
    return request;
})

api.interceptors.response.use(response => {
    console.log('Response:', response);
    return response;
})

module.exports = api;
