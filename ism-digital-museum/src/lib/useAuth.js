import { createContext, useContext } from 'react';

export const AuthCtx = createContext({ user: null, profile: null, isAdmin: false, loading: true });
export const useAuth = () => useContext(AuthCtx);
