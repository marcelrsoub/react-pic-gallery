import React from 'react'
import PicGallery, { imageObject } from 'react-pic-gallery'

const listOfImages:imageObject[]=[
  {thumbnailSrc:"https://picsum.photos/id/237/200/300",fullSrc:"https://picsum.photos/id/237/800/600",description:"A Dog standing on a wooden floor"},
  {thumbnailSrc:"https://picsum.photos/id/154/200/150",fullSrc:"https://picsum.photos/id/154/200/150"},
  {thumbnailSrc:"https://picsum.photos/id/385/300/200",fullSrc:"https://picsum.photos/id/385/800/600"},
  {thumbnailSrc:"https://picsum.photos/id/25/100/250",fullSrc:"https://picsum.photos/id/25/100/250"},
  {thumbnailSrc:"https://picsum.photos/id/35/120/200",fullSrc:"https://picsum.photos/id/35/800/600"},
  {thumbnailSrc:"https://picsum.photos/id/84/280/185",fullSrc:"https://picsum.photos/id/84/800/600"},
  {thumbnailSrc:"https://picsum.photos/id/185/200/300",fullSrc:"https://picsum.photos/id/185/800/600"},
  {thumbnailSrc:"https://picsum.photos/id/55/200/150",fullSrc:"https://picsum.photos/id/55/800/600"},
  {thumbnailSrc:"https://picsum.photos/id/852/300/200",fullSrc:"https://picsum.photos/id/852/800/600"},
]

const App = () => {
  return (
    <div style={{background:'#292929',padding:20,position:'absolute',width:'calc(100% - 35px)',height:'calc(100% - 35px)'}}>
      <PicGallery imgList={listOfImages} />
    </div>
  )
}

export default App
