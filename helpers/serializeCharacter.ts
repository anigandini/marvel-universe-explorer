import { Character } from '../interfaces/Character.interface'

const serializeCharacter = (data: any) => {
        const character : Character = {
            'id': data.id.toString(),
            'name': data.name,
            'description': data.description,
            'image': data.thumbnail.path + '.' + data.thumbnail.extension,
            'collections': []
        }
    return character
} 
export default serializeCharacter


