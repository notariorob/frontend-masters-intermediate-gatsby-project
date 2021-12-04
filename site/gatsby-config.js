module.exports = {
  siteMetadata: {
    title: 'My Book Club',
    navItems: [
      {
        label: 'Books',
        path: '/books',
      },
      {
        label: 'Authors',
        path: '/authors',
      },
      {
        label: 'Account',
        path: '/account',
      },
    ],
  },
  plugins: [
    'gatsby-plugin-image',
    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        defaults: {
          placeholder: 'tracedSVG',
        },
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-theme-shared-nav',
    'gatsby-plugin-netlify',
  ],
};
