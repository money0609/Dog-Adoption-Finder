import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Paper,
    Typography,
    Container
} from '@mui/material';

export default function Profile () {

    // redirect to login page if user is not logged in
    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (!user) {
            window.location.href = '/Dog-Adoption-Finder/login';
        }
    }, []);

    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    My Profile
                </Typography>
                
                <Box>
                    <Typography variant="h6">Name: {user?.name}</Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                        Email: {user?.email}
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}