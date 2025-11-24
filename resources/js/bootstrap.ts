import axios from 'axios';

// Configure axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// For Laravel CSRF token - get it from the meta tag or cookie
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] =
        token.getAttribute('content');
} else {
    // Try to get from cookie (set by Laravel)
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'XSRF-TOKEN') {
            axios.defaults.headers.common['X-XSRF-TOKEN'] =
                decodeURIComponent(value);
            break;
        }
    }
}

export default axios;
