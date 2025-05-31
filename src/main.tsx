import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Amplify } from 'aws-amplify';
import { awsCognitoConfig } from '@agensy/config';
import '@ant-design/v5-patch-for-react-19';

Amplify.configure(awsCognitoConfig);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
