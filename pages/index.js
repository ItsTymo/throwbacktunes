// pages/index.js
import Head from 'next/head';
import { useState } from 'react';
import MusicPreferences from '../components/MusicPreferences';
import supabase from '../lib/supabase';

export default function Home() {
  const [showPreferences, setShowPreferences] = useState(true);
  const [recommendation, setRecommendation] = useState(null);

  const handlePreferences = async (preferences) => {
    console.log('User preferences:', preferences);
    setShowPreferences(false);
    
    // Get a recommendation from the database based on preferences
    try {
      // Prepare arrays of selected decades and genres for querying
      const decadeQueries = preferences.decades;
      
      // Create a single array of all selected genres across all decades
      let genreQueries = [];
      Object.keys(preferences.genres).forEach(decade => {
        if (Array.isArray(preferences.genres[decade])) {
          genreQueries = [...genreQueries, ...preferences.genres[decade]];
        }
      });
      
      // Remove duplicates from genres array
      genreQueries = [...new Set(genreQueries)];
      
      // Query for songs that match both a selected decade AND a selected genre
      let query = supabase
        .from('songs')
        .select('*')
        .in('decade', decadeQueries);
        
      // Only filter by genre if genres were selected
      if (genreQueries.length > 0) {
        query = query.in('genre', genreQueries);
      }
      
      let { data: matchingSongs, error } = await query;
      
      if (error) throw error;
      
      if (matchingSongs && matchingSongs.length > 0) {
        // Pick a random song from the matches
        const randomIndex = Math.floor(Math.random() * matchingSongs.length);
        const randomSong = matchingSongs[randomIndex];
        setRecommendation(randomSong);
      } else {
        // No matches found, try a broader search just based on decades
        let { data: decadeSongs, error: decadeError } = await supabase
          .from('songs')
          .select('*')
          .in('decade', decadeQueries);
          
        if (decadeError) throw decadeError;
        
        if (decadeSongs && decadeSongs.length > 0) {
          // Found songs in the selected decades
          const randomIndex = Math.floor(Math.random() * decadeSongs.length);
          const randomSong = decadeSongs[randomIndex];
          setRecommendation(randomSong);
        } else {
          // Still no matches, use fallback
          console.log('No matches found, using fallback song');
          setRecommendation({
            title: "Billie Jean",
            artist: "Michael Jackson",
            decade: "80s",
            genre: "Pop",
            youtube_url: "https://www.youtube.com/watch?v=Zi_XLOBDo_Y"
          });
        }
      }
    } catch (error) {
      console.error('Error getting song recommendation:', error);
      // Show fallback recommendation
      setRecommendation({
        title: "Billie Jean",
        artist: "Michael Jackson",
        decade: "80s",
        genre: "Pop",
        youtube_url: "https://www.youtube.com/watch?v=Zi_XLOBDo_Y"
      });
    }
  };

  return (
    <>
      <Head>
        <title>Throwback Tunes</title>
        <meta name="description" content="Rediscover your favorite music from past decades" />
      </Head>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Throwback Tunes</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>Rediscover your favorite music from past decades</p>
        
        {showPreferences && (
          <MusicPreferences onSubmit={handlePreferences} />
        )}
        
        {recommendation && (
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '15px' }}>Your Throwback Tune</h2>
            <h3>{recommendation.title}</h3>
            <p style={{ marginBottom: '15px' }}>By {recommendation.artist} • {recommendation.decade} • {recommendation.genre}</p>
            
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%' }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src={recommendation && recommendation.youtube_url ? 
                  `https://www.youtube.com/embed/${recommendation.youtube_url.includes('v=') ? 
                    recommendation.youtube_url.split('v=')[1] : 
                    recommendation.youtube_url.split('/').pop()}` : 
                  ''}
                title={recommendation ? recommendation.title : ''}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={() => {
                  setShowPreferences(true);
                  setRecommendation(null);
                }}
                style={{
                  backgroundColor: '#6E56CF',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Try Different Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}