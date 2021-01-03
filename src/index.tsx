import * as React from 'react'
import styles from './styles.module.css'

interface imageObject {
  thumbnailSrc: string
  fullSrc: string
}

interface Props {
  imgList: imageObject[]
}

export const ExampleComponent = ({ imgList }: Props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {imgList.map((element: imageObject) => {
          return (
            <div key={element.thumbnailSrc} className={styles.imgDiv}>
              <div className={styles.innerImgDiv}>
                <img src={element.thumbnailSrc} alt='' />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
