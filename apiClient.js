const apiClient = (() => {
    const fetchWithInterceptors = (url, options = {}) => {
        const modifiedOptions = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            },
        };

        return fetch(url, modifiedOptions)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        return refreshToken().then(newToken => {
                            localStorage.setItem('authToken', newToken);
                            return fetchWithInterceptors(url, options);
                        });
                    }
                    return response.json().then(body => {
                        throw new Error(body.error);
                    });
                }
                return response.json();
            });
    };

    const refreshToken = () => {
        return fetch('https://api.example.com/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('refreshToken')}`
            },
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to refresh token');
            return response.json();
        })
        .then(data => data.newToken);
    };

    return {
        request: fetchWithInterceptors,
        refresh: refreshToken
    };
})();

export default apiClient;
