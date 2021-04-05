import React from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import CircularLoading from './CircularLoading'
import styles from './styles'

// const ImgLightbox = (props: {
//   imgObj: imageObject | null
//   options?: Options
//   onClose: () => void
//   onNavigation: (arg0: 'next' | 'previous') => void
//   hasPrevious: boolean
//   hasNext: boolean
// }) => {

const ImgLightbox = (props) => {
  const [imgSrcUrl, setImgSrcUrl] = React.useState('')

  const DescriptionCustomBox = props.options.descriptionCustomBox

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

  return (
    <div
      className='reactPic-lightbox'
      onClick={(event) => {
        document.body.style.overflow = ''
        const target = event.target

        if (target.className === 'reactPic-lightbox') {
          props.onClose()
        }
      }}
      style={styles.ModalDiv}
    >
      <div style={styles.LbButtonsDiv}>
        {props.options?.downloadBtnDisplay ||
        props.options?.downloadCustomBtn ? (
          props.options.downloadCustomBtn ? (
            <a href={imgSrcUrl} download style={styles.ABtn}>
              {props.options.downloadCustomBtn()}
            </a>
          ) : (
            <a href={imgSrcUrl} download style={styles.LbButton}>
              Download
            </a>
          )
        ) : null}
      </div>

      {imgSrcUrl === '' ? (
        <div style={{ display: 'block', margin: 'auto' }}>
          <CircularLoading />
        </div>
      ) : (
        <div>
        <TransformWrapper
          defaultScale={1}
          options={{
            limitToBounds: true,
            limitToWrapper: true,
            transformEnabled: true,
            centerContent:true,
          }}
        >
            <TransformComponent>
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
          {props.options?.descriptionBoxDisplay ? (
            props.imgObj?.description || DescriptionCustomBox  ? (
              DescriptionCustomBox ? (
                <DescriptionCustomBox imgObj={props.imgObj} onClose={props.onClose}>
                  {props.imgObj?.description}
                </DescriptionCustomBox>
              ) : (
                <div
                  className='reactPic-description'
                  style={styles.DescriptionDiv}
                >
                  {props.imgObj?.description}
                </div>
              )
            ) : null
          ) : null}
        </TransformWrapper>
          {props.hasPrevious && (
            <div
            className="react-lightbox-prevBtn"
              style={{
                position: 'absolute',
                left: 20,
                top: '50%',
                fontSize: 50,
                cursor: 'pointer',
                color:'white',
                display: props.options.hidePagination ? 'none' : 'inherit'
              }}
              onClick={() => {
                props.onNavigation('previous')
              }}
            >
              &#8249;
            </div>
          )}

          {props.hasNext && (
            <div
              className="react-lightbox-nextBtn"
              style={{
                position: 'absolute',
                right: 20,
                top: '50%',
                fontSize: 50,
                cursor: 'pointer',
                color:'white',
                display: props.options.hidePagination ? 'none' : 'inherit'
              }}
              onClick={() => {
                props.onNavigation('next')
              }}
            >
              &#8250;
            </div>
          )}
          </div>
      )}
    </div>
  )
}

export default ImgLightbox
