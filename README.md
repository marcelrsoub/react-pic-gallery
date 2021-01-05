# react-pic-gallery

> 

[![NPM](https://img.shields.io/npm/v/react-pic-gallery.svg)](https://www.npmjs.com/package/react-pic-gallery)

React library for a simple image gallery with lightbox implemented.

## Demo

![demo gif](https://i.imgur.com/f5O4m5i.gif)

## Install

```bash
npm install --save react-pic-gallery
```

## Usage

A list of objects containing a thumbnail source and the full source is the only needed parameter.

```tsx
import React from 'react'
import PicGallery, { imageObject } from 'react-pic-gallery'

const listOfImages:imageObject[]=[
  {thumbnailSrc:"https://picsum.photos/id/237/200/300",fullSrc:"https://picsum.photos/id/237/800/600",description:"A Dog standing on a wooden floor"},
  {thumbnailSrc:"https://picsum.photos/id/154/200/150",fullSrc:"https://picsum.photos/id/154/200/150"}
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
import PicGallery, { imageObject, Options } from 'react-pic-gallery'

const listOfImages:imageObject[]=[
  {thumbnailSrc:"https://picsum.photos/id/237/200/300",fullSrc:"https://picsum.photos/id/237/800/600",description:"A Dog standing on a wooden floor"},
  {thumbnailSrc:"https://picsum.photos/id/154/200/150",fullSrc:"https://picsum.photos/id/154/200/150"}
]

const optionsObj:Options = {
  downloadBtnDisplay:true,
  descriptionBoxDisplay:true
}

const App = () => {
  return (
    <div>
      <PicGallery imgList={listOfImages} options={optionsObj} />
    </div>
  )
}

export default App
```

## License

MIT © [marcelrsoub](https://github.com/marcelrsoub)
