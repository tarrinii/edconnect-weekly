const axios = require('axios');

const SERVER_PORT = process.env.SERVER_PORT;
const api = axios.create({
    baseURL: `http://localhost:${SERVER_PORT}/api`,
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
