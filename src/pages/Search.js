import React, { useState, useEffect } from 'react';
import {  Fab, Zoom, Card, CardActions, CardContent, CardMedia, Button, Typography, IconButton, Pagination, Tooltip, SwipeableDrawer, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Filter from '../components/Filter';
import BestMatch from '../components/BestMatch';

function Search() {
    const [dogs, setDogs] = useState([]);
    const [filteredDogs, setFilteredDogs] = useState([]);
    const [dogIds, setDogIds] = useState([]);
    const [breed, setBreed] = useState('');
    const [breeds, setBreeds] = useState([]);
    const [page, setPage] = useState(1);
    const [dogsPerPage, setDogsPerPage] = useState(20);
    const [favorites, setFavorites] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [activeFilters, setActiveFilters] = useState([]);
    const [age, setAge] = useState([0, 20]);
    const [zipCode, setZipCode] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [bestMatchDog, setBestMatchDog] = useState(null);
    const [bestMatchOpen, setBestMatchOpen] = useState(false);
    
    const BATCH_SIZE = 10000;
    const DOGS_PER_PAGE = 20;
    let fisrt_call = `${process.env.REACT_APP_SEARCH_DOGS_IDS_ENDPOINT}?from=0&size=${BATCH_SIZE}&sort=breed:asc`;

    const fetchDogIds = async (url) => {
        try {
            const params = ['value1', 'value2', 'value3']; // Your array of parameters
            const queryParams = new URLSearchParams({ params }).toString();
            console.log('queryParams111:', queryParams);
            setIsLoading(true);
            const response = await search_dogs_ids(url);
            
            setDogIds(prev => [...prev, ...response.resultIds]);
            setNextUrl(response.next);
            setHasMore(!!response.next);
            
            // Fetch dogs for first page
            if (currentPage === 1) {
                await get_dogs_by_ids(response.resultIds.slice(0, DOGS_PER_PAGE));
            }
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

    // useEffect(() => {
    //     const remainingPages = dogIds.length / DOGS_PER_PAGE - currentPage;
    //     console.log('remainingPages:', remainingPages, hasMore, !isLoading, nextUrl);
    //     if (remainingPages < 5 && hasMore && !isLoading && nextUrl) {
    //         console.log('fetching more dogs');
    //         fetchDogIds(nextUrl);
    //     }
    // }, [currentPage, dogIds.length, hasMore, isLoading, nextUrl]);
    useEffect(() => {
        console.log('remaining calls:', hasMore, nextUrl);
        if (hasMore && nextUrl) {
            console.log('fetching more dogs');
            fetchDogIds(nextUrl);
        }
    }, [hasMore, nextUrl]);

    useEffect(() => {
        console.log('favorites:', favorites);
    }, [favorites]);

    const get_available_breeds = async () => {
        try {
            const available_breeds = await fetch(`${process.env.REACT_APP_FETCH_REWARDS}${process.env.REACT_APP_DOGS_BREED_ENDPOINT}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!available_breeds.ok) {
                throw new Error('Unable to fetch all breeds');
            }

            const response =  await available_breeds.json();
            console.log('available_breeds:', response);
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
            console.log('search_dogs:', response);
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

            if (!dogs.ok) {
                throw new Error('Unable to fetch dogs by ids');
            }

            const response = await dogs.json();
            console.log('dogs:', response);

            setDogs(response);
            setFilteredDogs(response);

        } catch (error) {
            console.error('Unable to fetch dogs by ids', error);
            throw error;
        }
        
    };

    const handleFilterChange = (e) => {
        const selectedBreed = e.target.value;
        setBreed(selectedBreed);
        setCurrentPage(1); // Reset to first page when filtering
        
        if (selectedBreed === '') {
            setFilteredDogs(dogs);
        } else {
            const filtered = dogs.filter(dog => 
                dog.breed.toLowerCase().includes(selectedBreed.toLowerCase())
            );
            setFilteredDogs(filtered);
        }
    };

    const handlePageChange = async (event, newPage) => {
        setCurrentPage(newPage);
        const startIndex = (newPage - 1) * DOGS_PER_PAGE;
        const endIndex = startIndex + DOGS_PER_PAGE;
        await get_dogs_by_ids(dogIds.slice(startIndex, endIndex));
    };

    const handleFavoriteClick = (dog) => {
        setFavorites(prev => {
            const isFavorite = prev.some(fav => fav.id === dog.id);
            if (isFavorite) {
                return prev.filter(fav => fav.id !== dog.id);
            } else {
                return [...prev, dog];
            }
        });
    };

    const handleAddFilter = (type, value, label) => {
        setActiveFilters(prev => [...prev, {
            type,
            value,
            label: `${type}: ${label}`
        }]);
    };

    const handleRemoveFilter = (filterToRemove) => {
        setActiveFilters(prev => prev.filter(filter => 
            filter.type !== filterToRemove.type || 
            filter.value !== filterToRemove.value
        ));
    };

    const handleClearFilters = () => {
        setActiveFilters([]);
        setBreed('');
        setAge([0, 20]);
        setZipCode('');
    };

    const handleFilterSubmit = async (filters) => {
        const queryParams = new URLSearchParams();
        if (filters.breeds.length) {
            queryParams.append('breeds', filters.breeds.join(','));
        }
        if (filters.zipCodes.length) {
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
        console.log('filters:', filters);
        console.log('queryParams:', queryParams.toString());
    };

    const handleBestMatch = async () => {
        try {
            const favoriteIds = favorites.map(dog => dog.id);
        
            if (favoriteIds.length === 0) {
                console.warn('No favorites selected');
                return;
            }
            
            setBestMatchDog(null);
            const response = await fetch(`${process.env.REACT_APP_FETCH_REWARDS}${process.env.REACT_APP_FIND_MATCH_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(favoriteIds),
                credentials: 'include'
            });

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
            console.log('bestMatch:', bestMatch);
            setBestMatchDog(bestMatch);
            setBestMatchOpen(true);

        } catch (error) {
            console.error('Unable to find best match dog', error);
            throw error;
        }
    }
    
    return (
        <div className="search">
            <h1>Search</h1>
            <div>
                <Filter breeds={breeds} onFilterSubmit={handleFilterSubmit} />
            </div>
            <div className="dog-list">
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
                                Zip: {dog.zip_code}
                            </Typography>
                        </CardContent>
                        <CardActions className='dog-item-actions' disableSpacing>
                            <Tooltip title="Add" placement="top">
                                <IconButton 
                                    aria-label="add to favorites"
                                    onClick={() => handleFavoriteClick(dog)}
                                    sx={{
                                        color: favorites.some(fav => fav.id === dog.id) ? 'red' : 'outline',
                                        transition: 'color 0.3s ease'
                                    }}
                                >
                                    <FavoriteIcon /> 
                                    <Typography variant="h5" sx={{ color: 'text.secondary' }}>
                                        Add to Favorites
                                    </Typography>
                                </IconButton>
                            </Tooltip>
                            {/* <Button size="large" onClick={()=>{window.alert('Adopt feature coming soon...')}}>Adopt</Button> */}
                        </CardActions>
                    </Card>
                ))}
                
            </div>
            <div className='pagination'>
                {dogIds.length && <Pagination count={dogIds.length / DOGS_PER_PAGE} page={currentPage} onChange={handlePageChange} />}
            </div>
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
            <BestMatch 
                dog={bestMatchDog}
                open={bestMatchOpen}
                onClose={() => setBestMatchOpen(false)}
            />
        </div>
    );
}


export default Search;