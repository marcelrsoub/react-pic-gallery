import React from 'react'

const extraStyle = `
.lds-dual-ring {
  display: inline-block;
  width: 40px;
  height: 40px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 32px;
  height: 32px;
  margin: 8px;
  border-radius: 50%;
  border: 3px solid rgba(185, 185, 185, 0.466);
  border-color: rgba(185, 185, 185, 0.466) transparent rgba(185, 185, 185, 0.466) transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
`

// 3. Lightbox and Image Component

export default function CircularLoading() {
  const styleTag = document.querySelector('#react-pic-style')
  if (!styleTag) {
    const sheet = document.createElement('style')
    sheet.id = 'react-pic-style'
    sheet.innerHTML = extraStyle
    document.body.appendChild(sheet)
  }else{
    styleTag.innerHTML = styleTag.innerHTML + extraStyle;
  }
  return <div className='lds-dual-ring'></div>
}
