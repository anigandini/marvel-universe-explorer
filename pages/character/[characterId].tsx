import { Character } from '../../interfaces/Character.interface'
import md5 from 'md5'
import type { NextPage } from 'next'
import { GetStaticProps, GetStaticPaths } from 'next'
import { ParsedUrlQuery } from 'querystring'
import Image from 'next/image'
import styles from '../../styles/CharacterPage.module.css'
import Link from 'next/link'
import Section from '../../layout/Section'
import axios from "axios"
import serializeCharacter from '../../helpers/serializeCharacter'
import getCollectionsUrls from '../../helpers/getCollectionURLs'
import serializeItem from '../../helpers/serializeItem'
import Footer from '../../layout/Footer'

interface Params extends ParsedUrlQuery {
    id: string,
 }


const CharacterPage : NextPage<Params> = (props: Character) => {
    
    const sections = props.collections?.map((collection: object) => {
        return <Section type={Object.keys(collection)[0]} items={Object.values(collection)[0]}/>
    })

    return (
        <>   
        <header className={styles.container}>
            <Link href={'/'}><a>Return Home</a></Link>
            {props.image !== '' ?<figure><Image src={props.image} layout='fill' /></figure> : ''}
            <div className={styles.title}>
                <h1>{props.name}</h1>
                <p>{props.description !== ''? props.description : 'Check my comics and series to know more about me!'}</p>
            </div>

        </header>
        <main>
            {sections}
        </main>
        <Footer/>
        </>
    )
    }
    


export default CharacterPage

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}

export const getStaticProps: GetStaticProps<Params> = async (context) => {
    const characterId = context.params?.characterId !== undefined? context.params?.characterId.toString():''
    const timestamp = new Date().toISOString()
    const hash = md5(timestamp + process.env.MARVEL_PRIVATE_API_KEY + process.env.NEXT_PUBLIC_MARVEL_PUBLIC_API_KEY)
    const requestHeaders: HeadersInit = new Headers()
    requestHeaders.set('Content-Type', 'application/json')
    const api = "http://gateway.marvel.com/v1/public/characters/" + characterId
    const urlEnd = "?ts=" + timestamp + "&apikey=" + process.env.NEXT_PUBLIC_MARVEL_PUBLIC_API_KEY + "&hash=" + hash
    
    const res = await axios.get(api + urlEnd)
    const character = JSON.parse(JSON.stringify(res.data["data"].results[0]))
    const collectionsUrls = getCollectionsUrls(character)
    const serializedCharacter = serializeCharacter(character)
    if (collectionsUrls) {
        let collections: any[] = []
        for (const url of collectionsUrls) {
            const unserializedCollections = [Object.entries(url)[0]]
            for (const collection of unserializedCollections) {
                const response = await axios.get(collection[1] + urlEnd)
                const serializedCollection: any = []
                for (const item of response.data.data.results) {
                    serializedCollection.push(serializeItem(item))
                }
                collections.push({[collection[0]]: serializedCollection})        

            }
            
        }
        serializedCharacter['collections'] = collections
    }

    return {
        props: serializedCharacter
        } // will be passed to the page component as props
    }
