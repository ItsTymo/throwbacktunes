// pages/api/frame.js
import supabase from '../../lib/supabase';

export default async function handler(req, res) {
  // Only accept POST requests from Farcaster clients
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Get a random song recommendation
    let { data: songs, error } = await supabase
      .from('songs')
      .select('*')
      .limit(100);
    
    if (error) throw error;
    
    if (!songs || songs.length === 0) {
      throw new Error('No songs found in database');
    }
    
    // Pick a random song
    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    
    // Create a frame response with the song
    return res.status(200).json({
      frames: {
        version: 'vNext',
        image: `https://throwbacktunes.vercel.app/api/og?title=${encodeURIComponent(randomSong.title)}&artist=${encodeURIComponent(randomSong.artist)}&decade=${encodeURIComponent(randomSong.decade)}&genre=${encodeURIComponent(randomSong.genre)}`,
        buttons: [
          {
            label: "Get Another Song",
            action: "post"
          },
          {
            label: "Listen on YouTube",
            action: "link",
            target: randomSong.youtube_url
          }
        ]
      }
    });
  } catch (error) {
    console.error('Error in frame handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}