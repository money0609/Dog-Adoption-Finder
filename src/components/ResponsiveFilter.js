import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, Button, Typography, FormControl, Slider, SwipeableDrawer, List, ListItem, InputLabel, ListItemIcon, Select, MenuItem, Box } from '@mui/material';

import PetsIcon from '@mui/icons-material/Pets';
import FilterListIcon from '@mui/icons-material/FilterList';

export default function Filter({breeds, onFilterSubmit}) {
    const [state, setState] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const sortOptions = [
      { value: 'breed:asc', label: 'Breed: A to Z' },
      { value: 'breed:desc', label: 'Breed: Z to A' },
      { value: 'age:asc', label: 'Age: Youngest First' },
      { value: 'age:desc', label: 'Age: Oldest First' },
      { value: 'name:asc', label: 'Name: A to Z' },
      { value: 'name:desc', label: 'Name: Z to A' },
      { value: 'zip_code:asc', label: 'ZIP Code: Ascending' },
      { value: 'zip_code:desc', label: 'ZIP Code: Descending' }
    ];
    const [filters, setFilters] = useState({ 
      breeds: [], 
      age: [0, 25],
      zipCode: '',
      sort: 'breed:asc',
      location: {
          city: '',
          states: []
      }
    });
    const toggleDrawer = (open) => (event) => {
      if (
        event &&
        event.type === 'keydown' &&
        (event.key === 'Tab' || event.key === 'Shift')
      ) {
        return;
      }
  
      setState(open);
    };

    const handleSubmit = async () => {
      setIsSubmitting(true);
      try {
          await onFilterSubmit(filters);
      } catch (error) {
          console.error('Filter submission error:', error);
      } finally {
          setIsSubmitting(false);
      }
  };

    const list = () => (
      <Box
        sx={{ width: 'auto' }}
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
        <Typography variant="h6">Location Search</Typography>
        
        <TextField
            fullWidth
            label="City"
            value={filters.location.city}
            onChange={(e) => setFilters({
                ...filters,
                location: { ...filters.location, city: e.target.value }
            })}
            sx={{ mt: 2 }}
        />
        <Autocomplete
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
      />
        <List>
          <ListItem key='Breed' disablePadding>
              <ListItemIcon>
                  <PetsIcon color="primary" />
              </ListItemIcon>
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
          </ListItem>
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
              maxLength={5}
              label="ZIP Code"
              value={filters.zipCode}
              onChange={(e) => setFilters({ ...filters, zipCode: e.target.value })}
          />
          <Button
              sx={{ mt: 2 }}
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting}
          >
              {isSubmitting ? 'Applying Filters...' : 'Apply Filters'}
          </Button>
        </List>
      </Box>
    );
  
    return (
      <div>
        {
          <React.Fragment key='left'>
            <Button id='filter_sort_button' onClick={toggleDrawer(true)}>Filter & Sort <FilterListIcon/></Button>
            <SwipeableDrawer
              anchor='left'
              open={state}
              onClose={toggleDrawer(false)}
              onOpen={toggleDrawer(true)}
            >
              {list()}
            </SwipeableDrawer>
          </React.Fragment>
        }
      </div>
    );
  }

