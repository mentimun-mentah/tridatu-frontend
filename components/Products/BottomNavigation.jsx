import { useState, useEffect } from 'react';
import { Space, Button } from "antd";
import { motion } from "framer-motion"
import { useSelector, useDispatch } from "react-redux";

import Image from 'next/image'
import Nav from 'react-bootstrap/Nav'
import Media from 'react-bootstrap/Media'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'

import formatNumber from "lib/formatNumber";

const BottomNavigation = ({ product, love, loveHandler, quantity, selected }) => {

  const { products_id, products_name, products_image_product, products_slug } = product

  return (
    <>
      <Navbar expand="lg" variant="light" className="product-menu" fixed="bottom">
        <Container>
          <Nav.Item style={{ width: "calc(100%/2.5)" }}>
            <Media className="align-self-center product-list-admin noselect">
              <div className="mr-2 mb-n1">
                <Image 
                  width={50} 
                  height={50} 
                  src={`${process.env.NEXT_PUBLIC_API_URL}/static/products/${products_slug}/${products_image_product[0]}`}
                  className="align-self-center bor-rad-2rem" 
                />
              </div>
              <Media.Body className="align-self-center">
                <p className="mb-0 fs-14 align-self-center truncate-2">{products_name}</p>
              </Media.Body>
            </Media>
          </Nav.Item>

          <Nav className="ml-auto">
            <Space>
              <div className="mr-2">
                <p className="mb-0 fs-12 text-muted fw-500" style={{ lineHeight: '15px' }}>Total</p>
                <span className="fs-14 fw-600">Rp.{formatNumber(selected.price*quantity)}</span>
              </div>
              <Button 
                size="large"
                className="btn-love p-0"
                onClick={() => loveHandler(products_id)}
                icon={
                  <motion.i 
                    className={`fas fa-heart w-100 h-100 va-sub m-t-10 ${love ? "text-tridatu-light" : "text-muted"}`}
                    whileTap={{ scale: 1.2, y: 2 }}
                  />
                }
              />
              <Button 
                danger
                disabled
                size="large"
                className="fs-14 fw-600"
              >
                Beli Sekarang
              </Button>
              <Button 
                disabled
                size="large"
                className="btn-tridatu fs-14 fw-600"
                icon={<i className="far fa-plus p-r-8 p-r-2-s" />} 
                // onClick={showModalCartHandler}
              >
                Keranjang
              </Button>
            </Space>
          </Nav>
        </Container>
      </Navbar>

      <style jsx>{`
        :global(.product-menu){
          box-shadow: rgb(49 53 59 / 16%) 0px -2px 6px 0px;
          background-color: rgb(255, 255, 255);
          border-radius: 20px 20px 0px 0px;
        }

        :global(.btn-love:focus){
          border-color: #d9d9d9!important;
        }
        :global(.btn-love[ant-click-animating-without-extra-node='true']::after, .ant-click-animating-node){
          box-shadow: unset !important;
        }
      `}</style>
    </>
  )
}

export default BottomNavigation
