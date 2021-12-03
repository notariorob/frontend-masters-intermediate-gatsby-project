import * as React from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';

import { container, sharedNav, link, active } from '../styles/nav.module.css';

const Nav = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          navItems {
            label
            path
          }
        }
      }
    }
  `);

  const navItems = data.site.siteMetadata.navItems;

  return (
    <header className={container}>
      <Link to="/" className={link}>
        {data.site.siteMetadata.title}
      </Link>
      <nav className={sharedNav}>
        {navItems.map((item) => (
          <Link
            key={`nav-${item.path}`}
            to={item.path}
            className={link}
            activeClassName={active}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Nav;
