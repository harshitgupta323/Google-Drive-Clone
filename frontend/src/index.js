import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import { AuthProvider } from './context/AuthProvider';
import './index.css';
import App from './App';

ReactDOM.render(
  <>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<App/>}/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </>, document.getElementById('root'));

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>
// );
