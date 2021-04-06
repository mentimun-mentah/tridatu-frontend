import css from "styled-jsx/css";

const SlugStyle = css`
.main-content {
  margin-top: 20px;
  background: #FFF;
  border-radius: 4px;
  border: solid 1px #E1E1E1;
}
.post-body {
  padding: 30px;
  font-size: 14px;
  line-height: 1.6em;
}
.post-sidebar {
  margin-top: 20px;
  position: sticky;
  top: 5.5rem;
}
.postbox {
  width: 100%;
  margin-bottom: 20px;
  background-color: #FFFFFF;
  text-align: center;
}
.postbox-header {
  padding: 9px 0 9px 0;
  border-radius: 3px 3px 0 0;
  border-style: solid;
  border-color: #E0E0E0;
  border-width: 1px 1px 0;
}
.postbox-content {
  position: relative;
  text-align: center;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
}
.postbox-content-detail {
  border: 1px solid #E0E0E0;
  width: 100%;
  padding: 20px 5px;
}
.postbox-content--group-code {
  padding: 0 15px;
}
:global(.group-code-collapse.ant-collapse-icon-position-right > .ant-collapse-item > .ant-collapse-header) {
  padding: 12px 0px;
  padding-right: 20px;
}
:global(.border-top-code-promo > .ant-collapse-header){
  border-top: 1px solid #E0E0E0;
}
:global(.group-code-collapse.ant-collapse-icon-position-right > .ant-collapse-item > .ant-collapse-header .ant-collapse-arrow) {
  right: 0px;
}
:global(.group-code-collapse.ant-collapse-ghost > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box) {
  padding: 0;
  padding-bottom: 12px;
}
:global(.badge-count-code .ant-badge-count) {
  left: 0;
  right: unset;
  color: rgba(0, 0, 0, 0.85);
  font-size: 8px;
  background-color: #fff;
  box-shadow: 0 0 0 1px #d9d9d9 inset;
}
:global(.tooltip-info-promo .ant-tooltip-inner) {
  text-align: center;
}
:global(.copy-code-btn .ant-typography-copy){
  color: #999;
}
:global(#terms-conditions-id > ol, #terms-conditions-id-mobile > ol){
  padding-left: 25px;
}
@media (max-width: 767px){
  .post-body {
    padding: 15px;
  }
  .main-content {
    margin-top: 0;
    border: 0;
  }
  .post-sidebar {
    margin-top: 10px;
  }
  :global(.main-column){
    padding-left: 0;
    padding-right: 0;
  }
  .postbox-content-mobile{
    text-align: inherit;
  }
  .postbox-content-detail {
    padding: 15px;
  }
}
`

export default SlugStyle
