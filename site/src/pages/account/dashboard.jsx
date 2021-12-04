import * as React from 'react';
import { navigate } from 'gatsby';

const checkLogin = async (setLoginStatus) => {
  const { loggedIn = false } = await fetch('/api/check-auth').then((res) =>
    res.json(),
  );
  setLoginStatus(loggedIn);
};

const logout = async (setLoginStatus) => {
  const { status } = await fetch('/api/logout').then((res) => res.json());

  if (status !== 'ok') {
    throw new Error(status);
  }

  setLoginStatus(false);
};

const DashboardPage = () => {
  const [loginStatus, setLoginStatus] = React.useState(null);

  React.useEffect(() => {
    checkLogin(setLoginStatus);
  }, []);

  if (loginStatus === false) {
    navigate('/account/login', { replace: true });
    return null;
  }

  if (loginStatus === null) {
    return <p>loading...</p>;
  }

  return (
    <>
      <h1>Wow. All the secret stuff</h1>
      <button onClick={() => logout(setLoginStatus)}>Logout</button>
    </>
  );
};

export default DashboardPage;
