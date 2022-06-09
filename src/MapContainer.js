import React, { useState, useRef } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
  Autocomplete,
} from '@react-google-maps/api';
import { Box, Skeleton, Grid, TextField, Button } from '@mui/material';

//6.881576199114379, 79.91238178360855
const center = { lat: 6.881576199114379, lng: 79.91238178360855 };

const mapStyles = {
  height: '100vh',
  width: '100%',
};

const svg =
  'M 24.962891 1.0546875 A 1.0001 1.0001 0 0 0 24.384766 1.2636719 L 1.3847656 19.210938 A 1.0005659 1.0005659 0 0 0 2.6152344 20.789062 L 4 19.708984 L 4 46 A 1.0001 1.0001 0 0 0 5 47 L 18.832031 47 A 1.0001 1.0001 0 0 0 19.158203 47 L 30.832031 47 A 1.0001 1.0001 0 0 0 31.158203 47 L 45 47 A 1.0001 1.0001 0 0 0 46 46 L 46 19.708984 L 47.384766 20.789062 A 1.0005657 1.0005657 0 1 0 48.615234 19.210938 L 41 13.269531 L 41 6 L 35 6 L 35 8.5859375 L 25.615234 1.2636719 A 1.0001 1.0001 0 0 0 24.962891 1.0546875 z M 25 3.3222656 L 44 18.148438 L 44 45 L 32 45 L 32 26 L 18 26 L 18 45 L 6 45 L 6 18.148438 L 25 3.3222656 z M 37 8 L 39 8 L 39 11.708984 L 37 10.146484 L 37 8 z M 20 28 L 30 28 L 30 45 L 20 45 L 20 28 z';

const zoom = 12;

const options = {
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

const MapContainer = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });
  const icon = {
    path: 'M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z', // svg here
    // path: svg,
    fillColor: '#ff0000',
    fillOpacity: 0.6,
    // eslint-disable-next-line no-undef
    // anchor: google.maps.Point(15, 30),
    strokeWeight: 0,
    scale: 2,
  };
  const originRef = useRef();
  const destiantionRef = useRef();

  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  async function calculateRoute() {
    console.log(origin);
    console.log(destination);
    if (origin === '' || destination === '') {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: origin,
      destination: destination,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    originRef.current.value = '';
    destiantionRef.current.value = '';
  }

  if (!isLoaded) {
    return (
      <Skeleton
        sx={{ bgcolor: 'grey.900' }}
        variant='rectangular'
        width={'100%'}
        height={'100vh'}
      />
    );
  }

  return (
    <Grid container>
      <Grid
        container
        item
        xs={12}
        md={12}
        lg={12}
        spacing={2}
        sx={{
          marginTop: '1rem',
          marginBottom: '1rem',
          FlexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Grid item>
          <Autocomplete>
            <TextField
              id='origin'
              label='Origin'
                ref={originRef}
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
          </Autocomplete>
        </Grid>
        <Grid item>
          <Autocomplete>
            <TextField
              id='destination'
              label='Destination'
                ref={destiantionRef}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </Autocomplete>
        </Grid>
        <Grid item>
          <Button variant='contained' color='primary' onClick={calculateRoute}>
            Calculate Route
          </Button>
        </Grid>
        <Grid item>
          <Button variant='contained' color='primary' onClick={clearRoute}>
            clear Route
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              map.panTo(center);
              map.setZoom(zoom);
            }}
          >
            Center Map
          </Button>
        </Grid>
      </Grid>
      {/* Google Map Box */}
      <Grid item xs={12} md={12} lg={12}>
        <GoogleMap
          center={center}
          zoom={zoom}
          mapContainerStyle={mapStyles}
          options={options}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} icon={icon} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Grid>
      {/* Distance and Duration Box */}
    </Grid>
  );
};
export default MapContainer;
