import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "react-oidc-context";

const CognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_ZYlluw6aX",
  client_id: "1hbjetddcmf4hp5cmpl5tae8l9",
  redirect_uri:"https://d1vf5juqitmm06.cloudfront.net/",
  response_type: "code",
  scope:"openid email phone profile"
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider {...CognitoAuthConfig}>
      <App />
    </AuthProvider>
    
  </React.StrictMode>
);

reportWebVitals();
