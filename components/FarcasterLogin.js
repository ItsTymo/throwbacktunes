import React, { useState } from 'react';
import MusicPreferences from './MusicPreferences';
import supabase from '../lib/supabase';

export default function FarcasterLogin() {
  const [user, setUser] = useState(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  
  const handleLogin = async () => {
    // In a real implementation, this would use actual Farcaster auth
    const mockUserData = {
      fid: "123456",
      displayName: "Test User",
      pfp: { url: "https://i.pravatar.cc/150?img=3" }
    };
    
    // Save user to Supabase
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          farcaster_id: mockUserData.fid,
          username: mockUserData.displayName,
          profile_image_url: mockUserData.pfp.url
        }, { onConflict: 'farcaster_id' });
      
      if (error) throw error;
      console.log('User saved to Supabase:', data);
    } catch (error) {
      console.error('Error saving user:', error);
    }
    
    setUser(mockUserData);
  };
  
  const handlePreferences = async (preferences) => {
    console.log('User preferences:', preferences);
    
    // Save preferences to Supabase
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.fid, // In a real app, this would be the Supabase user ID
          selected_decades: preferences.decades,
          selected_genres: preferences.genres
        }, { onConflict: 'user_id' });
      
      if (error) throw error;
      console.log('Preferences saved to Supabase:', data);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
    
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
      
      console.log('Querying for decades:', decadeQueries);
      console.log('Querying for genres:', genreQueries);
      
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
      
      console.log('Matching songs found:', matchingSongs ? matchingSongs.length : 0);
      
      if (error) throw error;
      
      if (matchingSongs && matchingSongs.length > 0) {
        // Pick a random song from the matches
        const randomIndex = Math.floor(Math.random() * matchingSongs.length);
        const randomSong = matchingSongs[randomIndex];
        console.log('Selected random song:', randomSong);
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
          console.log('Selected random song from decade only:', randomSong);
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
    <div>
      {!user ? (
        <button 
          onClick={handleLogin}
          style={{
            backgroundColor: '#6E56CF',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Connect with Farcaster
        </button>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <img 
              src={user.pfp.url} 
              alt="Profile" 
              width={40} 
              height={40} 
              style={{ borderRadius: '50%' }}
            />
            <p>Welcome, {user.displayName}!</p>
          </div>
          
          {!showPreferences && !recommendation && (
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={() => setShowPreferences(true)}
                style={{
                  backgroundColor: '#6E56CF',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Set Music Preferences
              </button>
            </div>
          )}
          
          {showPreferences && (
            <MusicPreferences onSubmit={handlePreferences} />
          )}
          
          {recommendation && (
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px', maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ marginBottom: '15px' }}>Your Throwback Tune</h2>
              <h3>{recommendation.title}</h3>
              <p style={{ marginBottom: '15px' }}>By {recommendation.artist} • {recommendation.decade} • {recommendation.genre}</p>
              
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%' }}>
              // Update this part of your FarcasterLogin component
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
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                >
                  Try Different Preferences
                </button>
                
                <button
                  onClick={() => setUser(null)}
                  style={{
                    backgroundColor: '#EF4444',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}