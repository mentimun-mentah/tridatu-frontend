import { useState, useEffect } from 'react'
import { Radio, InputNumber, Tag } from 'antd'
import { AnimatePresence } from "framer-motion"

import { countDiscPrice } from 'lib/utility'

import _ from "lodash"
import Image from "next/image"
import Button from "antd-button-color"
import Notes from "components/Products/Notes";
import formatNumber from 'lib/formatNumber'

import { ongoing } from 'components/Card/Admin/Product/Promo/statusType'

import SlugStyle from 'components/Products/slugStyle'

const PriceGrosirComponent = ({ price, isWholesale }) => (
  <>
    <span className="info-product-body-price font-weight-bold h6 fs-14-s">
      Rp.{formatNumber(price)}
    </span>
    <Tag className="grosir-tag align-text-bottom mb-0 m-l-5" visible={isWholesale}>Grosir</Tag>
  </>
)

const Variants = ({ product, selected, setSelected, quantity, setQuantity, wholesaleList, setWholesaleList }) => {
  const [showNote, setShowNote] = useState(false)
  const [variation, setVariation] = useState({})
  const [va2Items, setVa2Items] = useState([])
  const [countVariation, setCountVariation] = useState(0)
  const [originalImage, setOriginalImage] = useState("")

  const { products_slug, products_discount_status, products_variant, products_wholesale, products_image_size_guide } = product
  const { variants_discount, variants_min_price, variants_max_price } = product

  if(products_image_size_guide){
    // console.log(products_image_size_guide)
  }

  // console.log(JSON.stringify(product, null, 2))

  useEffect(() => {
    if(products_variant){
      setVariation(products_variant)
      let tmp_stock = 0
      // console.log("Variation\n", JSON.stringify(products_variant, null, 2))
      // console.log("Wholesale\n", JSON.stringify(products_wholesale, null, 2))
      // console.log("Discount Status\n", JSON.stringify(products_discount_status, null, 2))
      const { va1_name, va2_name, va1_items } = products_variant
      if(va1_items && !va1_name && !va2_name) {
        setCountVariation(0)
        setVa2Items([])
        tmp_stock = +va1_items[0].va1_stock
      }
      if(va1_name && va1_items && !va2_name) {
        const sumStock = va1_items.reduce((n, {va1_stock}) => n + +va1_stock, 0)
        setCountVariation(1)
        setVa2Items([])
        tmp_stock = sumStock
      }
      if(va2_name) {
        let sumStock = 0
        for(let obj of va1_items){
          sumStock = obj.va2_items.reduce((n, {va2_stock}) => n + +va2_stock, sumStock)
        }
        setCountVariation(2)
        setVa2Items(va1_items[0].va2_items)
        tmp_stock = sumStock
      }

      const data = {
        ...selected,
        price: _.uniq([+variants_min_price, +variants_max_price]),
        discount: variants_discount,
        stock: tmp_stock
      }
      setSelected(data)
      setQuantity(1)
    }

    if(products_wholesale && products_wholesale.length){
      let tmp = []
      for(let obj of products_wholesale){
        tmp.push({key: obj.wholesale_id, ...obj})
      }
      setWholesaleList(tmp)
    } else {
      setWholesaleList([])
    }
  }, [product])

  // console.log(selected)
  
  useEffect(() => {
    if(wholesaleList.length){
      const { va2_name, va1_items } = products_variant
      let price = 0
      if(va1_items && !va2_name) price = +va1_items[0].va1_price
      if(va2_name) price = +va1_items[0].va2_items[0].va2_price

      let finalPrice = price
      if(products_discount_status === ongoing) finalPrice = countDiscPrice(selected.discount, price)
      for(let obj of wholesaleList){
        if(quantity >= obj.wholesale_min_qty){
          console.log(selected.discount, price)
          if(finalPrice > +obj.wholesale_price){
            setSelected({ ...selected, price: +obj.wholesale_price, isWholesale: true })
          }
          else{
            if(va1_items && !va2_name) setSelected({ ...selected, price: price, isWholesale: false })
            if(va2_name) setSelected({ ...selected, price: price, isWholesale: false })
          }
        }
      }

      if(quantity < wholesaleList[0].wholesale_min_qty){
        if(va1_items && !va2_name) setSelected({ ...selected, price: price, isWholesale: false })
        if(va2_name) setSelected({ ...selected, price: price, isWholesale: false })
      }
    }
  }, [quantity])

  const showNoteHandler = () => { setShowNote(true) }
  const closeNoteHandler = () => { setShowNote(false) }

  const quantityHandler = (e, val) => {
    if(val == "input"){
      if(e <= +selected.stock) setQuantity(e)
      else return
    }
    if(val === "min"){
      if(quantity <= 1) e.stopPropagation()
      else setQuantity(quantity-1)
    }
    if(val === "plus"){
      if(quantity >= +selected.stock) e.stopPropagation()
      else setQuantity(quantity+1) 
    }
  }


  const variantChangeHandler = (e, var2) => {
    setQuantity(1)
    const item = e.target.data

    console.log(JSON.stringify(item, null, 2))

    if(countVariation == 1){
      setSelected({ ...selected, price: item.va1_price, stock: +item.va1_stock, discount: item.va1_discount })
    }
    if(countVariation == 2){
      if(var2){
        setSelected({ ...selected, price: item.va2_price, stock: +item.va2_stock, discount: item.va2_discount })
      } else {
        const sumStock = item.reduce((n, {va2_stock}) => n + +va2_stock, 0)
        let tmp_discount = item.map(x => x.va2_discount)
        tmp_discount = _.uniq(tmp_discount)
        setSelected({ ...selected, price: item[0].va2_price, stock: sumStock, discount: _.max(tmp_discount) })
        setVa2Items(item)
      }
    }
  }

  const getActiveImage = (variantImage) => {
    const element = document.getElementById("id-product-images")
    const containerSlider = element.childNodes[0].childNodes[0].childNodes[0]
    const ImageContainer = containerSlider.querySelector(".image-gallery-slides")
    if(ImageContainer.querySelector(".center")){
      const imgElement = ImageContainer.querySelector(".center").childNodes[0].getElementsByTagName("img")[0]
      if(imgElement){
        setOriginalImage(imgElement.src)
        const tmpImg = `${process.env.NEXT_PUBLIC_API_URL}/static/products/${products_slug}/${variantImage}`
        imgElement.src = tmpImg
      }
    }
  }

  const getOriginalImage = () => {
    const element = document.getElementById("id-product-images")
    const containerSlider = element.childNodes[0].childNodes[0].childNodes[0]
    const ImageContainer = containerSlider.querySelector(".image-gallery-slides")
    if(ImageContainer.querySelector(".center")){
      const imgElement = ImageContainer.querySelector(".center").childNodes[0].getElementsByTagName("img")[0]
      if(imgElement){
        imgElement.src = originalImage
      }
    }
  }

  const renderPrice = () => {
    if(selected && selected.price){
      const { price, discount, isWholesale } = selected
      if(products_discount_status === ongoing && discount){
        if(Array.isArray(price)){
          if(price.length < 2){
            return(
              <div className="w-100">
                {!isWholesale ? (
                  <>
                    <span className="info-product-body-price font-weight-bold h6 fs-14-s">
                      Rp.{formatNumber(countDiscPrice(discount, price))}
                    </span>
                    <div className="d-flex align-items-center mt-1">
                      <Tag className="discount-tag align-text-bottom mb-0 m-r-5">{discount}%</Tag>
                      <span className="mb-0 text-truncate fw-500 text-muted"><s>Rp.{formatNumber(price)}</s></span>
                    </div>
                  </>
                ) : (
                  <PriceGrosirComponent price={price} isWholesale={isWholesale} />
                )}
              </div>
            )
          }
          else{
            return(
              <p>
                <span className="info-product-body-price font-weight-bold h6 fs-14-s">
                  Rp.{formatNumber(price[0])} - Rp.{formatNumber(price[1])}
                </span>
                <Tag className="discount-tag align-text-bottom mb-0 m-l-5">{discount}%</Tag>
              </p>
            )
          }
        }
        else{
          return(
            <div className="w-100">
              {!isWholesale ? (
                <>
                  <span className="info-product-body-price font-weight-bold h6 fs-14-s">
                    Rp.{formatNumber(countDiscPrice(discount, price))}
                  </span>
                  <div className="d-flex align-items-center mt-1">
                    <Tag className="discount-tag align-text-bottom mb-0 m-r-5">{discount}%</Tag>
                    <span className="mb-0 text-truncate fw-500 text-muted"><s>Rp.{formatNumber(price)}</s></span>
                  </div>
                </>
              ) : (
                <PriceGrosirComponent price={price} isWholesale={isWholesale} />
              )}
            </div>
          )
        }
      }
      if(Array.isArray(price)){
        if(price.length < 2){
          return(
            <div>
              <span className="info-product-body-price font-weight-bold h6 fs-14-s">
                Rp.{formatNumber(price)}
              </span>
            </div>
          )
        }
        else{
          return(
            <div>
              <span className="info-product-body-price font-weight-bold h6 fs-14-s">
                Rp.{formatNumber(price[0])} - Rp.{formatNumber(price[1])}
              </span>
            </div>
          )
        }
      }
      else{
        return <PriceGrosirComponent price={price} isWholesale={isWholesale} />
      }
    }
  }

  return(
    <>
      {/* PRICE PRODUCTS INFORMATION */}
      <div className="media info-product">
        <h5 className="info-product-left">Harga</h5>
        <div className="media-body info-product-body">
          <div className="fs-14 font-weight-light">
            {renderPrice()}
            {selected && selected.price && (
              <div className="d-none">
                <span className="info-product-body-price font-weight-bold h6 fs-14-s">
                  Rp.{formatNumber(selected.price)}
                </span>
                <Tag className="grosir-tag align-text-bottom mb-0 m-l-5" visible={selected.isWholesale}>Grosir</Tag>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* PRICE PRODUCTS INFORMATION */}

      {/* PRODUCTS ONLY 1 VARIANT INFORMATION */}
      {countVariation == 1 && variation && (
        <div className="media info-product">
          <h5 className="info-product-left">{variation.va1_name}</h5>
          <div className="media-body info-product-body">
            <Radio.Group onChange={variantChangeHandler}>
              {variation.va1_items && variation.va1_items.map(item => (
                <Radio.Button 
                  key={item.va1_id} 
                  data={item} 
                  value={item.va1_id}
                  disabled={+item.va1_stock <= 0}
                  onMouseEnter={item.va1_image ? () => getActiveImage(item.va1_image) : () => {}}
                  onMouseLeave={item.va1_image && getOriginalImage}
                  className={`variant-radio-button-wrapper noselect ${item.va1_image && "btn-variant"}`}
                >
                  <div className="container-img-variant">
                    {item.va1_image && (
                      <Image width={38} 
                        height={38} 
                        src={`${process.env.NEXT_PUBLIC_API_URL}/static/products/${products_slug}/${item.va1_image}`}
                        className="img-variant-button"
                      />
                    )}
                    <span className={`${item.va1_image && "ml-1"}`}>
                      {item.va1_option}
                    </span>
                  </div>
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>
        </div>
      )}
      {/* PRODUCTS ONLY 1 VARIANT INFORMATION */}

      {/* PRODUCTS 2 VARIANT INFORMATION */}
      {countVariation == 2 && variation && (
        <>
          <div className="media info-product">
            <h5 className="info-product-left">{variation.va1_name}</h5>
            <div className="media-body info-product-body">
              <Radio.Group onChange={variantChangeHandler}>
                {variation.va1_items && variation.va1_items.map(item => {
                  const sumStock = item.va2_items.reduce((n, {va2_stock}) => n + +va2_stock, 0)
                  return (
                    <Radio.Button 
                      key={item.va1_option} 
                      data={item.va2_items} 
                      value={item.va1_option}
                      disabled={sumStock <= 0}
                      onMouseEnter={item.va1_image ? () => getActiveImage(item.va1_image) : () => {}}
                      onMouseLeave={item.va1_image && getOriginalImage}
                      className={`variant-radio-button-wrapper noselect ${item.va1_image && "btn-variant"}`}
                    >
                      <div className="container-img-variant">
                        {item.va1_image && (
                          <Image width={38} 
                            height={38} 
                            src={`${process.env.NEXT_PUBLIC_API_URL}/static/products/${products_slug}/${item.va1_image}`}
                            className="img-variant-button"
                          />
                        )}
                        <span className={`${item.va1_image && "ml-1"}`}>
                          {item.va1_option}
                        </span>
                      </div>
                    </Radio.Button>
                  )
                })}
              </Radio.Group>
            </div>
          </div>

          <div className="media info-product">
            <h5 className="info-product-left">{variation.va2_name}</h5>
            <div className="media-body info-product-body">
              <Radio.Group onChange={e => variantChangeHandler(e, true)}>
                {va2Items && va2Items.length > 0 && va2Items.map(item => (
                  <Radio.Button 
                    key={item.va2_id} 
                    data={item} 
                    value={item.va2_id}
                    disabled={+item.va2_stock <= 0}
                    className="variant-radio-button-wrapper noselect"
                  >
                    {item.va2_option}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>
          </div>
        </>
      )}
      {/* PRODUCTS 2 VARIANT INFORMATION */}

      {/* QUANTITY PRODUCTS INFORMATION */}
      <div className="media info-product">
        <h5 className="info-product-left">Jumlah</h5>
        <div className="media-body info-product-body">
          <span className="fs-14 va-super">
            Tersedia {+selected.stock} pcs
          </span>
          <div className="mb-2">
            <Button 
              disabled={quantity == 1}
              icon={<i className="far fa-minus" />} 
              onClick={(e) => quantityHandler(e, 'min')} 
            />
            <InputNumber 
              size="middle"
              className="m-l-5 m-r-5" 
              min={1} 
              max={+selected.stock}
              value={quantity} 
              onChange={(e) => quantityHandler(e, 'input')} 
            />
            <Button 
              disabled={quantity == +selected.stock}
              icon={<i className="far fa-plus" />} 
              onClick={(e) => quantityHandler(e, 'plus')} 
            />
          </div>
          <AnimatePresence>
            <Notes show={showNote} onShow={showNoteHandler} onClose={closeNoteHandler} />
          </AnimatePresence>
        </div>
      </div>
      {/* QUANTITY PRODUCTS INFORMATION */}


      <style jsx>{SlugStyle}</style>
      <style jsx>{`
        :global(.variant-radio-button-wrapper, .variant-radio-button-wrapper:first-child, .ant-radio-button-wrapper:last-child){
          margin-right: 8px;
          margin-bottom: 8px;
          border-radius: .25rem;
          border-left-width: 1px!important;
        }
        :global(.ant-radio-button-wrapper:last-child){
          margin-right: 0px;
        }
        :global(.variant-radio-button-wrapper:hover){
          color: rgba(0, 0, 0, 0.85);
          box-shadow: rgb(49 53 59 / 16%) 0px 2px 6px 0px;
        }
        :global(
          .variant-radio-button-wrapper:not(:first-child)::before, 
          .variant-radio-button-wrapper.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before
        ){
          width: 0px;
        }
        :global(.variant-radio-button-wrapper.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):focus-within){
          box-shadow: 0 0 0 3px #ff434412;
        }
        :global(.variant-radio-button-wrapper.ant-radio-button-wrapper-checked:not([class*=' ant-radio-button-wrapper-disabled']).ant-radio-button-wrapper:first-child) {
          border-right-color: #d63031;
        }
        :global(.variant-radio-button-wrapper.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)){
          color: #d63031;
          background: #d630310a;
          border-color: #d63031;
        }
        :global(.variant-radio-button-wrapper.ant-radio-button-wrapper-disabled:hover){
          color: rgba(0, 0, 0, 0.25);
          box-shadow: unset;
        }

        :global(.wholesale-info .ant-popover-inner){
          border-radius: .25rem;
        }
        :global(.wholesale-info .ant-popover-inner-content){
          padding: 10px;
        }

        :global(.table-striped-rows tr:nth-child(1n):hover td) {
          background-color: #ffffff;
        }
        :global(.table-striped-rows tr:nth-child(2n) td, .table-striped-rows tr:nth-child(2n):hover td) {
          background-color: #fbfbfb;
        }
        :global(.table-striped-rows thead) {
          background-color: #f1f1f1;
        }

        :global(.btn-variant){
          padding: 5px 5px;
          height: 100%;
        }
        :global(.btn-variant > .ant-radio-button){
          line-height: unset;
        }
        :global(.container-img-variant > div){
          vertical-align: middle;
        }
        :global(.img-variant-button){
          margin-top: -2px;
          vertical-align: middle;
          border-radius: .2rem;
          border: 1px solid rgb(229, 231, 233) !important;
        }

        :global(.discount-tag){
          background-color: #ffdddd;
          color: #d63031;
          font-weight: bold;
          border: 0;
          font-size: 10px;
          margin-bottom: 2px;
          padding: 0 5px;
          border-radius: .25rem;
        }
      `}</style>
    </>
  )
}

export default Variants
