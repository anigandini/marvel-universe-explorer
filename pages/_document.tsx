import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta property="og:title" content="Explore all your favorite heroes" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;900&family=Poppins:wght@500;900&family=Luckiest+Guy&display=swap" rel="stylesheet"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}