import css from "styled-jsx/css";

const SlugStyle = css`
:global(.image-gallery-image){
  width: 443px;
  height: 100%;
}
:global(.img-brand > div){
  float: right;
}
.header-product{
  margin-bottom: 20px;
}
.header-product-title{
  font-size: 22px;
  margin-bottom: 10px;
}
.header-product-rating{
  font-size: 14px;
  margin-bottom: 10px;
}
:global(.header-product-rating-rate){
  font-size: 14px;
  margin-left: 0px;
}
.header-product-rating-detail{
  font-size: 14px;
  padding-left: 5px;
  vertical-align: middle;
}

.info-product{
  padding: 20px 0px;
  border-top: 1px solid rgb(229, 231, 233);
}
.info-product-left{
  font-size: 14px;
  text-transform: uppercase;
  color: #6c757d; 
  width: 70px;
}
.info-product-body{
  padding-left: 20px;
}
.info-product-body-title{
  font-size: 14px;
}
.info-product-body-price{
  font-weight: 700;
  font-size: 22px;
  color: #d63031;
}
.info-product-body-price-disc{
  font-weight: 400;
  color: #bbb;
  text-decoration: line-through;
}

.ulasan-rating{
  display: flex!important;
}
:global(.ulasan-rating-rate){
  font-size: 14px;
  margin-left: 0px;
  margin-top: -1px;
}
.ulasan-rating-text{
  font-size: 14px;
  padding-left: 3px;
  padding-right: 8px;
  color: rgba(0, 0, 0, 0.45);
}

.info-item{
  padding: 0px 16px;
  border-right: 1px solid rgb(229, 231, 233);
}
.info-item:last-child{
  border-right: 0;
}
.info-item:first-of-type{
  padding-left: 0;
}
.info-item p{
  margin-bottom: 0;
  font-size: 14px;
}
.info-item p:first-of-type{
  color: #828282;
  font-weight: 300;
}

.diskusi-section:not(:last-child){
  box-shadow: 0 .1rem .1rem rgba(0,0,0,.05)!important;
}

:global(.wh-80){
  width: 80px;
  height: 80px;
}
:global(.CircularProgressbar .CircularProgressbar-text){
  dominant-baseline: central;
  fill: rgba(0, 0, 0, 0.85);
  font-size: 1.7rem;
  font-weight: 600;
}
:global(.ulasan-star-rating.ant-progress-show-info .ant-progress-outer){
  padding-right: calc(4em);
}
:global(.ulasan-star-rating.ant-progress-status-success .ant-progress-text, 
        .ulasan-star-rating > .ant-progress-text){
  color: rgba(0, 0, 0, 0.45);
  margin-left: -10px;
}
:global(.ulasan-star-rating.ant-progress-status-success .ant-progress-bg, .ulasan-star-rating .ant-progress-bg){
  background-color: #fbbc04;
}

:global(.product-images .image-gallery-thumbnails){
  overflow: scroll;
}
:global(.product-images > .image-gallery.fullscreen-modal){
  z-index: 1040;
  background: #000000cc;
}
:global(.product-images > .image-gallery > .image-gallery-content.fullscreen){
  background: #00000000;
}
:global(.product-images > .image-gallery > .image-gallery-content.fullscreen .image-gallery-image){
  max-height: calc(100vh - 200px);
}
:global(.image-gallery-thumbnail.active, .image-gallery-thumbnail:hover, .image-gallery-thumbnail:focus){
  border: 4px solid #6c757d;
}

:global(.recomend-section .slick-list){
  padding-bottom: 20px;
}
:global(.recomend-section .slick-prev, .recomend-section .slick-next){
  top: calc(50% - 10px);
}
:global(.recomend-section .slick-prev:before, .recomend-section .slick-next:before){
  display: none;
}

:global(.card-item-popup){
  box-shadow: rgb(202, 211, 225) 0px 1px 4px 0px;
  border: 0;
}
:global(.card-item-popup-img){
  width: 65px;
  height: 65px;
  object-fit: cover;
  border-radius: .2rem;
}
:global(.card-item-popup.another-item){
  box-shadow: none; 
  margin-top: 30px;
}
:global(.card-item-popup.another-item > .another-product .card){
  margin-bottom: 15px !important;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 6px 0px !important;
}

:global(.scrolling-wrapper){
  overflow-x: auto;
}

:global(.ongkir-popover .ant-popover-inner){
  border-radius: 8px !important;
}

:global(.ongkir-popover .ant-popover-inner-content){
  width: 300px;
}
`

export default SlugStyle
