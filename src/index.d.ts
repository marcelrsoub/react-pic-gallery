/// <reference types="react" />
export interface imageObject {
  fullSrc: string;
  thumbnailSrc?: string;
  description?: string;
  [key:string]:string
}
export type Options = {
    downloadBtnDisplay?: boolean;
    downloadCustomBtn?: (props: { imgObj: imageObject }) => JSX.Element;
    descriptionBoxDisplay?: boolean;
    descriptionCustomBox?: (props: { imgObj: imageObject }) => JSX.Element;
    externalLightbox?:boolean;
    hidePagination?: boolean;
  };

declare const PicGallery: (props: {
  imgList: imageObject[];
  options?: Options;
}) => JSX.Element;
export default PicGallery;