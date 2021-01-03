import React from 'react'

import { ExampleComponent } from 'react-pic-gallery'
import 'react-pic-gallery/dist/index.css'

type imageObject = {
  thumbnailSrc:string,
  fullSrc:string
}

const listOfImages:imageObject[]=[
  {thumbnailSrc:"https://picsum.photos/id/237/200/300",fullSrc:""},
  {thumbnailSrc:"https://picsum.photos/id/154/200/150",fullSrc:""},
  {thumbnailSrc:"https://picsum.photos/id/385/300/200",fullSrc:""},
  {thumbnailSrc:"https://picsum.photos/id/25/100/250",fullSrc:""},
  {thumbnailSrc:"https://picsum.photos/id/35/120/200",fullSrc:""},
  {thumbnailSrc:"https://picsum.photos/id/84/280/185",fullSrc:""},
  {thumbnailSrc:"https://picsum.photos/id/237/200/300",fullSrc:""},
  {thumbnailSrc:"https://picsum.photos/id/154/200/150",fullSrc:""},
  {thumbnailSrc:"https://picsum.photos/id/385/300/200",fullSrc:""},
]

const App = () => {
  return (
    <div style={{background:'grey',padding:20,position:'absolute',width:'auto',height:'100%', border:'1px solid black'}}>
      <ExampleComponent imgList={listOfImages} />
    </div>
  )
}

export default App
