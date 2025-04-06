// pages/api/frame.js
import supabase from '../../lib/supabase';

export default async function handler(req, res) {
  // Set cache control headers
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.setHeader('X-Frame-Options', 'ALLOW-FROM https://warpcast.com/');
  
  // Handle GET requests (for validation)
  if (req.method === 'GET') {
    return res.status(200).json({
      frames: {
        version: 'vNext',
        image: `https://throwbacktunes.vercel.app/og-image.png`,
        buttons: [
          {
            label: "Get a Throwback Tune",
            action: "post"
          }
        ]
      }
    });
  }
  
  // Handle POST requests (for button clicks)
  if (req.method === 'POST') {
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
      return res.status(500).json({ 
        frames: {
          version: 'vNext',
          image: `https://throwbacktunes.vercel.app/og-image.png`,
          buttons: [
            {
              label: "Try Again",
              action: "post"
            }
          ]
        }
      });
    }
  }
  
  // Default response for other methods
  return res.status(405).json({ error: 'Method not allowed' });
}