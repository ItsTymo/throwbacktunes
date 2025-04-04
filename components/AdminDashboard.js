import React, { useState, useEffect } from 'react';
import supabase from '../lib/supabase';

export default function AdminDashboard() {
  const [songs, setSongs] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    decade: '80s',
    genre: 'Pop',
    youtube_url: ''
  });
  
  // Check if current user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('farcaster_id', '298138'); // Replace with your Farcaster ID
      
      if (data && data.length > 0) {
        setIsAdmin(true);
        fetchSongs();
      }
    };
    
    checkAdmin();
  }, []);
  
  const fetchSongs = async () => {
    const { data, error } = await supabase
      .from('songs')
      .select('*');
    
    if (error) {
      console.error('Error fetching songs:', error);
    } else {
      setSongs(data || []);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSong(prev => ({ ...prev, [name]: value }));
  };
  
  const addSong = async (e) => {
    e.preventDefault();
    
    const { data, error } = await supabase
      .from('songs')
      .insert([newSong]);
    
    if (error) {
      console.error('Error adding song:', error);
    } else {
      console.log('Song added successfully:', data);
      setNewSong({
        title: '',
        artist: '',
        decade: '80s',
        genre: 'Pop',
        youtube_url: ''
      });
      fetchSongs();
    }
  };
  
  const deleteSong = async (id) => {
    const { error } = await supabase
      .from('songs')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting song:', error);
    } else {
      fetchSongs();
    }
  };
  
  if (!isAdmin) {
    return <div>Access denied. Admin privileges required.</div>;
  }
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      
      <div style={{ marginTop: '30px' }}>
        <h2>Add New Song</h2>
        <form onSubmit={addSong} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label>Title:</label>
            <input 
              type="text" 
              name="title" 
              value={newSong.title} 
              onChange={handleInputChange} 
              required 
              style={{ marginLeft: '10px', padding: '5px', width: '300px' }}
            />
          </div>
          
          <div>
            <label>Artist:</label>
            <input 
              type="text" 
              name="artist" 
              value={newSong.artist} 
              onChange={handleInputChange} 
              required 
              style={{ marginLeft: '10px', padding: '5px', width: '300px' }}
            />
          </div>
          
          <div>
            <label>Decade:</label>
            <select 
              name="decade" 
              value={newSong.decade} 
              onChange={handleInputChange} 
              style={{ marginLeft: '10px', padding: '5px' }}
            >
              <option value="70s">70s</option>
              <option value="80s">80s</option>
              <option value="90s">90s</option>
              <option value="00s">00s</option>
              <option value="10s">10s</option>
            </select>
          </div>
          
          <div>
            <label>Genre:</label>
            <select 
              name="genre" 
              value={newSong.genre} 
              onChange={handleInputChange} 
              style={{ marginLeft: '10px', padding: '5px' }}
            >
              <option value="Rock">Rock</option>
              <option value="Pop">Pop</option>
              <option value="Hip-Hop">Hip-Hop</option>
              <option value="R&B">R&B</option>
              <option value="Disco">Disco</option>
              <option value="Funk">Funk</option>
              <option value="Soul">Soul</option>
              <option value="New Wave">New Wave</option>
              <option value="Metal">Metal</option>
              <option value="Grunge">Grunge</option>
              <option value="Alternative">Alternative</option>
              <option value="Electronic">Electronic</option>
              <option value="EDM">EDM</option>
              <option value="Indie">Indie</option>
            </select>
          </div>
          
          <div>
            <label>YouTube URL:</label>
            <input 
              type="url" 
              name="youtube_url" 
              value={newSong.youtube_url} 
              onChange={handleInputChange} 
              required 
              style={{ marginLeft: '10px', padding: '5px', width: '400px' }}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          
          <button 
            type="submit" 
            style={{
              backgroundColor: '#22C55E', 
              color: 'white', 
              padding: '10px', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer',
              width: '150px'
            }}
          >
            Add Song
          </button>
        </form>
      </div>
      
      <div style={{ marginTop: '50px' }}>
        <h2>Song Database ({songs.length} songs)</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Title</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Artist</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Decade</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Genre</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {songs.map(song => (
              <tr key={song.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{song.title}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{song.artist}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{song.decade}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{song.genre}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <button 
                    onClick={() => deleteSong(song.id)}
                    style={{
                      backgroundColor: '#EF4444', 
                      color: 'white', 
                      padding: '5px 10px', 
                      border: 'none', 
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}