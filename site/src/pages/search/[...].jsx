import * as React from 'react';
import { navigate } from 'gatsby';

import { form, input, button } from '../../styles/search.module.css';

const SearchClientOnly = ({ params }) => {
  const query = decodeURIComponent(params['*']);
  const [currentQuery, setCurrentQuery] = React.useState(query);
  const [result, setResult] = React.useState(null);
  const [status, setStatus] = React.useState('IDLE');

  const handleSearch = (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const query = form.get('search');

    setCurrentQuery(query);
    navigate(`/search/${encodeURIComponent(query)}`);
  };

  const handleSearchReset = () => {
    setCurrentQuery('');
    navigate('/search');
  };

  const bookSearch = async (query) => {
    setStatus('LOADING');
    const res = await fetch(`https://openlibrary.org/search.json?q=${query}`);
    if (!res.ok) {
      throw new Error(`Search failed: ${res.status}`);
    }

    const result = await res.json();
    setResult(result);
    setStatus('IDLE');
  };

  React.useEffect(() => {
    if (currentQuery === '') {
      setResult(null);
      return;
    }

    bookSearch(currentQuery);
  }, [currentQuery]);

  return (
    <>
      <h1>Search for a book</h1>
      <form className={form} onSubmit={handleSearch}>
        <input className={input} type="search" name="search" />
        <button className={button} onClick={handleSearchReset}>
          reset
        </button>
        <button className={button} type="submit">
          search
        </button>
      </form>

      {status === 'LOADING' && <p>Loading results...</p>}

      {status === 'IDLE' && currentQuery !== '' ? (
        <>
          <h2>Search results for "{currentQuery}"</h2>
          <ul>
            {result?.docs.map((doc) => (
              <li key={doc.key}>
                <strong>{doc.title}</strong>{' '}
                {doc.author_name && `by ${doc.author_name?.[0]}`}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </>
  );
};

export default SearchClientOnly;
