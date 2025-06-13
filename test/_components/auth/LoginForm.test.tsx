import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../../../src/_components/auth/LoginForm';
import { BrowserRouter } from 'react-router-dom';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = () =>
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

  test('renders email and password inputs and submit button', () => {
    setup();

    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('updates email and password inputs on change', () => {
    setup();

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('secret123');
  });

  test('shows static error message after submitting the form', async () => {
    setup();

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();

    await waitFor(() =>
      expect(screen.getByText(/this is a static form. no real login will happen./i)).toBeInTheDocument()
    );

    expect(submitButton).not.toBeDisabled();
  });

  test('navigates to /register when clicking sign up link', () => {
    setup();

    const signUpLink = screen.getByText(/sign up here/i);
    expect(signUpLink).toBeInTheDocument();

    fireEvent.click(signUpLink);

    expect(mockedUsedNavigate).toHaveBeenCalledWith('/register');
  });
});
