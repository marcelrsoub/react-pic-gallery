import { ImageObject, Options } from '../models/models'
import React from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import CircularLoading from '../CircularLoading'
import styles from '../styles'

const ImgLightbox = (props: {
  imgObj: ImageObject | null
  options?: Options
  onClose: () => void
  onClickNext?: () => void
  onClickPrevious?: () => void
  topCustomContent?: (props2: {
    imgObject: ImageObject
    closeLightbox: () => void
  }) => JSX.Element
  bottomCustomContent?: (props2: {
    imgObject: ImageObject
    closeLightbox: () => void
  }) => JSX.Element
}) => {
  const [imgSrcUrl, setImgSrcUrl] = React.useState('')
  const Loading: () => JSX.Element =
    props.options?.customLoadComponent !== undefined
      ? props.options.customLoadComponent
      : CircularLoading
  React.useEffect(() => {
    const imgSrc = props.imgObj?.fullSrc
      ? props.imgObj.fullSrc
      : props.imgObj?.thumbnailSrc
      ? props.imgObj.thumbnailSrc
      : null
    if (imgSrc) {
      fetch(imgSrc)
        .then((response) => response.blob())
        .then((blob) => {
          setImgSrcUrl(URL.createObjectURL(blob))
        })
    }
    // fixing body scrolling while lightbox is open
    document.body.style.overflow = 'hidden'
  }, [props.imgObj])

  const TopCustomContent = () =>
    props.topCustomContent?.({
      closeLightbox: props.onClose,
      imgObject: props.imgObj as ImageObject
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
          imgObject: props.imgObj as ImageObject
        })}
      </div>

      {imgSrcUrl === '' ? (
        <div style={{ display: 'block', margin: 'auto' }}>
          <Loading />
        </div>
      ) : (
        <div>
          <TransformWrapper>
            <TransformComponent wrapperStyle={{ overflow: 'visible' }}>
              <img
                src={imgSrcUrl}
                alt=''
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
          {props.onClickPrevious && (
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
              onClick={props.onClickPrevious}
            >
              &#8249;
            </div>
          )}

          {props.onClickNext && (
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
              onClick={props.onClickNext}
            >
              &#8250;
            </div>
          )}
        </div>
      )}
      <div
        style={styles.bottomCustomContent}
        className='reactPic-bottomCustomContent'
      >
        {props.bottomCustomContent?.({
          closeLightbox: props.onClose,
          imgObject: props.imgObj as ImageObject
        })}
      </div>
    </div>
  )
}

export default ImgLightbox
