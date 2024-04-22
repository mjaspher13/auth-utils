import { queryString } from "./helper";
import { userIdentityStorage } from "./storage";

const apiClient = (() => {
  const fetchWithInterceptors = (url, options = {}) => {
    const fullUrl = extractFullUrl(url, baseUrl);
    const modifiedOptions = {
      ...options,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...options.headers,
        Authorization: `Bearer ${userIdentityStorage.get("token")?.token}` ?? `Basic ${BASIC_AUTH}`,
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
