import React, { useEffect } from 'react'
import ImgLazyLoading from './ImgLazyLoading'
import ImgLightbox from './ImgLightbox'
import styles from './styles'

// 1. Types Declaration

export interface imageObject {
  fullSrc: string;
  thumbnailSrc?: string;
  description?: string;
  [key: string]: string
}

export interface Options {
  downloadBtnDisplay?: boolean;
  downloadCustomBtn?: (props: { imgObj?: imageObject }) => React.ReactNode;
  descriptionBoxDisplay?: boolean;
  descriptionCustomBox?: (props: { imgObj?: imageObject, onClose?: () => void }) => React.ReactNode;
  externalLightbox?: boolean;
  hidePagination?: boolean;
  rowHeight?: string | number;
  /** Number of Pictures per row. Default: 3 */
  picsPerRow?: number;
}

// 2. Styles

const extraStyle = `
`

// 3. Lightbox and Image Component

// 4. Main Component

// 4.1. Default Options

const defaultOptions = {
  downloadBtnDisplay: true,
  descriptionBoxDisplay: true,
  navigation: true
}

// 4.2. Main

export default function PicGallery(props: {
  imgList: imageObject[];
  options?: Options,
  bottomCustomContent?: (imgObject) => Element,
  setExtLightboxChildren?: (imgLightbox: React.Reacvagaha) => void
}) {
  // export default function PicGallery(props) {
  const [open, setOpen] = React.useState(false)
  const [modalImgIndex, setModalImgIndex] = React.useState(0)

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
        props.setExtLightboxChildren(null)
      }
    }
  }, [open])

  // allowing full screen zooming on react-zoom library
  const styleTag = document.querySelector('#react-pic-style')
  if (!styleTag) {
    const sheet = document.createElement('style')
    sheet.innerHTML =
      '.react-transform-component { overflow: unset !important; }' + extraStyle;
    sheet.id = 'react-pic-style';
    document.body.appendChild(sheet)
  } else {
    styleTag.innerHTML = styleTag.innerHTML + extraStyle
  }

  return (
    <div className='reactPic-wrapper' style={styles.Wrapper}>
      {open && !props.options.externalLightbox ? (
        <ImgLightbox
          imgObj={props.imgList[modalImgIndex]}
          options={options}
          onNavigation={(action) => {
            if (action === 'next' && modalImgIndex + 1 < props.imgList.length) {
              setModalImgIndex(modalImgIndex + 1)
            } else if (action === 'previous' && modalImgIndex - 1 >= 0) {
              setModalImgIndex(modalImgIndex - 1)
            }
          }}
          onClose={() => {
            setOpen(false)
          }}
          hasPrevious={modalImgIndex - 1 >= 0 ? true : false}
          hasNext={modalImgIndex + 1 < props.imgList.length ? true : false}
        />
      ) : null}
      <div className='reactPic-grid' style={{ ...styles.Grid, gridTemplateColumns: `repeat(${options.picsPerRow ? options.picsPerRow : "3"}, 1fr)`, }}>
        {props.imgList.map((element, count) => {
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
                  height: options.rowHeight ? options.rowHeight : '150px',
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
                    setModalImgIndex(count)
                    setOpen(!open)
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
