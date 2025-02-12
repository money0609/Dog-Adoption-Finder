import React, { useState, useEffect } from 'react';
import { AppBar, Box, Toolbar, Typography, Button, IconButton, Avatar, Menu, Tooltip, Container, MenuItem } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

const settings = ['Profile', 'Logout'];

export default function Header() {
    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        const updateUser = () => {
            const savedUser = sessionStorage.getItem('user');
            setUser(savedUser ? JSON.parse(savedUser) : null);
        };

        // Listen for custom event
        window.addEventListener('userUpdate', updateUser);
        
        return () => {
            window.removeEventListener('userUpdate', updateUser);
        };
    }, []);

    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    
    const handleSettingClick = (setting) => {
        handleCloseUserMenu();
        if (setting === 'Profile') {
            window.location.href = '/profile';
        } else if (setting === 'Logout') {       
            sessionStorage.removeItem('user');
            window.location.href = '/login';
        }
    };
  return (
    <Box sx={{ flexGrow: 1, mb: { xs: '80px', md: '90px' } }}>
        <AppBar position="fixed" sx={{ backgroundColor: 'rgb(68, 172, 192)' }}>
            <Container maxWidth="xl" id="header_container">
                <Toolbar 
                    disableGutters 
                    sx={{ 
                        minHeight: '70px !important',
                        py: 1 // Add padding top and bottom
                    }}
                >
                    <PetsIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Adopt A Dog
                    </Typography>
                    <PetsIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Adopt A Dog
                    </Typography>
                    <Box sx={{ 
                        flexGrow: 0,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        ml: 'auto'  // This pushes the Box to the right
                    }}>
                        {
                            user
                            ?
                            <>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar sx={{ bgcolor: 'rgb(255, 169, 0)' }}>{user?.name}</Avatar>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={() => handleSettingClick(setting)}>
                                        <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                                    </MenuItem>
                                ))}
                                </Menu>
                            </>
                            :
                            <Button variant='contained' sx={{ bgcolor: 'rgb(255, 169, 0)' }} onClick={() => window.location.href = '/login'}>Login</Button>
                        }
                        
                    </Box>
                </Toolbar>
            </Container>    
        </AppBar>
    </Box>
  );
}
