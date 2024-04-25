import { queryString } from "./helper";
import { userIdentityStorage } from "./storage";

/**
 * Creates an API client with methods to perform HTTP requests with authentication and additional processing.
 * This client uses interceptors to modify all outgoing requests, adding authorization headers and converting
 * body objects to query strings for form submissions.
 */
const apiClient = (() => {
  /**
   * Intercepts and modifies HTTP requests to include necessary headers and process body content.
   *
   * @param {string} url - The endpoint URL to which the request is sent.
   * @param {Object} options - Configuration options for the fetch request, including headers and body.
   * @return {Promise<Response>} - A promise that resolves with the response of the fetch request.
   */
  const fetchWithInterceptors = (url, options = {}) => {
    const fullUrl = extractFullUrl(url, baseUrl);
    const modifiedOptions = {
      ...options,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...options.headers,
        // Retrieves the user's token from storage, falling back to basic auth if no token is available.
        Authorization:
          `Bearer ${userIdentityStorage.get("token")?.token}` ??
          `Basic ${BASIC_AUTH}`,
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

  // Public API methods for get, post, put, and delete operations using the fetch interceptor.
  return {
    get: (url, options = {}) =>
      fetchWithInterceptors(url, { ...options, method: "GET" }),
    post: (url, body, options = {}) =>
      fetchWithInterceptors(url, { ...options, method: "POST", body }),
    put: (url, body, options = {}) =>
      fetchWithInterceptors(url, { ...options, method: "PUT", body }),
    delete: (url, options = {}) =>
      fetchWithInterceptors(url, { ...options, method: "DELETE" }),
  };
})();

export default apiClient;
