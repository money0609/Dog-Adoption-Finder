import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [user_name, setUsername] = useState('');
    const [user_email, setUseremail] = useState('');
    const [error_msg, setErrormsg] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        // Valid username and password
        
        try {
            const response = await fetch(`${process.env.REACT_APP_FETCH_REWARDS}${process.env.REACT_APP_LOGIN_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    name: user_name, 
                    email: user_email, 
                }),
                credentials: 'include'
            });
            console.log(response);
            if (response.status === 200 && response.ok) {
                console.log('Login successful');
                setErrormsg('');
                // Redirect to home page
                navigate('/search');

            } else {
                console.log('Login failed');
                setErrormsg('Invalid username or password');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrormsg('Something went wrong, please try again later.');
        }
    };

    return (
        <div className="login">
            <div>
                <input
                    type="text"
                    placeholder="Username"
                    value={user_name}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={user_email}
                    onChange={(e) => setUseremail(e.target.value)}
                />
            </div>
            {error_msg && <p className='error_message'>{error_msg}</p>}
            <div>
                <button onClick={handleLogin}>Login</button>
                <a href="/register">Not a member? Register</a>
            </div>
        </div>
    );
}

export default Login;