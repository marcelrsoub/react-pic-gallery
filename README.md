# react-pic-gallery

>

[![NPM](https://img.shields.io/npm/v/react-pic-gallery.svg)](https://www.npmjs.com/package/react-pic-gallery)

React library for a simple image gallery with lightbox implemented.

## Features

- 📱 Responsive
- 🚵 Lazy load on pictures
- ✏ Buttons and CSS customization classes are accessible
- 💡 Lightbox implemented with pinch zoom by [react-zoom-pan-pinch](https://www.npmjs.com/package/react-zoom-pan-pinch)

## Demo

https://marcelrsoub.github.io/react-pic-gallery/

![demo gif](https://i.imgur.com/qMhra73.gif)

## Install

```bash
npm install --save react-pic-gallery
```

or with yarn:

```bash
yarn add react-pic-gallery
```

## Usage

A list of objects containing a thumbnail source and the full source is the only needed parameter.

```jsx
import React from 'react'
import PicGallery from 'react-pic-gallery'

const listOfImages = [
  {
    thumbnailSrc: 'https://picsum.photos/id/237/200/300',
    fullSrc: 'https://picsum.photos/id/237/800/600'
  },
  {
    thumbnailSrc: 'https://picsum.photos/id/154/200/150',
    fullSrc: 'https://picsum.photos/id/154/200/150'
  }
]

const App = () => {
  return (
    <div>
      <PicGallery imgList={listOfImages} />
    </div>
  )
}

export default App
```

## Options

The options interface can be imported from the library and the object can be passed in the main component:

```tsx
import React from 'react'
import PicGallery from 'react-pic-gallery'

const listOfImages = [
  {
    thumbnailSrc: 'https://picsum.photos/id/237/200/300',
    fullSrc: 'https://picsum.photos/id/237/800/600',
    description: 'A Dog standing on a wooden floor'
  },
  {
    thumbnailSrc: 'https://picsum.photos/id/154/200/150',
    fullSrc: 'https://picsum.photos/id/154/200/150'
  }
]

const options = {
  // customLoadComponent: () => <h3>Loading</h3>
  // hidePagination: false,
  // externalLightbox: true,
  // rowHeight: '100px',
  // picsPerRow:3
}

const App = () => {
  return (
    <div>
      <PicGallery imgList={listOfImages} options={options} />
    </div>
  )
}

export default App
```

## License

MIT © [marcelrsoub](https://github.com/marcelrsoub)
