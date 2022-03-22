export interface Character {
    id: string,
    name: string,
    description: string,
    image: string,
    collections: Collection[] | null
}

export type collectionType = 'comics' | 'events' | 'series' | 'stories'

export interface Collection {
    type: collectionType,
    items: Item[]
}

export interface Item {
    id: string,
    title:string,
    description: string, 
    image: string,
    type: collectionType
}