import { render, screen } from '@testing-library/react';
import { WelcomeMessage, type WelcomeMessageProps } from '../../src/_components/WelcomeMessage';

describe('WelcomeMessage', () => {
  it('renders login message when user is not logged in', () => {
    const props: WelcomeMessageProps = {
      isLoggedIn: false,
    };

    render(<WelcomeMessage {...props} />);

    const loginMessage = screen.getByText('Please log in to continue.');
    expect(loginMessage).toBeInTheDocument();
    expect(loginMessage).toHaveClass('text-xl', 'text-red-500');
  });

  it('renders regular welcome message when user is logged in but not admin', () => {
    const props: WelcomeMessageProps = {
      isLoggedIn: true,
      isAdmin: false,
    };

    render(<WelcomeMessage {...props} />);

    const welcomeMessage = screen.getByText('Welcome to User Management!');
    expect(welcomeMessage).toBeInTheDocument();
    expect(welcomeMessage).toHaveClass('text-2xl', 'font-bold', 'text-blue-600');
  });

  it('renders regular welcome message when user is logged in and isAdmin is undefined', () => {
    const props: WelcomeMessageProps = {
      isLoggedIn: true,
    };

    render(<WelcomeMessage {...props} />);

    const welcomeMessage = screen.getByText('Welcome to User Management!');
    expect(welcomeMessage).toBeInTheDocument();
    expect(welcomeMessage).toHaveClass('text-2xl', 'font-bold', 'text-blue-600');
  });

  it('renders admin welcome message when user is logged in and is admin', () => {
    const props: WelcomeMessageProps = {
      isLoggedIn: true,
      isAdmin: true,
    };

    render(<WelcomeMessage {...props} />);

    const adminMessage = screen.getByText('Welcome Admin!');
    expect(adminMessage).toBeInTheDocument();
    expect(adminMessage).toHaveClass('text-2xl', 'font-bold', 'text-blue-600');
  });

  it('does not render admin message when user is not logged in even if isAdmin is true', () => {
    const props: WelcomeMessageProps = {
      isLoggedIn: false,
      isAdmin: true,
    };

    render(<WelcomeMessage {...props} />);

    const loginMessage = screen.getByText('Please log in to continue.');
    expect(loginMessage).toBeInTheDocument();

    const adminMessage = screen.queryByText('Welcome Admin!');
    expect(adminMessage).not.toBeInTheDocument();

    const userMessage = screen.queryByText('Welcome to User Management!');
    expect(userMessage).not.toBeInTheDocument();
  });
});