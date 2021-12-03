import * as React from 'react';
import { graphql, Link } from 'gatsby';

export const query = graphql`
  query AuthorPage($id: String!) {
    author(id: { eq: $id }) {
      name
      books {
        id
        name
        series
        seriesOrder
        sitePath
      }
    }
  }
`;

const sortAndExtendBooks = (books) =>
  books
    .sort((a, b) => a.seriesOrder - b.seriesOrder)
    .map((book) => {
      const series = book.series
        ? `(${book.series}, book ${book.seriesOrder})`
        : '';
      const displayName = `${book.name} ${series}`;

      return {
        ...book,
        displayName,
      };
    });

const AuthorPage = ({ data }) => {
  const author = data.author;
  const books = sortAndExtendBooks(author.books);

  return (
    <div>
      <h1>{author.name}</h1>
      <p>Books by {author.name}</p>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <Link to={book.sitePath}>{book.displayName}</Link>
          </li>
        ))}
      </ul>
      <Link to="/authors">&larr; back to all authors</Link>
    </div>
  );
};

export default AuthorPage;
