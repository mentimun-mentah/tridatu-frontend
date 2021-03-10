import { Avatar, Drawer } from 'antd'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'

import id from 'locales/id/account/profile'
import en from 'locales/en/account/profile'

import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const PROFILE = '/account/profile'
const ORDERS = '/account/orders'
const REVIEW = '/account/review'
const FAVORITE = '/account/favorite'
const ADDRESS = '/account/address'
const PASSWORD = '/account/password'
const MORE = 'more'

const AccountLayout = ({ children, pathname }) => {
  const router = useRouter()

  const { locale } = router
  const t = locale === "en" ? en : id

  const [showDrawer, setShowDrawer] = useState(false)

  const user = useSelector(state => state.auth.user)

  const navClickHandler = e => {
    if(e !== MORE) {
      router.push(e, e)
      setShowDrawer(false)
    }
    else setShowDrawer(true)
  }

  const closeDrawerHandler = () => {
    setShowDrawer(false)
  }

  useEffect(() => {
    if(!showDrawer) document.body.style.removeProperty('overflow')
  },[showDrawer])

  return(
    <>
      <div className="bg-light">
        <Container className="pt-4 pb-4 account">
          <Row>
            <Nav 
              activeKey={pathname} 
              onSelect={navClickHandler}
              className="flex-column col-md-2 d-none d-lg-block pl-2 fs-14"
            >
              <Nav.Link className="text-truncate text-dark align-middle text-decoration-none px-0 mb-3">
                <Avatar size="large" src={user && `${process.env.NEXT_PUBLIC_API_URL}/static/avatars/${user.avatar}`} />
                <span className="pl-1 align-middle">{user && user.username}</span>
              </Nav.Link>
              
              <Nav.Link eventKey={PROFILE} className="side-nav-link">
                <span>
                  <i className="far fa-user-circle mr-2" />
                  {t.my_account}
                </span>
              </Nav.Link>

              <Nav.Link eventKey={ORDERS} className="side-nav-link">
                <span>
                  <i className="far fa-clipboard-list mr-2" />
                  {t.my_order}
                </span>
              </Nav.Link>

              <Nav.Link eventKey={FAVORITE} className="side-nav-link">
                <span>
                  <i className="far fa-heart mr-2" />
                  {t.favorite}
                </span>
              </Nav.Link>

              <Nav.Link eventKey={REVIEW} className="side-nav-link">
                <span>
                  <i className="far fa-file-signature mr-2" />
                  {t.reviews}
                </span>
              </Nav.Link>

              <Nav.Link eventKey={ADDRESS} className="side-nav-link">
                <span>
                  <i className="far fa-address-book mr-2" />
                  {t.address_list}
                </span>
              </Nav.Link>

              <Nav.Link eventKey={PASSWORD} className="side-nav-link">
                <span>
                  <i className="far fa-lock mr-2" />
                  {t.set_password}
                </span>
              </Nav.Link>

            </Nav>

            <Col lg={10} md={12} className="bg-white px-0 rounded h-100">
              {children}
            </Col>

          </Row>

          <Row className="fixed-bottom pt-1 pb-1 bg-white shadow-menu border-top d-lg-none justify-content-center">
            <Nav
              variant="pills"
              activeKey={pathname} 
              onSelect={navClickHandler}
              className="justify-content-center text-center w-100 nav-mobile"
            >
              <Nav.Item className="fs-10">
                <Nav.Link eventKey={PROFILE} className="mobile-btn">
                  <i className="far fa-user-circle fs-24" />
                  <br />
                  {t.account}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="fs-10">
                <Nav.Link eventKey={ORDERS} className="mobile-btn">
                  <i className="far fa-clipboard-list fs-24" />
                  <br />
                  {t.order}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="fs-10">
                <Nav.Link eventKey={FAVORITE} className="mobile-btn">
                  <i className="far fa-heart fs-24" />
                  <br />
                  {t.favorite}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="fs-10">
                <Nav.Link eventKey={REVIEW} className="mobile-btn">
                  <i className="far fa-file-signature fs-24" />
                  <br />
                  {t.reviews}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="fs-10">
                <Nav.Link eventKey={MORE} className={`mobile-btn ${ADDRESS == pathname ? 'active' : PASSWORD == pathname ? 'active' : ''}`}>
                  <i className="far fa-ellipsis-h fs-24" />
                  <br />
                  {t.other}
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Row>

        </Container>

        <Drawer
          closable
          zIndex="1040"
          title="Lainnya"
          placement="bottom"
          height="auto"
          onClose={closeDrawerHandler}
          visible={showDrawer}
          className="d-block d-lg-none"
          closeIcon={<i className="fas fa-times" />}
        >
          <Nav 
            activeKey={pathname} 
            onSelect={navClickHandler}
            className="flex-column col-md-2 pl-2 fs-14"
          >
            <Nav.Link eventKey={ADDRESS} className="side-nav-link">
              <span>
                <i className="far fa-address-book mr-2" />
                {t.address_list}
              </span>
            </Nav.Link>

            <Nav.Link eventKey={PASSWORD} className="side-nav-link">
              <span>
                <i className="far fa-lock mr-2" />
                {t.set_password}
              </span>
            </Nav.Link>
          </Nav>
        </Drawer>
      </div>

      <style jsx>{`
        :global(.side-nav-link){
          padding-left: 0;
          padding-right: 0;
          color: rgba(0, 0, 0, 0.65);
        }
        :global(.side-nav-link.active){
          color: rgba(0, 0, 0, 0.95);
          font-weight: 500;
        }
        :global(.side-nav-link:hover, .mobile-btn:hover){
          color: rgba(0, 0, 0, 0.95);
        }
        :global(.mobile-btn){
          color: rgba(0, 0, 0, 0.60);
        }
        :global(.nav-pills.nav-mobile .mobile-btn.nav-link.active, .nav-pills.nav-mobile .show>.mobile-btn.nav-link){
          color: rgba(0, 0, 0, 0.95);
          font-weight: 500;
          background-color: transparent;
        }

        @media only screen and (max-width: 575px){
          :global(.account.pt-4.pb-4){
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }

          :global(.account .card.card-container){
            border: 0;
          }
        }

      `}</style>
    </>
  )
}

AccountLayout.whyDidYouRender = true;

export default AccountLayout
