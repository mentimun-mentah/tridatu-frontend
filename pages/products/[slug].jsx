import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Rate, Button, Select, Tabs, Progress, Breadcrumb, Input, AutoComplete } from "antd";
import { Comment, Avatar, Col as ColAntd, Row as RowAntd, Skeleton, Alert } from 'antd';
import { AnimatePresence, motion } from "framer-motion"
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import { SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";

import Link from 'next/link'
import Router, { useRouter } from "next/router";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import ButtonBoot from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'

import ImageGallery from 'react-image-gallery'

import getYoutubeThumbnail from "lib/getYoutubeThumbnail"
import formatNumber from "lib/formatNumber";
import Pagination from "components/Pagination";
import UlasanContainer from 'components/Card/Ulasan'
import DiskusiContainer from 'components/Card/Diskusi'
import ShareModal from 'components/Card/ShareModal'
import CardProduct from "components/Card/Product";

import VariantProduct from "components/Products/Variants";
import ShippingDisplayContainer from "components/Products/ShippingDisplay";
import BottomNavigation from "components/Products/BottomNavigation"

import * as actions from "store/actions";
import axios from 'lib/axios'

import { renderLeftNav, renderRightNav, renderFullscreenButton } from 'components/Products/ImageGalleryButton'

import SlugStyle from 'components/Products/slugStyle'

const CardProductMemo = React.memo(CardProduct);

const Fade = {
  initial: { opacity: 0, },
  in: { opacity: 1, },
  out: { opacity: 0, },
};

const initialShippingLocation = { 
  value: "Pilih lokasi untuk lihat ongkos kirim", 
  origin: "Kota Denpasar, Bali",
  shipping_cities_id: null, 
  shipping_subdistricts_id: null,
}

const loveLoginBtn = () => document.getElementById("id-btn-login").click();

const _renderVideo = (item) => {
  return (
    <div className="embed-responsive embed-responsive-1by1">
      <iframe className="embed-responsive-item" src={item} />
    </div>
  );
}

const _renderImage = (item) => {
  return (
    <div className="embed-responsive embed-responsive-1by1">
      <img src={item} className="embed-responsive-item gallery-img-size-guide" />
    </div>
  )
}

const ProductDetail = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const user = useSelector(state => state.auth.user)
  const productData = useSelector(state => state.products.productSlug)
  const loadingCost = useSelector(state => state.shipping.loading)
  const listLocation = useSelector(state => state.shipping.listLocation)
  const shippingCosts = useSelector(state => state.shipping.shippingCosts)

  useEffect(() => {
    dispatch(actions.getSlugProduct({ slug: router.query.slug, recommendation: true }))
    document.getElementById('id-footer').style.setProperty("padding-bottom", "4rem", "important")
    return (() => {
      document.getElementById('id-footer').style.removeProperty("padding-bottom")
    })
  }, [])

  console.log(JSON.stringify(productData, null, 2))

  const { products_id, products_brand, products_category, products_condition, products_desc, products_image_product } = productData
  const { products_image_size_guide, products_love, products_name, products_recommendation, products_slug } = productData
  const { products_variant, products_visitor, products_weight, products_wholesale, products_video } = productData

  const [showSearch, setShowSearch] = useState(false)
  const [showModalCart, setShowModalCart] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [product, setProduct] = useState({})
  const [courier, setCourier] = useState({})
  const [shippingLocation, setShippingLocation] = useState(initialShippingLocation)
  const [love, setLove] = useState(products_love)
  const [quantity, setQuantity] = useState(1)
  const [selected, setSelected] = useState({price: 0, va1_item: "", va2_item: "", stock: 0, priceChange: false })

  const showModalCartHandler = () => { setShowModalCart(true) }

  const showImageModalHandler = e => {
    console.log(e)
    e.preventDefault()
    e.stopPropagation()
    setShowImageModal(true)
  }

  useEffect(() => {
    setProduct(productData)
    setLove(products_love)
  }, [productData])

  useEffect(() => {
    dispatch(actions.getSlugProduct({ slug: router.query.slug, recommendation: true }))
  }, [love])


  useEffect(() => {
    if(shippingCosts){
      if(shippingCosts.costs_shipping.length > 0){
        const { code, costs } = shippingCosts.costs_shipping[0]
        if(costs && costs.length > 0){
          let data = {
            code: code,
            services: costs[0].service,
            etd: costs[0].cost[0].etd.split(" ")[0],
            cost: costs[0].cost[0].value
          }
          setCourier(JSON.stringify(data))
          setShippingLocation({...shippingLocation, origin: shippingCosts.origin_detail})
        }
      }
    }
  }, [shippingCosts])

  const searchHandlerClicked = () => setShowSearch(!showSearch)

  const onSearchChangeHandler = e => {
    const value = e.target.value
    dispatch(actions.searchCityDistrict({ q: value, limit: 50 }))
  }

  const onSearchSelectHandler = (_, option) => {
    dispatch(actions.getShippingCost({ destination: option.shipping_subdistricts_id, weight: products_weight }))
    setShippingLocation({ ...shippingLocation, ...option })
    setShowSearch(false)
  }

  const loveHandler = id => {
    if(!user) {
      loveLoginBtn()
    }
    if(user && !love) {
      setLove(!love)
      dispatch(actions.loveProduct(id))
    }
    if(user && love) {
      setLove(!love)
      dispatch(actions.unloveProduct(id))
    }
  }

  const getImageList = () => {
    let list = []
    let imgVariants = [], imgSizeGuide = [], videoProduct = []
    for(let [_, obj] of Object.entries(products_image_product)){
      let imgUrl = `${process.env.NEXT_PUBLIC_API_URL}/static/products/${products_slug}/${obj}`
      list.push({
        original: imgUrl, 
        thumbnail: imgUrl
      })
    }
    if(products_variant && products_variant.va1_name){
      const { va1_items } = products_variant
      for(let obj of va1_items){
        if(obj.va1_image){
          let imgUrl = `${process.env.NEXT_PUBLIC_API_URL}/static/products/${products_slug}/${obj.va1_image}`
          imgVariants.push({
            original: imgUrl, 
            thumbnail: imgUrl,
          })
        }
      }
    }
    if(products_image_size_guide){
      let imgUrl = `${process.env.NEXT_PUBLIC_API_URL}/static/products/${products_slug}/${products_image_size_guide}`
      imgSizeGuide.push({
        original: imgUrl, 
        thumbnail: imgUrl,
        renderItem: () => _renderImage(imgUrl),
      })
    }
    if(products_video){
      const video = {
        thumbnail: getYoutubeThumbnail(products_video, "max"),
        embedUrl: products_video,
        renderItem: () => _renderVideo(products_video)
      }
      videoProduct.push(video)
    }
    return list.concat(imgVariants, imgSizeGuide, videoProduct)
  }

  return(
    <>
      <BottomNavigation 
        product={productData}
        loveHandler={(id) => loveHandler(id)}
        love={love}
        selected={selected}
        quantity={quantity}
      />

      <Container className="pt-4 pb-2">
        <Row className="mb-3">
          <Col className="col-lg-7 col-12">
            <Breadcrumb className="text-truncate">
              <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
              <Breadcrumb.Item>{products_category.categories_name}</Breadcrumb.Item>
              <Breadcrumb.Item>{products_category.sub_categories_name}</Breadcrumb.Item>
              <Breadcrumb.Item>{products_category.item_sub_categories_name}</Breadcrumb.Item>
              <Breadcrumb.Item>{products_name}</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row>
          {/* POTHOS OF PRODUCTS */}
          <Col lg={6} className="product-images m-b-13-m m-b-13-s" id="id-product-images">
            <ImageGallery
              items={getImageList()} 
              showPlayButton={false}
              useBrowserFullscreen={false}
              useTranslate3D={false}
              preventDefaultTouchmoveEvent
              showFullscreenButton={false}
              renderLeftNav={renderLeftNav}
              renderRightNav={renderRightNav}
              renderFullscreenButton={renderFullscreenButton}
              onClick={showImageModalHandler}
            />
          </Col>
          {/* POTHOS OF PRODUCTS */}

          <Col lg={6}>
            {/* TITLE PRODUCTS INFORMATION */}
            <div className="header-product">
              <h1 className="header-product-title fs-18-s">{products_name}</h1>
              <div className="header-product-rating text-muted">
                <span className="header-product-rating-detail m-r-5">
                  4.5
                </span>
                <Rate className="header-product-rating-rate" allowHalf disabled defaultValue={5} />
                <span className="header-product-rating-detail">
                  (116) • <b>Terjual 127 Produk</b> • <b>{products_visitor}x</b> Dilihat
                </span>
              </div>
            </div>
            {/* TITLE PRODUCTS INFORMATION */}

            <VariantProduct 
              product={productData} 
              selected={selected}
              setSelected={setSelected}
              quantity={quantity}
              setQuantity={setQuantity}
            />

            {/* PRODUCTS INFORMATION */}
            <div className="media info-product">
              <h5 className="info-product-left">Info produk</h5>
              <div className="media-body info-product-body">
                <div className="d-flex noselect">
                  <div className="info-item">
                    <p>Berat</p>
                    <p>{products_weight}gr</p>
                  </div>
                  <div className="info-item">
                    <p>Kondisi</p>
                    <p>{products_condition ? "Baru" : "Bekas"}</p>
                  </div>
                  <div className="info-item">
                    <p>Kategori</p>
                    <p>{products_category.item_sub_categories_name}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* PRODUCTS INFORMATION */}

            {/* SHIPPING INFORMATION */}
            <div className="media info-product">
              <h5 className="info-product-left">Ongkos Kirim</h5>
              <div className="media-body info-product-body">
                <div className="fs-14 text-secondary mb-2">
                  <p className="mb-0 font-weight-light">
                    Ke
                    <a 
                      className="fw-500 text-dark m-l-3"
                      style={{ borderBottom: "1px dashed #343a40" }}
                      onClick={searchHandlerClicked}
                    >
                      {shippingLocation.value}
                    </a>
                  </p>
                  <p className="mb-0 font-weight-light">
                    Dari<span className="fw-500 text-dark m-l-3">{shippingLocation.origin}</span>
                  </p>
                </div>

                <AnimatePresence exitBeforeEnter>
                  {showSearch ? (
                    <motion.div initial="initial" animate="in" exit="out" variants={Fade} className="m-t-10" key={showSearch}>
                      <Card>
                        <Card.Body className="px-3" style={{ paddingTop: "9.5px", paddingBottom: "9.5px" }}>
                          <AutoComplete 
                            autoFocus 
                            dropdownClassName="idx-1020"
                            className="w-100"
                            options={listLocation}
                            onSelect={onSearchSelectHandler}
                          >
                            <Input
                              placeholder="Search"
                              onPressEnter={false}
                              onChange={onSearchChangeHandler}
                              prefix={<SearchOutlined className="text-black-50"/>}
                            />
                          </AutoComplete>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  ) : (
                    <motion.div initial="initial" animate="in" exit="out" variants={Fade} key={!showSearch}>
                      <Select 
                        className="w-100 select-courier"
                        onChange={val => setCourier(val)}
                        value={<ShippingDisplayContainer data={courier} />}
                      >
                        {shippingCosts && shippingCosts.costs_shipping.length > 0 && shippingCosts.costs_shipping.map((courier, i) => (
                          <React.Fragment key={i}>
                            {courier.costs.map(services => (
                              services.cost.map(cost => {
                                let etd = cost.etd.split(" ")
                                let data = {
                                  code: courier.code,
                                  services: services.service,
                                  etd: etd[0],
                                  cost: cost.value
                                }
                                return (
                                  <Select.Option value={JSON.stringify(data)} key={courier.code + services.service}>
                                    <div className="d-flex justify-content-between noselect">
                                      <div className="align-self-center" style={{ width: 'calc(100%/2)' }}>
                                        <p className="mb-0 text-uppercase text-truncate"> 
                                          <img 
                                            className="courier-img" 
                                            src={`/static/images/couriers/${courier.code}.png`} 
                                          />
                                          <span className="va-super">{courier.code || "-"} {services.service}</span>
                                        </p>
                                      </div>
                                      <div className="align-self-center">
                                        <p className="mb-0 text-truncate"> {etd[0] || 0} hari </p>
                                      </div>
                                      <div className="align-self-center m-r-17">
                                        <p className="mb-0 text-truncate"> Rp.{formatNumber(cost.value || 0)} </p>
                                      </div>
                                    </div>
                                  </Select.Option>
                                )
                              })
                            ))}
                          </React.Fragment>
                        ))}
                      </Select>
                    </motion.div>
                  )}
                </AnimatePresence>


                <AnimatePresence>
                  {shippingCosts.costs_shipping.length > 0 && (
                    <Alert banner showIcon 
                      type="info" className="m-t-10 shadow-sm bor-rad-5px p-2"
                      icon={<InfoCircleOutlined className="fs-18 m-r-10" />}
                      message={
                        <p className="mb-0 font-weight-light text-muted fs-12" style={{ lineHeight: "12px" }}>
                          Estimasi Biaya Pengiriman
                        </p>
                      }
                      description={
                        <motion.div initial="initial" animate="in" exit="out" variants={Fade} className="mb-0 font-weight-light">
                          {loadingCost ? (
                            <Skeleton.Button active className="h-17" style={{ verticalAlign: "sub" }} />
                          ):(
                            <span className="fw-500 text-dark" style={{ lineHeight: "12px" }}>
                              Rp.{formatNumber(shippingCosts.min_cost)} - Rp.{formatNumber(shippingCosts.max_cost)}
                            </span>
                          )}
                        </motion.div>
                      } 
                    />
                  )}
                </AnimatePresence>

              </div>
            </div>
            {/* SHIPPING INFORMATION */}

            {/* ACTIONS PRODUCTS INFORMATION 
            <div className="info-product">
              <Space>
                <Button 
                  size="large"
                  onClick={() => setShowShareModal(true)}
                  icon={<i className="fal fa-share-square" />} 
                />
              </Space>
            </div>
            {/* ACTIONS PRODUCTS INFORMATION */}

          </Col>
        </Row>









        <Row className="mt-3">
          <Col>
            <Tabs defaultActiveKey="1" style={{ borderTop: "1px solid #f0f0f0" }}>
              <Tabs.TabPane tab="Deskripsi" key="1">
                <p className="ws-preline"> {products_desc} </p>
              </Tabs.TabPane>

              <Tabs.TabPane tab="Ulasan (20)" key="2">
                <Row className="mt-4">
                  <Col className="col-auto align-self-center mr-3">
                    <div className="d-inline-flex">
                      <div className="align-self-center text-center">
                        <h5 className="fs-55 display-1 mb-0">4.5<span className="fs-16 font-weight-light m-l-2">/5</span></h5>
                        <Rate
                          className="header-product-rating-rate fs-20"
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
                      <Rate disabled className="ulasan-rating-rate" count={1} value={1} />
                      <span className="ulasan-rating-text">5</span>
                      <Progress className="ulasan-star-rating" percent={80} strokeWidth="5px" format={percent => `${percent}`} />
                    </div>
                    <div className="ulasan-rating">
                      <Rate disabled className="ulasan-rating-rate" count={1} value={1} />
                      <span className="ulasan-rating-text">4</span>
                      <Progress className="ulasan-star-rating" percent={100} strokeWidth="5px" format={percent => `${percent}`} />
                    </div>
                    <div className="ulasan-rating">
                      <Rate disabled className="ulasan-rating-rate" count={1} value={1} />
                      <span className="ulasan-rating-text">3</span>
                      <Progress className="ulasan-star-rating" percent={90} strokeWidth="5px" format={percent => `${percent}`} />
                    </div>
                    <div className="ulasan-rating">
                      <Rate disabled className="ulasan-rating-rate" count={1} value={1} />
                      <span className="ulasan-rating-text">2</span>
                      <Progress className="ulasan-star-rating" percent={30} strokeWidth="5px" format={percent => `${percent}`} />
                    </div>
                    <div className="ulasan-rating">
                      <Rate disabled className="ulasan-rating-rate" count={1} value={1} />
                      <span className="ulasan-rating-text">1</span>
                      <Progress className="ulasan-star-rating" percent={10} strokeWidth="5px" format={percent => `${percent}`} />
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

                <Row className="mt-3">
                  <Col className="align-self-center text-right">
                    <Pagination />
                  </Col>
                </Row>
              </Tabs.TabPane>

            </Tabs>
          </Col>
        </Row>

        <section className="mt-3 border-top pt-4 recomend-section">
          <h4 className="fs-20-s mb-4">Rekomendasi produk lainnya</h4>
          <RowAntd gutter={[16, 16]}>
            <AnimatePresence>
              {products_recommendation && products_recommendation.length > 0 && products_recommendation.map(product => (
                <ColAntd lg={4} md={6} sm={8} xs={12} className="modif-col" key={product.products_id}>
                  <CardProductMemo data={product} />
                </ColAntd>
              ))}
            </AnimatePresence>
          </RowAntd>
        </section>
      </Container>

      <Modal
        centered
        footer={null}
        visible={showImageModal}
        onCancel={() => setShowImageModal(false)}
        title={products_name}
        closeIcon={ <i className="fas fa-times" /> }
        width="900px"
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
      >
        <ImageGallery
          items={getImageList()} 
          showPlayButton={false}
          useBrowserFullscreen={false}
          useTranslate3D={false}
          preventDefaultTouchmoveEvent
          showFullscreenButton={false}
          renderLeftNav={renderLeftNav}
          renderRightNav={renderRightNav}
          renderFullscreenButton={renderFullscreenButton}
          thumbnailPosition="right"
        />
      </Modal>

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
            {/* <Row className="scrolling-wrapper flex-nowrap custom-gutters lg-screen"> */}
            {/*   {[...Array(6)].map((_, i) => ( */}
            {/*     <Col key={i} className="col-7 col-sm-5 col-md-3 col-lg-2"> */}
            {/*       <CardProductMemo /> */}
            {/*     </Col> */}
            {/*   ))} */}
            {/* </Row> */}
          </section>
        </Card>
      </Modal>

      <style jsx>{SlugStyle}</style>
      <style jsx>{`
        :global(.select-courier.ant-select-single:not(.ant-select-customize-input) .ant-select-selector){
          height: 53px;
        }
        .courier-img{
          height: 35px;
          vertical-align: bottom;
          margin-left: -5px;
        }
        :global(.h-17){
          height: 17px !important;
        }

        :global(.product-images .image-gallery-thumbnails .image-gallery-thumbnails-container){
          text-align: left;
        }

        :global(.gallery-img-size-guide){
          object-fit: contain;
          width: 100%;
        }

        :global(.image-gallery.fullscreen-modal){
          z-index: 3000;
        }
      `}</style>
    </>
  )
}

ProductDetail.getInitialProps = async ctx => {
  const { slug } = ctx.query
  ctx.store.dispatch(actions.getProductSlugStart)

  try{
    const res = await axios.get(`/products/${slug}?recommendation=true`)
    ctx.store.dispatch(actions.getProductSlugSuccess(res.data))
    if(res.hasOwnProperty("status") && res.status == 404){
      process.browser
        ? Router.replace("/products", "/products") //Redirec from Client Side
        : ctx.res.writeHead(302, { Location: "/products" }); //Redirec from Server Side
      !process.browser && ctx.res.end()
      ctx.store.dispatch(actions.getProductSlugFail("something was wrong"))
    }
    ctx.store.dispatch(actions.getProductSlugFail("something was wrong"))
  }
  catch (err) {
    const res = await axios.get(`/products/${slug}?recommendation=true`)
    ctx.store.dispatch(actions.getProductSlugSuccess(res.data))
    if(res.hasOwnProperty("status") && res.status == 404){
      process.browser
        ? Router.replace("/products", "/products") //Redirec from Client Side
        : ctx.res.writeHead(302, { Location: "/products" }); //Redirec from Server Side
      !process.browser && ctx.res.end()
      ctx.store.dispatch(actions.getProductSlugFail("something was wrong"))
    }
    ctx.store.dispatch(actions.getProductSlugFail("something was wrong"))
  }
}

export default ProductDetail
