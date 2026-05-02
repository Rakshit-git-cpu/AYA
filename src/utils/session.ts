const SESSION_KEYS = {
  userId: 'aya_user_id',
  mobile: 'aya_user_mobile',
  name: 'aya_user_name',
  age: 'aya_user_age',
};

const safeSet = (key: string, value: string) => {
  try { localStorage.setItem(key, value); } catch {}
  try { sessionStorage.setItem(key, value); } catch {}
};

const safeGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  } catch { return null; }
};

const safeRemove = (key: string) => {
  try { localStorage.removeItem(key); } catch {}
  try { sessionStorage.removeItem(key); } catch {}
};

export const saveSession = (user: any) => {
  safeSet(SESSION_KEYS.userId, user.id);
  safeSet(SESSION_KEYS.mobile, user.mobile);
  safeSet(SESSION_KEYS.name, user.name);
  safeSet(SESSION_KEYS.age, String(user.age));
};

export const getSession = () => ({
  userId: safeGet(SESSION_KEYS.userId),
  mobile: safeGet(SESSION_KEYS.mobile),
  name: safeGet(SESSION_KEYS.name),
  age: safeGet(SESSION_KEYS.age),
});

export const clearSession = () => {
  Object.values(SESSION_KEYS).forEach(safeRemove);
  try { localStorage.removeItem('aya-user-store'); } catch {}
};
