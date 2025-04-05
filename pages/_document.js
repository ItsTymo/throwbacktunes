import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Farcaster Frame Meta Tags */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://throwbacktunes-a4xdcr7fl-tymos-projects-8d562207.vercel.app/og-image.png" />
        <meta property="fc:frame:button:1" content="Get a Throwback Tune" />
        <meta property="fc:frame:post_url" content="https://throwbacktunes-a4xdcr7fl-tymos-projects-8d562207.vercel.app/api/frame" />
        
        {/* Cache control headers for Farcaster */}
        <meta property="x-opengraph-ttl" content="86400" />
        <meta property="cache-control" content="max-age=86400" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}