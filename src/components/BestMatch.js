import React from 'react';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    IconButton,
    Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const BestMatch = ({ dog, open, onClose }) => {
    if (!dog) return null;

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                Your Best Match!
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Card elevation={0}>
                    <CardMedia
                        component="img"
                        height="300"
                        image={dog.img}
                        alt={dog.name}
                        sx={{ objectFit: 'contain' }}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {dog.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Breed: {dog.breed}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Age: {dog.age}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Zip: {dog.zip_code}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button 
                            size="large" 
                            variant="contained" 
                            color="primary"
                            fullWidth
                            onClick={() => window.alert('Adopt feature coming soon...')}
                        >
                            Adopt Me!
                        </Button>
                    </CardActions>
                </Card>
            </DialogContent>
        </Dialog>
    );
};

export default BestMatch;