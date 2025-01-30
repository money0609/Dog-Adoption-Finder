import React, { useState, useEffect } from 'react';

function Search() {
    const [dogs, setDogs] = useState([]);
    const [filteredDogs, setFilteredDogs] = useState([]);
    const [breed, setBreed] = useState('');
    const [breeds, setBreeds] = useState('');
    let isMounted = true;
    useEffect(() => {
        const fetchDogs = async () => {
            if (isMounted) {
                isMounted = false;
                try {
                    await get_available_breeds();
                    let search_dogs_ids_response = await search_dogs_ids(`${process.env.REACT_APP_SEARCH_DOGS_IDS_ENDPOINT}?from=0&size=10000&sort=breed:asc`);

                    // get_dogs_by_ids based on pagination
                    await get_dogs_by_ids(search_dogs_ids_response.resultIds.slice(0, 100));
                    while (search_dogs_ids_response && search_dogs_ids_response.next) {
                        search_dogs_ids_response = await search_dogs_ids(search_dogs_ids_response.next);
                        await get_dogs_by_ids(search_dogs_ids_response.resultIds.slice(0, 100));
                    }
                    
                } catch (error) {
                    console.error('Error fetching dogs information:', error);
                }
            }
        };

        fetchDogs();
    }, []);

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
        if (selectedBreed === '') {
            setFilteredDogs(dogs);
        } else {
            const filtered = dogs.filter(dog => dog.breed.toLowerCase().includes(selectedBreed.toLowerCase()));
            setFilteredDogs(filtered);
        }
    };

    return (
        <div className="search">
            <h1>Search</h1>
            <div>
                <label htmlFor="breed">Filter by breed:</label>
                <input
                    type="text"
                    id="breed"
                    value={breed}
                    onChange={handleFilterChange}
                    placeholder="Enter breed"
                />
            </div>
            <div className="dog-list">
                {filteredDogs && filteredDogs?.map(dog => (
                    <div key={dog.id} className="dog-item">
                        <img src={dog.img} alt={dog.name} width="200" />
                        <h2>{dog.name}</h2>
                        <p>Breed: {dog.breed}</p>
                        <p>Age: {dog.age}</p>
                        <p>Area Zip: {dog.zip_code}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Search;