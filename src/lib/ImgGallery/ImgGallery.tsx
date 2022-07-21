import { useCallback } from 'react'
import * as React from "react"
import ImgLazyLoading from '../ImgLazyLoading'
import { ImageObject, Options } from '../models/models'
import styles from '../styles'

function ImgGallery(props: {
  options?: Options
  imgList: ImageObject[]
  onOpen: (index_of_image: number) => void
}) {
  const onOpen = useCallback((index) => () => props.onOpen(index), [])
  return (
    <div
      className='reactPic-grid'
      data-testid='test-reactPic-grid'
      style={{
        ...styles.Grid,
        gridTemplateColumns: `repeat(${
          props.options?.picsPerRow ? props.options.picsPerRow : '3'
        }, 1fr)`
      }}
    >
      {props.imgList.map((element, index) => {
        return (
          <div
            key={element.thumbnailSrc ? element.thumbnailSrc : element.fullSrc}
            className='reactPic-imgDiv'
            style={{
              overflow: 'hidden',
              width: '100%',
              height: '100%',
              minHeight: '150px'
            }}
          >
            <div
              className='reactPic-innerImgDiv'
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden !important',
                width: '100%',
                height: props.options?.rowHeight
                  ? props.options.rowHeight
                  : '150px',
                cursor: 'pointer'
              }}
            >
              <ImgLazyLoading
                options={props.options}
                imgSrc={
                  element.thumbnailSrc ? element.thumbnailSrc : element.fullSrc
                }
                style={{
                  flexShrink: 0,
                  minWidth: '100%',
                  minHeight: '100%'
                }}
                onClick={onOpen(index)}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default React.memo(ImgGallery)
