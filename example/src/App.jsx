import React from 'react'
import PicGallery from 'react-pic-gallery'
import './App.css'

const listOfImages=[
  {thumbnailSrc:"https://picsum.photos/id/237/200/300",fullSrc:"https://picsum.photos/id/237/800/600",description:"A Dog standing on a wooden floor."},
  {thumbnailSrc:"https://picsum.photos/id/154/200/150",fullSrc:"https://picsum.photos/id/154/200/150",hello:"hello, there!"},
  {thumbnailSrc:"https://picsum.photos/id/385/300/200",fullSrc:"https://picsum.photos/id/385/800/600"},
  {thumbnailSrc:"https://picsum.photos/id/25/100/250",fullSrc:"https://picsum.photos/id/25/100/250"},
  {thumbnailSrc:"https://picsum.photos/id/35/120/200",fullSrc:"https://picsum.photos/id/35/800/600"},
  {thumbnailSrc:"https://picsum.photos/id/84/280/185",fullSrc:"https://picsum.photos/id/84/800/600"},
  {thumbnailSrc:"https://picsum.photos/id/185/200/300",fullSrc:"https://picsum.photos/id/185/800/600"},
  {thumbnailSrc:"https://picsum.photos/id/55/200/150",fullSrc:"https://picsum.photos/id/55/800/600"},
  {thumbnailSrc:"https://picsum.photos/id/852/300/200",fullSrc:"https://picsum.photos/id/852/800/600"},
]

// const DownBtn = ()=>{
//   return <div>Download</div>
// }

// const DescBox = (props)=>{
//   console.log("here")
//   return <div style={{background:'red'}}>{props.imgObj.hello}</div>
// }

const options = {
  // downloadBtnDisplay:true,
  // downloadCustomBtn:DownBtn,
  // descriptionBoxDisplay:true,
  // descriptionCustomBox:DescBox
  // hidePagination: true
}

const App = () => {
  return (
    <div>
      <h1>react-pic-gallery</h1>

      <PicGallery imgList={listOfImages} options={options} />
    </div>
  )
}

export default App