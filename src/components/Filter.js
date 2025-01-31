import React, { useState, useEffect } from 'react';
import { Checkbox, TextField, Autocomplete, Button, Typography, FormControl, Slider, SwipeableDrawer, Divider, List, ListItem, InputLabel, ListItemIcon, Select, MenuItem, Box, Chip } from '@mui/material';

import PetsIcon from '@mui/icons-material/Pets';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

export default function Filter({breeds, onFilterSubmit}) {
  console.log(breeds);
    const [state, setState] = useState(false);
    // const [selectedBreeds, setSelectedBreeds] = useState([]);
    // const [age, setAge] = useState([0, 20]);
    // const [zipCode, setZipCode] = useState('');
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
      { value: 'zip_code:asc', label: 'ZIP Code: Ascending' },
      { value: 'zip_code:desc', label: 'ZIP Code: Descending' }
    ];
    const [filters, setFilters] = useState({ 
      breeds: [], 
      age: [0, 25],
      zipCodes: [],
      sort: 'breed:asc'
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

    const isValidZipCode = (zip) => /^\d{5}$/.test(zip);
    // Add handler for zip codes
    const handleZipCodeChange = (event, newValue) => {
      // Remove any duplicates and invalid zip codes
      const validZips = [...new Set(newValue)]
        .filter(zip => isValidZipCode(zip));
      setFilters({ ...filters, zipCodes: validZips });
    };
    const handleSubmit = async () => {
      setIsSubmitting(true);
      await onFilterSubmit(filters);
      setIsSubmitting(false);
    };

    const list = () => (
      <Box
        sx={{ width: 'auto' }}
        role="presentation"
        // onClick={toggleDrawer(false)}
        // onKeyDown={toggleDrawer(false)}
      >
        <FormControl fullWidth sx={{ mt: 2 }}>
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
        </FormControl>
        <List>
          <ListItem key='Breed' disablePadding>
              <ListItemIcon>
                  <PetsIcon color="primary" />
              </ListItemIcon>
              <Autocomplete
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

          {/* <TextField
              sx={{ mt: 2 }}
              fullWidth
              label="ZIP Code"
              value={filters.zipCode}
              onChange={(e) => setFilters({ ...filters, zipCode: e.target.value })}
          /> */}
          <Autocomplete
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
            <Button onClick={toggleDrawer(true)}>Filter & Sort <FilterListIcon/></Button>
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

