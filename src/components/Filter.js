import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, Button, Typography, FormControl, Slider, Divider, InputLabel, Select, MenuItem, Box, useMediaQuery, useTheme, FormHelperText } from '@mui/material';

export default function Filter({breeds, onFilterSubmit, isFilterOpen, setIsFilterOpen}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const handleTouchStart = (e) => {
        if (!isMobile) return;
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        if (!isMobile) return;
        setTouchEnd(e.targetTouches[0].clientX);
        // console.log('Touch Move:', e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!isMobile || !touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        // console.log('Touch End - Distance:', distance);
        const isLeftSwipe = distance > minSwipeDistance;
        if (isLeftSwipe && isFilterOpen) {
            setIsFilterOpen(false);
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const sortOptions = [
      { value: 'breed:asc', label: 'Breed: A to Z' },
      { value: 'breed:desc', label: 'Breed: Z to A' },
      { value: 'age:asc', label: 'Age: Youngest First' },
      { value: 'age:desc', label: 'Age: Oldest First' },
      { value: 'name:asc', label: 'Name: A to Z' },
      { value: 'name:desc', label: 'Name: Z to A' }
    ];
    const [filters, setFilters] = useState({ 
      breeds: [], 
      age: [0, 25],
      zipCodes: [],
      sort: 'breed:asc',
      location: {
          city: '',
          states: []
      }
    });

    const [formErrors, setFormErrors] = useState({
        city: false,
        state: false
    });

    const handleZipCodeChange = (e) => {
        const zip = e.target.value;
        if (/^\d{0,5}$/.test(zip)) {
            setFilters({ ...filters, zipCodes: zip ? [zip] : null });
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // Reset errors
        setFormErrors({
            city: false,
            state: false
        });

        try {
            // validate city and state if either one is present and another is missing
            if (
                (filters.location.city && (!filters.location.states || filters.location.states.length === 0)) 
                || 
                (!filters.location.city && filters.location.states && filters.location.states.length > 0)
            ) {
                setFormErrors({
                    city: !filters.location.city,
                    state: (!filters.location.states || filters.location.states.length === 0)
                });
                return;
            }

            if (filters.location.city || filters.location.states?.length > 0) {
                const locations = await searchLocations(filters.location);
                const lookup_location_res = (locations && locations.length > 0) ? locations[0]?.zip_code : null;
                const updatedFilters = {
                    ...filters,
                    zipCodes: lookup_location_res ? [lookup_location_res] : [],
                    location: {
                        city: (locations && locations.length > 0) ? filters.location.city : '',
                        states: (locations && locations.length > 0) ? filters.location.states : []
                    }
                };
                setFilters(updatedFilters);
                await onFilterSubmit(updatedFilters);
            } else {
                await onFilterSubmit(filters);
            }
        } catch (error) {
            console.error('Filter submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
  
    const handleCancelFilters = () => {
      setFilters({
          breeds: [],
          age: [0, 25],
          zipCodes: [],
          sort: 'breed:asc',
          location: {
              city: '',
              states: []
          }
      });
      setIsFilterOpen(false);

    };

  const getCityStateCoordinates = async (city, state) => {
    try {
        // Use first location as city center
        const response = await fetch(`${process.env.REACT_APP_FETCH_REWARDS}/locations/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                city: city,
                states: [state],
                size: 1
            }),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Unable to get city coordinates');
        }

        const data = await response.json();
        if (data.results && data.results.length > 0) {
            return {
                latitude: data.results[0].latitude,
                longitude: data.results[0].longitude
            };
        }
        throw new Error('No coordinates found for city/state');
    } catch (error) {
        console.error('Error getting city coordinates:', error);
        throw error;
    }
  };

  const searchLocations = async (searchParams) => {
    try {

        const params = {
            city: searchParams.city,
            states: searchParams.states,
            // geoBoundingBox: boundingBox,
            size: 1
        };

        const response = await fetch(`${process.env.REACT_APP_FETCH_REWARDS}/locations/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Location search failed');
        }

        const data = await response.json();
        return data.results;

    } catch (error) {
        console.error('Location search error:', error);
        throw error;
    }
  };
    const list = () => (
      <Box
        sx={{ 
            width: '100%',
            padding: { xs: '15px', sm: '20px' },
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        }}
        role="presentation"
      >
        <FormControl fullWidth>
          <InputLabel id="sortInput">Sort By</InputLabel>
          <Select
            labelId="sortInput"
            id="sortSelect"
            value={filters.sort}
            label="Sort By"
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                  {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Divider sx={{mt: 2}} />
        <FormControl fullWidth>
            <Typography variant="h6">Location Search</Typography>
            
            <TextField
                fullWidth
                label="City"
                value={filters.location.city}
                onChange={(e) => setFilters({
                    ...filters,
                    location: { ...filters.location, city: e.target.value }
                })}
                sx={{ mt: 1 }}
                error={formErrors.city}
                helperText={formErrors.city ? "City and State are required when using location search" : ""}
            />
        </FormControl>

        <FormControl fullWidth error={formErrors.state}>
            <InputLabel id="state-select-label">Select State</InputLabel>
            <Select
                labelId="state-select-label"
                id="state-select"
                value={(filters.location.states && filters.location.states.length) ? filters.location.states[0] : ''}
                label="Select State"
                onChange={(e) => setFilters({
                    ...filters,
                    location: { 
                        ...filters.location, 
                        states: e.target.value ? [e.target.value] : null
                    }
                })}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {[
                    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
                    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
                    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
                    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
                    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
                ].map((state) => (
                    <MenuItem key={state} value={state}>
                        {state}
                    </MenuItem>
                ))}
            </Select>

            <FormHelperText>{formErrors.state ? "City and State are required when using location search" : ""}</FormHelperText>
        </FormControl>
        <Divider sx={{mt: 2}} />
        <Box>
            <Typography variant="h6">Breed</Typography>
            <Autocomplete
                options={breeds}
                value={filters.breeds[0] || null}
                onChange={(_, newValue) => setFilters({
                    ...filters,
                    breeds: newValue ? [newValue] : []
                })}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select Breed"
                        placeholder="Choose a breed"
                        sx={{ mt: 1 }}
                    />
                )}
            />
        </Box>
        <Divider sx={{mt: 2}} />
        <Box>
            <Typography variant='h6'>Age Range</Typography>
            <Slider
                value={filters.age}
                onChange={(_, newValue) => setFilters({ ...filters, age: newValue })}
                valueLabelDisplay="auto"
                min={0}
                max={25}
                sx={{ color: '#ffa900', mt: 1 }}
            />
        </Box>

        <Divider sx={{mt: 2}} />
        <Box>
            <Typography variant='h6'>ZIP Code</Typography>
            <TextField
                sx={{ mt: 1 }}
                fullWidth
                label="ZIP Code"
                value={(filters.zipCodes && filters.zipCodes.length) ? filters.zipCodes[0] : ''}
                onChange={handleZipCodeChange}
                // onChange={(e) => setFilters({ ...filters, zipCodes: e.target.value ? [e.target.value] : null })}
            />
        </Box>
        <Divider sx={{mt: 2}} />
        <Button
            sx={{ mt: 2, background: '#ffa900' }}
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
        >
            {isSubmitting ? 'Applying Filters...' : 'Apply Filters'}
        </Button>
        <Button
            sx={{ mt: 2 }}
            fullWidth
            variant="outlined"
            color='default'
            onClick={handleCancelFilters}
            disabled={isSubmitting}
        >
            Cancel
        </Button>
    </Box>
);
  
    return (
        <Box
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            sx={{
                position: {
                    xs: 'fixed',
                    md: 'relative'
                },
                top: {
                    xs: 0,
                    md: 'auto'
                },
                left: 0,
                width: {
                    xs: isFilterOpen ? '-webkit-fill-available' : '0',
                    md: isFilterOpen ? '320px' : '0'
                },
                height: '100vh',
                opacity: isFilterOpen ? 1 : 0,
                transform: {
                    xs: isFilterOpen ? 'translateX(0)' : 'translateX(-100%)',
                    md: isFilterOpen ? 'translateX(0)' : 'translateX(-320px)'
                },
                visibility: isFilterOpen ? 'visible' : 'hidden',
                bgcolor: '#44acc0',
                borderRadius: '1rem',
                display: 'flex',
                gap: 2,
                p: isFilterOpen ? 2 : 0,
                transition: theme => theme.transitions.create(
                    ['transform', 'width', 'opacity'],
                    {
                        duration: theme.transitions.duration.standard,
                        easing: isFilterOpen ? 
                            'cubic-bezier(0.0, 0, 0.2, 1)' : 
                            'cubic-bezier(0.4, 0, 1, 1)'
                    }
                ),
                overflowY: 'auto',
                overflowX: 'hidden',
                zIndex: {
                    xs: 1200,
                    md: 1
                },
                boxShadow: 1
            }}
        >
            {list()}
        </Box>
    );
}
