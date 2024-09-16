import { extractFullUrl, queryString } from "./helper";
import { userIdentityStorage } from "./storage";

const apiClient = (() => {
  const fetchWithInterceptors = (url, options = {}) => {
    const fullUrl = extractFullUrl(url, baseUrl);
    const authToken = userIdentityStorage.get("token")?.token;
    const authHeader = authToken
      ? `Bearer ${authToken}`
      : `Basic ${BASIC_AUTH}`;

    const modifiedOptions = {
      ...options,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...options.headers,
        Authorization: authHeader,
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
    /**
     * Allows multiple requests to be made concurrently, similar to axios.all.
     *
     * @param {Array<Promise>} requests - An array of Promises representing the requests.
     * @return {Promise<Array>} - A promise that resolves when all the requests complete.
     */
    all: (requests) => Promise.all(requests),
  };
})();

export default apiClient;
