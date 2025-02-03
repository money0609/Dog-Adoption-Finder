import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        textAlign: 'center',
        gap: 3
      }}>
        <PetsIcon sx={{ 
          fontSize: { xs: '4rem', md: '6rem' },
          color: 'rgb(68, 172, 192)'
        }} />
        
        <Typography variant="h2" sx={{
          fontFamily: 'monospace',
          fontWeight: 700,
          color: 'rgb(255, 169, 0)',
          fontSize: {
            xs: '2.1rem',
            sm: '2.25rem',
            md: '3rem'
          }
        }}>
          404 - Page Not Found
        </Typography>

        <Typography variant="h5" sx={{ 
          color: '#424242',
          fontSize: {
            xs: '1.1rem',
            sm: '1.25rem',
            md: '1.5rem'
          }
        }}>
          Sorry, we couldn't find the page you're looking for.
        </Typography>

        <Button 
          variant="contained"
          onClick={() => navigate('/')}
          sx={{ 
            mt: 2,
            bgcolor: 'rgb(68, 172, 192)',
            '&:hover': {
              bgcolor: 'rgb(53, 137, 153)'
            }
          }}
        >
          Go Back Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;