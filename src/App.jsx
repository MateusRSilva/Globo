// src/App.js
import './App.css';
import React, { useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import * as THREE from 'three';

const App = () => {
  const globeEl = useRef();
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [country, setCountry] = useState('');
  const [pinData, setPinData] = useState([]);

  const handleClick = async (event) => {
    const { lat, lng } = event;
    setCoordinates({ lat, lng });
    await fetchCountry(lat, lng);
    setPinData([{ lat, lng }]); // Atualiza o pino com a nova localização
  };

  const fetchCountry = async (lat, lng) => {
    const apiKey = '3b9fa8b982804ad8955d83e574d0884b';
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}&no_annotations=1`;

    try {
      const response = await axios.get(url);
      const results = response.data.results[0];
      const country = results.components.country;
      const state = results.components.state || results.components.province;

      setCountry(`${country}, ${state}`);
    } catch (error) {
      console.error('Error fetching country:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Globo Interativo</h1>
      <div style={{ overflow: 'hidden', borderRadius: '50%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -20%)' }}>
        <Globe
          ref={globeEl}
          width={400}
          height={400}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          backgroundColor="#0010"
          onGlobeClick={handleClick}
          objectsData={pinData}
          objectLat={(d) => d.lat}
          objectLng={(d) => d.lng}
          objectAltitude={0.01} // Define a altitude do pino
          objectThreeObject={() => {
            const pinGeometry = new THREE.CylinderGeometry(1.4, 0.1, 10, 8); // Geometria de cilindro para simular uma gota
            const pinMaterial = new THREE.MeshStandardMaterial({ color: 'red' });
            const pin = new THREE.Mesh(pinGeometry, pinMaterial);
            pin.rotation.x = Math.PI / 2; // Rotaciona o cilindro para que fique na vertical
            return pin;
          }}
        />
      </div>

      {coordinates.lat && coordinates.lng ? (
        <div>
          <h2>Coordenadas do Ponto Clicado:</h2>
          <p>Latitude: {coordinates.lat.toFixed(2)}</p>
          <p>Longitude: {coordinates.lng.toFixed(2)}</p>
          {country ? (
            <div>
              <h3>País: {country}</h3>
            </div>
          ) : <CircularProgress color="inherit" />}
        </div>
      ) : <h2>Selecione um Local:</h2>}
    </div>
  );
};

export default App;
