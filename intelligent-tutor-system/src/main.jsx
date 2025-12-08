// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom"; 
import { GoogleOAuthProvider } from '@react-oauth/google'; 


const GOOGLE_CLIENT_ID = "1048323814275-k3pd1ludt8klskk2eve8ahutd2e5bcm9.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      
      <BrowserRouter>
       
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);