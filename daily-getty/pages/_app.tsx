import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={lightTheme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  )
}
