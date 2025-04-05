import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Farcaster Frame Meta Tags */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://throwbacktunes.vercel.app/og-image.png" />
        <meta property="og:image" content="https://throwbacktunes.vercel.app/og-image.png" />
        <meta property="fc:frame:button:1" content="Get a Throwback Tune" />
        <meta property="fc:frame:post_url" content="https://throwbacktunes.vercel.app/api/frame" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}