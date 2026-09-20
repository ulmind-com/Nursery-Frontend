const TOKEN_KEY = "plant-nursery-access-token";
export const tokenStore = {
  get: () => typeof window === "undefined" ? null : window.localStorage.getItem(TOKEN_KEY),
  set: (token: string) => { if (typeof window !== "undefined") window.localStorage.setItem(TOKEN_KEY, token); },
  clear: () => { if (typeof window !== "undefined") window.localStorage.removeItem(TOKEN_KEY); },
};
