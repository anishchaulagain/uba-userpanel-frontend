import { WelcomeMessage } from "../_components/WelcomeMessage";


export default function HomePage() {
  const isLoggedIn = true;  //static
  const isAdmin = false; //static

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
        <h1>This is the Home Page</h1>
      <WelcomeMessage isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
    </div>
  );
}