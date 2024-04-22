import { extractFullUrl, queryString } from "./helper";

const apiClient = (() => {
  const fetchWithInterceptors = (url, options = {}) => {
    const fullUrl = extractFullUrl(url, baseUrl);
    const modifiedOptions = {
      ...options,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...options.headers,
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: options.body && queryString(options.body),
    };

    return fetch(fullUrl, modifiedOptions).then((response) => {
      if (!response.ok) {
        return response.json().then((body) => {
          throw new Error(body.error || "Unknown Error");
        });
      }
      return response.json();
    });
  };

  return {
    get: (url, params = {}) =>
      fetchWithInterceptors(url, { method: "GET" }, params),
    post: (url, body, params = {}) =>
      fetchWithInterceptors(url, { method: "POST", body }, params),
    put: (url, body, params = {}) =>
      fetchWithInterceptors(url, { method: "PUT", body }, params),
    delete: (url, params = {}) =>
      fetchWithInterceptors(url, { method: "DELETE" }, params),
  };
})();

export default apiClient;
