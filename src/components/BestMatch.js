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
            <DialogTitle 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 2
                }}
            >
                <Typography variant='h5' sx={{ flex: 1, textAlign: 'center' }}>Your Best Match!</Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', justifyContent: 'center'}}>
                {/* <Card elevation={0}>
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
                            {dog.city ? dog.city + ', ' : ''}{dog.state} {dog.zip_code}
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
                </Card> */}
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
                        <Button size="large" variant="contained" onClick={()=>{window.alert('Adopt feature coming soon...')}}>Adopt Me!</Button>
                    </CardActions>
                </Card>
            </DialogContent>
        </Dialog>
    );
};

export default BestMatch;