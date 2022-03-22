import axios from "axios"
import serializeCharacter from '../../helpers/serializeCharacter'
import { NextApiRequest, NextApiResponse } from 'next'

var md5 = require("md5")

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const name = req.body.searchValue
    const searchCriteria = req.body.searchCriteria
    let api: string = "http://gateway.marvel.com/v1/public/characters?nameStartsWith=" + name + "&orderBy=name&ts="
    
    if (req.body.searchCriteria === 'comic' || req.body.searchCriteria === 'serie'){ 
            api = "http://gateway.marvel.com/v1/public/" + searchCriteria + "s?titleStartsWith=" + name + "&orderBy=title&ts="
    } 
    
    const timestamp = new Date().toISOString()
    const hash = md5(timestamp + process.env.MARVEL_PRIVATE_API_KEY + process.env.NEXT_PUBLIC_MARVEL_PUBLIC_API_KEY)
    const apiUrl = api + timestamp + "&apikey=" + process.env.NEXT_PUBLIC_MARVEL_PUBLIC_API_KEY + "&hash=" + hash

    try {
        const data = await axios.get(apiUrl)
        const serializedCharacters = []
        let dataToSerialize = JSON.parse(JSON.stringify(data.data["data"].results))

        if (searchCriteria !== 'character') {
            const charactersToSerialize: any[] = []
            for (const i in dataToSerialize) {
                    const itemId = dataToSerialize[i].id
                    const charactersUrl = "http://gateway.marvel.com/v1/public/"+ searchCriteria +"s/" + itemId +"/characters?&limit=20&ts="
                    const charactersApiUrl = charactersUrl + timestamp + "&apikey=" + process.env.NEXT_PUBLIC_MARVEL_PUBLIC_API_KEY + "&hash=" + hash
                    const charactersArray = await axios.get(charactersApiUrl)
                    for (const i in charactersArray) {
                        if (charactersArray.data["data"].results.length > 0) {
                            for (const i in charactersArray.data["data"].results){
                                if (charactersArray.data["data"].results[i] !== undefined && charactersToSerialize.find(x => x.id === charactersArray.data["data"].results[i].id) === undefined){
                                    charactersToSerialize.push(charactersArray.data["data"].results[i])
                                }
                            
                            }
                        }
                    }
            }
            for (const i in charactersToSerialize) {
                serializedCharacters.push(serializeCharacter(charactersToSerialize[i], null))
            }
        } else {
            for (const i in dataToSerialize) {
                serializedCharacters.push(serializeCharacter(dataToSerialize[i], null))
            }
        }
        
        res.status(200).json(serializedCharacters)
    
         
    } catch (e) {
        console.log(e)
        //res.status(400).end()

    }
}
