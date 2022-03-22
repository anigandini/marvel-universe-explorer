import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useState, useEffect} from 'react'
import Loader from '../layout/Loader'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState<boolean>(false)
  useEffect(() => {
    const handleStart = () => { setPageLoading(true)}
    const handleComplete = () => { setPageLoading(false) }
    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)
    }, [router])
  
  if (pageLoading) {
    return (<Loader/>)
  } else {
    return <Component {...pageProps} />
  }
}

export default MyApp
