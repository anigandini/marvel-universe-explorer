type Item = {
    'id': string,
    'title': string,
    'description': string,
    'image': string
}

const serializeItem = (data: any) => {
    const item : Item = {
        'id': data.id,
        'title': data.title,
        'description': data.description,
        'image': data.thumbnail ? data.thumbnail.path + '.' + data.thumbnail.extension : ''
    }
return item
} 
export default serializeItem