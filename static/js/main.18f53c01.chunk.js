(this["webpackJsonpreact-pic-gallery-example"]=this["webpackJsonpreact-pic-gallery-example"]||[]).push([[0],{14:function(t,e,n){},15:function(t,e,n){"use strict";n.r(e);n(7);var i,o=n(0),a=n.n(o),l=n(5),r=n.n(l),c=n(2),s=n(1),d=n(3),p=n(4),u='\n.lds-dual-ring {\n  display: inline-block;\n  width: 40px;\n  height: 40px;\n}\n.lds-dual-ring:after {\n  content: " ";\n  display: block;\n  width: 32px;\n  height: 32px;\n  margin: 8px;\n  border-radius: 50%;\n  border: 3px solid rgba(185, 185, 185, 0.466);\n  border-color: rgba(185, 185, 185, 0.466) transparent rgba(185, 185, 185, 0.466) transparent;\n  animation: lds-dual-ring 1.2s linear infinite;\n}\n@keyframes lds-dual-ring {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n';function m(){var t=document.querySelector("#react-pic-style");if(t)t.innerHTML=t.innerText+u;else{var e=document.createElement("style");e.id="react-pic-style",e.innerHTML=u,document.body.appendChild(e)}return a.a.createElement("div",{className:"lds-dual-ring"})}var h=function(t){var e=a.a.useState(""),n=Object(c.a)(e,2),i=n[0],o=n[1];return a.a.useEffect((function(){var e=new AbortController;return t.imgSrc&&fetch(t.imgSrc).then((function(t){return t.blob()})).then((function(t){o(URL.createObjectURL(t))})),function(){e.abort()}}),[t.imgSrc]),i?a.a.createElement("img",{src:i,alt:"",style:Object(d.a)({},t.style),onClick:function(){t.onClick()}}):a.a.createElement("div",{style:{height:"100%",width:"100%",display:"flex",alignItems:"center",alignContent:"center",justifyContent:"center",background:"rgba(0, 0, 0, 0.157)",border:"1px solid rgba(0, 0, 0,0.3)"}},a.a.createElement(m,null))},g={};g.ModalDiv=(i={position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"rgba(0, 0, 0, 0.454)",backdropFilter:"blur(6px)",display:"flex",zIndex:9999999},Object(s.a)(i,"display","grid"),Object(s.a)(i,"gridTemplateRows","60px | auto | 300px"),Object(s.a)(i,"justifyContent","center"),Object(s.a)(i,"alignContent","center"),i),g.LbButtonsDiv={position:"absolute",top:"10px",width:"calc(100% - 20px)"},g.LbButton={float:"right",textDecoration:"none",color:"white",padding:"5px",border:"1px solid white",borderRadius:"5px"},g.ABtn={float:"right",textDecoration:"none",color:"white"},g.DescriptionDiv={background:"white",padding:"10px",color:"#666",textAlign:"center",position:"relative",zIndex:-1},g.Wrapper={display:"flex",width:"100%",minWidth:200,height:"100%"},g.Grid={display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gridTemplateRows:"1fr",gap:"2px",width:"100%",height:"auto"};var b=function(t){var e,n,i,o,l,r,s=a.a.useState(""),d=Object(c.a)(s,2),u=d[0],h=d[1],b=t.options.descriptionCustomBox;return a.a.useEffect((function(){var e,n,i=null!==(e=t.imgObj)&&void 0!==e&&e.fullSrc?t.imgObj.fullSrc:null!==(n=t.imgObj)&&void 0!==n&&n.thumbnailSrc?t.imgObj.thumbnailSrc:null;i&&fetch(i).then((function(t){return t.blob()})).then((function(t){h(URL.createObjectURL(t))})),document.body.style.overflow="hidden"}),[t.imgObj]),a.a.createElement("div",{className:"reactPic-lightbox",onClick:function(e){document.body.style.overflow="","reactPic-lightbox"===e.target.className&&t.onClose()},style:g.ModalDiv},a.a.createElement("div",{style:g.LbButtonsDiv},null!==(e=t.options)&&void 0!==e&&e.downloadBtnDisplay||null!==(n=t.options)&&void 0!==n&&n.downloadCustomBtn?t.options.downloadCustomBtn?a.a.createElement("a",{href:u,download:!0,style:g.ABtn},t.options.downloadCustomBtn()):a.a.createElement("a",{href:u,download:!0,style:g.LbButton},"Download"):null),""===u?a.a.createElement("div",{style:{display:"block",margin:"auto"}},a.a.createElement(m,null)):a.a.createElement("div",null,a.a.createElement(p.b,{defaultScale:1,options:{limitToBounds:!0,limitToWrapper:!0,transformEnabled:!0,centerContent:!0}},a.a.createElement(p.a,null,a.a.createElement("img",{src:u,alt:"",id:"lightboxImg",style:{maxWidth:"80vw",maxHeight:"calc(80vh - 20px)",margin:"auto",zIndex:99999999999}})),null!==(i=t.options)&&void 0!==i&&i.descriptionBoxDisplay&&(null!==(o=t.imgObj)&&void 0!==o&&o.description||b)?b?a.a.createElement(b,{imgObj:t.imgObj,onClose:t.onClose},null===(l=t.imgObj)||void 0===l?void 0:l.description):a.a.createElement("div",{className:"reactPic-description",style:g.DescriptionDiv},null===(r=t.imgObj)||void 0===r?void 0:r.description):null),t.hasPrevious&&a.a.createElement("div",{className:"react-lightbox-prevBtn",style:{position:"absolute",left:20,top:"50%",fontSize:50,cursor:"pointer",color:"white",display:t.options.hidePagination?"none":"inherit"},onClick:function(){t.onNavigation("previous")}},"\u2039"),t.hasNext&&a.a.createElement("div",{className:"react-lightbox-nextBtn",style:{position:"absolute",right:20,top:"50%",fontSize:50,cursor:"pointer",color:"white",display:t.options.hidePagination?"none":"inherit"},onClick:function(){t.onNavigation("next")}},"\u203a")))},f={downloadBtnDisplay:!0,descriptionBoxDisplay:!0,navigation:!0};var x=function(t){var e=a.a.useState(!1),n=Object(c.a)(e,2),i=n[0],l=n[1],r=a.a.useState(0),s=Object(c.a)(r,2),p=s[0],u=s[1],m=Object(d.a)(Object(d.a)({},f),t.options);Object(o.useEffect)((function(){"function"==typeof t.setExtLightboxChildren&&(i?t.setExtLightboxChildren(a.a.createElement(b,{imgObj:t.imgList[p],options:m,onClose:function(){l(!1)}})):t.setExtLightboxChildren(null))}),[i]);var x=document.querySelector("#react-pic-style");if(x)x.innerHTML=x.innerHTML+"\n";else{var v=document.createElement("style");v.innerHTML=".react-transform-component { overflow: unset !important; }\n",v.id="react-pic-style",document.body.appendChild(v)}return a.a.createElement("div",{className:"reactPic-wrapper",style:g.Wrapper},i&&!t.options.externalLightbox?a.a.createElement(b,{imgObj:t.imgList[p],options:m,onNavigation:function(e){"next"===e&&p+1<t.imgList.length?u(p+1):"previous"===e&&p-1>=0&&u(p-1)},onClose:function(){l(!1)},hasPrevious:p-1>=0,hasNext:p+1<t.imgList.length}):null,a.a.createElement("div",{className:"reactPic-grid",style:g.Grid},t.imgList.map((function(t,e){return a.a.createElement("div",{key:t.thumbnailSrc?t.thumbnailSrc:t.fullSrc,className:"reactPic-imgDiv",style:{overflow:"hidden",width:"100%",height:"100%",minHeight:"150px"}},a.a.createElement("div",{className:"reactPic-innerImgDiv",style:{display:"flex",justifyContent:"center",alignItems:"center",overflow:"hidden !important",width:"100%",height:m.rowHeight?m.rowHeight:"150px",cursor:"pointer"}},a.a.createElement(h,{imgSrc:t.thumbnailSrc?t.thumbnailSrc:t.fullSrc,style:{flexShrink:0,minWidth:"100%",minHeight:"100%"},onClick:function(){u(e),l(!i)}})))}))))},v=(n(14),[{thumbnailSrc:"https://picsum.photos/id/237/200/300",fullSrc:"https://picsum.photos/id/237/800/600",description:"A Dog standing on a wooden floor."},{thumbnailSrc:"https://picsum.photos/id/154/200/150",fullSrc:"https://picsum.photos/id/154/200/150",hello:"hello, there!"},{thumbnailSrc:"https://picsum.photos/id/385/300/200",fullSrc:"https://picsum.photos/id/385/800/600"},{thumbnailSrc:"https://picsum.photos/id/25/100/250",fullSrc:"https://picsum.photos/id/25/100/250"},{thumbnailSrc:"https://picsum.photos/id/35/120/200",fullSrc:"https://picsum.photos/id/35/800/600"},{thumbnailSrc:"https://picsum.photos/id/84/280/185",fullSrc:"https://picsum.photos/id/84/800/600"},{thumbnailSrc:"https://picsum.photos/id/185/200/300",fullSrc:"https://picsum.photos/id/185/800/600"},{thumbnailSrc:"https://picsum.photos/id/55/200/150",fullSrc:"https://picsum.photos/id/55/800/600"},{thumbnailSrc:"https://picsum.photos/id/852/300/200",fullSrc:"https://picsum.photos/id/852/800/600"}]),y=function(){var t=a.a.useState(a.a.createElement(a.a.Fragment,null)),e=Object(c.a)(t,2),n=e[0],i=e[1];return a.a.createElement(a.a.Fragment,null,a.a.createElement("div",{children:n}),a.a.createElement(x,{imgList:v,options:{downloadBtnDisplay:!1,externalLightbox:!0},setExtLightboxChildren:function(t){return i(t)}}))},E=function(){return a.a.createElement(a.a.Fragment,null,a.a.createElement("div",{className:"card"},a.a.createElement("h1",null,"react-pic-gallery"),a.a.createElement("hr",null),a.a.createElement("p",null,"Image gallery and lightbox"),a.a.createElement("div",{style:{display:"flex",justifyContent:"center",alignItems:"center"}},a.a.createElement("div",{style:{maxWidth:300}},a.a.createElement(x,{imgList:v,options:{}})))),a.a.createElement("div",{className:"card"},a.a.createElement("h2",null,"External Lightbox"),a.a.createElement("p",null,"If your PicGallery is a child component of a child component of a ..., the lightbox might show up inside the components. In order to correct this problem you can use an external component and pass the lightbox to it everytime a picture is opened."),a.a.createElement(y,null)))};r.a.render(a.a.createElement(E,null),document.getElementById("root"))},6:function(t,e,n){t.exports=n(15)},7:function(t,e,n){}},[[6,1,2]]]);
//# sourceMappingURL=main.18f53c01.chunk.js.map