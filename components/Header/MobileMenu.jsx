import { useRouter } from 'next/router';
import { useSelector } from "react-redux";
import { useState, useEffect } from 'react';
import { Drawer, Avatar, Input, Grid } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card'

import CategoryMenu from './CategoryMenu';

const useBreakpoint = Grid.useBreakpoint;

const dummyResponse = ['baju', 'baju anak', 'baju pria', 'baju wanita', 'baju tidur', 'baju kasual', 'baju kemeja panjang']

const MobileMenu  = ({ visible, close, register, login, logout, searchQuery, setSearchQuery, routes }) => {
  const router = useRouter()
  const screens = useBreakpoint();
  const [showSearch, setShowSearch] = useState(false)
  const [showCategory, setShowCategory] = useState(false)

  const user = useSelector(state => state.auth.user)

  const showCategoryHandler = () => setShowCategory(true)
  const closeCategoryHandler = () => setShowCategory(false)

  const showSearchHandler = () => {
    close()
    setTimeout(() => {
      setShowSearch(true)
      document.body.classList.add("overflow-hidden");
    }, 100)
  }

  const closeSearchHandler = () => {
    setShowSearch(false)
    document.body.classList.remove("overflow-hidden");
  }

  let headerMobile;
  if(user){
    headerMobile = (
      <div className="text-truncate mr-4">
        <Avatar src={user && `${process.env.NEXT_PUBLIC_API_URL}/static/avatars/${user.avatar}`} />
        <span className="text-capitalize text-truncate pl-2">{user.username}</span>
      </div>
    )
  }

  const screenSize = () => {
    let mounted = true
    for(let key in screens){
      if(key == "lg" && mounted){
        if(screens[key]){
          document.body.classList.remove("overflow-hidden");
        } else {
          if(showSearch) document.body.classList.add("overflow-hidden");
        }
      }
    }
    mounted = false
  }

  const onSearchChange = e => {
    const value = e.target.value;
    setSearchQuery(value)
  }

  const onPressEnter = e => {
    e.preventDefault()
    setShowSearch(false)
    let url = `/products?q=${searchQuery}`
    router.push(url, url)
    document.body.classList.remove("overflow-hidden");
  }

  const onSelectSuggestionHandler = e => {
    setSearchQuery(e.target.text)
    setShowSearch(false)
    let url = `/products?q=${e.target.text}`
    router.push(url, url)
    document.body.classList.remove("overflow-hidden");
  }

  useEffect(() => {
    screenSize()
  },[screenSize])

  return(
    <>
      <Drawer
        placement="right"
        zIndex="1030"
        onClose={close}
        visible={visible}
        closeIcon={<i className="fas fa-times" />}
        className="d-block d-sm-block d-md-block d-lg-none d-xl-none"
        headerStyle={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}
        title={headerMobile}
      >
        <Nav className="flex-column mobile-menu">
          <div className={`${!user && 'mt-4 mb-1'} w-100 nav-search`} onClick={showSearchHandler}>
            <Input
              placeholder="Search"
              value={searchQuery}
              onFocus={showSearchHandler}
              prefix={<i className="far fa-search text-secondary" />}
            />
          </div>

          {!user && (
            <>
              <Nav.Link onClick={login}>Masuk</Nav.Link>
              <Nav.Link onClick={register}>Daftar</Nav.Link>
            </>
          )}

          <Link href="/products" as="/products">
            <Nav.Link as="a" onClick={showCategoryHandler}>
              Kategori
            </Nav.Link>
          </Link>

          <Link href="/promo" as="/promo">
            <Nav.Link as="a" onClick={close}>
              Promo
            </Nav.Link>
          </Link>

          {user && (
            <>
              {routes.map((route, i) => (
                <Link href={route.link} as={route.link} key={i}>
                  <Nav.Link as="a" onClick={close}>
                    {route.text}
                  </Nav.Link>
                </Link>
              ))}
              <Nav.Link onClick={logout}>Keluar</Nav.Link>
            </>
          )}
        </Nav>
      </Drawer>

      <AnimatePresence>
        {showSearch && (
          <motion.div 
            className={`modal ${showSearch && "show modal-open d-block"} d-block d-lg-none`}
            transition={{ duration: ".2" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="modal-dialog m-0 mw-100 min-h-100 mh-100">
              <div className="modal-content rounded-0 border-0 mh-100">

                <div className="modal-header border-0 rounded-0">
                  <Form inline className="mx-lg-2 w-100">
                    <Form.Row className="align-items-center w-100">
                      <Col>
                        <div className="w-100 nav-search mobile-search">
                          <Input
                            autoFocus
                            allowClear
                            placeholder="Search"
                            value={searchQuery}
                            onChange={onSearchChange}
                            onPressEnter={onPressEnter}
                            prefix={<i className="far fa-search text-secondary" />}
                          />
                        </div>
                      </Col>
                      <Col xs="auto" className="pr-0">
                        <a className="text-tridatu fw-500 fs-13 align-text-bottom" onClick={closeSearchHandler}>Batal</a>
                      </Col>
                    </Form.Row>
                  </Form>
                </div>

                <Card.Body className="overflow-auto vh-100 max-vh-100 pt-0 px-3">
                  {dummyResponse.map((data, x) => (
                    <div className="search-result-list" key={x} onClick={onSelectSuggestionHandler}>
                      <a className="w-100" text={data}>{data}</a>
                    </div>
                  ))}
                </Card.Body>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Drawer
        placement="right"
        zIndex="1031"
        width="100vw"
        onClose={closeCategoryHandler}
        visible={showCategory}
        closeIcon={<i className="fas fa-times" />}
        className="d-block d-sm-block d-md-block d-lg-none d-xl-none"
        headerStyle={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}
        title={<b>Kategori</b>}
      >
        <CategoryMenu />
      </Drawer>

      <style jsx>{`
        :global(.mobile-menu > a){
          color: #343a40!important;
          border-bottom: 1px solid #dee2e6!important;
        }
        :global(.mobile-search > .ant-input-affix-wrapper){
          padding: 6px 11px;
        }
        :global(.mobile-search > .ant-input-affix-wrapper:focus,
                .mobile-search > .ant-input-affix-wrapper-focused){
          box-shadow: 0 0 0 0 rgb(151 151 151 / 21%) !important;
        }

        :global(.modal-search){
          animation-duration: 100ms !important;
        }
        :global(.search-result-list){
          padding: 10px 0px;
          display: flex;
          flex: 1 1 0%;
          flex-direction: row;
          -webkit-box-align: center;
          align-items: center; 
        }
        :global(.search-result-list a){
          color: rgba(49, 53, 59, 0.85);
          font-size: 14px;
          line-height: 20px;
          display: flex;
        }
      `}</style>
    </>
  )
}

export default MobileMenu
