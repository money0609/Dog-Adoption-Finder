import React, { useState, useEffect } from 'react';
import {  Fab, Zoom, Card, CardActions, CardContent, CardMedia, Button, Typography, IconButton, Pagination, Tooltip, Paper, Box, Container, useMediaQuery, useTheme, Backdrop, CircularProgress  } from '@mui/material';

import FilterListIcon from '@mui/icons-material/FilterList';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Filter from '../components/Filter';
import BestMatch from '../components/BestMatch';

function Search() {
    
    // redirect to login page if user is not logged in
    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (!user) {
            window.location.href = '/login';
        }
    }, []);
    const [filteredDogs, setFilteredDogs] = useState([]);
    const [dogIds, setDogIds] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [bestMatchDog, setBestMatchDog] = useState(null);
    const [bestMatchOpen, setBestMatchOpen] = useState(false);
    const [locationMap, setLocationMap] = useState(new Map());
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const BATCH_SIZE = 10000;
    const DOGS_PER_PAGE = 20;
    let fisrt_call = `${process.env.REACT_APP_SEARCH_DOGS_IDS_ENDPOINT}?from=0&size=${BATCH_SIZE}&sort=breed:asc`;

    const fetchDogIds = async (url) => {
        try {
            setIsLoading(true);
            const response = await search_dogs_ids(url);
            
            setDogIds(prev => [...prev, ...response.resultIds]);

            // Fetch dogs for first page
            if (currentPage === 1) {
                await get_dogs_by_ids(response.resultIds.slice(0, DOGS_PER_PAGE));
            }
            setNextUrl(response.next);
            setHasMore(!!response.next);
        } catch (error) {
            console.error('Error fetching dog IDs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        if (fisrt_call) {
            get_available_breeds();
            fetchDogIds(fisrt_call);
            fisrt_call = null;
        }
    }, []);

    useEffect(() => {
        if (hasMore && nextUrl) {
            fetchDogIds(nextUrl);
        }
    }, [hasMore, nextUrl]);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        if (isMobile && isFilterOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isFilterOpen, isMobile]);

    const handleSessionExpired = (response) => {

        if (response.status === 401) {
            // Session expired, clear storage and redirect
            sessionStorage.clear();
            window.location.href = '/login';
            return true;
        }
        return false;
        
    }
    const get_available_breeds = async () => {
        try {
            const available_breeds = await fetch(`${process.env.REACT_APP_FETCH_REWARDS}${process.env.REACT_APP_DOGS_BREED_ENDPOINT}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (handleSessionExpired(available_breeds)) {
                return;
            }

            if (!available_breeds.ok) {
                throw new Error('Unable to fetch all breeds');
            }

            const response =  await available_breeds.json();
            setBreeds(response);

        } catch (error) {
            console.error('Error fetching breeds:', error);
            throw error;
        }
        
    };
    
    const search_dogs_ids = async (next_url) => {
        try {
            // fetch dogs
            const search_dogs = await fetch(`${process.env.REACT_APP_FETCH_REWARDS}${next_url}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            if (!search_dogs.ok) {
                throw new Error('Unable to fetch dog ids', search_dogs.json());
            }
            const response = await search_dogs.json();
            return response;
        } catch (error) {
            console.error('Unable to fetch dog ids:', error);
            throw error;
        }
        
    };
    
    const get_dogs_by_ids = async (dog_ids = []) => {
        try {
            const dogs = await fetch(`${process.env.REACT_APP_FETCH_REWARDS}${process.env.REACT_APP_SEARCH_DOGS_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dog_ids),
                credentials: 'include'
            });

            if (handleSessionExpired(dogs)) {
                return;
            }

            if (!dogs.ok) {
                throw new Error('Unable to fetch dogs by ids');
            }

            const response = await dogs.json();

            setFilteredDogs(response);

            await search_dogs_locations_by_zip(response);
            
        } catch (error) {
            throw error;
        }
    };

    const search_dogs_locations_by_zip = async (dogs = []) => {
        try {
            if (!dogs || dogs.length === 0) return;
    
            const dog_zips = dogs.map(dog => dog.zip_code);
            const response = await fetch(`${process.env.REACT_APP_FETCH_REWARDS}/locations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dog_zips),
                credentials: 'include'
            });

            if (handleSessionExpired(response)) {
                return;
            }
    
            if (!response.ok) {
                throw new Error('Unable to fetch locations');
            }
    
            const locations = await response.json();
            // Convert locations array to Map for O(1) lookup
            const locMap = new Map(
                locations?.filter(loc => loc && loc.zip_code) // Filter out null/undefined locations
                    .map(loc => [loc.zip_code, loc]) || []
            );
            setLocationMap(locMap);
            return locMap;
        } catch (error) {
            console.error('Unable to fetch locations', error);
            throw error;
        }
    };

    const handlePageChange = async (event, newPage) => {
        setCurrentPage(newPage);
        const startIndex = (newPage - 1) * DOGS_PER_PAGE;
        const endIndex = startIndex + DOGS_PER_PAGE;
        await get_dogs_by_ids(dogIds.slice(startIndex, endIndex));
    };

    const handleFavoriteClick = (dog) => {
        // get new favorite dog's city and state
        dog.city = locationMap.get(dog.zip_code)?.city;
        dog.state = locationMap.get(dog.zip_code)?.state;
        const newFavorites = favorites.some(fav => fav.id === dog.id)
            ? favorites.filter(fav => fav.id !== dog.id)
            : [...favorites, dog];
        
        setFavorites(newFavorites);
        sessionStorage.setItem('favorites', JSON.stringify(newFavorites));
        window.dispatchEvent(new Event('favoritesUpdate'));
    };

    const handleFilterSubmit = async (filters) => {
        setIsInitialLoad(false);
        const queryParams = new URLSearchParams();
        if (filters.breeds.length) {
            queryParams.append('breeds', filters.breeds.join(','));
        }
        if (filters.zipCodes && filters.zipCodes.length) {

            queryParams.append('zipCodes', filters.zipCodes.join(','));
        }
        queryParams.append('ageMin', filters.age[0]);
        queryParams.append('ageMax', filters.age[1]);
        queryParams.append('sort', filters.sort);

        const url = `${process.env.REACT_APP_SEARCH_DOGS_IDS_ENDPOINT}?from=0&size=${BATCH_SIZE}&${queryParams.toString()}`;
        setDogIds([]);
        setNextUrl(null);
        setHasMore(true);
        setCurrentPage(1);
        await fetchDogIds(url);
    };

    const handleBestMatch = async () => {
        try {
            const favoriteIds = favorites.map(dog => dog.id);
        
            if (favoriteIds.length === 0) {
                return;
            }
            
            setIsLoading(true);
            setBestMatchDog(null);
            const response = await fetch(`${process.env.REACT_APP_FETCH_REWARDS}${process.env.REACT_APP_FIND_MATCH_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(favoriteIds),
                credentials: 'include'
            });

            if (handleSessionExpired(response)) {
                return;
            }

            if (!response.ok) {
                throw new Error('Unable to find best match dog');
            }

            const matchedDogId = await response.json();

            if (!matchedDogId || !matchedDogId.match) { 
                console.warn('No best match found');
                return;
            }

            const bestMatch = favorites.find(dog => 
                dog.id === matchedDogId.match
            );
            
            setBestMatchDog(bestMatch);
            setIsLoading(false);
            setBestMatchOpen(true);

        } catch (error) {
            setIsLoading(false);
            throw error;
        }
    }
    
    return (
        <Container maxWidth="xl" id="search_page_container">
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: { xs: 0.5, sm: 1 },
                background: 'rgb(236, 236, 236)',
                borderRadius: '1rem',
                mb: { xs: '20px', sm: '35px' },
                padding: { xs: '15px', sm: '20px' }
            }}>
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
                    Meet dogs available for adoption
                </Typography>
                <Typography 
                    variant="h5" 
                    sx={{ 
                        color: '#424242',
                        fontSize: {
                            xs: '1.1rem',
                            sm: '1.25rem',
                            md: '1.5rem'
                        } 
                    }}
                >
                    🐾 Browse our lovely dogs looking for their forever homes
                </Typography>
                <Typography 
                    variant="h5" 
                    sx={{ 
                        color: '#424242',
                        fontSize: {
                            xs: '1.1rem',
                            sm: '1.25rem',
                            md: '1.5rem'
                        } 
                    }}
                >💝 Save your favorites and let us help find your perfect match
                </Typography>
                <Typography 
                    variant="h5" 
                    sx={{ 
                        color: '#424242',
                        fontSize: {
                            xs: '1.1rem',
                            sm: '1.25rem',
                            md: '1.5rem'
                        } 
                    }}
                >🏠 Filter by breed, age, and location to find nearby dogs
                </Typography>
            </Box>
            <Button id='filter_sort_button' onClick={() => setIsFilterOpen(!isFilterOpen)} variant="outlined" endIcon={<FilterListIcon />}>
                Filter & Sort
            </Button>
            <Box className="search" sx={{ display: 'flex'}}>
                {/* Filter section with animation */}
                <Box sx={{
                    width: isFilterOpen ? 'auto' : 0,
                    overflow: 'hidden',
                    transition: 'width 0.3s ease'
                }}>
                    <Filter 
                        breeds={breeds} 
                        onFilterSubmit={handleFilterSubmit}
                        isFilterOpen={isFilterOpen}
                        setIsFilterOpen={setIsFilterOpen}
                    />
                </Box>
                <Box sx={{ 
                    flex: 1,
                    transition: 'margin-left 0.3s ease'
                }}>
                    <div className="dog-list">
                        {
                            filteredDogs && filteredDogs.length === 0
                            ?
                            <Box 
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    minHeight: '50vh'
                                }}
                            >
                                <Paper 
                                    elevation={3}
                                    sx={{
                                        p: 4,
                                        borderRadius: 2,
                                        textAlign: 'center'
                                    }}
                                >
                                    {isInitialLoad ? (
                                        <>
                                            <Typography variant="h4" sx={{
                                                fontFamily: 'monospace',
                                                fontWeight: 700,
                                                color: 'text.primary'
                                            }}>
                                                One moment... Fetching our dog friends...
                                            </Typography>
                                            <Typography variant="body1" sx={{ 
                                                mt: 2,
                                                color: 'text.secondary'
                                            }}>
                                                Use filters to find your perfect companion
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            <Typography 
                                                variant="h4" 
                                                sx={{
                                                    fontFamily: 'monospace',
                                                    fontWeight: 700,
                                                    color: 'text.primary'
                                                }}
                                            >
                                                No dogs found
                                            </Typography>
                                            <Typography 
                                                variant="body1" 
                                                sx={{ 
                                                    mt: 2,
                                                    color: 'text.secondary'
                                                }}
                                            >
                                                Try adjusting your filters
                                            </Typography>
                                        </>
                                    )}
                                </Paper>
                            </Box>
                            :
                            null
                        }
                        {filteredDogs && filteredDogs?.map(dog => (
                            <Card sx={{ maxWidth: 345 }} classes={{ root: 'dog-item' }} key={dog.id}>
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
                                        {locationMap.get(dog.zip_code)?.city}, {locationMap.get(dog.zip_code)?.state} {dog.zip_code}
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
                                    <Tooltip title="Add to favorites" placement="top">
                                        <IconButton 
                                            aria-label="add to favorites"
                                            onClick={() => handleFavoriteClick(dog)}
                                            sx={{
                                                color: favorites.some(fav => fav.id === dog.id) ? 'red' : 'outline',
                                                transition: 'color 0.3s ease'
                                            }}
                                        >
                                            {favorites.some(fav => fav.id === dog.id) ? 
                                                <FavoriteIcon fontSize='large' /> : 
                                                <FavoriteBorderIcon fontSize='large' />
                                            }
                                        </IconButton>
                                    </Tooltip>
                                    {/* <Button size="large" onClick={()=>{window.alert('Adopt feature coming soon...')}}>Adopt</Button> */}
                                </CardActions>
                            </Card>
                        ))}
                        
                    </div>
                    {
                        dogIds.length
                        ?
                        <div className='pagination'>
                            <Pagination count={Math.ceil(dogIds.length / DOGS_PER_PAGE)} page={currentPage} onChange={handlePageChange} showFirstButton={true} showLastButton={true} size={'large'}/>
                        </div>
                        :
                        null
                    }
                    <Zoom
                        in={favorites.length > 0}
                        timeout={300}
                        style={{
                            transitionDelay: favorites.length > 0 ? '300ms' : '0ms',
                        }}
                    >
                        <Box sx={{ position: 'fixed', bottom: 20, right: 20, textAlign: 'center' }}>
                            {/* <Typography
                                variant="subtitle2"
                                sx={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                    color: 'white',
                                    p: 1,
                                    borderRadius: 1,
                                    mb: 1
                                }}
                            >
                                Next: Find Your Match!
                            </Typography> */}
                            <Fab
                                variant="extended"
                                color="error"
                                aria-label="find match"
                                sx={{
                                    animation: 'glow 1.5s ease-in-out infinite alternate',
                                    '@keyframes glow': {
                                        from: {
                                            boxShadow: '0 0 5px #ff4081, 0 0 10px #ff4081, 0 0 15px #ff4081'
                                        },
                                        to: {
                                            boxShadow: '0 0 10px #ff4081, 0 0 20px #ff4081, 0 0 30px #ff4081'
                                        }
                                    }
                                }}
                                onClick={handleBestMatch}
                            >
                                <FavoriteIcon sx={{ mr: 1 }} />
                                Find Your Match ({favorites.length})
                            </Fab>
                        </Box>
                    </Zoom>
                </Box>
                <BestMatch 
                    dog={bestMatchDog}
                    open={bestMatchOpen}
                    onClose={() => setBestMatchOpen(false)}
                />
                <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                {/* Toggle button */}
                {/* <IconButton
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    sx={{
                        position: 'fixed',
                        left: isFilterOpen ? 260 : 20,
                        top: 20,
                        transition: 'left 0.3s ease',
                        zIndex: 1000
                    }}
                >
                    Filter & Sort <FilterListIcon/>
                </IconButton> */}
            </Box>
        </Container>
    );
}


export default Search;