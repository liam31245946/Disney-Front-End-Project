'use strict';
function saveToLocalStorage(key, data) {
  if (Array.isArray(data) && data.every((item) => item._id && item.name)) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
function getFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  const parsedData = data ? JSON.parse(data) : [];
  return parsedData;
}
