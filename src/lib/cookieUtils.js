/**
 * Helper functions to manage cookies without external dependencies
 */

export const setCookie = (name, value, days = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (JSON.stringify(value) || "") + expires + "; path=/";
};

export const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      const value = c.substring(nameEQ.length, c.length);
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
  }
  return null;
};

export const eraseCookie = (name) => {
  document.cookie = name + '=; Max-Age=-99999999; path=/';
};
