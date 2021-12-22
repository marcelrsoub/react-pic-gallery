import React from 'react'
import PicGallery from './lib/main'
import { Options } from './lib/models/models'
import SyntaxHighlighter from 'react-syntax-highlighter'
import './App.css'

const listOfImages = [
  {
    thumbnailSrc: 'https://picsum.photos/id/237/200/300',
    fullSrc: 'https://picsum.photos/id/237/800/600'
  },
  {
    thumbnailSrc: 'https://picsum.photos/id/154/200/150',
    fullSrc: 'https://picsum.photos/id/154/200/150'
  },
  {
    thumbnailSrc: 'https://picsum.photos/id/385/300/200',
    fullSrc: 'https://picsum.photos/id/385/800/600'
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

// const DescBox = (props)=>{
//   console.log("here")
//   return <div style={{background:'red'}}>{props.imgObj.hello}</div>
// }

const External = () => {
  const [lightboxNode, setLightboxNode] = React.useState<
    JSX.Element | undefined
  >(<></>)

  const options2 = {
    hidePagination: true,
    // externalLightbox: true,
    picsPerRow: 4
  }
  return (
    <>
      <div children={lightboxNode}></div>
      <PicGallery
        imgList={listOfImages}
        options={options2}
        setExtLightboxChildren={(children) => setLightboxNode(children)}
      />
    </>
  )
}

const App = () => {
  const options: Options = {
    // customLoadComponent: () => <h3>Loading</h3>
    // hidePagination: false,
    // externalLightbox: true,
  }

  return (
    <>
      <div className='card'>
        <h1>react-pic-gallery</h1>
        <hr />
        <p>Image gallery and lightbox</p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div style={{ maxWidth: 300 }}>
            <PicGallery imgList={listOfImages} options={options} />
          </div>
        </div>
      </div>
      <div className='card'>
        <h2>External Lightbox</h2>
        <p>
          If your PicGallery's lightbox is showing up inside an element instead
          of taking up the full screen, you can use the External Lightbox
          option. This option uses an external div, as shown below.
        </p>
        <SyntaxHighlighter
          language='tsx'
          showLineNumbers
          customStyle={{ textAlign: 'left' }}
        >
          {`const App = () => {
  const [lightboxNode, setLightboxNode] = React.useState<
    JSX.Element | undefined
  >(<></>)

  const options2 = {
    hidePagination: true,
    // externalLightbox: true,
    picsPerRow: 4
  }
  return (
    <>
      <div children={lightboxNode}></div>
      <PicGallery
        imgList={listOfImages}
        options={options2}
        setExtLightboxChildren={(children) => setLightboxNode(children)}
      />
    </>
  )
}`}
        </SyntaxHighlighter>
        <p>
          Using <b>External Lightbox</b> brings a performance drop.
        </p>
        <External />
      </div>
    </>
  )
}

export default App
