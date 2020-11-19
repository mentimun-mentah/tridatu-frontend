import { useState } from 'react'
import { useSelector } from "react-redux";
import { Button, Divider, Select, Space, Skeleton, Empty } from "antd";

import Link from 'next/link'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'

import axios, { jsonHeaderHandler, signature_exp, resNotification } from "lib/axios";
import AddAddressModal from 'components/Modal/AddAddress'
import SelectAddressModal from 'components/Modal/SelectAddress'
import PromoModal from 'components/Cart/PromoModal'
import CartItemCheckout from 'components/Cart/CartItemCheckout'
import { PromoSelected, PromoButton } from 'components/Cart/PromoSelected'

import formatNumber from 'lib/formatNumber'

import { courierEstimation } from 'data/courierEstimation'

import CartStyle from 'components/Cart/style'

import { listPromo } from '../cart'

const Checkout = () => {
  const [showPromoModal, setShowPromoModal] = useState(false)
  const [promo, setPromo] = useState({ code: '', isUsed: false })
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [showSelectAddressModal, setShowSelectAddressModal] = useState(false)

  const loading = useSelector(state => state.address.loading)
  const addresses = useSelector(state => state.address.address)

  const showAddressModalHandler = () => {
    setShowAddressModal(true)
  }

  const closeAddressModalHandler = () => {
    setShowAddressModal(false)
  }

  const showSelectAddressModalHandler = () => {
    setShowSelectAddressModal(true)
  }

  const closeSelectAddressModalHandler = () => {
    setShowSelectAddressModal(false)
  }

  const showPromoModalHandler = () => {
    setShowPromoModal(true)
  }

  const closePromoModalHandler = () => {
    setPromo({ ...promo, code: '' })
    setShowPromoModal(false)
  }

  const promoChangeHandler = e => {
    const value = e.target.value
    setPromo({ ...promo, code: value })
  }

  const onUsePromoHandler = () => {
    setPromo({ ...promo, isUsed: true })
    setShowPromoModal(false)
  }

  const onRemovePromoHandler = () => {
    setPromo({ ...promo, isUsed: false, code: '' })
  }

  return(
    <>
      <Container className="pt-4 pb-2">
        <h4 className="fs-20 mb-4">Checkout</h4>
        <Row>
          <Col lg={8}>
            <p className="fw-500 fs-16">Alamat penerima</p>
            <Card className="address-card fs-14 fs-12-s">
              {!loading && (addresses == null || addresses.data.length == 0) && (
                <Empty 
                  className="my-3 text-left"
                  imageStyle={{ height: 70 }}
                  description={<span className="text-secondary">Kamu belum memiliki alamat</span>} 
                />
              )}
              {addresses && addresses.data.length > 0 && (
                <Skeleton loading={loading} paragraph={{ rows: 2 }} active className="custom-skeleton">
                  <p className="user-address-title mb-0 fw-500">
                    {addresses.data[0].receiver} <span className="font-weight-light">({addresses.data[0].label})</span>
                  </p>
                  <p className="font-weight-light user-phone mb-0">{addresses.data[0].phone}</p>
                  <p className="text-secondary mb-0">
                    {addresses.data[0].recipient_address}
                    <br />
                    {addresses.data[0].region}, {addresses.data[0].postal_code}
                  </p>
                </Skeleton>
              )}
            </Card>

            <Card.Body className="border-0 p-0 mb-3">
              <Space>
                <Button style={{ height: 35 }} onClick={showSelectAddressModalHandler}>Pilih Alamat Lain</Button>

                <Select placeholder="Pilih Kurir" className="select-courier" allowClear dropdownClassName="idx-1020" style={{ width: 200 }}>
                  {courierEstimation.map(courier => (
                    <Select.OptGroup label={courier.code.toUpperCase()} key={courier.code}>
                      {courier.costs.map(services => (
                        services.cost.map(cost => (
                          <Select.Option value={services.service} key={courier.code + services.service}>
                            <p className="mb-n1">{services.service} {cost.etd && <>({cost.etd} hari)</>}</p>
                            <small className="text-secondary fs-12">Rp. {formatNumber(cost.value)}</small>
                          </Select.Option>
                        ))
                      ))}
                    </Select.OptGroup>
                  ))}
                </Select>
              </Space>
            </Card.Body>

            <div className="border-bottom-5 mb-2" />
            
            <div className="cart-item">
              <Row className="mx-0">
                {[...Array(8)].map((_, i) => (
                  <CartItemCheckout key={i} />
                ))}
              </Row>
            </div>
          </Col>

          <Col>
            <Card className="checkout-summary">
              <Card.Body className="border-bottom-5">
                {!promo.isUsed ? (
                  <PromoButton
                    disabled={false}
                    show={showPromoModalHandler}
                  />
                ) : (
                  <PromoSelected
                    reset={onRemovePromoHandler}
                  />
                )}
              </Card.Body>
              <Card.Body>
                <p className="font-weight-bold fs-14">Ringkasan belanja</p>
                <p className="font-weight-light checkout-summary-price fs-14 mb-1 text-truncate fs-12-s">
                  Total Harga (8 Produk)
                  <span className="float-right">
                    Rp. 600.000
                  </span>
                </p>
                <p className="font-weight-light checkout-summary-price fs-14 mb-1 text-truncate fs-12-s">
                  Ongkos Kirim
                  <span className="float-right">
                    Rp. 60.000
                  </span>
                </p>
                <p className="font-weight-light checkout-summary-price fs-14 mb-1 text-truncate fs-12-s">
                  Promo
                  <span className="float-right">
                    - Rp. 10.000
                  </span>
                </p>

                <Divider className="my-2" />

                <p className="font-weight-bold checkout-summary-price fs-14 fs-12-s text-truncate">
                  Total Tagihan
                  <span className="float-right cart-item-price font-weight-bold">
                    Rp. 710.000
                  </span>
                </p>
                <Link href="/checkout" as="/checkout">
                  <a>
                    <Button 
                      block
                      size="large"
                      className="btn-tridatu font-weight-bold"
                    >
                      Pilih Pembayaran
                    </Button>
                  </a>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <SelectAddressModal
        show={showSelectAddressModal}
        close={closeSelectAddressModalHandler}
        showAddAddress={showAddressModalHandler}
      />

      <AddAddressModal
        show={showAddressModal}
        close={closeAddressModalHandler}
        perPage={1000000}
        currentPage={1}
      />

      <PromoModal
        show={showPromoModal} 
        close={closePromoModalHandler}
        reset={onRemovePromoHandler}
        selectPromo={onUsePromoHandler}
        onChange={promoChangeHandler}
        promo={promo}
        dataPromo={listPromo}
      />


      <style jsx>{CartStyle}</style>
      <style jsx>{`
        :global(.address-card){
          border-radius: 0;
          border-left: 0;
          border-right: 0;
          padding: 10px 0 10px 0;
          margin-bottom: 1em;
        }
        :global(.user-phone){
          letter-spacing : -1px;
        }
        :global(.select-courier .ant-select-selection-placeholder){
          color: rgba(0, 0, 0, 0.85);
        }
        :global(.custom-skeleton > .ant-skeleton-content .ant-skeleton-title + .ant-skeleton-paragraph){
          margin-top: 16px;
        }
      `}</style>
    </>
  )
}

export default Checkout
