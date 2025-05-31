export const get = (name: string): string | null => {
  return sessionStorage.getItem(name);
};

export const set = (name: string, value: string, saveCookieToo: boolean = false): void => {
  if (saveCookieToo) {
    document.cookie = `${name}=${encodeURIComponent(value)};path=/`;
  }
  sessionStorage.setItem(name, value);
};

export const remove = (name: string): void => {
  sessionStorage.removeItem(name);
};

export const clearExcept = (except: string[]): void => {
  const keysToRemove = Object.keys(sessionStorage).filter((key) => !except.includes(key));
  keysToRemove.forEach((key) => sessionStorage.removeItem(key));
};
