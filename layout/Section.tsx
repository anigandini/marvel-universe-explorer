import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import styles from '../styles/Section.module.css'
import {Item} from '../interfaces/Character.interface'
import Image from 'next/image'


const Section = (props: {type: string, items: Item[]}) => {
    return (<section className={`${styles.container} ${styles[props.type]}`}>
        <h2>{'My ' + props.type}</h2>
        <Swiper
            spaceBetween={50}
            breakpoints={{
                300: {
                slidesPerView: 1.5,
                },
                768: {
                slidesPerView: 3,
                },
                1024: {
                    slidesPerView: 4,
                },
            }}
        >
            {props.items.map((item: Item) => {return <SwiperSlide>
                <div className={styles.card}>
                    {item.image && !item.image.includes('image_not_available')?<figure><Image className={styles.image} src={item.image} layout='fill' alt={item.title}/></figure> : <div className={styles.info}>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                    </div>} 
                    
                </div>
            </SwiperSlide>})}
        </Swiper>
    </section>
    )
}

export default Section
