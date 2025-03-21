import React from 'react';
import { createRoot } from 'react-dom/client';
import RootContainer from '../../containers/Root/RootContainer';
import { AsyncStoreProvider } from '../../hooks/useStore';
import '../../styles/tailwind.css'; // Import Tailwind CSS

import './index.css';

const container = document.getElementById('app-container');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <AsyncStoreProvider>
      <RootContainer />
    </AsyncStoreProvider>
  </React.StrictMode>
);
