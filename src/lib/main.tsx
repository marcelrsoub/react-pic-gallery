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
            open={open}
            currentImgIndex={modalImgIndex}
            imgList={props.imgList}
            topCustomContent={props.topCustomContent}
            bottomCustomContent={props.bottomCustomContent}
            options={options}
            onClose={() => setOpen(false)}
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
  const onClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <div className='reactPic-wrapper' data-testid="test-main-div" style={styles.Wrapper}>
      {open && !props.options?.externalLightbox ? (
        <ImgLightbox
          open={open}
          currentImgIndex={modalImgIndex}
          imgList={props.imgList}
          topCustomContent={props.topCustomContent}
          bottomCustomContent={props.bottomCustomContent}
          options={options}
          onClose={onClose}
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
