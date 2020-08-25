import Head from 'next/head'

import '~styles/index.css'
import { AuthenticationProvider } from 'swrlit'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>adventure</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="stylesheet" href="https://use.typekit.net/dtu4zwf.css" />
        <meta name="monetization" content="$ilp.uphold.com/fR3aBhBwnnjy" />
      </Head>
      <AuthenticationProvider>
        <Component {...pageProps} />
      </AuthenticationProvider>
    </>
  )
}

export default MyApp
