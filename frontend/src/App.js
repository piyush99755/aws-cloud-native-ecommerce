import logo from './logo.svg';
import './App.css';
import { useAuth } from 'react-oidc-context';
import Products from '../src/components/products';

function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "1hbjetddcmf4hp5cmpl5tae8l9";
    const logoutUri = "http://localhost:3000/"; 
    const cognitoDomain = "https://us-east-1zylluw6ax.auth.us-east-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;

  }

  if (auth.isLoading){
    return <div>Loading...</div>;
  }

  if(auth.error){
    return <div>Error: {auth.error.message}</div>;
  }

  if(auth.isAuthenticated){
    return(
      <div>
        <h2>Welcome, {auth.user.profile.email}</h2>
        <pre>Access Token: {auth.user.access_token}</pre>

        {/* Signout Options*/ }
        <button onClick={() => auth.removeUser()}>Clear Sessions</button>
        <button onClick={signOutRedirect}>Sign out</button>

        {/* Show products only if user is authenticated */}
          <Products />
      </div>
    );
  }
  return (
    <div>
      <button onClick={()=> auth.signinRedirect()}>Sign in</button>
    </div>
  );
}

export default App;
