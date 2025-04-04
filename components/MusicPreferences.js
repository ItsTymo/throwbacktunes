import React, { useState } from 'react';

export default function MusicPreferences({ onSubmit }) {
  const [selectedDecades, setSelectedDecades] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState({});
  
  const decades = ['70s', '80s', '90s', '00s', '10s'];
  const genresByDecade = {
    '70s': ['Rock', 'Disco', 'Funk', 'Soul', 'Pop'],
    '80s': ['New Wave', 'Pop', 'Rock', 'Hip-Hop', 'Metal'],
    '90s': ['Grunge', 'R&B', 'Hip-Hop', 'Pop', 'Alternative'],
    '00s': ['Pop', 'R&B', 'Hip-Hop', 'Rock', 'Electronic'],
    '10s': ['EDM', 'Hip-Hop', 'Pop', 'Indie', 'R&B']
  };
  
  const toggleDecade = (decade) => {
    setSelectedDecades(prev => {
      if (prev.includes(decade)) {
        // If already selected, remove it
        const newSelected = prev.filter(d => d !== decade);
        
        // Also remove any genres from this decade
        const newGenres = {...selectedGenres};
        delete newGenres[decade];
        setSelectedGenres(newGenres);
        
        return newSelected;
      } else {
        // Add the decade if not already selected
        return [...prev, decade];
      }
    });
  };
  
  const toggleGenre = (decade, genre) => {
    setSelectedGenres(prev => {
      const decadeGenres = prev[decade] || [];
      
      if (decadeGenres.includes(genre)) {
        // Remove genre if already selected
        const newDecadeGenres = decadeGenres.filter(g => g !== genre);
        return {
          ...prev,
          [decade]: newDecadeGenres.length > 0 ? newDecadeGenres : undefined
        };
      } else {
        // Add genre if not already selected
        return {
          ...prev,
          [decade]: [...decadeGenres, genre]
        };
      }
    });
  };
  
  const handleSubmit = () => {
    onSubmit({
      decades: selectedDecades,
      genres: selectedGenres
    });
  };
  
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Select Your Music Preferences</h2>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>Choose your favorite decades:</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
          {decades.map(decade => (
            <button
              key={decade}
              onClick={() => toggleDecade(decade)}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedDecades.includes(decade) ? '#6E56CF' : '#f0f0f0',
                color: selectedDecades.includes(decade) ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {decade}
            </button>
          ))}
        </div>
      </div>
      
      {selectedDecades.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3>Choose genres for each decade:</h3>
          
          {selectedDecades.map(decade => (
            <div key={decade} style={{ marginTop: '15px' }}>
              <h4>{decade}</h4>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                {genresByDecade[decade].map(genre => (
                  <button
                    key={`${decade}-${genre}`}
                    onClick={() => toggleGenre(decade, genre)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: selectedGenres[decade]?.includes(genre) ? '#6E56CF' : '#f0f0f0',
                      color: selectedGenres[decade]?.includes(genre) ? 'white' : 'black',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button
        onClick={handleSubmit}
        disabled={selectedDecades.length === 0}
        style={{
          padding: '10px 20px',
          backgroundColor: selectedDecades.length > 0 ? '#22C55E' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: selectedDecades.length > 0 ? 'pointer' : 'not-allowed',
          marginTop: '20px'
        }}
      >
        Get My Throwback Tune
      </button>
    </div>
  );
}