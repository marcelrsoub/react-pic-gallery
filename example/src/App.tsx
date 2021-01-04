import React from 'react'
import PicGallery, { imageObject } from 'react-pic-gallery'

const listOfImages:imageObject[]=[
  {thumbnailSrc:"https://picsum.photos/id/237/200/300",fullSrc:"https://picsum.photos/id/237/800/600"},
  {thumbnailSrc:"https://picsum.photos/id/154/200/150",fullSrc:"https://picsum.photos/id/154/200/150"},
  {thumbnailSrc:"https://picsum.photos/id/385/300/200",fullSrc:"https://picsum.photos/id/385/800/600"},
  {thumbnailSrc:"https://picsum.photos/id/25/100/250",fullSrc:"https://picsum.photos/id/25/100/250"},
  {thumbnailSrc:"https://picsum.photos/id/35/120/200",fullSrc:"https://picsum.photos/id/35/120/200"},
  {thumbnailSrc:"https://picsum.photos/id/84/280/185",fullSrc:"https://picsum.photos/id/84/280/185"},
  {thumbnailSrc:"https://picsum.photos/id/185/200/300",fullSrc:"https://picsum.photos/id/185/200/300"},
  {thumbnailSrc:"https://picsum.photos/id/55/200/150",fullSrc:"https://picsum.photos/id/55/200/150"},
  {thumbnailSrc:"https://picsum.photos/id/852/300/200",fullSrc:"https://picsum.photos/id/852/300/200"},
]

const App = () => {
  return (
    <div style={{background:'grey',padding:20,position:'absolute',width:'auto',height:'100%', border:'1px solid black'}}>
      <PicGallery imgList={listOfImages} />
    </div>
  )
}

export default App
