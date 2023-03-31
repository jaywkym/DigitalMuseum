import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { ThemeProvider, createTheme } from '@mui/material/styles';

declare module "@mui/material/styles/createPalette" {
  interface CommonColors {
    blueScheme: {
      foreground: string;
      background: string;
      darkBlue: string;
      blue: string;
      notBlue: string;
      notWhite: string;
    }
  }
}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {

  const blueTheme = createTheme({
    typography: {
      button:{
        textTransform:'none'
      },
      fontFamily: ['Montserrat'].join(',') ,
    },
    palette: {
      common: {
        blueScheme: {
          foreground: '#0e0e1a',
          background: '#1A1A2E',
          darkBlue: '#16213E',
          blue: '#0F3460',
          notBlue: '#E94560',
          notWhite: '#FFF',
        },
      }
    }
  });

  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={blueTheme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  )
}
