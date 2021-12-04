const fetch = require('node-fetch');
const { createRemoteFileNode } = require('gatsby-source-filesystem');

const authors = require('./src/data/authors.json');
const books = require('./src/data/books.json');
const { default: slugify } = require('slugify');

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`
  type Book implements Node {
    author: Author! @link(from: "author", by: "slug")
  }
  type Author implements Node {
    books: [Book!]! @link(from: "slug", by: "author.slug")
  }
`);
};

exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions;

  authors.forEach((author) => {
    createNode({
      ...author,
      id: createNodeId(`author-${author.slug}`),
      parent: null,
      children: [],
      internal: {
        type: 'Author',
        content: JSON.stringify(author),
        contentDigest: createContentDigest(author),
      },
    });
  });

  books.forEach((book) => {
    createNode({
      ...book,
      id: createNodeId(`book-${book.isbn}`),
      parent: null,
      children: [],
      internal: {
        type: 'Book',
        content: JSON.stringify(book),
        contentDigest: createContentDigest(book),
      },
    });
  });
};

exports.createPages = ({ actions }) => {
  const { createPage } = actions;

  createPage({
    path: '/custom',
    component: require.resolve('./src/templates/custom.js'),
    context: {
      title: 'A Custom Page!',
      meta: {
        description: 'A custom page with context',
      },
    },
  });
};

exports.createResolvers = ({
  actions,
  cache,
  createNodeId,
  createResolvers,
  store,
  reporter,
}) => {
  const { createNode } = actions;
  const resolvers = {
    Book: {
      buyLink: {
        type: 'String',
        resolve: ({ isbn }) =>
          `https://www.powells.com/searchresults?keyword=${isbn}`,
      },
      sitePath: {
        type: 'String',
        resolve: ({ series, name }) => {
          const slug = slugify(name, { lower: true });

          let path;
          if (series !== null) {
            const seriesSlug = slugify(series, { lower: true });
            path = `/book/${seriesSlug}/${slug}`;
          } else {
            path = `/book/${slug}`;
          }

          return path;
        },
      },
      cover: {
        type: 'File',
        resolve: async ({ isbn, name }) => {
          const response = await fetch(
            `https://openlibrary.org/isbn/${isbn}.json`,
          );

          if (!response.ok) {
            reporter.warn(
              `Error loading details about ${name} - got ${response.status}: ${response.statusText}`,
            );
            return null;
          }

          const { covers } = await response.json();
          if (covers.length) {
            return createRemoteFileNode({
              url: `https://covers.openlibrary.org/b/id/${covers[0]}-L.jpg`,
              store,
              cache,
              createNode,
              createNodeId,
              reporter,
            });
          } else {
            return null;
          }
        },
      },
    },
  };

  createResolvers(resolvers);
};
