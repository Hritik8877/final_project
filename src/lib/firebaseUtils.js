/**
 * Sanitizes Firestore data by converting non-serializable objects (like Timestamps)
 * into serializable ones (like ISO strings or milliseconds).
 */
export const sanitizeFirestoreData = (data) => {
  if (!data || typeof data !== "object") return data;

  const sanitized = Array.isArray(data) ? [] : {};

  for (const key in data) {
    const value = data[key];

    // Check if it's a Firestore Timestamp (has toDate method)
    if (value && typeof value === "object" && typeof value.toDate === "function") {
      sanitized[key] = value.toDate().toISOString();
    } 
    // Check if it's a Date object
    else if (value instanceof Date) {
      sanitized[key] = value.toISOString();
    }
    // Recursive call for nested objects/arrays
    else if (value && typeof value === "object") {
      sanitized[key] = sanitizeFirestoreData(value);
    } 
    else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};
