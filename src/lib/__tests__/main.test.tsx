import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import PicGallery from '../main'

const listOfImages = [
  {
    thumbnailSrc: 'https://picsum.photos/id/154/200/150',
    fullSrc: 'https://picsum.photos/id/154/200/150'
  },
  {
    thumbnailSrc: 'https://picsum.photos/id/385/300/200',
    fullSrc: 'https://picsum.photos/id/385/800/600'
  },
  {
    thumbnailSrc: '-',
    fullSrc: '-'
  },
  {
    thumbnailSrc: 'https://picsum.photos/id/25/100/250',
    fullSrc: 'https://picsum.photos/id/25/100/250'
  },
  {
    thumbnailSrc: 'https://picsum.photos/id/35/120/200',
    fullSrc: 'https://picsum.photos/id/35/800/600'
  },
  {
    thumbnailSrc: 'https://picsum.photos/id/84/280/185',
    fullSrc: 'https://picsum.photos/id/84/800/600'
  },
  {
    thumbnailSrc: 'https://picsum.photos/id/185/200/300',
    fullSrc: 'https://picsum.photos/id/185/800/600'
  },
  {
    thumbnailSrc: 'https://picsum.photos/id/55/200/150',
    fullSrc: 'https://picsum.photos/id/55/800/600'
  },
  {
    thumbnailSrc: 'https://picsum.photos/id/852/300/200',
    fullSrc: 'https://picsum.photos/id/852/800/600'
  }
]

test('component renders correct amount of pictures', () => {
  render(<PicGallery imgList={listOfImages} />)

  const element = screen.getByTestId('test-reactPic-grid').children
  expect(element).toHaveLength(listOfImages.length)
})

test('if no picture, it doesnt show up', () => {
  render(<PicGallery imgList={listOfImages} />)

  const listOfImagesRendered = screen.getAllByRole('img',{name:'reactPic-img'},)
  const noPic = listOfImagesRendered[2]
  const withPic = listOfImagesRendered[0]

  expect(noPic).toHaveAttribute('src', '-')
  expect(withPic).toHaveAttribute('src', listOfImages[0].thumbnailSrc)
  expect(withPic).not.toHaveAttribute('src', '-')
})
