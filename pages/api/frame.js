// pages/api/frame.js
export default function handler(req, res) {
    if (req.method === 'POST') {
      // Handle frame action (when user clicks a button)
      const { trustedData } = req.body;
      // Process user action
      
      res.status(200).json({
        frameHtml: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="https://yourdomain.com/recommendation-image.png" />
              <meta property="fc:frame:button:1" content="Get New Recommendation" />
              <meta property="fc:frame:post_url" content="https://yourdomain.com/api/frame" />
            </head>
          </html>
        `
      });
    } else {
      // Initial frame load
      res.status(200).json({
        frameHtml: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="https://yourdomain.com/welcome-image.png" />
              <meta property="fc:frame:button:1" content="Get Throwback Tune" />
              <meta property="fc:frame:post_url" content="https://yourdomain.com/api/frame" />
            </head>
          </html>
        `
      });
    }
  }
  import supabase from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Get the Farcaster user data from the request
    const { untrustedData } = req.body;
    const { fid } = untrustedData;
    
    // Generate a random recommendation
    let { data: songs, error } = await supabase
      .from('songs')
      .select('*')
      .limit(100);
    
    if (error) throw error;
    
    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    
    // Create the response frame
    return res.status(200).json({
      frames: {
        version: 'vNext',
        image: `https://your-vercel-url.vercel.app/api/og-song?title=${encodeURIComponent(randomSong.title)}&artist=${encodeURIComponent(randomSong.artist)}&decade=${encodeURIComponent(randomSong.decade)}&genre=${encodeURIComponent(randomSong.genre)}`,
        buttons: [
          {
            label: "Get Another Tune",
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
    console.error('Frame error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}