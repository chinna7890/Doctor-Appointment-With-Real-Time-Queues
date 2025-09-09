document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const confirmLogout = document.getElementById('confirmLogout');
    const cancelLogout = document.getElementById('cancelLogout');

    // Handle logout confirmation
    confirmLogout.addEventListener('click', function() {
        // Perform logout actions
        logoutUser();
    });

    // Handle cancel logout
    cancelLogout.addEventListener('click', function() {
        // Redirect back to the previous page or home page
        window.history.back();
    });

    // Logout function
    function logoutUser() {
        // 1. Clear client-side storage
        document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        localStorage.removeItem('user_session');
        sessionStorage.clear();

        // 2. Send logout request to server
        fetch('/api/logout', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCSRFToken()
            }
        })
        .then(response => {
            if (response.ok) {
                // 3. Redirect to login page
                window.location.href = '/login';
            } else {
                throw new Error('Logout failed');
            }
        })
        .catch(error => {
            console.error('Logout error:', error);
            window.location.href = '/login';
        });
    }

    // Helper function to get CSRF token
    function getCSRFToken() {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1];
        return cookieValue ? decodeURIComponent(cookieValue) : null;
    }
});