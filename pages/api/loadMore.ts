import md5 from 'md5'
import axios from 'axios'
import serializeCharacter from '../../helpers/serializeCharacter'
import { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const offset = Object.values(req.body)[0]
    const timestamp = new Date().toISOString()
    const hash = md5(timestamp + process.env.MARVEL_PRIVATE_API_KEY + process.env.NEXT_PUBLIC_MARVEL_PUBLIC_API_KEY)
    const requestHeaders: HeadersInit = new Headers()
    requestHeaders.set('Content-Type', 'application/json')
    const api = "http://gateway.marvel.com/v1/public/characters?orderBy=name&limit=20&offset=" + offset + "&ts="
    const apiUrl = api + timestamp + "&apikey=" + process.env.NEXT_PUBLIC_MARVEL_PUBLIC_API_KEY + "&hash=" + hash
    console.log(apiUrl)

    try {
        const data = await axios.get(apiUrl)
        const newCharacters = []
        const charactersToSerialize = JSON.parse(JSON.stringify(data.data["data"].results))
        for (const i in charactersToSerialize) {
            newCharacters.push(serializeCharacter(charactersToSerialize[i]))
        }
        const response = {
            offset: data.data['data'].offset, 
            characters: newCharacters
        }
        res.status(200).json(response)

    } catch {
        res.status(400).end()
    }
    
}