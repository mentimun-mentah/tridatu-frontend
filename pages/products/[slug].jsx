import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Space, Modal, Rate, InputNumber, Button, Select, Tabs, Progress, Breadcrumb, Input, Popover } from "antd";
import { Comment, Avatar } from 'antd';
import { motion, AnimatePresence } from "framer-motion"
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';

import Link from 'next/link'
import Slider from 'react-slick';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import ButtonBoot from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'

import ImageGallery from 'react-image-gallery'

import Pagination from "components/Pagination";
import UlasanContainer from 'components/Card/Ulasan'
import DiskusiContainer from 'components/Card/Diskusi'
import ShareModal from 'components/Card/ShareModal'
import CardProduct from "components/Card/Product";

const CardProductMemo = React.memo(CardProduct);

import { renderLeftNav, renderRightNav, renderFullscreenButton } from 'components/Products/ImageGalleryButton'
import { brandSettings } from "lib/slickSetting";

import PHOTOS from 'data/detailPhotoProduct'

const content = (
  <Form>
    <Form.Group>
      <Form.Label className="d-block">Kota atau Kecamatan</Form.Label>
      <Select
        showSearch
        showArrow={false}
        name="region"
        className="w-100"
        placeholder="Tulis Nama Alamat / Kota / Kecamatan tujuan pengiriman"
        notFoundContent={
          <p className="text-center mb-2">
            <i className="fad fa-map-marked-alt fs-35 text-center d-block my-2" />
            <span className="text-center"></span>
          </p>
        }
      >
      </Select>
    </Form.Group>
    <Form.Group className="mb-1">
      <Form.Label className="d-block">Kode Pos</Form.Label>
      <Select
        showSearch
        showArrow={false}
        name="region"
        className="w-100"
        placeholder="Tulis Nama Alamat / Kota / Kecamatan tujuan pengiriman"
        notFoundContent={
          <p className="text-center mb-2">
            <i className="fad fa-map-marked-alt fs-35 text-center d-block my-2" />
            <span className="text-center"></span>
          </p>
        }
      >
      </Select>
    </Form.Group>
  </Form>
);

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1)
  const [showNote, setShowNote] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showModalCart, setShowModalCart] = useState(false)

  const user = useSelector(state => state.auth.user)

  const quantityHandler = (e, val) => {
    if(val == "input"){
      setQuantity(e)
    }
    if(val === "min"){
      if(quantity == 1) e.stopPropagation()
      else setQuantity(quantity-1)
    }
    if(val === "plus"){
      setQuantity(quantity+1) 
    }
  }

  const showModalCartHandler = () => { setShowModalCart(true) }

  const showNoteHandler = () => { setShowNote(true) }
  const closeNoteHandler = () => { setShowNote(false) }

  return(
    <>
      <Container className="pt-4 pb-2">
        <Row className="mb-3">
          <Col className="col-12">
            <Breadcrumb>
              <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
              <Breadcrumb.Item href="/products">Baju</Breadcrumb.Item>
              <Breadcrumb.Item>Kaos - Baju - Tshirt Deus Ex Machina 02 - Putih</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row>
          {/* POTHOS OF PRODUCTS */}
          <Col lg={6} className="product-images m-b-13-m m-b-13-s">
            <ImageGallery
              items={PHOTOS} 
              showPlayButton={false}
              useBrowserFullscreen={false}
              renderLeftNav={renderLeftNav}
              renderRightNav={renderRightNav}
              renderFullscreenButton={renderFullscreenButton}
            />
          </Col>
          {/* POTHOS OF PRODUCTS */}

          <Col lg={6}>
            {/* TITLE PRODUCTS INFORMATION */}
            <div className="header-product">
              <h1 className="header-product-title fs-18-s">Kaos - Baju - Tshirt Deus Ex Machina 02 - Putih</h1>
              <div className="header-product-rating">
                <Rate className="header-product-rating-rate" allowHalf disabled defaultValue={5} />
                <span className="header-product-rating-detail">
                  116 Ulasan • 127 Terjual • 169x Dilihat
                </span>
              </div>
            </div>
            {/* TITLE PRODUCTS INFORMATION */}

            {/* PRICE PRODUCTS INFORMATION */}
            <div className="media info-product">
              <h5 className="info-product-left">Harga</h5>
              <div className="media-body info-product-body">
                {/* <h5 className="info-product-body-title">Top-aligned media</h5> */}
                <div className="fs-14 font-weight-light">
                  {/*
                  <span className="info-product-body-price-disc">
                    <s>Rp. 150.000</s>
                  </span>
                  <br />
                  */}
                  <span className="info-product-body-price font-weight-bold h6 fs-14-s">Rp. 105.000</span>
                </div>
              </div>
            </div>
            {/* PRICE PRODUCTS INFORMATION */}

            {/* COLOR PRODUCTS INFORMATION */}
            <div className="media info-product">
              <h5 className="info-product-left">Warna</h5>
              <div className="media-body info-product-body">
                <Form>
                  <Form.Row>
                    <Form.Group as={Col} lg={4} className="mb-0">
                      <Select placeholder="Pilih warna" className="w-100">
                        <Select.Option value="1">Hitam</Select.Option>
                        <Select.Option value="3">Coklat</Select.Option>
                        <Select.Option value="2">Hijau</Select.Option>
                      </Select>
                    </Form.Group>
                  </Form.Row>
                </Form>
              </div>
            </div>
            {/* COLOR PRODUCTS INFORMATION */}

            {/* SIZE PRODUCTS INFORMATION */}
            <div className="media info-product">
              <h5 className="info-product-left">Ukuran</h5>
              <div className="media-body info-product-body">
                <Form>
                  <Form.Row>
                    <Form.Group as={Col} lg={4} className="mb-0">
                      <Select placeholder="Pilih ukuran" className="w-100">
                        <Select.Option value="1">XS</Select.Option>
                        <Select.Option value="3">S</Select.Option>
                        <Select.Option value="2">M</Select.Option>
                        <Select.Option value="4">L</Select.Option>
                        <Select.Option value="5">XL</Select.Option>
                        <Select.Option value="6">XXL</Select.Option>
                      </Select>
                    </Form.Group>
                  </Form.Row>
                </Form>
              </div>
            </div>
            {/* SIZE PRODUCTS INFORMATION */}

            {/* QUANTITY PRODUCTS INFORMATION */}
            <div className="media info-product">
              <h5 className="info-product-left">Jumlah</h5>
              <div className="media-body info-product-body">
                <span className="fs-14 va-super">
                  Tersedia 12 pcs
                </span>
                <div className="mb-2">
                  <Button 
                    disabled={quantity == 1}
                    icon={<i className="far fa-minus" />} 
                    onClick={(e) => quantityHandler(e, 'min')} 
                  />
                  <InputNumber 
                    size="middle"
                    className="mx-2" 
                    min={1} 
                    value={quantity} 
                    onChange={(e) => quantityHandler(e, 'input')} 
                  />
                  <Button 
                    icon={<i className="far fa-plus" />} 
                    onClick={(e) => quantityHandler(e, 'plus')} 
                  />
                </div>
                <AnimatePresence>
                  {showNote ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="d-flex align-items-center mt-3">
                        <Input /> <h6 className="ml-2 mb-0 fs-14 text-tridatu hover-pointer" onClick={closeNoteHandler}>Batal</h6>
                      </div>
                      <small className="text-secondary fs-12 mb-0">Contoh: Warna Putih, Size M</small>
                    </motion.div>
                  ) : (
                    <motion.h6 
                      className="fs-14 mb-0 text-tridatu hover-pointer" onClick={showNoteHandler}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Tulis catatan untuk penjual
                    </motion.h6>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {/* QUANTITY PRODUCTS INFORMATION */}

            {/* PRODUCTS INFORMATION */}
            <div className="media info-product">
              <h5 className="info-product-left">Info produk</h5>
              <div className="media-body info-product-body">
                <div className="d-flex">
                  <div className="info-item">
                    <p>Berat</p>
                    <p>100gr</p>
                  </div>
                  <div className="info-item">
                    <p>Kondisi</p>
                    <p>Baru</p>
                  </div>
                  <div className="info-item">
                    <p>Kategori</p>
                    <p>Baju</p>
                  </div>
                </div>
              </div>
            </div>
            {/* PRODUCTS INFORMATION */}

            {/* SHIPPING INFORMATION */}
            <div className="media info-product">
              <h5 className="info-product-left">Ongkos Kirim</h5>
              <div className="media-body info-product-body">
                <div className="fs-14 text-secondary">
                  Ke{" "} 
                  <Popover arrowPointAtCenter trigger="click" placement="bottom" overlayClassName="ongkir-popover" content={content}> 
                    <span className="font-weight-bold text-dark hover-pointer">Denpasar Bali</span>
                  </Popover>
                </div>
              </div>
            </div>
            {/* SHIPPING INFORMATION */}

            {/* ACTIONS PRODUCTS INFORMATION */}
            <div className="info-product">
              <Space>
                <Button 
                  size="large"
                  className="btn-tridatu w-100 p-l-8-s p-r-8-s fs-14-s"
                  icon={<i className="far fa-cart-plus p-r-10 p-r-8-s" />} 
                  onClick={showModalCartHandler}
                >Tambah Ke Keranjang</Button>
                <Button 
                  size="large"
                  icon={<i className="fal fa-heart" />} 
                />
                <Button 
                  onClick={() => setShowShareModal(true)}
                  size="large"
                  icon={<i className="fal fa-share-square" />} 
                />
              </Space>
            </div>
            {/* ACTIONS PRODUCTS INFORMATION */}

          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Deskripsi" key="1">
                <p>
                  1 pcs Rp 40.000<br />3pcs Rp 105.000 (motif boleh campur)<br /><br />Caranya : Klik 'BELI' di 1 Gambar saja, Lalu isi Kuantitinya 3pcs. Maka otomatis harga akan berubah menjadi 35rb.<br />Kemudian sebutkan nama motif yang ingin kamu order di kolom keterangan. Terima Kasih.<br /><br />Ukuran : ALL SIZE FIT TO L<br />LD (lingkar dada): 96 cm<br/>P (panjang): 65 cm<br />Bahan: Cotton combed 30s<br /><br />Jika masih belum mengerti untuk mendapatkan hrga 3pcs 105.000 dgn motif campur silahkan order melalui<br />line: @ellipses.inc (pakai @ ya) / Pin: D47B1DA4 WA : 081932547692<br /><br />Follow IG: @ellipses.inc</p>
              </Tabs.TabPane>

              <Tabs.TabPane tab="Ulasan (20)" key="2">
                <Row className="mt-4">
                  <Col className="col-auto align-self-center mr-3">
                    <div className="d-inline-flex">
                      <CircularProgressbar 
                        className="wh-80 mr-3" 
                        strokeWidth={5} 
                        value={4.5} 
                        text={4.5} 
                        minValue={0} 
                        maxValue={5} 
                        styles={buildStyles({
                          pathColor: "#fbbc04",
                          trailColor: "#f5f5f5",
                        })}
                      />
                      <div className="align-self-center">
                        <Rate
                          className="header-product-rating-rate"
                          allowHalf
                          disabled
                          value={5}
                        />
                        <p className="font-weight-light mb-0">dari 20 ulasan</p>
                      </div>
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="ulasan-rating">
                      <Rate disabled
                        className="ulasan-rating-rate"
                        count={1} value={1}
                      />
                      <span className="ulasan-rating-text">5</span>
                      <Progress 
                        className="ulasan-star-rating" 
                        percent={80} 
                        strokeWidth="5px" 
                        format={percent => `${percent} %`}
                      />
                    </div>
                    <div className="ulasan-rating">
                      <Rate disabled
                        className="ulasan-rating-rate"
                        count={1} value={1}
                      />
                      <span className="ulasan-rating-text">4</span>
                      <Progress 
                        className="ulasan-star-rating" 
                        percent={100} 
                        strokeWidth="5px" 
                        format={percent => `${percent} %`}
                      />
                    </div>
                    <div className="ulasan-rating">
                      <Rate disabled
                        className="ulasan-rating-rate"
                        count={1} value={1}
                      />
                      <span className="ulasan-rating-text">3</span>
                      <Progress 
                        className="ulasan-star-rating" 
                        percent={90} 
                        strokeWidth="5px" 
                        format={percent => `${percent} %`}
                      />
                    </div>
                    <div className="ulasan-rating">
                      <Rate disabled
                        className="ulasan-rating-rate"
                        count={1} value={1}
                      />
                      <span className="ulasan-rating-text">2</span>
                      <Progress 
                        className="ulasan-star-rating" 
                        percent={30} 
                        strokeWidth="5px" 
                        format={percent => `${percent} %`}
                      />
                    </div>
                    <div className="ulasan-rating">
                      <Rate disabled
                        className="ulasan-rating-rate"
                        count={1} value={1}
                      />
                      <span className="ulasan-rating-text">1</span>
                      <Progress 
                        className="ulasan-star-rating" 
                        percent={90} 
                        strokeWidth="5px" 
                        format={percent => `${percent} %`}
                      />
                    </div>
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col><h5 className="text-secondary">Daftar Ulasan</h5></Col>
                </Row>
                <Row className="mt-3">
                  {[...Array(3)].map((_,i) => (
                    <Col className="col-12 border-bottom" key={i}>
                      <UlasanContainer />
                    </Col>
                  ))}
                </Row>
                <Row className="mt-3">
                  <Col className="align-self-center text-right">
                    <Pagination />
                  </Col>
                </Row>
              </Tabs.TabPane>

              <Tabs.TabPane tab="Diskusi (3)" key="3">
                <section>
                  <Comment 
                    avatar={
                      <Avatar
                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        alt="Han Solo"
                      />
                    }
                    content={
                      <Form>
                        <Form.Group>
                          <Form.Control 
                            as="textarea" 
                            rows={3}
                            placeholder="Apa yang ingin Anda tanyakan tentang produk ini?"
                          />
                        </Form.Group>
                        <ButtonBoot className="btn-tridatu px-5">Kirim</ButtonBoot>
                      </Form>
                    }
                  />
                </section>

                {[...Array(3)].map((_,i) => (
                  <section className="diskusi-section mb-0" key={i}>
                    <DiskusiContainer head body="isi">
                      <DiskusiContainer body="isi" />
                      {/* IF USER LOGIN */}
                      {user && <DiskusiContainer body="balas" />}
                    </DiskusiContainer>
                  </section>
                ))}
              </Tabs.TabPane>

            </Tabs>
          </Col>
        </Row>

        <section className="mt-3 border-top pt-4 recomend-section">
          <h4 className="fs-20-s mb-4">Rekomendasi produk lainnya</h4>
          <Slider {...brandSettings}>
            {[...Array(10)].map((_, i) => (
              <Col key={i} className="px-0">
                <CardProductMemo />
              </Col>
            ))}
          </Slider>
        </section>
      </Container>

      <Modal
        centered
        footer={null}
        visible={showShareModal}
        onCancel={() => setShowShareModal(false)}
        title="Bagikan"
        closeIcon={ <i className="fas fa-times" /> }
        bodyStyle={{padding: "10px 0px"}}
        width="400px"
      >
        <ShareModal link="www.google.com" />
      </Modal>

      <Modal
        centered
        footer={null}
        visible={showModalCart}
        onCancel={() => setShowModalCart(false)}
        title="Berhasil Ditambahkan"
        closeIcon={ <i className="fas fa-times" /> }
        width="950px"
      >
        <Card className="card-item-popup">
          <Card.Body className="p-3">
            <div className="media">
              <img src="https://ecs7.tokopedia.net/img/cache/700/product-1/2019/5/18/3453155/3453155_bdfa5991-04e9-49a3-8246-34f9d270b180_1438_1438.webp" className="mr-3 card-item-popup-img align-self-center" alt="Tridatu Bali ID" />
              <div className="media-body align-self-center mr-3">
                <p className="mb-0 text-dark truncate-2">Kaos - Baju - Tshirt Deus Ex Machina 02 - Putih</p>
                <Link href="/cart" as="/cart">
                  <Button className="btn-tridatu d-block d-md-none mt-1" size="small">Lihat Keranjang</Button>
                </Link>
              </div>
              <Link href="/cart" as="/cart">
                <Button className="btn-tridatu align-self-center d-none d-md-block">Lihat Keranjang</Button>
              </Link>
            </div>
          </Card.Body>
        </Card>

        <Card className="card-item-popup another-item">
          <section className="another-product mb-0">
            <h4 className="fs-16-s fs-18">Produk lainnya</h4>
            <Row className="scrolling-wrapper flex-nowrap custom-gutters lg-screen">
              {[...Array(6)].map((_, i) => (
                <Col key={i} className="col-7 col-sm-5 col-md-3 col-lg-2">
                  <CardProductMemo />
                </Col>
              ))}
            </Row>
          </section>
        </Card>
      </Modal>

      <style jsx>{`
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

      `}</style>
    </>
  )
}

export default ProductDetail
