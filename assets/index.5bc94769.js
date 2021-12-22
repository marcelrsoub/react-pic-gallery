var P=Object.defineProperty,N=Object.defineProperties;var k=Object.getOwnPropertyDescriptors;var x=Object.getOwnPropertySymbols;var O=Object.prototype.hasOwnProperty,R=Object.prototype.propertyIsEnumerable;var y=(t,i,l)=>i in t?P(t,i,{enumerable:!0,configurable:!0,writable:!0,value:l}):t[i]=l,d=(t,i)=>{for(var l in i||(i={}))O.call(i,l)&&y(t,l,i[l]);if(x)for(var l of x(i))R.call(i,l)&&y(t,l,i[l]);return t},C=(t,i)=>N(t,k(i));import{r as a,R as e,T as M,a as T,S,b as A}from"./vendor.530ee378.js";const D=function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function l(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerpolicy&&(r.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?r.credentials="include":o.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(o){if(o.ep)return;o.ep=!0;const r=l(o);fetch(o.href,r)}};D();let s={};s.lightbox={position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"rgba(0, 0, 0, 0.454)",backdropFilter:"blur(6px)",zIndex:9999999,display:"grid",gridTemplateRows:"60px | auto | 300px",justifyContent:"center",alignContent:"center"};s.topCustomContent={position:"absolute",top:0};s.bottomCustomContent={position:"absolute",bottom:0};s.LbButton={float:"right",textDecoration:"none",color:"white",padding:"5px",border:"1px solid white",borderRadius:"5px"};s.ABtn={float:"right",textDecoration:"none",color:"white"};s.DescriptionDiv={background:"white",padding:"10px",color:"#666",textAlign:"center",position:"relative",zIndex:-1};s.Wrapper={display:"flex",width:"100%",minWidth:200,height:"100%"};s.Grid={display:"grid",gridTemplateRows:"1fr",gap:"2px",width:"100%",height:"auto"};const E=`
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
`;function G(){return a.exports.useEffect(()=>{const t=document.querySelector("#react-pic-style");if(t)t.innerHTML=t.innerHTML+E;else{const i=document.createElement("style");i.id="react-pic-style",i.innerHTML=E,document.body.appendChild(i)}return()=>{var i;(i=document.querySelector("#react-pic-style"))==null||i.remove()}},[]),e.createElement("div",{className:"lds-dual-ring"})}const L=t=>{var c;const[i,l]=e.useState(""),n=((c=t.options)==null?void 0:c.customLoadComponent)!==void 0?t.options.customLoadComponent:G,[o,r]=a.exports.useState(!0);return e.useEffect(()=>{r(!0);const u=new AbortController;return t.imgSrc&&fetch(t.imgSrc).then(m=>m.blob()).then(m=>{l(URL.createObjectURL(m)),r(!1)}),()=>{u.abort()}},[t.imgSrc]),o?e.createElement("div",{style:{height:"100%",width:"100%",display:"flex",alignItems:"center",alignContent:"center",justifyContent:"center",background:t.lightboxMode?"":"rgba(0, 0, 0, 0.157)",border:t.lightboxMode?"":"1px solid rgba(0, 0, 0,0.3)"}},e.createElement(n,null)):e.createElement("img",{src:i,alt:"",id:t.id,style:d({},t.style),onClick:t.onClick})},v=t=>{var r,c,u,m,h,f;const[i,l]=a.exports.useState(""),[n,o]=a.exports.useState(t.currentImgIndex);return a.exports.useCallback(()=>o(n+1),[n]),a.exports.useCallback(()=>o(n-1),[n]),e.useEffect(()=>{var p,b;const g=((p=t.imgList[n])==null?void 0:p.fullSrc)?t.imgList[n].fullSrc:((b=t.imgList[n])==null?void 0:b.thumbnailSrc)?t.imgList[n].thumbnailSrc:null;g&&l(g),document.body.style.overflow="hidden"},[n]),e.createElement("div",{className:"reactPic-lightbox",style:s.lightbox,onClick:g=>{document.body.style.overflow="",g.target.className==="reactPic-lightbox"&&t.onClose()}},e.createElement("div",{style:s.topCustomContent,className:"reactPic-topCustomContent"},(r=t.topCustomContent)==null?void 0:r.call(t,{closeLightbox:t.onClose,imgObject:t.imgList[n]})),e.createElement("div",null,e.createElement(M,null,e.createElement(T,{wrapperStyle:{overflow:"visible"}},e.createElement(L,{lightboxMode:!0,imgSrc:i,id:"lightboxImg",style:{maxWidth:"80vw",maxHeight:"calc(80vh - 20px)",margin:"auto",zIndex:99999999999}}))),n-1>=0&&!((c=t.options)==null?void 0:c.hidePagination)&&e.createElement("div",{className:"react-lightbox-prevBtn",style:{position:"absolute",left:20,height:50,top:"calc(50% - 50px)",fontSize:50,cursor:"pointer",color:"white",display:((u=t.options)==null?void 0:u.hidePagination)?"none":"inherit"},onClick:n-1>=0?()=>o(n-1):void 0},"\u2039"),n+1<t.imgList.length&&!((m=t.options)==null?void 0:m.hidePagination)&&e.createElement("div",{className:"react-lightbox-nextBtn",style:{position:"absolute",right:20,height:50,top:"calc(50% - 50px)",fontSize:50,cursor:"pointer",color:"white",display:((h=t.options)==null?void 0:h.hidePagination)?"none":"inherit"},onClick:n+1<t.imgList.length?()=>o(n+1):void 0},"\u203A")),e.createElement("div",{style:s.bottomCustomContent,className:"reactPic-bottomCustomContent"},(f=t.bottomCustomContent)==null?void 0:f.call(t,{closeLightbox:t.onClose,imgObject:t.imgList[n]})))};function H(t){var l;const i=a.exports.useCallback(n=>()=>t.onOpen(n),[]);return e.createElement("div",{className:"reactPic-grid",style:C(d({},s.Grid),{gridTemplateColumns:`repeat(${((l=t.options)==null?void 0:l.picsPerRow)?t.options.picsPerRow:"3"}, 1fr)`})},t.imgList.map((n,o)=>{var r;return e.createElement("div",{key:n.thumbnailSrc?n.thumbnailSrc:n.fullSrc,className:"reactPic-imgDiv",style:{overflow:"hidden",width:"100%",height:"100%",minHeight:"150px"}},e.createElement("div",{className:"reactPic-innerImgDiv",style:{display:"flex",justifyContent:"center",alignItems:"center",overflow:"hidden !important",width:"100%",height:((r=t.options)==null?void 0:r.rowHeight)?t.options.rowHeight:"150px",cursor:"pointer"}},e.createElement(L,{options:t.options,imgSrc:n.thumbnailSrc?n.thumbnailSrc:n.fullSrc,style:{flexShrink:0,minWidth:"100%",minHeight:"100%"},onClick:i(o)})))}))}var j=e.memo(H);const B={downloadBtnDisplay:!0,descriptionBoxDisplay:!0,navigation:!0};function w(t){var m;const[i,l]=a.exports.useState(!1),[n,o]=a.exports.useState(0),r=d(d({},B),t.options);a.exports.useEffect(()=>{typeof t.setExtLightboxChildren=="function"&&(i?t.setExtLightboxChildren(e.createElement(v,{open:i,currentImgIndex:n,imgList:t.imgList,topCustomContent:t.topCustomContent,bottomCustomContent:t.bottomCustomContent,options:r,onClose:()=>l(!1)})):t.setExtLightboxChildren(void 0))},[i]);const c=a.exports.useCallback(h=>{o(h),l(!0)},[]),u=a.exports.useCallback(()=>{l(!1)},[]);return e.createElement("div",{className:"reactPic-wrapper",style:s.Wrapper},i&&!((m=t.options)==null?void 0:m.externalLightbox)?e.createElement(v,{open:i,currentImgIndex:n,imgList:t.imgList,topCustomContent:t.topCustomContent,bottomCustomContent:t.bottomCustomContent,options:r,onClose:u}):null,e.createElement(j,{options:t.options,imgList:t.imgList,onOpen:c}))}const I=[{thumbnailSrc:"https://picsum.photos/id/237/200/300",fullSrc:"https://picsum.photos/id/237/800/600"},{thumbnailSrc:"https://picsum.photos/id/154/200/150",fullSrc:"https://picsum.photos/id/154/200/150"},{thumbnailSrc:"https://picsum.photos/id/385/300/200",fullSrc:"https://picsum.photos/id/385/800/600"},{thumbnailSrc:"https://picsum.photos/id/25/100/250",fullSrc:"https://picsum.photos/id/25/100/250"},{thumbnailSrc:"https://picsum.photos/id/35/120/200",fullSrc:"https://picsum.photos/id/35/800/600"},{thumbnailSrc:"https://picsum.photos/id/84/280/185",fullSrc:"https://picsum.photos/id/84/800/600"},{thumbnailSrc:"https://picsum.photos/id/185/200/300",fullSrc:"https://picsum.photos/id/185/800/600"},{thumbnailSrc:"https://picsum.photos/id/55/200/150",fullSrc:"https://picsum.photos/id/55/800/600"},{thumbnailSrc:"https://picsum.photos/id/852/300/200",fullSrc:"https://picsum.photos/id/852/800/600"}],U=()=>{const[t,i]=e.useState(e.createElement(e.Fragment,null)),l={hidePagination:!0,externalLightbox:!0,picsPerRow:4};return e.createElement(e.Fragment,null,e.createElement("div",{children:t}),e.createElement(w,{imgList:I,options:l,setExtLightboxChildren:n=>i(n)}))},W=()=>{const t={};return e.createElement(e.Fragment,null,e.createElement("div",{className:"card"},e.createElement("h1",null,"react-pic-gallery"),e.createElement("hr",null),e.createElement("p",null,"Image gallery and lightbox"),e.createElement(S,{language:"tsx",showLineNumbers:!0},`import React from 'react'
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
      <PicGallery
        imgList={listOfImages}
      />
  )
}`),e.createElement("div",{style:{display:"flex",justifyContent:"center",alignItems:"center"}},e.createElement("div",{style:{maxWidth:300}},e.createElement(w,{imgList:I,options:t})))),e.createElement("div",{className:"card"},e.createElement("h2",null,"External Lightbox"),e.createElement("p",null,"If your PicGallery's lightbox is showing up inside an element instead of taking up the full screen, you can use the External Lightbox option. This option uses an external div, as shown below."),e.createElement(S,{language:"tsx",showLineNumbers:!0},`const App = () => {
  const [lightboxNode, setLightboxNode] = React.useState<
    JSX.Element | undefined
  >(<></>)

  const options2 = {
    hidePagination: true,
    externalLightbox: true,
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
}`),e.createElement("p",null,"Using ",e.createElement("b",null,"External Lightbox")," brings a performance drop."),e.createElement(U,null)))};A.render(e.createElement(e.StrictMode,null,e.createElement(W,null)),document.getElementById("root"));
