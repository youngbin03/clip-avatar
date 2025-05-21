import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// index.css는 비어있으므로 import하지 않습니다

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
