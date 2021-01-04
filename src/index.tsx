/* eslint-disable prettier/prettier */
import * as React from 'react'
import styled from 'styled-components'

export interface imageObject {
  fullSrc: string
  thumbnailSrc: string
}

interface Props {
  imgList: imageObject[]
}

const ModalDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.774);
  display: flex;
  z-index: 1e9;
  justify-content: center;
`

const Wrapper = styled.div({
  display: 'flex',
  width: '100%',
  height: '100%'
})

const Grid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  width: '100%',
  height: 'auto'
})

const ImgModal = (props: { imgSrc: string; onClose: () => void }) => {
  return (
    <ModalDiv
      onClick={() => {
        props.onClose()
      }}
    >
      <img
        src={props.imgSrc}
        alt=''
        style={{
          touchAction: 'pan-right pinch-zoom',
          display: 'block',
          margin: 'auto',
          maxWidth: '90%',
          maxHeight: '80%'
        }}
      />
    </ModalDiv>
  )
}

const PicGallery = ({ imgList }: Props) => {
  const [open, setOpen] = React.useState(false)
  const [modalImgSrc, setModalImgSrc] = React.useState('')
  return (
    <Wrapper>
      {open ? (
        <ImgModal
          imgSrc={modalImgSrc}
          onClose={() => {
            setOpen(false)
          }}
        />
      ) : null}
      <Grid>
        {imgList.map((element: imageObject) => {
          return (
            <div
              key={element.thumbnailSrc}
              className='imgDiv'
              style={{
                overflow: 'hidden',
                width: '100%',
                height: '100%',
                minHeight: '150px'
              }}
            >
              <div
                className='innerImgDiv'
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
                <img
                  src={element.thumbnailSrc}
                  alt=''
                  style={{
                    flexShrink: 0,
                    minWidth: '100%',
                    minHeight: '100%'
                  }}
                  onClick={() => {
                    setModalImgSrc(element.fullSrc)
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
