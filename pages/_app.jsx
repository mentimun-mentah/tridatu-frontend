import React from "react";
import { Provider } from "react-redux";

import Head from "next/head";
import Layout from "components/Layout";

import * as actions from "store/actions";
import withReduxStore from "lib/with-redux-store";
import whyDidYouRender from "@welldone-software/why-did-you-render";

import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "antd-button-color/dist/css/style.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "react-image-gallery/styles/css/image-gallery.css";

import "react-circular-progressbar/dist/styles.css";

import "suneditor/dist/css/suneditor.min.css";

if (typeof window !== 'undefined' && process.env.NODE_ENV === "development") {
  whyDidYouRender(React)
}

const App = ({ Component, pageProps, store }) => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <title>Tridatu Bali ID</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="description" content="Tridatu Bali ID" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_FRONTEND_URL} />
        <link rel="icon" href="/tridatu-icon.png" />
        <link rel="stylesheet" href="/static/fontawesome/css/all.min.css" />
        <link rel="stylesheet" href="/static/css/utility.min.css" />
      </Head>

      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>

      <style global jsx>{`
        body {
          font-size: 1rem;
          line-height: 1.5;
          padding-top: 68px;
        }
        section {
          margin-bottom: 1.5rem;
        }

        /*DROPDOWN BOOTSTRAP*/
        .dropdown-item.active,
        .dropdown-item:active {
          color: #212529;
          background-color: #cccccc66;
        }
        /*DROPDOWN BOOTSTRAP*/

        /*FORM CONTROL BOOTSTRAP*/
        .form-control {
          font-size: 0.9rem;
        }
        .form-control:focus {
          border-color: #8c8c8c;
          box-shadow: 0 0 0 0.2rem rgb(140 140 140 / 14%);
        }
        .form-control::placeholder {
          color: black;
          opacity: 0.3;
        }
        /*FORM CONTROL BOOTSTRAP*/

        /*BADGE BOOTSTRAP*/
        .badge-primary {
          color: #d63031;
          background-color: #d6303130;
        }
        /*BADGE BOOTSTRAP*/

        /*ANT RATE*/
        .ant-rate {
          color: #fbbc04;
        }
        .ant-rate-star:not(:last-child) {
          margin-right: 4px;
        }
        /*ANT RATE*/

        /*ANT RADIO*/
        .ant-radio {
          top: -1px;
        }
        .ant-radio-checked::after {
          border: 1px solid #ff4d4f;
        }
        .ant-radio-wrapper:hover .ant-radio,
        .ant-radio:hover .ant-radio-inner,
        .ant-radio-input:focus + .ant-radio-inner {
          border-color: #ff4d4f;
        }
        .ant-radio-inner::after,
        .ant-checkbox-indeterminate .ant-checkbox-inner::after {
          background-color: #ff4d4f;
        }
        .ant-radio-checked .ant-radio-inner {
          border-color: #ff4d4f;
        }
        .ant-radio-input:focus + .ant-radio-inner {
          box-shadow: 0 0 0 3px rgb(255 77 79 / 0.08);
        }
        /*ANT RADIO*/

        /*ANT CHECKBOX*/
        .ant-checkbox-checked .ant-checkbox-inner {
          background-color: #ff4d4f;
          border-color: #ff4d4f;
        }
        .ant-checkbox-wrapper:hover .ant-checkbox-inner,
        .ant-checkbox:hover .ant-checkbox-inner {
          border-color: #ff4d4f;
        }
        .ant-checkbox-input:focus + .ant-checkbox-inner {
          border: 1px solid #ff4d4f;
        }
        .ant-checkbox-checked::after {
          border: 1px solid #ff4d4f;
        }
        /*ANT CHECKBOX*/

        /*ANT SLIDER*/
        :global(.ant-slider-handle) {
          background-color: white;
          border: solid 2px #ff4d4f;
        }
        :global(.ant-slider:hover .ant-slider-handle:not(.ant-tooltip-open)) {
          border-color: #d63031;
        }
        :global(.ant-slider-handle:focus, .ant-slider-handle-dragging.ant-slider-handle-dragging.ant-slider-handle-dragging) {
          border: solid 2px #ff4d4f;
          box-shadow: 0 0 0 5px #ff4d4f36;
        }
        :global(.ant-slider:hover .ant-slider-track) {
          background-color: #f9696be0;
        }
        :global(.ant-slider-track) {
          background-color: #f9696be0;
        }
        /*ANT SLIDER*/

        /*ANT INPUT NUMBER*/
        .ant-input-number {
          border-radius: 0.25rem;
        }
        .ant-input-number:hover {
          border-color: #8c8c8c;
        }
        .ant-input-number:focus,
        .ant-input-number-focused {
          box-shadow: none;
          border-color: #8c8c8c;
          border-radius: 0.25rem;
        }
        .ant-input-number-input {
          border-radius: 0.25rem;
        }
        .ant-input-number:hover .ant-input-number-handler-wrap {
          opacity: 0;
        }
        /*ANT INPUT NUMBER*/

        /*ANT INPUT*/
        .ant-input {
          border-radius: 0.25rem;
        }
        .ant-input:hover,
        .ant-input-search .ant-input:hover {
          border-color: #8c8c8c;
        }
        .ant-input:focus,
        .ant-input-focused,
        .ant-input-search .ant-input:focus {
          border-color: #8c8c8c;
          box-shadow: 0 0 0 2px rgb(151 151 151 / 21%);
        }

        .ant-input-group-addon{
          border-radius: .25rem;
        }

        .ant-select-selection-search-input{
          height: 100%!important;
        }
        /*ANT INPUT*/

        /*ANT CASCADER */
        .ant-cascader-input.ant-input {
          height: calc(1.5em + 0.75rem + 2px);
        }
        .ant-cascader-picker:focus .ant-cascader-input {
          border-color: #8c8c8c;
          box-shadow: 0 0 0 2px rgb(151 151 151 / 21%);
        }
        .ant-cascader-menu-item-active:not(.ant-cascader-menu-item-disabled),
        .ant-cascader-menu-item-active:not(.ant-cascader-menu-item-disabled):hover {
          background-color: #cccccc66;
        }
        /*ANT CASCADER */

        /*ANT SELECT*/
        .ant-select-selection-item {
          color: #495057;
        }
        .ant-select-single:not(.ant-select-customize-input)
          .ant-select-selector {
          border-radius: 0.25rem;
          height: calc(1.5em + 0.75rem + 2px);
        }
        .ant-select-single:not(.ant-select-customize-input)
          .ant-select-selector
          .ant-select-selection-search-input {
          // height: calc(1.5em + 0.75rem + 2px);
        }
        .ant-select-single .ant-select-selector .ant-select-selection-item,
        .ant-select-single
          .ant-select-selector
          .ant-select-selection-placeholder {
          line-height: 2.4;
        }
        .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
          border-color: #8c8c8c !important;
          box-shadow: 0 0 0 2px rgb(151 151 151 / 21%) !important;
          border-radius: 0.25rem;
        }
        .ant-select-focused:not(.ant-select-disabled).ant-select-single:not(.ant-select-customize-input)
          .ant-select-selector {
          border-color: #8c8c8c !important;
          box-shadow: 0 0 0 2px rgb(151 151 151 / 21%) !important;
          border-radius: 0.25rem;
        }
        .ant-select-focused.ant-select-single .ant-select-selector {
          border-color: #8c8c8c !important;
          box-shadow: 0 0 0 2px rgb(151 151 151 / 21%) !important;
          border-radius: 0.25rem;
        }
        .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
          background-color: #f5f5f5;
        }
        .ant-select-multiple .ant-select-selector {
          border-radius: 0.25rem;
        }
        .ant-select-focused {
          border-radius: 0.25rem;
          border-color: #8c8c8c;
          box-shadow: 0 0 0 2px rgb(151 151 151 / 21%);
        }
        .ant-select-focused:not(.ant-select-disabled).ant-select-multiple
          .ant-select-selector {
          border-radius: 0.25rem;
          border-color: #8c8c8c;
          // box-shadow: 0 0 0 2px rgb(151 151 151 / 21%);
        }
        /*ANT SELECT*/

        /*ANT TABS*/
        .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #343a40 !important;
        }
        .ant-tabs-ink-bar {
          background: #343a40 !important;
        }
        .ant-tabs-tab:hover {
          color: #505050 !important;
        }
        .ant-tabs-tab {
          color: #5d5d5d !important;
        }
        .ant-tabs-tab-btn:focus,
        .ant-tabs-tab-remove:focus,
        .ant-tabs-tab-btn:active,
        .ant-tabs-tab-remove:active {
          color: #343a40 !important;
        }
        /*ANT TABS*/

        /*ANT INPUT SEARCH*/
        .ant-input-affix-wrapper {
          border-radius: 0.25rem;
        }
        .ant-input-affix-wrapper:focus,
        .ant-input-affix-wrapper-focused {
          border-color: #8c8c8c !important;
          box-shadow: 0 0 0 2px rgb(151 151 151 / 21%) !important;
        }
        .ant-input-affix-wrapper:hover {
          border-color: #8c8c8c !important;
        }
        .ant-input-search-enter-button input:hover,
        .ant-input-search-enter-button input:focus {
          border-color: #8c8c8c !important;
          box-shadow: 0 0 0 2px rgb(151 151 151 / 21%) !important;
        }
        /*ANT INPUT SEARCH*/

        /*ANT BUTTON*/
        .ant-btn,
        .ant-btn-icon-only,
        .ant-btn-icon-only.ant-btn-lg {
          border-radius: 0.25rem;
        }
        .ant-btn:hover,
        .ant-btn:focus,
        .ant-btn:active {
          border-color: #8c8c8c !important;
          color: inherit;
        }
        .ant-btn-primary:hover,
        .ant-btn-primary:focus {
          border-color: #40a9ff !important;
          color: #fff;
        }
        .ant-btn-dangerous:hover,
        .ant-btn-dangerous:focus {
          color: #ff7875 !important;
          border-color: #ff7875 !important;
        }
        .ant-btn-background-ghost.ant-btn-success:hover,
        .ant-btn-background-ghost.ant-btn-success:focus {
          background: transparent !important;
          border-color: rgba(40, 167, 69, 0.75) !important;
        }
        .ant-btn-dangerous.ant-btn-primary:hover,
        .ant-btn-dangerous.ant-btn-primary:focus {
          color: #fff !important;
        }
        /*ANT BUTTON*/

        /*ANT BREADCRUMB*/
        .ant-breadcrumb a:hover {
          color: #505050d6 !important;
        }
        /*ANT BREADCRUMB*/

        /*ANT ICON*/
        .ant-message .anticon,
        .anticon {
          vertical-align: 0.125em;
        }
        /*ANT ICON*/

        /*ANT MODAL*/
        .ant-modal-mask,
        .ant-image-preview-mask,
        .ant-modal-wrap {
          z-index: 1030;
        }
        .modal-rad-10 > .ant-modal-content,
        .modal-rad-10 > .ant-modal-content > .ant-modal-header {
          border-radius: 10px;
          border: unset;
        }
        /*ANT MODAL*/

        /*ANT TAG SELECTABLE*/
        .ant-tag-checkable:not(.ant-tag-checkable-checked):hover {
          color: #000;
        }
        .ant-tag-checkable:active,
        .ant-tag-checkable-checked {
          border-color: #d63031 !important;
          color: #d63031;
          background-color: #ffeaea;
        }
        /*ANT TAG SELECTABLE*/

        /*ANT UPLOAD*/
        .ant-upload-list-picture-card .ant-upload-list-item-info::before {
          left: 0;
        }
        /*ANT UPLOAD*/

        /*ANT TABLE*/
        .custom-table .ant-table-tbody > tr.ant-table-row-selected > td {
          background: #fff6f6;
        }
        .custom-table .ant-table-tbody > tr.ant-table-row-selected:hover > td {
          background: #ffefef;
        }
        .custom-table .ant-table-tbody > tr > td {
          vertical-align: top;
        }
        /*ANT TABLE*/

        /*ANT DATE PICKER*/
        .ant-picker {
          border-radius: 0.25rem;
        }
        .ant-picker:hover,
        .ant-picker-focused {
          border-color: #8c8c8c;
        }
        .ant-picker-focused {
          box-shadow: 0 0 0 2px rgb(151 151 151 / 21%) !important;
        }
        /*ANT DATE PICKER*/

        /*ANT NOTIFICATION*/
        .ant-notification{
          margin-right: 12px;
          bottom: 0!important;
          z-index: 1030;
        }
        /*ANT NOTIFICATION*/

        /*SLICK-SLIDE*/
        .slick-slide {
          padding: 0px 15px;
        }
        .slick-list {
          margin: 0 -1em;
        }
        .slick-prev,
        .slick-next {
          font-size: 15px !important;
        }
        .slick-prev:before,
        .slick-next:before {
          content: "" !important;
        }
        .slick-slider > i.arrow-slick:before,
        i.arrow-slick:before {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        /*SLICK-SLIDE*/

        .text-tridatu {
          color: #d63031;
        }
        .text-tridatu:hover {
          color: #ff4d4f;
        }
        .text-tridatu-light {
          color: #ff4d4f;
        }

        /*CUSTOM BUTTON*/
        .btn-tridatu {
          color: #fff;
          background-color: #ff4d4f;
          border-color: #ff4d4f;
        }
        .btn-tridatu:hover {
          color: #fff;
          background-color: #d63031;
          border-color: #d63031 !important;
        }
        .btn-tridatu.focus,
        .btn-tridatu:focus {
          color: #fff;
          background-color: #d63031;
          border-color: #d63031 !important;
          box-shadow: 0 0 0 0.2rem rgb(255 77 79 / 16%);
        }
        .btn-tridatu:not(:disabled):not(.disabled).active,
        .btn-tridatu:not(:disabled):not(.disabled):active,
        .show > .btn-tridatu.dropdown-toggle {
          color: #fff;
          background-color: #d63031;
          border-color: #d63031 !important;
        }
        .btn-tridatu:not(:disabled):not(.disabled).active:focus,
        .btn-tridatu:not(:disabled):not(.disabled):active:focus,
        .show > .btn-tridatu.dropdown-toggle:focus {
          background-color: #d63031;
          border-color: #d63031;
          box-shadow: 0 0 0 0.2rem rgb(255 77 79 / 16%);
        }

        .btn-tridatu.disabled,
        .btn-tridatu:disabled,
        .btn-tridatu.disabled:hover,
        .btn-tridatu:disabled:hover {
          opacity: 0.65;
          color: #fff;
          background-color: #ff4d4f;
          border-color: #ff4d4f;
        }

        .btn-dark-tridatu-outline {
          color: #343a40;
          background-color: transparent;
          border-color: #343a40;
        }
        .btn-dark-tridatu-outline:hover {
          color: #343a40;
          background-color: transparent;
          border-color: #343a40;
        }
        .btn-dark-tridatu-outline.focus,
        .btn-dark-tridatu-outline:focus {
          color: #343a40;
          background-color: transparent;
          border-color: #343a40;
          box-shadow: 0 0 0 0.2rem rgb(52 58 64 / 21%);
        }
        .btn-dark-tridatu-outline:not(:disabled):not(.disabled).active,
        .btn-dark-tridatu-outline:not(:disabled):not(.disabled):active,
        .show > .btn-dark-tridatu-outline.dropdown-toggle {
          color: #343a40;
          background-color: transparent;
          border-color: #343a40;
          box-shadow: 0 0 0 0.2rem rgb(52 58 64 / 21%);
        }
        .btn-dark-tridatu-outline:not(:disabled):not(.disabled).active:focus,
        .btn-dark-tridatu-outline:not(:disabled):not(.disabled):active:focus,
        .show > .btn-dark-tridatu-outline.dropdown-toggle:focus {
          color: #343a40;
          background-color: transparent;
          border-color: #343a40;
          box-shadow: 0 0 0 0.2rem rgb(52 58 64 / 21%);
        }
        /*CUSTOM BUTTON*/

        .fw-500 {
          font-weight: 500 !important;
        }

        .truncate-4 {
          -webkit-line-clamp: 4;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
        }
        .truncate-3 {
          -webkit-line-clamp: 3;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
        }
        .truncate-2 {
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
        }

        .va-inherit {
          vertical-align: inherit !important;
        }

        .va-super{
          vertical-align: super !important;
        }
        .va-sub {
          vertical-align: sub !important;
        }
        .va-top{
          vertical-align: top !important;
        }
        .ws-preline{
          white-space: pre-line;
        }

        .ls-n1 {
          letter-spacing: -1px;
        }

        .hover-pointer:hover {
          cursor: pointer;
        }

        .noselect {
          -webkit-touch-callout: none; /* iOS Safari */
          -webkit-user-select: none; /* Safari */
          -khtml-user-select: none; /* Konqueror HTML */
          -moz-user-select: none; /* Old versions of Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version, currently
                                          supported by Chrome, Edge, Opera and Firefox */
        }

        .radius-top-img-card {
          border-top-left-radius: calc(0.25rem - 1px);
          border-top-right-radius: calc(0.25rem - 1px);
        }

        .bor-rad-2rem {
          border-radius: .2rem;
        }

        .bor-rad-25rem {
          border-radius: 0.25rem;
        }

        .bor-rad-15px {
          border-radius: 15px;
        }

        .bor-rad-5px {
          border-radius: 5px !important;
        }

        .bor-rad-8px {
          border-radius: 8px !important;
        }

        .border-bottom-5 {
          border-bottom: 5px solid rgb(243, 244, 245) !important;
        }

        .border-top-5 {
          border-top: 5px solid rgb(243, 244, 245);
        }

        .min-h-100 {
          min-height: 100% !important;
        }

        .max-vw-100 {
          max-width: 100vw !important;
        }

        .max-vh-100 {
          max-height: 100vh !important;
        }

        .w-340px{
          width: 340px !important;
        }

        .top-50{
          top: 50px !important;
        }
        .top-68{
          top: 68px !important;
        }

        .idx-1020{
          z-index: 1020;
        }

        .idx-2020{
          z-index: 2020;
        }

        .custom-gutters {
          margin-right: -15px;
          margin-left: -15px;
        }
        .custom-gutters > [class*="col-"],
        .custom-gutters > [class*="col"] {
          padding-right: 15px;
          padding-left: 15px;
        }

        @media only screen and (max-width: 767.98px) {
          .custom-gutters {
            margin-right: -5px;
            margin-left: -5px;
          }
          .custom-gutters > [class*="col-"],
          .custom-gutters > [class*="col"] {
            padding-right: 5px;
            padding-left: 5px;
          }
        }

        @media only screen and (min-width: 768px) {
          .custom-gutters.lg-screen {
            margin-right: -5px;
            margin-left: -5px;
          }
          .custom-gutters.lg-screen > [class*="col-"],
          .custom-gutters.lg-screen > [class*="col"] {
            padding-right: 5px;
            padding-left: 5px;
          }
        }

        .product-search .ant-input-affix-wrapper {
          background-color: #fff;
          box-shadow: 0rem 0.3rem 0.8rem 0rem rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </>
  );
};

App.getInitialProps = async ({ Component, ctx }) => {
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
  await ctx.store.dispatch(actions.authCheckState(ctx));
  return { pageProps };
};

export default withReduxStore(App);
