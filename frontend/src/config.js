// backend address: same host the site is opened from, port 8000
// (works on localhost and on an ec2 server without editing anything)
const API_URL = `http://${window.location.hostname}:8000`;

export default API_URL;
