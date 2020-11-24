import React, { useRef, useState, useContext, useEffect } from 'react';
import AuthContext from '../context/auth-context';
import './Auth.css';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const contextType = useContext(AuthContext);

    const emailEl = useRef();
    const passwordEl = useRef();

    const switchModeHandler = () => {
        setIsLogin(!isLogin);
    }

    const submitHandler = (event) => {
        event.preventDefault();
        const email = emailEl.current.value;
        const password = passwordEl.current.value;

        if(email.trim().length === 0 || password.trim().length === 0){
            return;
        }

        let requestBody = {
            query:`
                query {
                    login(email: "${email}", password:"${password}") {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `
        }

        if (!isLogin) {
            requestBody = {
                query: `
                    mutation {
                        newUser(userInput: {email: "${email}", password: "${password}"}) {
                            _id
                            email
                        }
                    }
                `
            }
        }

        fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        setShowErrorMessage(false);
        setShowSuccessMessage(true);
        if (res.status !== 200 && res.status !== 201) {
          setShowSuccessMessage(false);
          setShowErrorMessage(true);
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        if (resData.data.login.token) {
          contextType.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
        }
      })
      .catch(err => {
        // setShowSuccessMessage(false);
        // setShowErrorMessage(true);
        console.log(err);
      });
    };


    return(
        <div className="main-auth">
            {isLogin ? <h2>LogIn Page</h2> : <h2>SignUp Page</h2>}
            <form className="auth-form" onSubmit={submitHandler}>
                <div className="form-control-auth">
                    <label htmlFor="email">E-Mail</label>
                    <input type="email" id="email" ref={emailEl} />
                </div>
                <div className="form-control-auth">
                    <label htmlFor="password">Password</label>
                    <input type="password" ref={passwordEl} />
                </div>
                <div className="form-actions">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={switchModeHandler}>Switch to {isLogin ? 'SignUp' : 'Login'}</button>
                </div>

            </form>
            {showSuccessMessage && (
                <div className="success-message">
                    <p>SUCCESS!!</p>
                </div>
            )}
            { showErrorMessage && (
                <div className="error-message">
                    <p>ERROR!!</p>
                </div>
            )}
        </div>
    )

}

export default AuthPage;