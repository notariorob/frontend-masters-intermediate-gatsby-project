import * as React from 'react';

import '../styles/variables.css';
import '../styles/global.css';
import { content, footer } from '../styles/layout.module.css';
import Nav from './nav';

const Layout = ({ children }) => (
  <>
    <Nav />
    <main className={content}>{children}</main>
    <footer className={footer}>Biult with the shared nav gatsby theme</footer>
  </>
);

export default Layout;
