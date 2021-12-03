import * as React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';

const BooksPage = () => {
  const data = useStaticQuery(graphql`
    query getAllBooks {
      allBook {
        nodes {
          name
          sitePath
          author {
            slug
            name
          }
        }
      }
    }
  `);

  const books = data.allBook.nodes;

  return (
    <>
      <h1>Books</h1>
      <ul>
        {books.map((book) => (
          <li key={book.slug}>
            <Link to={book.sitePath}>{book.name}</Link>, by{' '}
            <Link to={`/${book.author.slug}`}>{book.author.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default BooksPage;
