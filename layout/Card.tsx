import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Character } from '../interfaces/Character.interface'
import styles from '../styles/Card.module.css'


const Card = (item: Character) => {
    
    const [isActive, setActive] = useState<boolean>(false)
    const imagePath = item.image.includes('image_not_available') ? false : true
   
    return <div onMouseEnter={()=>setActive(true)} onMouseLeave={()=>setActive(false)}  className={styles.container}>
                {imagePath? <Image src={item.image} alt={item.name} layout='fill'/> : <h3>{item.name}</h3> } 
                <div className={styles.button}>
                    <Link href={`/character/${item.id}`}><a>{imagePath ? item.name : 'Go to my page'}</a></Link>
                </div>
            </div>
}

export default Card