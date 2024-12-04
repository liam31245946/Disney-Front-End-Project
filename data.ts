function saveToLocalStorage(key: string, data: Data[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key: string): Data[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}
