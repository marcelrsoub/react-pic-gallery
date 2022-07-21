import React, { useState } from 'react'
import CircularLoading from './CircularLoading/CircularLoading'
import { Options } from './models/models'

const ImgLazyLoading = (props: {
  imgSrc: string
  id?: string
  alt?:string
  style: React.CSSProperties
  options?: Options
  onClick?: () => void
  lightboxMode?: boolean
}) => {
  const Loading: () => JSX.Element =
    props.options?.customLoadComponent !== undefined
      ? props.options.customLoadComponent
      : CircularLoading
  const [loadingState, setLoadingState] = useState(false)

  if (loadingState) {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center',
          background: !props.lightboxMode ? 'rgba(0, 0, 0, 0.157)' : '',
          border: !props.lightboxMode ? '1px solid rgba(0, 0, 0,0.3)' : ''
        }}
      >
        <Loading />
      </div>
    )
  }
  return (
    <img
      src={props.imgSrc}
      alt={props.alt}
      aria-label='reactPic-img'
      id={props.id}
      style={{
        ...props.style
      }}
      onClick={props.onClick}
      loading="lazy"
    />
  )
}

export default ImgLazyLoading
