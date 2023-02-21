import React, { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

function Login() {
    let { loginUser } = useContext(AuthContext);
    return (
        <div>
            <form onSubmit={loginUser}>
                <input
                    type='text'
                    name='username'
                    placeholder='Enter Username'
                />
                <input
                    type='text'
                    name='password'
                    placeholder='Enter Password'
                />
                <input type='submit' />
            </form>
        </div>
    );
}

export default Login;
