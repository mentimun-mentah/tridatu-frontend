import css from "styled-jsx/css";

export const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

const ProductsStyle = css`
:global(.filter-menu){
  border: 0;
}
:global(.shadow-filter){
  box-shadow: rgba(49, 53, 59, 0.12) 0px 1px 6px 0px;
}

:global(.filter-menu .ant-menu-item:not(:last-child)){
  margin-bottom: 4px;
}
:global(.filter-menu > .ant-menu-submenu > .ant-menu-submenu-title){
  height: 30px !important;
  line-height: 30px !important;
}
:global(.filter-menu .ant-menu-submenu-title){
  height: 30px !important;
  line-height: 30px !important;
  padding-left: 15px !important;
  margin-left: 0px !important;
}
:global(.filter-menu .ant-menu-sub.ant-menu-inline > .ant-menu-item){
  height: 30px !important;
  line-height: 30px !important;
  padding-left: 40px !important;
}
:global(.filter-menu .ant-menu-sub.ant-menu-inline > .ant-menu-item.checkbox-item){
  padding-left: 20px !important;
  margin-bottom: 5px;
  height: auto !important;
}
:global(.ant-menu-submenu-vertical > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::after, 
        .ant-menu-submenu-vertical-left > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::after, 
        .ant-menu-submenu-vertical-right > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::after, 
        .ant-menu-submenu-inline > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::after, 
        .ant-menu-submenu-vertical > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::before, 
        .ant-menu-submenu-vertical-left > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::before, 
        .ant-menu-submenu-vertical-right > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::before, 
        .ant-menu-submenu-inline > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::before){
  background: linear-gradient(to right, #232323, #232323);
}
:global(.ant-menu-submenu-vertical > .ant-menu-submenu-title .ant-menu-submenu-arrow::before, 
        .ant-menu-submenu-vertical-left > .ant-menu-submenu-title .ant-menu-submenu-arrow::before, 
        .ant-menu-submenu-vertical-right > .ant-menu-submenu-title .ant-menu-submenu-arrow::before, 
        .ant-menu-submenu-inline > .ant-menu-submenu-title .ant-menu-submenu-arrow::before, 
        .ant-menu-submenu-vertical > .ant-menu-submenu-title .ant-menu-submenu-arrow::after, 
        .ant-menu-submenu-vertical-left > .ant-menu-submenu-title .ant-menu-submenu-arrow::after, 
        .ant-menu-submenu-vertical-right > .ant-menu-submenu-title .ant-menu-submenu-arrow::after, 
        .ant-menu-submenu-inline > .ant-menu-submenu-title .ant-menu-submenu-arrow::after){
  background: linear-gradient(to right, #232323, #232323);
}

:global(.ant-menu-sub > .ant-menu-submenu .ant-menu-submenu-arrow::before,
        .ant-menu-sub > .ant-menu-submenu .ant-menu-submenu-arrow::after){
  background: linear-gradient(to right, #6c757d, #6c757d) !important;
}

:global(.filter-menu:not(.ant-menu-horizontal) .ant-menu-item-selected){
  background-color: #cccccc66;
}
:global(.filter-menu:not(.ant-menu-horizontal) .ant-menu-item-selected.checkbox-item){
  background-color: transparent;
}
:global(.ant-menu-vertical .ant-menu-item::after, 
        .ant-menu-vertical-left .ant-menu-item::after, 
        .ant-menu-vertical-right .ant-menu-item::after, 
        .ant-menu-inline .ant-menu-item::after){
  border-right: 3px solid #6c757d;
}
:global(.ant-menu-inline .ant-menu-item.checkbox-item::after){
  border-right: 0px;
}
:global(.ant-menu-item:active, .ant-menu-submenu-title:active){
  background-color: #cccccc66;
}

// :global(.ant-menu-vertical .ant-menu-submenu, 
//         .ant-menu-vertical-left .ant-menu-submenu, 
//         .ant-menu-vertical-right .ant-menu-submenu, 
//         .filter-menu .ant-menu-submenu:last-child){
//   border-bottom: 1px solid #6c757d2b;
// }
// :global(.filter-menu .filter-checkbox > .ant-menu-sub:last-child){
//   border-bottom: 1px solid #6c757d2b !important;
// }

:global(.filter-menu .title-filter:not(:first-of-type)){
  border-top: 1px solid #6c757d2b !important;
}
:global(.checkbox-item > .ant-checkbox-wrapper){
  width: 100%;
  line-height: 0 !important;
}

:global(.filter-rate .ant-rate-star-first > .anticon){
  margin-right: 0;
}
:global(.filter-rate > .ant-rate-star){
  width: 20px;
}
:global(.filter-tag){
  margin-right: 7px;
  margin-bottom: 7px;
  padding: 4px 10px;
  background: transparent;
  border-radius: .25rem;
}
:global(.card-mobile-filter:first-child){
  margin-top: .5rem;
}
:global(.card-mobile-filter){
  margin-bottom: .5rem;
}
:global(.filter-category-body){
  max-height: 200px;
  overflow-y: auto;
}

:global(.scrollable-submenu > .ant-menu-sub.ant-menu-inline, .scrollable-submenu){
  max-height: 300px;
  overflow: scroll;
}

:global(.scrollable-submenu-brand){
  max-height: 350px;
  overflow: hidden;
}
:global(.scrollable-submenu-brand > .ant-menu-sub.ant-menu-inline){
  overflow: scroll;
  max-height: 250px;
}

:global(.scrollable-submenu-category > .ant-menu-sub.ant-menu-inline, .scrollable-submenu-category){
  max-height: 450px;
  overflow: scroll;
}

`
export default ProductsStyle
