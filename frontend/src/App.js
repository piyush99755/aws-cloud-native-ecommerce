import logo from './logo.svg';
import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Products from '../src/components/products';
import Cart from './components/Cart';
import Orders from './components/Orders';
import Checkout from './components/Checkout';
import './App.css';
import { useAuth } from 'react-oidc-context';


function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "1hbjetddcmf4hp5cmpl5tae8l9";
    const logoutUri = "https://app.piyushkumartadvi.link"; 
    const cognitoDomain = "https://us-east-1zylluw6ax.auth.us-east-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;

  }

  if (auth.isLoading){
    return <div>Loading...</div>;
  }

  if(auth.error){
    return <div>Error: {auth.error.message}</div>;
  }

  if(auth.isAuthenticated && auth.user){
    return(
      <div>
        <h2>Cloud E-Commerce App</h2>
        <pre>Access Token: {auth.user.access_token}</pre>
        

         {/* Signout Options */}
        <button onClick={()=>auth.removeUser()}>Clear Sessions</button>
        <button onClick={signOutRedirect}>Sign out</button>

        {/* Show products only if user is authenticated */}
        <Products />
      </div>
    );
  }
  return (
  <Router>
    <div>
      <h2>Welcome, {auth.user?.profile?.email || "Unknown User"}</h2>
      {/* Auth Buttons */}
        {!auth.isAuthenticated && <button onClick={() => auth.signinRedirect()}>Sign in</button>}
        {auth.isAuthenticated && (
          <>
            <pre>Access Token: {auth.user.access_token}</pre>
            <button onClick={() => auth.removeUser()}>Clear Sessions</button>
            <button onClick={signOutRedirect}>Sign out</button>
          </>
        )}
      <nav>
        <Link to="/products">Products</Link> |{" "}
        <Link to="/cart">Cart</Link> |{" "}
        <Link to="/checkout">Checkout</Link>|{" "}
        <Link to="/orders">Orders</Link>
      </nav>
      <br />
      
     

      <Routes>
        <Route path='/products' element = {<Products />}></Route>
        <Route path='/cart' element = {<Cart />}></Route>
        <Route path='/checkout' element = {<Checkout />}></Route>
        <Route path='/orders' element = {<Orders />}></Route>
        <Route path='*' element={<Products />}></Route>
      </Routes>
    </div>
  </Router>
)

  

 
}




export default App;
