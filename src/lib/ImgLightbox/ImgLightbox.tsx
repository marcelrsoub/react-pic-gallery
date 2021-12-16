import { ImageObject, Options } from '../models/models'
import React, { useCallback, useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import CircularLoading from '../CircularLoading/CircularLoading'
import styles from '../styles'
import ImgLazyLoading from '../ImgLazyLoading'

const ImgLightbox = (props: {
  imgList: ImageObject[]
  open: boolean
  currentImgIndex: number
  options?: Options
  onClose: () => void
  topCustomContent?: (props2: {
    imgObject: ImageObject
    closeLightbox: () => void
  }) => JSX.Element
  bottomCustomContent?: (props2: {
    imgObject: ImageObject
    closeLightbox: () => void
  }) => JSX.Element
}) => {
  const [imgSrcUrl, setImgSrcUrl] = useState('')
  const [modalImgIndex, setModalImgIndex] = useState<number>(
    props.currentImgIndex
  )

  const nextImage = useCallback(
    () => setModalImgIndex(modalImgIndex + 1),
    [modalImgIndex]
  )
  const previousImage = useCallback(
    () => setModalImgIndex(modalImgIndex - 1),
    [modalImgIndex]
  )

  React.useEffect(() => {
    const imgSrc = props.imgList[modalImgIndex]?.fullSrc
      ? props.imgList[modalImgIndex].fullSrc
      : props.imgList[modalImgIndex]?.thumbnailSrc
      ? props.imgList[modalImgIndex].thumbnailSrc
      : null

    if (imgSrc) setImgSrcUrl(imgSrc)
    // fixing body scrolling while lightbox is open
    document.body.style.overflow = 'hidden'
  }, [modalImgIndex])

  const TopCustomContent = () =>
    props.topCustomContent?.({
      closeLightbox: props.onClose,
      imgObject: props.imgList[modalImgIndex] as ImageObject
    })

  return (
    <div
      className='reactPic-lightbox'
      style={styles.lightbox}
      onClick={(event) => {
        document.body.style.overflow = ''
        const target: HTMLDivElement = event.target as HTMLDivElement

        if (target.className === 'reactPic-lightbox') {
          props.onClose()
        }
      }}
    >
      <div
        style={styles.topCustomContent}
        className='reactPic-topCustomContent'
      >
        {props.topCustomContent?.({
          closeLightbox: props.onClose,
          imgObject: props.imgList[modalImgIndex] as ImageObject
        })}
      </div>

      <div>
        <TransformWrapper>
          <TransformComponent wrapperStyle={{ overflow: 'visible' }}>
            <ImgLazyLoading
              lightboxMode
              imgSrc={imgSrcUrl}
              id='lightboxImg'
              style={{
                maxWidth: '80vw',
                maxHeight: 'calc(80vh - 20px)',
                margin: 'auto',
                zIndex: 99999999999
              }}
            />
          </TransformComponent>
        </TransformWrapper>
        {modalImgIndex - 1 >= 0 && !props.options?.hidePagination && (
          <div
            className='react-lightbox-prevBtn'
            style={{
              position: 'absolute',
              left: 20,
              height: 50,
              top: 'calc(50% - 50px)',
              fontSize: 50,
              cursor: 'pointer',
              color: 'white',
              display: props.options?.hidePagination ? 'none' : 'inherit'
            }}
            onClick={
              modalImgIndex - 1 >= 0
                ? () => setModalImgIndex(modalImgIndex - 1)
                : undefined
            }
          >
            &#8249;
          </div>
        )}

        {modalImgIndex + 1 < props.imgList.length &&
          !props.options?.hidePagination && (
            <div
              className='react-lightbox-nextBtn'
              style={{
                position: 'absolute',
                right: 20,
                height: 50,
                top: 'calc(50% - 50px)',
                fontSize: 50,
                cursor: 'pointer',
                color: 'white',
                display: props.options?.hidePagination ? 'none' : 'inherit'
              }}
              onClick={
                modalImgIndex + 1 < props.imgList.length
                  ? () => setModalImgIndex(modalImgIndex + 1)
                  : undefined
              }
            >
              &#8250;
            </div>
          )}
      </div>
      <div
        style={styles.bottomCustomContent}
        className='reactPic-bottomCustomContent'
      >
        {props.bottomCustomContent?.({
          closeLightbox: props.onClose,
          imgObject: props.imgList[modalImgIndex] as ImageObject
        })}
      </div>
    </div>
  )
}

export default ImgLightbox
