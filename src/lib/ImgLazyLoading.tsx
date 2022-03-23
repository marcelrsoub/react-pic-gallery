import React, { useState } from 'react'
import CircularLoading from './CircularLoading/CircularLoading'
import { Options } from './models/models'

const ImgLazyLoading = (props: {
  imgSrc: string
  id?: string
  style: React.CSSProperties
  options?: Options
  onClick?: () => void
  lightboxMode?: boolean
}) => {
  const [imgSrcUrl, setImgSrcUrl] = React.useState('')
  const Loading: () => JSX.Element =
    props.options?.customLoadComponent !== undefined
      ? props.options.customLoadComponent
      : CircularLoading
  const [loadingState, setLoadingState] = useState(true)

  React.useEffect(() => {
    setLoadingState(true)
    const ac = new AbortController()

    if (props.imgSrc) {
      fetch(props.imgSrc, { mode: 'cors' })
        .then((response) => response.blob())
        .then((blob) => {
          setImgSrcUrl(URL.createObjectURL(blob))
          setLoadingState(false)
        })
    }
    return () => {
      ac.abort()
    } // cleanup function
  }, [props.imgSrc])

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
      src={imgSrcUrl}
      alt=''
      id={props.id}
      style={{
        ...props.style
      }}
      onClick={props.onClick}
    />
  )
}

export default ImgLazyLoading
