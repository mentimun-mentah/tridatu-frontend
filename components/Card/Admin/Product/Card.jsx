import { useState } from 'react'
import { Card as CardAnt, Dropdown, Menu, Modal, Space } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import { EditOutlined, EllipsisOutlined } from '@ant-design/icons'
import { countDiscPrice } from 'lib/utility'
import { ongoing } from 'components/Card/Admin/Product/Promo/statusType'

import Link from "next/link";
import Image from "next/image";
import Card from 'react-bootstrap/Card'
import Button from "antd-button-color"

import kFormatter from 'lib/kFormatter'
import formatNumber from 'lib/formatNumber'

const NormalPrice = ({ children }) => <span className="mb-0 fs-12 text-tridatu">Rp.{children}</span>
const DiscPrice = ({ children }) => <span className="mb-0 fs-10 text-tridatu"> <s>Rp.{children}</s> </span>

const CardProductAdmin = ({ data, aliveArchive, deleteProduct, t }) => {
  const { products_id, products_name, products_slug, products_image_product, products_live } = data;
  const { variants_min_price, variants_max_price, variants_discount, products_discount_status } = data;
  const { products_visitor, variants_total_stock } = data;

  const [showModal, setShowModal] = useState(false)

  const onDeleteProduct = () => {
    deleteProduct(products_id)
    setShowModal(false)
  }

  const renderPrice = () => {
    if(countDiscPrice(variants_discount, variants_min_price) === countDiscPrice(variants_discount, variants_max_price)){
      if(variants_discount > 0 && products_discount_status === ongoing){
        return (
          <div className="product-price text-truncate text-tridatu lh-1">
            <NormalPrice>{formatNumber(countDiscPrice(variants_discount, variants_max_price))}</NormalPrice>
            <DiscPrice>{formatNumber(variants_max_price)}</DiscPrice>
          </div>
        )
      } else {
        return (
          <div className="product-price text-truncate text-tridatu lh-1">
            <NormalPrice>{formatNumber(variants_max_price)}</NormalPrice>
          </div>
        )
      }
    }
    else {
      return (
        <div className="product-price text-truncate text-tridatu lh-1">
          <NormalPrice>{formatNumber(variants_min_price)} - </NormalPrice>
          <NormalPrice>{formatNumber(variants_max_price)}</NormalPrice>
        </div>
      )
    }
  }

  return(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: ".2" }}
      >
        <CardAnt
          className="product-card-admin"
          bodyStyle={{ padding: 0 }}
          actions={[
            <Link href="products/[slugs]" as={`products/${products_slug}`}>
              <a className="text-decoration-none">
                <EditOutlined key="edit" />
              </a>
            </Link>,
            <Dropdown 
              placement="bottomRight" 
              trigger={['click']}
              overlay={
                <Menu>
                  <Menu.Item onClick={() => aliveArchive(products_id)}>
                    {products_live ? t.more_menu.archive : t.more_menu.show}
                  </Menu.Item>
                  <Menu.Item onClick={() => setShowModal(true)} className="text-danger">
                    {t.more_menu.delete_product}
                  </Menu.Item>
                </Menu>
              } 
            >
              <EllipsisOutlined key="more" />
            </Dropdown>
          ]}
        >
          <div className="position-relative">
            <div className="text-center">
              {products_discount_status == ongoing && variants_discount > 0 && (
                <span className="card-discount noselect">{variants_discount}%</span>
              )}
              <Image 
                width={270}
                height={270}
                src={`${process.env.NEXT_PUBLIC_API_URL}/static/products/${products_slug}/${products_image_product}`}
                alt="Tridatu Bali"
              />
            </div>
            <AnimatePresence>
              {!products_live && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: ".2" }}
                  className="w-100"
                >
                  <div className="item-overlay text-center text-white">
                    <h4 className="mb-2">
                      <i className="fas fa-lock-alt text-white" />
                    </h4>
                    <p className="fs-12 mb-2">{t.tabs.archived}</p>
                    <Button ghost className="btn-product-overlay fs-12" onClick={() => aliveArchive(products_id)}>{t.more_menu.show}</Button>
                  </div>
                  <div className="image-overlay"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Card.Body className="fs-13 fs-14-m py-1 px-2">
            <div style={{ height: "44px" }}>
              <p className="mb-0 font-weight-light text-break truncate-2">
                {products_name}
              </p>
            </div>
            <div className="d-flex justify-content-between noselect w-100 align-items-baseline">
              <>{renderPrice()}</>
              <span className="mb-0 fs-12 text-muted text-truncate">Stok
                <span className="text-dark"> {kFormatter(variants_total_stock)}</span>
              </span>
            </div>
            <div className="product-meta">
              <div className="mb-0 product-meta-item"><i className="fal fa-eye" />
                <span className="text-truncate m-l-2">{products_visitor}</span>
              </div>
              <div className="mb-0 product-meta-item product-meta-sales">
                <span>Terjual</span>
                <span className="text-truncate">1K</span>
              </div>
            </div>
          </Card.Body>
        </CardAnt>
      </motion.div>

      <Modal
        centered
        visible={showModal}
        zIndex={3000}
        width={416}
        closable={false}
        footer={null}
        className="modal-rad-10 text-center"
      >
        <div className="text-dark">
          <h5 className="mb-3">{t.modal.title}</h5>
          <p className="text-black-50 fs-14">{products_name}</p>
          <p className="text-black-50">{t.modal.sub}</p>

          <Space>
            <Button onClick={() => setShowModal(false)}>{t.modal.cancel}</Button>
            <Button type="primary" className="btn-tridatu" onClick={onDeleteProduct}>{t.modal.delete_product}</Button>
          </Space>
        </div>
      </Modal>

      <style jsx>{`
        :global(.product-card-admin .ant-card-actions > li){
          margin: 5px 0;
        }
        .image-overlay {
          position: absolute;
          top: 0;
          bottom: 6px;
          left: 0;
          right: 0;
          width: 100%;
          background: rgba(0, 0, 0, 0.6);
        }
        .item-overlay{
          position: absolute;
          z-index: 20;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          -ms-transform: translate(-50%, -50%);
        }
        :global(.btn-product-overlay){
          color: white !important;
          border-color: #e5e5e5 !important;
          padding: 0px 10px;
        }
        :global(.btn-product-overlay:hover, .btn-product-overlay:focus, .btn-product-overlay:active){
          color: white !important;
          border-color: #e5e5e5 !important;
          background-color: rgba(255,255,255,.1) !important;
        }

        :global(.product-price){
          -webkit-box-flex: 1;
          -ms-flex: 1;
          flex: 1;
          min-width: 36%;
        }

        :global(.product-meta){
          display: flex;
          -webkit-box-align: center;
          align-items: center;
          -webkit-box-pack: justify;
          -ms-flex-pack: justify;
          justify-content: space-between;
          -ms-flex-align: center;
          width: 100%;
          max-width: 100%;
          line-height: 1.5;
          font-size: 12px;
          color: #bababa;
        }

        :global(.product-meta .product-meta-item){
          -webkit-box-flex: 4;
          flex: 4;
          -webkit-box-pack: start;
          align-items: center;
          justify-content: flex-start;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .product-meta-item.product-meta-like{
          justify-content: center;
        }
        .product-meta-item.product-meta-sales{
          -webkit-box-flex: 6;
          -ms-flex: 6;
          flex: 6;
          -webkit-box-pack: end;
          justify-content: flex-end;
        }

        .card-discount{
          position: absolute;
          display: flex;
          width: 40px;
          height: 40px;
          color: white;
          background-color: #ff4d4f;
          border-radius: 2px 60% 60% 60%;
          font-size: 12px !important;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        :global(.lh-1){
          line-height: 1;
        }

        :global(w-65){
          width: 65% !important;
        }

      `}</style>
    </>
  )
}

export default CardProductAdmin
