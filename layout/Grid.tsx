import { Character } from '../interfaces/Character.interface'
import styles from '../styles/Grid.module.css'
import Card from '../layout/Card'

const Grid = (props: {characters: Character[]}) => {
    const characterCards = props.characters.map((character: Character)=><Card key={character.id} {...character}/>)
    return <div className={styles.container}>
        {characterCards}
    </div>
}

export default Grid