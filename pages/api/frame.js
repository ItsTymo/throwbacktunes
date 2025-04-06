// This should be in your api/frame.js file
export default function handler(req, res) {
    // Handle POST requests when users click the button
    if (req.method === 'POST') {
      // For simplicity, return a static response with sample song
      res.status(200).json({
        frames: {
          version: "vNext",
          image: "https://throwbacktunes.vercel.app/og-image.png",
          buttons: [
            {
              label: "Get Another Song",
              action: "post"
            }
          ]
        }
      });
    } else {
      // Handle GET requests (for validation)
      res.status(200).json({
        frames: {
          version: "vNext",
          image: "https://throwbacktunes.vercel.app/og-image.png",
          buttons: [
            {
              label: "Get a Throwback Tune",
              action: "post"
            }
          ]
        }
      });
    }
  }