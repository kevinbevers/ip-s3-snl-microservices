import React from 'react'
import App from 'next/app'
import Router from 'next/router'
import auth0 from './auth0'

const SessionContext = React.createContext()
SessionContext.displayName = 'SessionContext'

export function useSession() {
  const context = React.useContext(SessionContext)
  if (context === undefined) {
    throw new Error(
      'useSession must be used within a SessionProvider. Did you wrap the page component with `withSession`?'
    )
  }
  return context
}

export const withSession = (PageComponent) => {
  const WithSession = ({ session, ...props }) => {
    return (
      <SessionContext.Provider value={session}>
        <PageComponent {...props} />
      </SessionContext.Provider>
    )
  }

  WithSession.getInitialProps = async (context) => {
    const session = await getSession(context)

    // Provide the session to getInitialProps of pages
    // In order to make authenticated requests
    context.session = session

    // Run getInitialProps from HOCed PageComponent
    const pageProps =
      typeof PageComponent.getInitialProps === 'function'
        ? await PageComponent.getInitialProps(context)
        : {}

    // Pass props to PageComponent
    return {
      session,
      ...pageProps,
    }
  }

  return WithSession
}

async function getSession(context) {
  const { req, res, pathname } = context

  // On the server, we can ask auth0 for the session
  if (req) {
    const session = await auth0.getSession(req)
    if (!session || !session.user) {
      res.writeHead(302, {
        Location: '/api/login',
      })
      res.end()
      return {}
    } else {
      const tokenCache = auth0.tokenCache(req, res)
      const { accessToken } = await tokenCache.getAccessToken()
      return {
        ...session,
        accessToken,
      }
    }
  }

  // On the client
  const { session } = __NEXT_DATA__.props.pageProps
  if (session) {
    // If we go from authenticated to authenticated page (both using withSession),
    // We can pass around the session from pageProps
    // This crucially avoids an un-needed network request when a page is requested from a Link component
    return session
  } else {
    // If we go from unauthenticated (without withSession) to authenticated page (with withSession),
    // we have to redirect through login first
    Router.replace(`/api/login?redirectTo=${pathname}`)
  }
}