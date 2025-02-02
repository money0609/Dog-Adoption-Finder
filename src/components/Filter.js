import React, { useState, useEffect } from 'react';
import { Checkbox, TextField, Autocomplete, Button, Typography, FormControl, Slider, SwipeableDrawer, Divider, List, ListItem, InputLabel, ListItemIcon, Select, MenuItem, Box, Chip, useMediaQuery, useTheme } from '@mui/material';

import PetsIcon from '@mui/icons-material/Pets';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

export default function Filter({breeds, onFilterSubmit, isFilterOpen, setIsFilterOpen}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const handleTouchStart = (e) => {
        console.log('Touch Start:', isMobile);
        if (!isMobile) return;
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        if (!isMobile) return;
        setTouchEnd(e.targetTouches[0].clientX);
        console.log('Touch Move:', e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!isMobile || !touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        console.log('Touch End - Distance:', distance);
        const isLeftSwipe = distance > minSwipeDistance;
        if (isLeftSwipe && isFilterOpen) {
            console.log('Closing filter');
            setIsFilterOpen(false);
        }
    };

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const sortOptions = [
      { value: 'breed:asc', label: 'Breed: A to Z' },
      { value: 'breed:desc', label: 'Breed: Z to A' },
      { value: 'age:asc', label: 'Age: Youngest First' },
      { value: 'age:desc', label: 'Age: Oldest First' },
      { value: 'name:asc', label: 'Name: A to Z' },
      { value: 'name:desc', label: 'Name: Z to A' },
      { value: 'zipCodes:asc', label: 'ZIP Code: Ascending' },
      { value: 'zipCodes:desc', label: 'ZIP Code: Descending' }
    ];
    const [filters, setFilters] = useState({ 
      breeds: [], 
      age: [0, 25],
      zipCodes: [],
      sort: 'breed:asc',
      location: {
          city: '',
          states: [],
          // size: 10000,
          // distance: 25, // miles
          // geoBoundingBox: null
      }
    });
    // const distanceOptions = [
    //   { value: 5, label: '5 miles' },
    //   { value: 10, label: '10 miles' },
    //   { value: 25, label: '25 miles' },
    //   { value: 50, label: '50 miles' }
    // ];
    // const calculateBoundingBox = (lat, lon, distance) => {
    //   const milesPerDegree = 69;
    //   const deltaLat = distance / milesPerDegree;
    //   const deltaLon = distance / (Math.cos(lat * Math.PI / 180) * milesPerDegree);
  
    //   return {
    //       top: { lat: lat + deltaLat, lon },
    //       right: { lat, lon: lon + deltaLon },
    //       bottom: { lat: lat - deltaLat, lon },
    //       left: { lat, lon: lon - deltaLon }
    //   };
    // };
    // const toggleDrawer = (open) => (event) => {
    //   console.log('toggleDrawer', open, event);
    //   if (
    //     event &&
    //     event.type === 'keydown' &&
    //     (event.key === 'Tab' || event.key === 'Shift')
    //   ) {
    //     return;
    //   }
  
    //   setState(open);
    // };

    // useEffect(() => {
    //   console.log('isFilterOpen', isFilterOpen);
    //   setState(isFilterOpen);
    // }, [isFilterOpen]);
    
    const isValidZipCode = (zip) => /^\d{5}$/.test(zip);
    // Add handler for zip codes
    const handleZipCodeChange = (event, zip) => {
      console.log('Zip filter: ', zip);
      // Remove any duplicates and invalid zip codes
      const validZips = isValidZipCode(zip);
      setFilters({ ...filters, zipCodes: [zip] });
    };
    const handleSubmit = async () => {
      setIsSubmitting(true);
      try {
          // if (filters.location.city || filters.location.states.length > 0) {
              // console.log('filters.location', filters);
              // const locations = await searchLocations(filters.location);
              // const zipCodes = locations.map(loc => loc.zip_code);
              // setFilters({ ...filters, zipCodes });
          // }
          await onFilterSubmit(filters);
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
      // setFilters({ ...filters, zipCodes: [] });
      // setState(false);
      setIsFilterOpen(false);

    };
  // const getCityStateCoordinates = async (city, state) => {
  //   try {
  //       // Use first location as city center
  //       const response = await fetch(`${process.env.REACT_APP_FETCH_REWARDS}/locations/search`, {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify({
  //               city: city,
  //               states: [state],
  //               size: 1
  //           }),
  //           credentials: 'include'
  //       });

  //       if (!response.ok) {
  //           throw new Error('Unable to get city coordinates');
  //       }

  //       const data = await response.json();
  //       if (data.results && data.results.length > 0) {
  //           return {
  //               latitude: data.results[0].latitude,
  //               longitude: data.results[0].longitude
  //           };
  //       }
  //       throw new Error('No coordinates found for city/state');
  //   } catch (error) {
  //       console.error('Error getting city coordinates:', error);
  //       throw error;
  //   }
  // };

  // const searchLocations = async (searchParams) => {
  //   try {
  //       // Get coordinates for the first selected state and city
  //       const coordinates = await getCityStateCoordinates(
  //           searchParams.city,
  //           searchParams.states[0]
  //       );

  //       // Calculate bounding box based on city center
  //       const boundingBox = calculateBoundingBox(
  //           coordinates.latitude,
  //           coordinates.longitude,
  //           searchParams.distance
  //       );

  //       const params = {
  //           city: searchParams.city,
  //           states: searchParams.states,
  //           geoBoundingBox: boundingBox,
  //           size: searchParams.size || 10
  //       };

  //       const response = await fetch(`${process.env.REACT_APP_FETCH_REWARDS}/locations/search`, {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify(params),
  //           credentials: 'include'
  //       });

  //       if (!response.ok) {
  //           throw new Error('Location search failed');
  //       }

  //       const data = await response.json();
  //       return data.results;

  //   } catch (error) {
  //       console.error('Location search error:', error);
  //       throw error;
  //   }
  // };
    const list = () => (
      <Box
        sx={{ width: 'auto' }}
        role="presentation"
        // onClick={toggleDrawer(false)}
        // onKeyDown={toggleDrawer(false)}
      >
        {/* <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          >
              {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                      {option.label}
                  </MenuItem>
              ))}
          </Select>
        </FormControl> */}
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
        {/* <Typography variant="h6">Location Search</Typography>
        
        <TextField
            fullWidth
            label="City"
            value={filters.location.city}
            onChange={(e) => setFilters({
                ...filters,
                location: { ...filters.location, city: e.target.value }
            })}
            sx={{ mt: 2 }}
        /> */}

        {/* <Autocomplete
            multiple
            options={[
                'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
                'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
                'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
                'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
                'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
            ]}
            value={filters.location.states}
            onChange={(_, newValue) => setFilters({
                ...filters,
                location: { ...filters.location, states: newValue }
            })}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="States"
                    placeholder="Select states"
                    sx={{ mt: 2 }}
                />
            )}
        /> */}
        {/* <Autocomplete
          options={[
              'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
              'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
              'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
              'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
              'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
          ]}
          value={filters.location.states[0] || null}
          onChange={(_, newValue) => setFilters({
              ...filters,
              location: { 
                  ...filters.location, 
                  states: newValue ? [newValue] : [] 
              }
          })}
          renderInput={(params) => (
              <TextField
                  {...params}
                  label="Select State"
                  placeholder="Choose a state"
                  sx={{ mt: 2 }}
              />
          )}
      /> */}
        {/* <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Search Distance</InputLabel>
            <Select
                value={filters.location.distance}
                onChange={(e) => setFilters({
                    ...filters,
                    location: { 
                        ...filters.location, 
                        distance: e.target.value 
                    }
                })}
            >
                {distanceOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl> */}
        <List>
          {/* <ListItem key='Breed' disablePadding> */}
              {/* <Autocomplete
                multiple
                id="breeds-checkbox"
                options={breeds ?? []}
                value={filters.breeds}
                onChange={(_, newValue) => setFilters({ ...filters, breeds: newValue })}
                disableCloseOnSelect
                getOptionLabel={(option) => option}
                renderOption={(props, option, { selected }) => {
                  const { key, ...optionProps } = props;
                  return (
                    <li key={key} {...optionProps}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option}
                    </li>
                  );
                }}
                style={{ width: 500 }}
                renderInput={(params) => (
                  <TextField {...params} label="Breeds" placeholder="Breeds" />
                )}
              /> */}
          {/* </ListItem> */}

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
                    sx={{ mt: 2 }}
                />
            )}
          />

          <Box sx={{ mt: 2 }}>
              <Typography>Age Range</Typography>
              <Slider
                  value={filters.age}
                  onChange={(_, newValue) => setFilters({ ...filters, age: newValue })}
                  valueLabelDisplay="auto"
                  min={0}
                  max={25}
              />
          </Box>

          <TextField
              sx={{ mt: 2 }}
              fullWidth
              label="ZIP Code"
              value={filters.zipCodes[0] || ''}
              onChange={(e) => setFilters({ ...filters, zipCodes: [e.target.value] })}
          />
          {/* <Autocomplete
              multiple
              freeSolo
              options={[]} // Empty array as options since it's free input
              value={filters.zipCodes}
              onChange={handleZipCodeChange}
              renderTags={(value, getTagProps) =>
                  value.map((zip, index) => (
                      <Chip
                          label={zip}
                          {...getTagProps({ index })}
                          color={isValidZipCode(zip) ? "default" : "error"}
                      />
                  ))
              }
              renderInput={(params) => (
                  <TextField
                      {...params}
                      label="ZIP Codes"
                      placeholder="Enter ZIP code"
                      helperText="Enter 5-digit ZIP codes"
                      error={filters.zipCodes.some(zip => !isValidZipCode(zip))}
                  />
              )}
          /> */}
          <Button
              sx={{ mt: 2 }}
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
        </List>
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
            bgcolor: 'background.paper',
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
