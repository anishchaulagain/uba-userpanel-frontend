
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import AuthContext, { AuthProvider } from '../../context/AuthContext'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders loading spinner initially', () => {
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <div>Is Authenticated: {value?.isAuthenticated.toString()}</div>}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    // Your spinner div has a class "animate-spin"
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('loads user and token from localStorage', async () => {
    const fakeUser = { id: 1, email: 'test@example.com', name: 'Test User' };
    localStorage.setItem('user', JSON.stringify(fakeUser));
    localStorage.setItem('token', 'fake-token');

    let contextValue: any = null;

    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>User: {value?.user?.email || 'no user'}</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(contextValue?.user).toBeTruthy();
      expect(contextValue?.token).toBe('fake-token');
      expect(contextValue.isAuthenticated).toBe(true);
    });

    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
  });

  it('logout clears user, token and roles from state and localStorage', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1 }));
    localStorage.setItem('token', 'token');
    localStorage.setItem('roles', JSON.stringify(['admin']));

    let contextValue: any = null;

    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <button onClick={() => value?.logout()}>Logout</button>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    await waitFor(() => expect(contextValue?.user).not.toBeNull());

    userEvent.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(contextValue?.user).toBeNull();
      expect(contextValue?.token).toBeNull();
      expect(contextValue.isAuthenticated).toBe(false);

      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('roles')).toBeNull();
    });
  });
});
