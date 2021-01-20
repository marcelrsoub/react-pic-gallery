/* eslint-disable prettier/prettier */
import * as React from 'react'
import styled from 'styled-components'
import { circularLoading } from '@yami-beta/react-circular-loading'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import './styles.css'

// 1. Types Declaration

export interface imageObject {
  fullSrc: string
  thumbnailSrc?: string
  description?: string
}

export interface Options {
  downloadBtnDisplay?: boolean
  downloadCustomBtn?: () => JSX.Element
  // shareBtnDisplay?:boolean
  descriptionBoxDisplay?: boolean
  descriptionCustomBox?: (props: { children: any }) => JSX.Element
}

// 2. Styled Components
const ModalDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.774);
  /* backdrop-filter: blur(6px); */
  display: flex;
  z-index: 9999999;
  justify-content: center;
`

const LbButtonsDiv = styled.div`
  position: absolute;
  top: 10px;
  width: calc(100% - 20px);
`

const LbButton = styled.a`
  float: right;
  text-decoration: none;
  color: white;
  padding: 5px;
  border: 1px solid white;
  border-radius: 5px;
`
const ABtn = styled.a`
  float: right;
  text-decoration: none;
  color: white;
`

const DescriptionDiv = styled.div`
  background: white;
  position: fixed;
  bottom: 0px;
  padding: 10px;
  width: 100%;
  text-align: center;
  max-height: 60px;
  overflow-y: scroll;
`

const Wrapper = styled.div({
  display: 'flex',
  width: '100%',
  minWidth: 200,
  height: '100%'
})

const Grid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '2px',
  width: '100%',
  height: 'auto'
})

// 3. Lightbox and Image Component

const CircularLoading = circularLoading({
  // Distance of dot from center `em`
  distance: 1,
  // Dot's size `em`
  dotSize: 0.3,
  // A number of dots
  num: 10,
  // Dot's color (base color)
  dotColor0: `rgba(255, 255, 255, 0.1)`,
  // Dot's color (semi highlight color)
  dotColor1: `rgba(255 ,255, 255, 0.2)`,
  // Dot's color (highlight color)
  dotColor2: `rgba(255 ,255, 255, 1.0)`
})

const ImgLazyLoading = (props: {
  imgSrc: string
  style: React.CSSProperties
  onClick: () => void
}) => {
  const [imgSrcUrl, setImgSrcUrl] = React.useState('')

  React.useEffect(() => {
    const ac = new AbortController()
    if (props.imgSrc) {
      fetch(props.imgSrc)
        .then((response) => response.blob())
        .then((blob) => {
          setImgSrcUrl(URL.createObjectURL(blob))
        })
    }
    return () => {
      ac.abort()
    } // cleanup function
  }, [props.imgSrc])

  if (imgSrcUrl) {
    return (
      <img
        src={imgSrcUrl}
        alt=''
        style={{
          ...props.style
        }}
        onClick={() => {
          props.onClick()
        }}
      />
    )
  } else {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.157)',
          border: '1px solid rgba(0, 0, 0,0.3)'
        }}
      >
        <CircularLoading />
      </div>
    )
  }
}

const ImgLightbox = (props: {
  imgObj: imageObject | null
  options?: Options
  onClose: () => void
}) => {
  const [imgSrcUrl, setImgSrcUrl] = React.useState('')

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
    <ModalDiv
      className='reactPic-lightbox'
      onClick={() => {
        document.body.style.overflow = ''
        props.onClose()
      }}
    >
      <LbButtonsDiv>
        {props.options?.downloadBtnDisplay ||
        props.options?.downloadCustomBtn ? (
          props.options.downloadCustomBtn ? (
            <ABtn href={imgSrcUrl} download>
              {props.options.downloadCustomBtn()}
            </ABtn>
          ) : (
            <LbButton href={imgSrcUrl} download>
              Download
            </LbButton>
          )
        ) : null}
      </LbButtonsDiv>

      {imgSrcUrl === '' ? (
        <div style={{ display: 'block', margin: 'auto' }}>
          <CircularLoading />
        </div>
      ) : (
        <TransformWrapper defaultScale={1} options={{}}>
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: props.imgObj?.description ? 'calc(100% - 95px)' : '100%',
              paddingBottom: props.imgObj?.description ? 60 : 0,
              paddingTop: props.imgObj?.description ? 35 : 0
            }}
          >
            <div
              style={{
                margin: 'auto'
              }}
            >
              <TransformComponent>
                <img
                  src={imgSrcUrl}
                  alt=''
                  id='lightboxImg'
                  style={{
                    maxWidth: '80vw',
                    maxHeight: 'calc(80vh - 60px)',
                    margin: 'auto',
                    zIndex: 1000000
                  }}
                />
              </TransformComponent>
            </div>
          </div>
          {props.options?.descriptionBoxDisplay ? (
            props.imgObj?.description ? (
              props.options.descriptionCustomBox ? (
                <props.options.descriptionCustomBox>
                  {props.imgObj?.description}
                </props.options.descriptionCustomBox>
              ) : (
                <DescriptionDiv className='reactPic-description'>
                  {props.imgObj?.description}
                </DescriptionDiv>
              )
            ) : null
          ) : null}
        </TransformWrapper>
      )}
    </ModalDiv>
  )
}

// 4. Main Component

// 4.1. Default Options

const defaultOptions: Options = {
  downloadBtnDisplay: true,
  descriptionBoxDisplay: true
}

// 4.2. Main

const PicGallery = (props: { imgList: imageObject[]; options?: Options }) => {
  const [open, setOpen] = React.useState(false)
  const [modalImgObj, setModalImgObj] = React.useState<imageObject | null>(null)

  const options: Options = { ...defaultOptions, ...props.options }

  // allowing full screen zooming on react-zoom library
  const sheet = document.createElement('style')
  sheet.innerHTML =
    '.react-transform-component { overflow: inherit !important; }'
  document.body.appendChild(sheet)

  return (
    <Wrapper className='reactPic-wrapper'>
      {open ? (
        <ImgLightbox
          imgObj={modalImgObj}
          options={options}
          onClose={() => {
            setOpen(false)
          }}
        />
      ) : null}
      <Grid className='reactPic-grid'>
        {props.imgList.map((element: imageObject) => {
          return (
            <div
              key={
                element.thumbnailSrc ? element.thumbnailSrc : element.fullSrc
              }
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
                  height: '100%',
                  cursor: 'pointer'
                }}
              >
                <ImgLazyLoading
                  imgSrc={
                    element.thumbnailSrc
                      ? element.thumbnailSrc
                      : element.fullSrc
                  }
                  style={{
                    flexShrink: 0,
                    minWidth: '100%',
                    minHeight: '100%'
                  }}
                  onClick={() => {
                    setModalImgObj(element)
                    setOpen(!open)
                  }}
                />
              </div>
            </div>
          )
        })}
      </Grid>
    </Wrapper>
  )
}

export default PicGallery
