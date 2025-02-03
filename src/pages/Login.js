import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, TextField, Typography, Box, FormControl, FormHelperText } from '@mui/material';

function Login() {
    const [user_name, setUsername] = useState('');
    const [user_email, setUseremail] = useState('');
    const [error_msg, setErrormsg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (user) {
            navigate('/search');
        }
    }, []);

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
            // console.log(response);
            if (response.status === 200 && response.ok) {
                // console.log('Login successful');
                setErrormsg('');

                // Save user to session storage
                sessionStorage.setItem('user', JSON.stringify({ 
                    name: user_name, 
                    email: user_email, 
                }));

                // Dispatch custom event
                window.dispatchEvent(new Event('userUpdate'));

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
        <Container 
            maxWidth="md" 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center',
                gap: 3
            }}
        >
            <Typography variant="h2" sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'rgb(68, 172, 192)',
                fontSize: {
                    xs: '2.1rem',
                    sm: '2.25rem',
                    md: '3rem'
                },
                mt: 10
            }}>
                Sign in or sign up
            </Typography>
            <FormControl fullWidth error={error_msg}>
                <TextField
                    sx={{ mt: 1 }}
                    isRequired={true}
                    fullWidth
                    label="Name"
                    value={user_name}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    sx={{ mt: 1 }}
                    isRequired={true}
                    fullWidth
                    label="Email"
                    value={user_email}
                    onChange={(e) => setUseremail(e.target.value)}
                />
                <FormHelperText>{error_msg ?? ''}</FormHelperText>
            </FormControl>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent:'center' }}>
                <Button variant="contained" size="large" disabled={!user_name || !user_email} onClick={handleLogin} sx={{ background: 'rgb(68, 172, 192)', width: '150px'}}>Sign In</Button>
                <a style={{ alignSelf: 'center' }} href="#" onClick={()=>{window.alert('Sign up feature coming soon...')}}>Not a member? Register</a>
            </Box>
        </Container>
    );
}

export default Login;