
export type WelcomeMessageProps = {
    isLoggedIn: boolean;
    isAdmin?: boolean;
  };
  
export const WelcomeMessage = ({ isLoggedIn, isAdmin }: WelcomeMessageProps) => {
    if (!isLoggedIn) {
      return <div className="text-xl text-red-500">Please log in to continue.</div>;
    }
  
    return (
      <div className="text-2xl font-bold text-blue-600">
        {isAdmin ? "Welcome Admin!" : "Welcome to User Management!"}
      </div>
    );
  };
  