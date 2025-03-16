import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from "@react-oauth/google";
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider } from 'react-router-dom';
import { routers } from './router/router';


const clientId = process.env.REACT_APP_GG_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
   <GoogleOAuthProvider clientId={clientId}>
      <RouterProvider router={routers} />
   </GoogleOAuthProvider>
);