import { useRouter } from 'next/router'
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Input, Badge, Menu, Dropdown, Avatar, Tabs, AutoComplete } from "antd";

import Link from "next/link";
import Image from "next/image";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

import Login from "../Header/Auth/Login";
import Register from "../Header/Auth/Register";
import MobileMenu from "./MobileMenu";

import CartItem from 'components/Cart/CartItemNavbar'

import * as actions from "store/actions";

import { category_data } from './data'

const routes = [
  {link: "/account/profile", text: "Akun Saya"},
  {link: "/account/orders", text: "Pesanan Saya"},
  {link: "/account/favorite", text: "Favorit"},
]

const options = [
  { value: 'baju', },
  { value: 'baju anak', },
  { value: 'baju wanita', },
  { value: 'baju tidur', },
  { value: 'baju renang', },
  { value: 'baju formal', },
  { value: 'baju kasual panjang', },
  { value: 'baju kemeja jeans panjang', },
];

const accountMenu = (logoutHandler) => (
  <Menu className="d-none d-lg-block">
    {routes.map((route, i) => (
      <Menu.Item key={i}>
        <Link href={route.link} as={route.link}>
          <a className="text-decoration-none">
            {route.text}
          </a>
        </Link>
      </Menu.Item>
    ))}

    <Menu.Divider />
    <Menu.Item onClick={logoutHandler}> <a className="text-decoration-none"> Keluar </a> </Menu.Item>
  </Menu>
);

const notificationMenu = (
  <Menu className="d-none d-lg-block">
    <Menu.ItemGroup 
      title={
        <>
          <b className="text-dark">Notifikasi</b>
          <a className="text-tridatu view-all-text-navbar">Baca Semua</a>
        </>
      }
    />
    <Menu.Divider />
    <Menu.ItemGroup className="cart-item-navbar notification-item-navbar">
    {[...Array(10)].map((_,i) => (
      <Menu.Item key={i} className={`notification-item ${i%2 === 0 && 'unread'}`}>
        <Row>
          <Col className="text-truncate pr-1">
            <span className="fs-13 fw-500">Tagihan Anda Sudah Ada</span>
          </Col>
          <Col className="col-auto pl-0">
            <span className="text-secondary fs-10">11.30</span>
          </Col>
        </Row>
        <small className="text-wrap mb-0 text-secondary truncate-2">
          Hi Paulus, batas waktu pembayaranmu di Tokopedia hampir habis. Silakan melakukan pembayaran Rp 94.200 + biaya layanan di Gerai (Indomaret, Alfamart/Alfamidi/Lawson, Kioson, Kantorpos, JNE) terdekat menggunakan kode pembayaran AD085156565673 sebelum 7 Oct 14:19.
        </small>
      </Menu.Item>
    ))}
    </Menu.ItemGroup>
  </Menu>
);

const cartMenu = (
  <Menu className="d-none d-lg-block">
    <Menu.ItemGroup 
      title={
        <>
          <b className="text-dark">Keranjang</b>
          <Link href="/cart" as="/cart">
            <a className="text-tridatu view-all-text-navbar">Lihat Sekarang</a>
          </Link>
        </>
      }
    />
    <Menu.Divider />
    <Menu.ItemGroup className="cart-item-navbar">
    {[...Array(10)].map((_,i) => (
      <Menu.Item key={i}>
        <CartItem />
      </Menu.Item>
    ))}
    </Menu.ItemGroup>
  </Menu>
);

const Header = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [searchQuery, setSearchQuery] = useState('')
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  const isAuth = useSelector(state => state.auth.auth)

  // LOGIN & REGISTER HANDLER
  const showLoginHandler = () => {
    setShowLogin(true)
    setShowRegister(false)
    setShowMobileMenu(false)
  }

  const showRegisterHandler = () => {
    setShowRegister(true)
    setShowLogin(false)
    setShowMobileMenu(false)
  }

  const closeModalHandler = () => {
    setShowLogin(false)
    setShowRegister(false)
    setShowMobileMenu(false)
  }
  // LOGIN & REGISTER HANDLER
  
  // MOBILE MENU HANDLER
  const showMobileMenuHandler = () => {
    setShowMobileMenu(true)
  }

  const closeMobileMenuHandler = () => {
    setShowMobileMenu(false)
    setShowLogin(false)
    setShowRegister(false)
  }
  // MOBILE MENU HANDLER

  const loginHandler = () => {
    dispatch(actions.authSuccess())
    setShowMobileMenu(false)
  }
  const logoutHandler = () => {
    dispatch(actions.logout())
    setShowMobileMenu(false)
  }

  const goToHandler = (destination) => {
    router.push(destination, destination)
  }

  const showCategoryDropdownHandler = () => {
      setShowCategoryDropdown(true)
  }
  const showCategoryDropdownChange = flag => {
    setShowCategoryDropdown(flag)
  }

  // Search navbar
  const onSearchChange = e => {
    const value = e.target.value;
    setSearchQuery(value)
  }
  const onSelectSuggestionHandler = e => {
    let url = `/products?q=${e}`
    goToHandler(url)
  }
  const onPressEnter = e => {
    e.preventDefault()
    let url = `/products?q=${searchQuery}`
    goToHandler(url)
  }
  // Search navbar

  useEffect(() => {
    if(!showMobileMenu) document.body.style.removeProperty('overflow')
  },[showMobileMenu])

  useEffect(() => {
    if(router.query.q){
      setSearchQuery(router.query.q)
    }
  },[router.query.q])

  const categoryMenu = (
    <Menu
      className="d-none d-lg-block"
      onClick={showCategoryDropdownHandler}
      onMouseEnter={() => document.body.classList.add("overflow-hidden")}
      onMouseLeave={() => document.body.classList.remove("overflow-hidden")}
    >
      <Menu.Item key="1" className="category-item-navbar">
        <Container>
          <Tabs 
            tabBarGutter={10}
            tabPosition="left" 
            defaultActiveKey="1" 
            className="category-item-navbar-tabs-left noselect"
          >
            {category_data.map(data => (
              <Tabs.TabPane tab={data.category} key={data.category}>
                <div className="westeros-c-column-container">
                  {data.sub.map(child => (
                    <div className="westeros-c-column-container_item text-truncate" key={child.title}>
                      <b className="fs-14">{child.title}</b>
                      {child.child.map((dataChild,i) => (
                        <p className="mb-0 text-truncate item-sub-category" key={i}>
                          <Link href="/products" as="/products">
                            <a className="text-reset"> {dataChild} </a>
                          </Link>
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </Tabs.TabPane>
            ))}
          </Tabs>
        </Container>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Navbar
        expand="lg"
        expanded={false}
        variant="light"
        bg="light"
        fixed="top"
        className="bg-white navbar-shadow-bottom py-2 noselect"
      >
        <Container>
          <Navbar.Brand href="/" className="font-italic d-inline-flex">
            <Image
              height={42}
              width={29}
              src="/tridatu-icon.png"
              className="d-inline-block align-top logo-navbar"
              alt="Tridatu Bali ID"
            />
            <span className="text-dark font-weight-bold align-self-center align-baseline-middle pl-1 text-navbar">
              Tridatu
              <span className="text-muted font-weight-bold text-navbar"> Bali ID</span>
            </span>
          </Navbar.Brand>

          <Navbar.Toggle className="border-0 ml-auto d-lg-none">
            <Link href="/notification" as="/notification">
              <a>
                <Badge count={400} size="small" className="nav-notification">
                  <i className="far fa-bell fa-lg" />
                </Badge>
              </a>
            </Link>
          </Navbar.Toggle>
          <Navbar.Toggle className="border-0 mx-2 pl-1 d-lg-none">
            <Link href="/cart" as="/cart">
              <a>
                <Badge count={400} size="small" className="nav-notification">
                  <i className="far fa-shopping-cart fa-lg" />
                </Badge>
              </a>
            </Link>
          </Navbar.Toggle>

          <Navbar.Toggle 
            className="border-0 px-2"
            aria-controls="tridatu-navbar-nav" 
            onClick={showMobileMenuHandler}
          >
            <i className="far fa-bars" />
          </Navbar.Toggle>

          <Navbar.Collapse id="tridatu-navbar-nav">
            <Nav className="w-100">

              <Dropdown 
                overlay={categoryMenu} 
                trigger={['hover']}
                placement="bottomCenter" 
                overlayClassName="position-fixed top-68 vw-100 category-dropdown"
                visible={showCategoryDropdown}
                onVisibleChange={showCategoryDropdownChange}
              >
                <Nav.Link as="a" 
                  className="text-dark align-self-center"
                  onMouseEnter={() => document.body.classList.add("overflow-hidden")}
                  onMouseLeave={() => document.body.classList.remove("overflow-hidden")}
                >
                  Kategori
                </Nav.Link>
              </Dropdown>

              <Link href="/promo" as="/promo">
                <Nav.Link as="a" className="text-dark align-self-center">
                  Promo
                </Nav.Link>
              </Link>
              
              <Form inline className="mx-lg-2 w-100">
                <div className="w-100 nav-search">
                  <AutoComplete 
                    className="w-100"
                    dropdownClassName="position-fixed list-suggestion"
                    options={options}
                    value={searchQuery}
                    onSelect={onSelectSuggestionHandler}
                  >
                    <Input.Search 
                      placeholder="Search"
                      onChange={onSearchChange}
                      onPressEnter={onPressEnter}
                    />
                  </AutoComplete>
                </div>
              </Form>

              <Dropdown 
                arrow
                overlay={notificationMenu} 
                trigger={['click']}
                placement="bottomCenter" 
                overlayClassName="position-fixed top-50 w-340px"
                overlayStyle={{top: '500px'}}
                onClick={() => goToHandler("/notification")}
              >
                <Nav.Link className="mx-2 d-none d-lg-block align-self-center">
                  <Badge count={100} size="small" className="nav-notification">
                    <i className="far fa-bell fa-lg" />
                  </Badge>
                </Nav.Link>
              </Dropdown>

              <Dropdown 
                arrow
                overlay={cartMenu} 
                trigger={['hover']}
                placement="bottomCenter" 
                overlayClassName="position-fixed top-50 w-340px"
                onClick={() => goToHandler("/cart")}
              >
                <Nav.Link className="ml-2 d-none d-lg-block align-self-center">
                  <Badge count={100} size="small" className="nav-notification">
                    <i className="far fa-shopping-cart fa-lg" />
                  </Badge>
                </Nav.Link>
              </Dropdown>

              <span className="border-right mx-4"></span>

              {isAuth ? (
                <Dropdown overlay={() => accountMenu(logoutHandler)} placement="bottomRight">
                  <a className="text-truncate text-dark align-middle text-decoration-none">
                    <Avatar size="large" src="https://ecs7.tokopedia.net/img/cache/700/product-1/2019/5/18/3453155/3453155_bdfa5991-04e9-49a3-8246-34f9d270b180_1438_1438.webp" />
                    <span className="pl-2 align-middle">Jhon Bakery Handler</span>
                  </a>
                </Dropdown>
              ) : (
                <>
                  <Nav.Item className="mr-2 align-self-center d-none d-lg-block" onClick={showLoginHandler}>
                    <Button size="sm" className="btn-dark-tridatu-outline">Masuk</Button>
                  </Nav.Item>
                  <Nav.Item className="align-self-center d-none d-lg-block" onClick={showRegisterHandler}>
                    <Button size="sm" className="btn-tridatu">Daftar</Button>
                  </Nav.Item>
                </>
              )}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Login show={showLogin} handler={showRegisterHandler} close={closeModalHandler} login={loginHandler} />
      <Register show={showRegister} handler={showLoginHandler} close={closeModalHandler} login={loginHandler} />
      <MobileMenu 
        routes={routes}
        isAuth={isAuth}
        visible={showMobileMenu} 
        close={closeMobileMenuHandler} 
        login={showLoginHandler} 
        register={showRegisterHandler}
        logout={logoutHandler}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <style jsx>{`
        :global(.list-suggestion){
          z-index: 1060;
        }
        :global(.list-suggestion .rc-virtual-list-scrollbar-thumb){
          background: transparent!important;
          display: none!important;
        }
        :global(.navbar-shadow-bottom) {
          box-shadow: rgba(0, 0, 0, 0.18) 0px 1px 15px !important;
        }
        :global(.align-baseline-middle) {
          vertical-align: -webkit-baseline-middle !important;
        }
        :global(.nav-notification){
          color: rgba(0,0,0,.5);
          font-size: 16px;
        }
        :global(.nav-notification .ant-badge-count-sm){
          font-size: 10px;
          min-width: 15px;
          height: 15px;
        }
        :global(.nav-notification .ant-badge-multiple-words){
          padding: 0 4px;
        }
        :global(.nav-search .ant-input-wrapper, .nav-search .ant-input-affix-wrapper){
          border: 0;
          border-radius: .25rem;
          background-color: #f1f3f5;
        }
        :global(.nav-search .ant-input-wrapper > input.ant-input, .nav-search .ant-input-affix-wrapper > input.ant-input){
          background-color: transparent;
          border: 0;
        }
        :global(.nav-search .ant-input-wrapper > .ant-input::placeholder, .nav-search .ant-input-affix-wrapper > .ant-input::placeholder){
          color: rgba(0, 0, 0, 0.45);
        }
        :global(.nav-search .ant-input-wrapper > .ant-input-group-addon > .ant-input-search-button){
          border: 0;
          background: #f1f3f5;
          box-shadow: none;
        }
        :global(.nav-search .ant-input:focus, .nav-search .ant-input-focused, .nav-search .ant-input-search .ant-input:focus){
          border: 0;
          box-shadow: unset;
        }
        :global(.nav-search .ant-input-affix-wrapper > .ant-input-suffix > .ant-input-search-icon::before){
          border-left: 0;
        }

        /*CATEGORY ITEM NAVBAR*/
        :global(.category-dropdown > .ant-dropdown-menu){
          border-top: 1px solid #ececec;
          box-shadow: rgba(0,0,0,0.18) 0px 25px 32px !important;
        }
        :global(.category-item-navbar){
          height: auto;
          max-height: 80vh;
        }
        :global(.category-item-navbar.ant-dropdown-menu-item:hover){
          background-color: transparent;
          cursor: default;
        }

        :global(.category-item-navbar-tabs-left){
          height: 100%;
          max-height: 80vh;
          overflow: auto;
        }
        :global(.category-item-navbar-tabs-left > .ant-tabs-nav){
          position: sticky;
          top: 0;
          width: 150px;
        }
        :global(.category-item-navbar-tabs-left .ant-tabs-tab){
          padding-left: 0 !important;
        }
        :global(.category-item-navbar-tabs-left .ant-tabs-tab-btn){
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /*CATEGORY ITEM NAVBAR*/

        /*CART ITEM NAVBAR*/
        :global(.cart-item-navbar){
          max-height: 300px;
          overflow: scroll;
        }
        :global(.cart-item-navbar > .ant-dropdown-menu-item-group-title){
          padding: 0;
        }
        :global(.cart-item-navbar > .ant-dropdown-menu-item-group-list){
          margin: 0;
          max-height: 300px;
        }
        :global(.view-all-text-navbar){
          float: right;
          line-height: 2;
          font-size: 12px;
        }
        :global(.notification-item-navbar > .ant-dropdown-menu-item-group-list > .notification-item){
          background: white;
        }
        :global(.notification-item-navbar > .ant-dropdown-menu-item-group-list > .notification-item:not(:last-child)){
          border-bottom: 1px solid #dee2e6!important;
        }
        :global(.notification-item-navbar > .ant-dropdown-menu-item-group-list > .notification-item:hover){
          background-color: #f5f5f5;
        }
        :global(.notification-item-navbar > .ant-dropdown-menu-item-group-list > .notification-item.unread){
          background-color:#effaf3;
        }
        /*CART ITEM NAVBAR*/

        /* LOGIN & REGISTER */
        :global(.modal-login > .ant-modal-content, .modal-login
            > .ant-modal-content
            > .ant-modal-header) {
          border-radius: 10px;
          border: unset;
        }
        :global(.ant-divider-horizontal.ant-divider-with-text::before, 
                .ant-divider-horizontal.ant-divider-with-text::after) {
          border-top: 0.5px solid rgba(0, 0, 0, 0.12);
        }
        /* LOGIN & REGISTER */

        :global(.logo-navbar){
          height: 42px;
          width: auto;
        }
        @media only screen and (max-width: 375px){
          :global(.westeros-c-column-container){
            columns: 85px !important;
          }
        }
        @media only screen and (max-width: 425px){
          :global(.text-navbar){
            font-size: 16px;
          }
          :global(.logo-navbar){
            height: 32px;
            width: auto;
          }
          :global(.align-baseline-middle){
            vertical-align: unset !important;
          }
        }
        @media only screen and (max-width: 768px) and (min-width: 378px){
          :global(.westeros-c-column-container){
            columns: 100px !important;
          }
        }
        @media only screen and (max-width: 768px){
          :global(.category-item-navbar-tabs-left > .ant-tabs-nav){
            width: 100px;
          }
        }

        :global(.westeros-c-column-container){
          columns: 120px;
          column-gap: 2em;
        }
        :global(.westeros-c-column-container_item){
          margin-bottom: 24px;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        :global(.item-sub-category){
          color: rgba(0,0,0,.55);
        }
        :global(.item-sub-category:hover){
          color: rgba(0,0,0,.95);
        }
      `}</style>
    </>
  );
};

Header.whyDidYouRender = true;

export default Header;
