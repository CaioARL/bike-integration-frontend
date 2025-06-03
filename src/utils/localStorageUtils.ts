export const get = (name: string): string | null => {
  return localStorage.getItem(name);
};

export const set = (name: string, value: string): void => {
  localStorage.setItem(name, value);
};

export const remove = (name: string): void => {
  localStorage.removeItem(name);
};

export const clearExcept = (except: string[]): void => {
  const keysToRemove = Object.keys(localStorage).filter((key) => !except.includes(key));
  keysToRemove.forEach((key) => localStorage.removeItem(key));
};
