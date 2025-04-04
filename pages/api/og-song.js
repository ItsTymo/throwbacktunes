import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Get the song details from query parameters
    const title = searchParams.get('title') || 'Unknown Song';
    const artist = searchParams.get('artist') || 'Unknown Artist';
    const decade = searchParams.get('decade') || '00s';
    const genre = searchParams.get('genre') || 'Pop';
    
    // Generate the image
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            color: 'white',
            background: 'linear-gradient(to right, #4A00E0, #8E2DE2)',
            width: '100%',
            height: '100%',
            padding: 50,
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <h1 style={{ fontSize: 50, fontWeight: 'bold', marginBottom: 10 }}>
            Throwback Tunes
          </h1>
          <div style={{ fontSize: 40, marginBottom: 10 }}>"{title}"</div>
          <div style={{ fontSize: 30 }}>by {artist}</div>
          <div style={{ fontSize: 24, marginTop: 20 }}>{decade} • {genre}</div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}