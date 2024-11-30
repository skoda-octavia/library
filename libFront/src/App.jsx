import React from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css"

const App = () => {
  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <HomePage />
      </div>
    </div>
  );
};

export default App;