import axios from "axios"
import serializeCharacter from "../../helpers/serializeCharacter"

var md5 = require("md5")
const api = "http://gateway.marvel.com/v1/public/characters?orderBy=name&ts="
const timestamp = new Date().toISOString()
const hash = md5(timestamp + process.env.MARVEL_PRIVATE_API_KEY + process.env.NEXT_PUBLIC_MARVEL_PUBLIC_API_KEY)
const apiUrl = api + timestamp + "&apikey=" + process.env.NEXT_PUBLIC_MARVEL_PUBLIC_API_KEY + "&hash=" + hash

export default async function handler(req: Request, res: any) {
    try {
        const data = await axios.get(apiUrl)
        const characters = JSON.parse(JSON.stringify(data.data["data"].results))
        const serializedCharacther = characters.map((character: any) =>{serializeCharacter(character, null)})
        res.status(200).json(serializedCharacther)
    } catch (e) {
        console.log(e.message)
        res.status(400).end()
    }
}