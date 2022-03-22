import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import marvelLogo from '../assets/Marvel_Logo.svg.webp'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import Grid from '../layout/Grid'
import axios from 'axios'
import { Character } from '../interfaces/Character.interface'
import serializeCharacter from '../helpers/serializeCharacter'
import searchIcon from '../assets/search.png'
import Footer from '../layout/Footer'
import Loader from '../layout/Loader'
import md5 from 'md5'

type HomeState = {
  offset: number,
  charactersPerPage: number,
  totalItems: number,
  characters: Character[]
}

const Home: NextPage<HomeState> = (initialData) => {
  const [characters, setCharacters] = useState<Character[]>(initialData.characters)
  const [offset, setOffset] = useState<number>(initialData.charactersPerPage)
  const [totalCharacters, setTotalCharacters] = useState<number>(initialData.totalItems)
  const [charactersPerPage, setCharactersPerPage] = useState<number>(initialData.charactersPerPage)
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchCriteria, setSearchCriteria] = useState<string>('character')
  const [isLoadingMore, setLoadingMore] = useState<boolean>(false)
  const [isSearching, setIsSerching] = useState<boolean>(false)
  const [isReachingEnd, setReachingEnd] = useState<boolean>(false)

  const handleReachEnd = () => {
    if (offset === totalCharacters || offset > totalCharacters - charactersPerPage) {
      setReachingEnd(true)
    } else {
      setReachingEnd(false)
    }
  
  }
  useEffect(() => {
    handleReachEnd()
  }, []);
  

  
  const loadMore = async() => {
    setLoadingMore(true)
    await axios.post("/api/loadMore", { offset }).then((response) => {
    setOffset(response.data.offset + charactersPerPage)
    setCharacters(characters.concat(response.data.characters))
    setLoadingMore(false)
    })
  }

  const search = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSerching(true)
    await axios.post("/api/search", { searchCriteria, searchValue }).then((response) => {
      setCharacters(response.data)
      setLoadingMore(false)
      setIsSerching(false)
      })
  }

  const clearSearchInput = () => {
    setLoadingMore(true)
    setSearchValue('')
    setCharacters(initialData.characters)
    setLoadingMore(false)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Marvel Universe Explorer</title>
        <meta name="description" content="Search and discover everything you need to know about Marvel's characters." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
          <figure>
            <Image src={marvelLogo} alt='Marvel'/>
            <h1>UNIVERSE EXPLORER</h1>
          </figure>
            <form onSubmit={e=>search(e)}>
              <input
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              required/>
              <button className={styles.searchButton} disabled={isSearching} type='submit'><Image src={searchIcon} width={24} height={24} alt=''/></button>
            </form>
            <div className={styles.searchBy}>
              <div>Search by</div>
              <button className={searchCriteria === 'character' ? styles.active : ''} disabled={isSearching} onClick={()=>setSearchCriteria('character')}>Hero</button>
              <button className={searchCriteria === 'comic' ? styles.active : ''} disabled={isSearching} onClick={()=>setSearchCriteria('comic')}>Comic</button>
              <button className={searchCriteria === 'serie' ? styles.active : ''} disabled={isSearching} onClick={()=>setSearchCriteria('serie')}>Serie</button>
            </div>
      </header>
      <main className={styles.main}>
        {isSearching?<Loader/> : <Grid characters={characters}></Grid>}
        <div className={styles.loadMore}>
          {searchValue === '' ?  <button disabled={isReachingEnd}  onClick={loadMore} >{isLoadingMore ? 'Loading' : 'Load More'}</button> : <button disabled={isLoadingMore} onClick={clearSearchInput} >{isLoadingMore? 'Loading' : 'view all heroes'}</button>}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Home


export const getStaticProps = async () => {
  
  const api = "http://gateway.marvel.com/v1/public/characters?orderBy=name&ts="
  const timestamp = new Date().toISOString()
  const hash = md5(timestamp + process.env.MARVEL_PRIVATE_API_KEY + process.env.NEXT_PUBLIC_MARVEL_PUBLIC_API_KEY)
  const apiUrl = api + timestamp + "&apikey=" + process.env.NEXT_PUBLIC_MARVEL_PUBLIC_API_KEY + "&hash=" + hash
  const data = await axios.get(apiUrl)
  const characters = JSON.parse(JSON.stringify(data.data["data"].results))
  const serializedCharacthers: any[] = []
  for (var i in characters){
    serializedCharacthers.push(serializeCharacter(characters[i]));
  }
  const homeState = {
    offset: data.data['data'].offset,
    charactersPerPage: data.data['data'].count,
    totalItems: data.data['data'].total,
    characters: serializedCharacthers
  }

  return {
    props:  homeState
    // will be passed to the page component as props
  }
}
