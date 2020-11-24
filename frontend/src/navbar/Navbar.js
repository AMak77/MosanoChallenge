import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

import AuthContext from '../context/auth-context';

const NavBar = props => (
    <AuthContext.Consumer>
        {context => {
            return (
                <header className="main-navbar">
                    <div className="main-navbar__logo">
                        <h1>Mosano Challenge</h1>
                    </div>
                    <nav className="main-navbar__items">
                        <ul>
                            {!context.token && (
                                <li>
                                    <NavLink to="/auth">Authenticate</NavLink>
                                </li>
                            )}
                            <li>
                                <NavLink to="/entries">Entries</NavLink>
                            </li>
                            {context.token && (
                                <>
                                    <li>
                                        <button onClick={context.logout}>Logout</button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                </header>
            )
        }}
    </AuthContext.Consumer>
)

export default NavBar;