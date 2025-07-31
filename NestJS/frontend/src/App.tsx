import React from 'react';
import AppRouter from './router/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div>
      {<AppRouter />}
      <ToastContainer /> {/* Display toast notifications globally */}
    </div>
  );
};

export default App;
