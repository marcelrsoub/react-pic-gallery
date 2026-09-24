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
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading')

  useEffect(() => {
    setState('loading')

    const image = imageRef.current
    if (!image?.complete) return

    setState(image.naturalWidth > 0 ? 'loaded' : 'error')
  }, [src])

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
        src={src}
        alt={alt}
        className={`react-pic-gallery__image-element ${imageClassName}`.trim()}
        style={{ objectFit, ...imageStyle }}
        loading={eager ? 'eager' : 'lazy'}
        decoding='async'
        width={width}
        height={height}
        onLoad={() => setState('loaded')}
        onError={() => setState('error')}
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
