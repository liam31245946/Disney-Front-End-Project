function saveToLocalStorage(key: string, data: Data[]): void {
  if (Array.isArray(data) && data.every((item) => item._id && item.name)) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

function getFromLocalStorage(key: string): Data[] {
  const data = localStorage.getItem(key);
  const parsedData = data ? JSON.parse(data) : [];
  return parsedData;
}
