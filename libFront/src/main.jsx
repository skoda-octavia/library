import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/account/Login';
import RegisterPage from './pages/account/Register';
import BookDetails from './pages/book/BookDetails';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditBook from './pages/book/EditBook';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/Books/Details/:id" element={<BookDetails />} />
        <Route path="/Books/Edit/:id" element={<EditBook/>} />
      </Routes>
    </Router>
  </React.StrictMode>
);
