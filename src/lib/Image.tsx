import {
  useEffect,
  useRef,
  useState,
  type AnimationEventHandler,
  type CSSProperties,
  type MouseEventHandler
} from 'react'

type ImageProps = {
  src: string
  srcSet?: string
  sizes?: string
  alt: string
  className?: string
  imageClassName?: string
  style?: CSSProperties
  imageStyle?: CSSProperties
  onAnimationEnd?: AnimationEventHandler<HTMLSpanElement>
  onClick?: MouseEventHandler<HTMLSpanElement>
  eager?: boolean
  objectFit?: 'cover' | 'contain'
  width?: number
  height?: number
}

export function Image({
  src,
  srcSet,
  sizes,
  alt,
  className = '',
  imageClassName = '',
  style,
  imageStyle,
  onAnimationEnd,
  onClick,
  eager = false,
  objectFit = 'cover',
  width,
  height
}: ImageProps) {
  const imageRef = useRef<HTMLImageElement>(null)
  const sourceKey = JSON.stringify([src, srcSet ?? null, sizes ?? null])
  const [imageState, setImageState] = useState<{
    sourceKey: string
    status: 'loading' | 'loaded' | 'error'
  }>({ sourceKey, status: 'loading' })
  const state = imageState.sourceKey === sourceKey ? imageState.status : 'loading'

  useEffect(() => {
    setImageState({ sourceKey, status: 'loading' })

    const image = imageRef.current
    if (!image?.complete) return

    setImageState({
      sourceKey,
      status: image.naturalWidth > 0 ? 'loaded' : 'error'
    })
  }, [sourceKey])

  return (
    <span
      className={`react-pic-gallery__image ${className}`.trim()}
      style={style}
      aria-busy={state === 'loading'}
      onAnimationEnd={onAnimationEnd}
      onClick={onClick}
    >
      <img
        ref={imageRef}
        sizes={sizes}
        srcSet={srcSet}
        src={src}
        alt={alt}
        className={`react-pic-gallery__image-element ${imageClassName}`.trim()}
        style={{ objectFit, ...imageStyle }}
        loading={eager ? 'eager' : 'lazy'}
        decoding='async'
        width={width}
        height={height}
        onLoad={() => setImageState({ sourceKey, status: 'loaded' })}
        onError={() => setImageState({ sourceKey, status: 'error' })}
      />
      {state === 'loading' && (
        <span
          className='react-pic-gallery__image-loader'
          role='progressbar'
          aria-label='Loading image'
        />
      )}
      {state === 'error' && (
        <span className='react-pic-gallery__image-error' role='status'>
          Unable to load image
        </span>
      )}
    </span>
  )
}
