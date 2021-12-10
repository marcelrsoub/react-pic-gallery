import React, { useCallback, useEffect, useState } from 'react'
import ImgLightbox from './ImgLightbox/ImgLightbox'
import ImgGallery from './ImgGallery/ImgGallery'
import styles from './styles'

import { ImageObject, Options, defaultOptions } from './models/models'

function PicGallery(props: {
  imgList: ImageObject[]
  options?: Options
  topCustomContent?: (props: {
    imgObject: ImageObject
    closeLightbox: () => void
  }) => JSX.Element
  bottomCustomContent?: (props: {
    imgObject: ImageObject
    closeLightbox: () => void
  }) => JSX.Element
  setExtLightboxChildren?: (imgLightbox: JSX.Element | undefined) => void
}) {
  const [open, setOpen] = useState<boolean>(false)

  const [modalImgIndex, setModalImgIndex] = useState<number>(0)

  const options: Options = { ...defaultOptions, ...props.options }

  // solving lightbox not in full screen problem
  useEffect(() => {
    if (typeof props.setExtLightboxChildren == 'function') {
      if (open) {
        props.setExtLightboxChildren(
          <ImgLightbox
            imgObj={props.imgList[modalImgIndex]}
            options={options}
            onClose={() => {
              setOpen(false)
            }}
          />
        )
      } else {
        props.setExtLightboxChildren(undefined)
      }
    }
  }, [open])

  const onOpen = useCallback((count) => {
    setModalImgIndex(count)
    setOpen(true)
  }, [])

  return (
    <div className='reactPic-wrapper' style={styles.Wrapper}>
      {open && !props.options?.externalLightbox ? (
        <ImgLightbox
          imgObj={props.imgList[modalImgIndex]}
          topCustomContent={props.topCustomContent}
          bottomCustomContent={props.bottomCustomContent}
          options={options}
          onClose={() => setOpen(false)}
          onClickPrevious={
            modalImgIndex - 1 >= 0
              ? () => setModalImgIndex(modalImgIndex - 1)
              : undefined
          }
          onClickNext={
            modalImgIndex + 1 < props.imgList.length
              ? () => setModalImgIndex(modalImgIndex + 1)
              : undefined
          }
        />
      ) : null}
      <ImgGallery
        options={props.options}
        imgList={props.imgList}
        onOpen={onOpen}
      />
    </div>
  )
}

export default PicGallery
