
import md5 from 'md5'
import axios from "axios"
import serializeCharacter from '../../../helpers/serializeCharacter'
import getCollectionsUrls from '../../../helpers/getCollectionURLs'
import serializeItem from '../../../helpers/serializeItem'



export default async function getCharacterController(characterId : string) {        
    const timestamp = new Date().toISOString()
    const hash = md5(timestamp + process.env.MARVEL_PRIVATE_API_KEY + process.env.NEXT_PUBLIC_MARVEL_PUBLIC_API_KEY)
    const requestHeaders: HeadersInit = new Headers()
    requestHeaders.set('Content-Type', 'application/json')
    const api = "http://gateway.marvel.com/v1/public/characters/" + characterId
    const urlEnd = "?ts=" + timestamp + "&apikey=" + process.env.NEXT_PUBLIC_MARVEL_PUBLIC_API_KEY + "&hash=" + hash
    
    try {
        const res = await axios.get(api + urlEnd)
        const character = JSON.parse(JSON.stringify(res.data["data"].results[0]))
        const collectionsUrls = getCollectionsUrls(character)
        const serializedCharacter = serializeCharacter(character, collectionsUrls)
        let collections: any[] = []
        if (serializedCharacter.collectionURLS) {
            for (const url of serializedCharacter.collectionURLS) {
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
        }
        serializedCharacter['collections'] = collections
        return serializedCharacter
    

    } catch (e) {
        console.log(e.message)
        res.status(400).end()
    }
}