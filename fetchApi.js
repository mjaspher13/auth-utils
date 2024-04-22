const apiClient = (() => {
    const fetchWithInterceptors = (url, options = {}) => {
        const modifiedOptions = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: options.body && JSON.stringify(options.body)
        };

        return fetch(url, modifiedOptions)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(body => {
                        throw new Error(body.error || 'Unknown Error');
                    });
                }
                return response.json();
            });
    };

    return {
        get: (url, options = {}) => fetchWithInterceptors(url, { ...options, method: 'GET' }),
        post: (url, body, options = {}) => fetchWithInterceptors(url, { ...options, method: 'POST', body }),
        put: (url, body, options = {}) => fetchWithInterceptors(url, { ...options, method: 'PUT', body }),
        delete: (url, options = {}) => fetchWithInterceptors(url, { ...options, method: 'DELETE' })
    };
})();

export default apiClient;
