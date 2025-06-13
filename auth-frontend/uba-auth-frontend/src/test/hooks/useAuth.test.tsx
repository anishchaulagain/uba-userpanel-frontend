import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { describe, it, expect } from 'vitest';

import { useAuth } from '../../hooks/useAuth';
import AuthContext, { AuthProvider } from '../../context/AuthContext';

describe('useAuth hook', () => {
  it('throws error if used outside AuthProvider', () => {
    // Render hook without provider, expect to throw
    const { result } = renderHook(() => useAuth());
    expect(result.error).toEqual(
      new Error('useAuth must be used within an AuthProvider')
    );
  });

  it('returns context value when used inside AuthProvider', () => {
    // Render hook with provider
    const wrapper: React.FC = ({ children }) => <AuthProvider>{children}</AuthProvider>;

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Context default value: user and token null initially
    expect(result.current).toHaveProperty('user', null);
    expect(result.current).toHaveProperty('token', null);
    expect(result.current).toHaveProperty('isAuthenticated', false);
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });
});
