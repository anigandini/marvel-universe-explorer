const getCollectionsUrls = (data: any) => {
    const collectionTypes = ['comics', 'events', 'stories', 'series']
    const urls: any[]= []
    collectionTypes.forEach((type: string) => {
        if (data[type].available > 0) {
            const collection = { [type]: data[type].collectionURI}
            urls.push(collection)
        }
    })
    return urls

}
export default getCollectionsUrls