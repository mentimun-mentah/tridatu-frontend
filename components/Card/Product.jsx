import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { motion } from 'framer-motion'
import { Rate, Tag } from "antd";
import { countDiscPrice } from 'lib/utility'
import { ongoing } from 'components/Card/Admin/Product/Promo/statusType'

import Link from "next/link";
import Image from "next/image";
import Card from "react-bootstrap/Card";

import formatNumber from 'lib/formatNumber'
import * as actions from "store/actions";

const loveLoginBtn = () => document.getElementById("id-btn-login").click();

const NormalPrice = ({ children }) => <span className="fs-13 fw-500 text-dark">Rp.{children}</span>
const DiscPrice = ({ children }) => <span className="ml-1"> <s>Rp.{children}</s> </span>


const CardProduct = ({ data }) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)

  const { products_id, products_name, products_slug, products_love, products_wholesale, products_image_product } = data;
  const { variants_min_price, variants_max_price, variants_discount, products_discount_status } = data;

  const [love, setLove] = useState(products_love)

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

  useEffect(() => {
    setLove(products_love)
  }, [products_love])

  const renderPrice = () => {
    if(countDiscPrice(variants_discount, variants_min_price) === countDiscPrice(variants_discount, variants_max_price)){
      if(variants_discount > 0 && products_discount_status === ongoing){
        return (
          <>
            <NormalPrice>{formatNumber(countDiscPrice(variants_discount, variants_max_price))}</NormalPrice>
            <DiscPrice>{formatNumber(variants_max_price)}</DiscPrice>
          </>
        )
      } else {
        return <NormalPrice>{formatNumber(variants_max_price)}</NormalPrice>
      }
    } 
    else {
      return (
        <>
          <NormalPrice>{formatNumber(variants_min_price)} - </NormalPrice>
          <NormalPrice>{formatNumber(variants_max_price)}</NormalPrice>
        </>
      )
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: ".2" }}
      >
      <Card className="border-0 shadow h-100">
        <Image 
          width={270}
          height={270}
          src={`${process.env.NEXT_PUBLIC_API_URL}/static/products/${products_slug}/${products_image_product}`}
          alt="Tridatu Bali"
          className="img-fit img-product noselect"
        />
        {products_discount_status == ongoing && variants_discount > 0 && (
          <span className="card-discount noselect">{variants_discount}%</span>
        )}
        <i className={`fa${love ? "s":"r"} fa-heart card-wishlist hover-pointer`} onClick={() => loveHandler(products_id)} />
        <Link href="/products/[slug]" as={`/products/${products_slug}`}>
          <a className="text-decoration-none text-secondary">
            <Card.Body className="p-2 card-body-height">
              <p className="fs-13 mb-0 text-break truncate-2">
                {products_name}
              </p>
              <Tag className="grosir-tag" visible={products_wholesale}>Grosir</Tag>
              <p className="text-red-dicount text-truncate fs-10 mb-0">
                {renderPrice()}
              </p>
              <div className="card-rating fs-12 mb-0 text-muted">
                <Rate
                  className="fs-12 mx-0"
                  allowHalf
                  disabled
                  defaultValue={4.5}
                /> ({Math.floor((Math.random() * 100) + 1)})
              </div>
            </Card.Body>
          </a>
        </Link>
      </Card>
      </motion.div>

      <style jsx>{`
        .card-discount{
          position: absolute;
          display: flex;
          width: 40px;
          height: 40px;
          color: white;
          background-color: #ff4d4f;
          border-radius: 4px 60% 60% 60%;
          font-size: 12px !important;
          align-items: center;
          justify-content: center;
        }
        .card-wishlist{
          position: absolute;
          display: flex;
          width: 40px;
          height: 40px;
          color: #ff4d4f;
          background-color: white;
          border-radius: 60% 4px 60% 60%;
          font-size: 16px !important;
          right: 0;
          align-items: center;
          justify-content: center;
        }
        .card-rating{
          font-size: 12px;
          line-height: 15px;
        }
        :global(.img-product){
          border-top-left-radius: .25rem;
          border-top-right-radius: .25rem;
        }
        :global(.grosir-tag){
          background-color: #d6ffde;
          color: #03ac0e;
          font-weight: bold;
          border: 0;
          font-size: 10px;
          margin-bottom: 2px;
          padding: 0 5px;
          border-radius: .25rem;
        }
        :global(.card-body-height){
          height: 112px;
        }
        :global(.text-red-dicount){
          color: #dc3545b5 !important;
        }
      `}</style>
    </>
  );
};

export default CardProduct;
