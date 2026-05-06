const KEY = "campuscart_accounts";

const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
};

const save = (accounts) => localStorage.setItem(KEY, JSON.stringify(accounts));

export const registerAccount = ({ firstName, lastName, email, onecardId, password }) => {
  const accounts = load();
  if (accounts.find(a => a.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("An account with this email already exists.");
  }
  const newAccount = { firstName, lastName, email: email.toLowerCase(), onecardId, password };
  save([...accounts, newAccount]);
  return newAccount;
};

export const loginAccount = (email, password) => {
  const accounts = load();
  const account = accounts.find(
    a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
  );
  if (!account) throw new Error("Incorrect email or password.");
  return account;
};

export const updateAccount = (currentEmail, updates) => {
  const accounts = load();
  const idx = accounts.findIndex(a => a.email.toLowerCase() === currentEmail.toLowerCase());
  if (idx === -1) throw new Error("Account not found.");

  const newEmail = updates.email?.toLowerCase() || currentEmail.toLowerCase();
  const emailTaken = accounts.some((a, i) => i !== idx && a.email.toLowerCase() === newEmail);
  if (emailTaken) throw new Error("That email is already used by another account.");

  const updated = { ...accounts[idx], ...updates, email: newEmail };
  const next = [...accounts];
  next[idx] = updated;
  save(next);
  return updated;
};
