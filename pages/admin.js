import React, { useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import Papa from 'papaparse';

export default function AdminPage() {
  const [songs, setSongs] = useState([]);
  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    decade: '80s',
    genre: 'Pop',
    youtube_url: ''
  });
  const [filterDecade, setFilterDecade] = useState('all');
  const [filterGenre, setFilterGenre] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const { data, error } = await supabase
          .from('songs')
          .select('*');
        
        if (error) {
          console.error('Error fetching songs:', error);
        } else {
          setSongs(data || []);
        }
      } catch (err) {
        console.error('Error in fetchSongs:', err);
      }
    };
    
    fetchSongs();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSong(prev => ({ ...prev, [name]: value }));
  };
  
  const addSong = async (e) => {
    e.preventDefault();
    
    try {
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
        
        // Refresh songs list
        const { data: updatedSongs } = await supabase
          .from('songs')
          .select('*');
        
        setSongs(updatedSongs || []);
      }
    } catch (err) {
      console.error('Error in addSong:', err);
    }
  };
  
  const deleteSong = async (id) => {
    try {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting song:', error);
      } else {
        // Refresh songs list
        const { data: updatedSongs } = await supabase
          .from('songs')
          .select('*');
        
        setSongs(updatedSongs || []);
      }
    } catch (err) {
      console.error('Error in deleteSong:', err);
    }
  };
  
  // Handle CSV file upload and processing
  const handleCsvUpload = async (e) => {
    e.preventDefault();
    
    if (!csvFile) {
      alert('Please select a CSV file first');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      const csv = target.result;
      const results = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true
      });
      
      // Check if data has the required columns
      const requiredColumns = ['title', 'artist', 'decade', 'genre', 'youtube_url'];
      const csvColumns = results.meta.fields;
      const missingColumns = requiredColumns.filter(col => !csvColumns.includes(col));
      
      if (missingColumns.length > 0) {
        alert(`CSV is missing required columns: ${missingColumns.join(', ')}`);
        return;
      }
      
      // Process the data
      try {
        // Insert each row into Supabase
        const { data, error } = await supabase
          .from('songs')
          .insert(results.data);
          
        if (error) throw error;
        
        alert(`Successfully imported ${results.data.length} songs!`);
        
        // Refresh the songs list
        const { data: updatedSongs } = await supabase
          .from('songs')
          .select('*');
        
        setSongs(updatedSongs || []);
        setCsvFile(null);
        
        // Reset the file input
        const fileInput = document.getElementById('csv-file');
        if (fileInput) fileInput.value = '';
        
      } catch (err) {
        console.error('Error importing CSV data:', err);
        alert(`Error importing CSV: ${err.message}`);
      }
    };
    
    reader.readAsText(csvFile);
  };
  
  // Filter songs based on the selected filters and search term
  const filteredSongs = songs.filter(song => {
    const matchesDecade = filterDecade === 'all' || song.decade === filterDecade;
    const matchesGenre = filterGenre === 'all' || song.genre === filterGenre;
    const matchesSearch = searchTerm === '' || 
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDecade && matchesGenre && matchesSearch;
  });
  
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
      
      {/* CSV Upload Section */}
      <div style={{ marginTop: '40px', marginBottom: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Bulk Import Songs</h2>
        <p>Upload a CSV file with columns: title, artist, decade, genre, youtube_url</p>
        
        <form onSubmit={handleCsvUpload} style={{ marginTop: '15px' }}>
          <div style={{ marginBottom: '15px' }}>
            <input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files[0])}
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}
            />
          </div>
          
          <button
            type="submit"
            disabled={!csvFile}
            style={{
              backgroundColor: csvFile ? '#22C55E' : '#ccc',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: csvFile ? 'pointer' : 'not-allowed'
            }}
          >
            Import Songs
          </button>
        </form>
        
        <div style={{ marginTop: '15px', fontSize: '14px' }}>
          <p><strong>Note:</strong> Make sure your CSV has headers matching the required column names.</p>
          <p><strong>Tip:</strong> For decades, use: 70s, 80s, 90s, 00s, 10s</p>
        </div>
      </div>
      
      <div style={{ marginTop: '50px' }}>
        <h2>Song Database ({songs.length} songs)</h2>
        
        {/* Filtering controls */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <label>Filter by Decade:</label>
          <select 
            value={filterDecade} 
            onChange={(e) => setFilterDecade(e.target.value)}
            style={{ padding: '5px' }}
          >
            <option value="all">All Decades</option>
            <option value="70s">70s</option>
            <option value="80s">80s</option>
            <option value="90s">90s</option>
            <option value="00s">00s</option>
            <option value="10s">10s</option>
          </select>
          
          <label style={{ marginLeft: '20px' }}>Filter by Genre:</label>
          <select 
            value={filterGenre} 
            onChange={(e) => setFilterGenre(e.target.value)}
            style={{ padding: '5px' }}
          >
            <option value="all">All Genres</option>
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
          
          <input
            type="text"
            placeholder="Search by title or artist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginLeft: '20px', padding: '5px', width: '200px' }}
          />
        </div>
        
        <p>Showing {filteredSongs.length} of {songs.length} songs</p>
        
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
            {filteredSongs.map(song => (
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