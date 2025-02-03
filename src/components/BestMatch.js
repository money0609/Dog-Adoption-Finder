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
            slotProps={{ 
                desktopPaper: { 
                    borderRadius: 2,
                    backgroundColor: 'background.paper' 
                } 
            }}
        >
            <DialogTitle 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 2
                }}
            >
                <Typography sx={{ flex: 1, textAlign: 'center', color: '#44acc0', fontSize: '30px' }}>Your Best Match!</Typography>
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', justifyContent: 'center'}}>
                <Card elevation={0} sx={{ maxWidth: 345 }} classes={{ root: 'dog-item' }} key={'fav_' + dog.id}>
                    <CardMedia
                        component="img"
                        alt={dog.name}
                        image={dog.img}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {dog.name}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            Breed: {dog.breed}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            Age: {dog.age}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        {dog.city ? dog.city + ', ' : ''}{dog.state} {dog.zip_code}
                        </Typography>
                    </CardContent>
                    <CardActions 
                        className='dog-item-actions' 
                        disableSpacing 
                        sx={{ 
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <Button sx={{ mt: 2, background: '#ffa900' }} size="large" variant="contained" onClick={()=>{window.alert('Adopt feature coming soon...')}}>Adopt Me!</Button>
                    </CardActions>
                </Card>
            </DialogContent>
        </Dialog>
    );
};

export default BestMatch;