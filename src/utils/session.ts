// Session persistence utility — dual localStorage/sessionStorage fallback (Safari Private Mode safe)

const KEYS = {
  userId: 'aya_user_id',
  mobile: 'aya_user_mobile',
  name: 'aya_user_name',
  age: 'aya_user_age',
  quizDone: 'aya_quiz_done',
};

const safeSet = (key: string, value: string) => {
  try { localStorage.setItem(key, value); } catch {}
  try { sessionStorage.setItem(key, value); } catch {}
};

const safeGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  } catch {
    try { return sessionStorage.getItem(key); } catch { return null; }
  }
};

const safeRemove = (key: string) => {
  try { localStorage.removeItem(key); } catch {}
  try { sessionStorage.removeItem(key); } catch {}
};

export const saveSession = (user: { id: string; mobile: string; name: string; age: number }) => {
  safeSet(KEYS.userId, user.id);
  safeSet(KEYS.mobile, user.mobile);
  safeSet(KEYS.name, user.name);
  safeSet(KEYS.age, String(user.age));
  console.log('[Session] Saved:', user.id);
};

export const getSession = () => ({
  userId: safeGet(KEYS.userId),
  mobile: safeGet(KEYS.mobile),
  name: safeGet(KEYS.name),
  age: Number(safeGet(KEYS.age) || 0),
});

export const clearSession = () => {
  Object.values(KEYS).forEach(safeRemove);
  console.log('[Session] Cleared.');
};

export const markQuizDone = () => {
  safeSet(KEYS.quizDone, 'true');
};

export const isQuizDone = (): boolean => safeGet(KEYS.quizDone) === 'true';
