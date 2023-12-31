import React from 'react';
import { UserContextProvider } from '../context/userContext';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import './globals.css';
config.autoAddCss = false

function MyApp({ Component, pageProps }) {

  return (
    <UserContextProvider>
      <Component {...pageProps} />
    </UserContextProvider>
  );
}

export default MyApp;
