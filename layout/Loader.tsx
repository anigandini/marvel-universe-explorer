import styles from '../styles/Loader.module.css'
import loader from '../assets/loader.webp'
import Image from 'next/image'

const Loader = () => {
    return <div className={styles.container}><Image className={styles.rotating} src={loader} alt='loader'/>Loading</div>
}

export default Loader