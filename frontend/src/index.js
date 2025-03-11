import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider } from 'react-router-dom';
import { routers } from './router/router';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <RouterProvider router={routers} />
);