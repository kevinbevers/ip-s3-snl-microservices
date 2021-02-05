import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang={"en-EN"}>
        <Head>
        <meta name="description" content="Smitenoobleague is a website where teams can sign up, compete and see there stats" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Smitenoobleague" />
        <meta name="twitter:title" content="Embed a Twitch Video into a React Website" />
        <meta name="twitter:description" content="Smitenoobleague is a website where teams can sign up, compete and see there stats" />
        <meta name="twitter:image" content="https://smitenoobleague.com/images/twitterbanner.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#2c3043" />
        <meta name="theme-color" content="#2c3043"></meta>
          </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument