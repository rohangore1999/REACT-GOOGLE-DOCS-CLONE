import '../styles/globals.css'
import type { AppProps } from 'next/app'
import "@material-tailwind/react/tailwind.css";
import Head from "next/head"

// importing Provider >> higher order component
import { Provider } from "next-auth/client"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* to import Icon for material UI */}
      <Head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </Head>

      {/* using Provider we are wrapping our entier component */}

      {/* to provider we are sending the session as a props from our server side rendering function(getServerSideProps) from line:65 in index.js */}
      <Provider session={pageProps.session}>
        {/* it will pass the functionality to its children, so every children component will have access to session */}
        {/* {console.log("pageProps", pageProps)} */}

        {/* output:
          session:
            accessToken: "b4903202c4fe3dca18bd933a761795f695a85b93d27046fd736826b4d1d2ad4e"
              expires: "2022-02-12T05:58:59.029Z"
              user:
                email: "gorerohan15@gmail.com"
                image: "https://lh3.googleusercontent.com/a-/AOh14GjK3MXMvgcq-2aeWzBCj6F_JyupLrUw5AcJihHcoA=s96-c"
                name: "Rohan Gore"
        */}
        
        <Component {...pageProps} />
      </Provider>
    </>
  )
}

export default MyApp
