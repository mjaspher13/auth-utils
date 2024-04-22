export const isEmpty = (value) => {
  return (
    value == null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

export const queryString = (obj, parentKey = "") => {
  const pairs = [];
  const encode = encodeURIComponent;

  Object.entries(obj).forEach(([key, value]) => {
    if (value == null) return;
    const fullKey = parentKey ? `${parentKey}[${encode(key)}]` : encode(key);

    if (typeof value === "object") {
      if (Array.isArray(value)) {
        value.forEach((val, i) => {
          const elementKey =
            Array.isArray(val) || typeof val === "object"
              ? `${fullKey}[${i}]`
              : `${fullKey}[]`;
          pairs.push(...queryString(val, elementKey));
        });
      } else {
        pairs.push(...queryString(value, fullKey));
      }
    } else {
      pairs.push(`${fullKey}=${encode(value)}`);
    }
  });

  return pairs.join("&");
};
