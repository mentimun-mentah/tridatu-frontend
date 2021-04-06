import { useEffect } from "react";
import { Col, Row, Empty } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'

import id from 'locales/id/home'
import en from 'locales/en/home'

import Link from "next/link";
import dynamic from 'next/dynamic'
import RowB from "react-bootstrap/Row";
import ColB from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Slider from "react-slick";

import axios from "lib/axios";
import * as actions from "store/actions";

import CardBrandLoading from "components/Card/BrandLoading";
import CardBannerLoading from "components/Card/BannerLoading";
import OutletImageLoading from "components/Card/OutletLoading";
import CardProductLoading from "components/Card/ProductLoading";

const CardBrandLoadingMemo = React.memo(CardBrandLoading);
const CardBannerLoadingMemo = React.memo(CardBannerLoading);
const OutletImageLoadingMemo = React.memo(OutletImageLoading);
const CardProductLoadingMemo = React.memo(CardProductLoading);

const CardProduct = dynamic(() => import("components/Card/Product"), { ssr: false, loading: () => <CardProductLoadingMemo />  })
const CardProductMemo = React.memo(CardProduct);
const CardBrand = dynamic(() => import("components/Card/Brand"), { ssr: false, loading: () => <CardBrandLoadingMemo />  })
const CardBrandMemo = React.memo(CardBrand);
const CardBanner = dynamic(() => import("components/Card/Banner"), { ssr: false, loading: () => <CardBannerLoadingMemo />  })
const CardBannerMemo = React.memo(CardBanner);
const OutletImage = dynamic(() => import("components/Card/Outlet"), { ssr: false, loading: () => <OutletImageLoadingMemo />  })
const OutletImageMemo = React.memo(OutletImage);

import { brandSettings, bannerSettings, infoStoreSettings, infoStoreSettingsMobile } from "lib/slickSetting";

// let banners = ['/static/images/promo/used.jpg', '/static/images/banner/0.jpg', '/static/images/promo/Thumbnail-600x328.jpg', '/static/images/banner/2.jpeg']
let banners = [
  "/static/images/banner/0.jpg",
  "/static/images/promo/new-promo.jpeg",
  "/static/images/promo/new-promo-1.jpeg",
  "/static/images/promo/new-promo-2.jpeg",
  "/static/images/promo/new-promo-3.jpeg",
  "/static/images/promo/new-promo-4.jpeg",
  "/static/images/promo/new-promo-5.jpeg",
  "/static/images/promo/new-promo-6.jpeg",
  "/static/images/promo/new-promo-7.jpeg",
]

const infoStores = [...Array(4)].map(() => '/static/images/info-store/placeholder.png')
const emptyBrands = [...Array(5)].map(() => '/static/images/brand/placeholder.png')

const per_page = 10
const params = { page: 1, per_page: per_page, live: "true", order_by: "visitor" }
const Home = () => {
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : id

  const dispatch = useDispatch()
  const outlets = useSelector(state => state.outlet.outlet)
  const brands = useSelector(state => state.brand.brand)

  const user = useSelector(state => state.auth.user)
  const products = useSelector(state => state.products.products)
  const loadingProduct = useSelector(state => state.products.loading)

  useEffect(() => {
    dispatch(actions.getProducts({ ...params }))
  }, [user])

  return (
    <>
      <Container className="pt-4">
        <RowB>
          <ColB lg={10} md={12}>
            <section className="banner-section">
              <h4 className="fs-20-s">{t.promo}</h4>
              <AnimatePresence>
                <Slider {...bannerSettings}>
                  {banners.map((data, i) => (
                    <ColB key={i} className="px-0">
                      <CardBannerMemo image={data} />
                    </ColB>
                  ))}
                </Slider>
              </AnimatePresence>
            </section>

            {/*INFORMASI BRAND*/}
            <section className="brand-section">
              <h4 className="fs-20-s mb-4">{t.brand}</h4>
              <AnimatePresence>
                {brands && brands.length > 0 ? (
                  <Slider {...brandSettings} infinite={brands.length > 5} autoplay={false}>
                    {brands.map(data => (
                      <ColB key={data.id} className="px-0">
                        <CardBrandMemo image={`${process.env.NEXT_PUBLIC_API_URL}/static/brands/${data.image}`} name={data.name} />
                      </ColB>
                    ))}
                  </Slider>
                ) : (
                  <Slider {...brandSettings} infinite={true}>
                    {emptyBrands.map((data, i) => (
                      <ColB key={i} className="px-0">
                        <CardBrandMemo image={data} name="Brand" />
                      </ColB>
                    ))}
                  </Slider>
                )}
              </AnimatePresence>
            </section>
            {/*INFORMASI BRAND*/}
          </ColB>

          {/*INFORMASI OUTLET*/}
          <ColB lg={2} md={12} sm={12} className="d-none d-lg-block">
            <section className="info-store">
              <h4 className="fs-20-s info-store-title mb-3">{t.outlet_information}</h4>
              <AnimatePresence>
                {outlets && outlets.length > 0 ? (
                  <Slider {...infoStoreSettings} infinite={outlets.length > 4}>
                    {outlets.map(data => (
                      <div className="mb-1" key={data.id}>
                        <OutletImageMemo image={`${process.env.NEXT_PUBLIC_API_URL}/static/outlets/${data.image}`} size={145} />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <Slider {...infoStoreSettings} infinite={true}>
                    {infoStores.map((data, i) => (
                      <div className="mb-1" key={i}>
                        <OutletImageMemo image={data} size={145} />
                      </div>
                    ))}
                  </Slider>
                )}
              </AnimatePresence>
            </section>
          </ColB>
          {/*INFORMASI OUTLET*/}
        </RowB>

        {/*INFORMASI OUTLET MOBILE*/}
        <section className="info-store d-block d-lg-none">
          <h4 className="fs-20-s info-store-title mb-3">{t.outlet_information}</h4>
          {outlets && outlets.length > 0 ? (
            <Slider {...infoStoreSettingsMobile} infinite={outlets.length > 4}>
              {outlets.map(data => (
                <OutletImageMemo image={`${process.env.NEXT_PUBLIC_API_URL}/static/outlets/${data.image}`} size={151} key={data.id} />
              ))}
            </Slider>
          ) : (
            <Slider {...infoStoreSettingsMobile} infinite={true}>
              {infoStores.map((data, i) => (
                <OutletImageMemo image={data} size={151} key={i} />
              ))}
            </Slider>
          )}
        </section>
        {/*INFORMASI OUTLET MOBILE*/}

        <section>
          <h4 className="fs-20-s mb-4">{t.most_viewed}</h4>
          <AnimatePresence>
            <Row gutter={[16, 16]}>
              {products && products.data && products.data.length > 0 && products.data.map(product => (
                <Col lg={5} md={6} sm={8} xs={12} className="modif-col" key={product.products_id}>
                  <CardProductMemo data={product} />
                </Col>
              ))}
              {loadingProduct && (
                <>
                  {[...Array(per_page)].map((_,i) => (
                    <Col lg={6} md={8} sm={12} xs={12} key={i}>
                      <CardProductLoading />
                    </Col>
                  ))}
                </>
              )}
              {!loadingProduct && products && products.data && products.data.length == 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: ".2" }}
                  className="w-100"
                >
                  <Empty className="my-5" description={<span className="text-secondary">{t.no_product}</span>} />
                </motion.div>
              )}
            </Row>
          </AnimatePresence>

          {products && products.data && products.data.length > 0 && (
            <div className="text-center mb-5 mt-3">
              <Link href="/products" as="/products">
                <Button className="btn-dark-tridatu-outline mx-auto">{t.see_all}</Button>
              </Link>
            </div>
          )}
        </section>

      </Container>

      <style jsx>{`
        :global(.brand-section .slick-list){
          padding-bottom: 20px;
        }
        :global(.brand-section .slick-prev, .brand-section .slick-next){
          top: calc(50% - 10px);
        }
        :global(.brand-section .slick-prev:before, .brand-section .slick-next:before){
          display: none;
        }

        :global(.info-store > .info-store-title){
          font-size: 24px;
        }
        :global(.info-store .slick-track){
          height: auto !important;
        }
        :global(.info-store-img){
          width: 130px;
          object-fit: cover;
        }

        :global(.brand-section .slick-track, .info-store .slick-track){
          margin-left: 0;
        }

        @media only screen and (min-width: 992px){
          :global(.info-store > .info-store-title){
            font-size: 18px !important;
          }
          :global(.banner-section){
            margin-bottom: 2.4rem;
          }
        }
        @media only screen and (max-width: 1199px){
          :global(.info-store > .info-store-title){
            font-size: 16px !important;
          }
        }
        @media only screen and (min-width: 1200px){
          :global(.info-store-img){
            height: 144px;
          }
        }

        @media only screen and (min-width: 1200px){
          :global(.banner-section){
            margin-bottom: 3rem;
          }
        }

        @media only screen and (min-width: 600px){
          :global(.banner-section .slick-list){
            padding-top: 30px !important;
            padding-bottom: 24px !important;
            padding-left: 20% !important;
            padding-right: 20% !important;
            margin-left: 0px;
            margin-right: 0px;
          }
          :global(.banner-section .slick-slide){
            transform: scale(0.8, 0.8);
            transition: transform 0.3s;
          }
          :global(.banner-section .slick-slide.slick-center){
            transform: scale(1.2);
          }
          :global(.banner-section .slick-prev, .banner-section .slick-next){
            opacity: 0;
            transition: .3s all;
          }
          :global(.banner-section:hover .slick-prev, .banner-section:hover .slick-next){
            opacity: 1;
          }
        }

        @media only screen and (max-width: 600px){
          :global(.banner-section .slick-slider > .slick-dots){
            bottom: -15px;
          }
          :global(.slick-next){
            right: -10px;
          }
          :global(.slick-prev){
            left: -10px;
          }
        }

        @media (min-width: 992px){
          :global(.ant-col-lg-5.modif-col){
            display: block;
            flex: 0 0 20%;
            max-width: 20%;
          }
        }
      `}</style>
    </>
  );
};

Home.getInitialProps = async ctx => {
  // const cookies = parseCookies(ctx)
  // const { NEXT_LOCALE } = cookies
  // console.log("index =>", NEXT_LOCALE)
  const outlet = await axios.get("/outlets/all-outlets")
  const brand = await axios.get("/brands/all-brands")
  ctx.store.dispatch(actions.getOutletSuccess(outlet.data)); 
  ctx.store.dispatch(actions.getBrandSuccess(brand.data)); 
}

export default Home;
