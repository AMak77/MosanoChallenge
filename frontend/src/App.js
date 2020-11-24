import React, { useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import AuthContext from './context/auth-context';

import NavBar from './navbar/Navbar';
import AuthPage from './pages/Auth';
import EntriesPage from './pages/Entries';


import './App.css';

const App = () => {

  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
  }

  const logout = () => {
    setToken(null);
    setUserId(null);
  }

  return (
    <BrowserRouter>
      <>
        <AuthContext.Provider
          value={{
            token: token,
            userId: userId,
            login: login,
            logout: logout
          }}
        >
          <NavBar />
          <main className="main-content">
            <Switch>
              {!token && <Redirect from="/" to="/auth" exact />}
              {token && <Redirect from="/" to="/entries" exact />}
              {token && <Redirect from="/auth" to="/entries" exact />}
              {!token && 
                <Route path="/auth" component={AuthPage} />
              }
              <Route
                path='/entries'
                render={(props) => (
                  <EntriesPage {...props} isAuthed={token} />
                )}
              />
            </Switch>
          </main>
        </AuthContext.Provider>
      </>
    </BrowserRouter>
  );
}

export default App;
