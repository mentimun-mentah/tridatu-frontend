import { useState, useEffect } from 'react'
import { Radio, InputNumber, Tag, Popover, Table } from 'antd'
import { AnimatePresence } from "framer-motion"

import { columnsGrosir } from 'data/products'

import Button from "antd-button-color"
import Notes from "components/Products/Notes";
import formatNumber from 'lib/formatNumber'

import SlugStyle from 'components/Products/slugStyle'

const Variants = ({ product }) => {
  const [quantity, setQuantity] = useState(1)
  const [showNote, setShowNote] = useState(false)
  const [variation, setVariation] = useState({})
  const [selected, setSelected] = useState({price: 0, va1_item: "", va2_item: "", stock: 0, priceChange: false })
  const [va2Items, setVa2Items] = useState([])
  const [wholesaleList, setWholesaleList] = useState([])
  const [countVariation, setCountVariation] = useState(0)

  const { products_variant, products_wholesale } = product

  useEffect(() => {
    if(products_variant){
      setVariation(products_variant)
      const { va1_name, va2_name, va1_items } = products_variant
      if(va1_items && !va1_name && !va2_name) {
        setSelected({ ...selected, price: va1_items[0].va1_price, stock: va1_items[0].va1_stock })
        setCountVariation(0)
        setVa2Items([])
      }
      if(va1_name && va1_items && !va2_name) {
        const sumStock = va1_items.reduce((n, {va1_stock}) => n + va1_stock, 0)
        setSelected({ ...selected, price: va1_items[0].va1_price, stock: sumStock })
        setCountVariation(1)
        setVa2Items([])
      }
      if(va2_name) {
        let sumStock = 0
        for(let obj of va1_items){
          sumStock = obj.va2_items.reduce((n, {va2_stock}) => n + va2_stock, sumStock)
        }
        setSelected({ ...selected, price: va1_items[0].va2_items[0].va2_price, stock: sumStock })
        setCountVariation(2)
        setVa2Items(va1_items[0].va2_items)
      }

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
  
  useEffect(() => {
    if(wholesaleList.length){
      for(let obj of wholesaleList){
        if(quantity >= obj.wholesale_min_qty){
          setSelected({ ...selected, price: obj.wholesale_price, priceChange: true })
        }
      }
      if(quantity < wholesaleList[0].wholesale_min_qty){
        const { va1_name, va2_name, va1_items } = products_variant
        if(va1_items && !va1_name && !va2_name) setSelected({ ...selected, price: va1_items[0].va1_price, priceChange: false })
        if(va1_name && va1_items && !va2_name) setSelected({ ...selected, price: va1_items[0].va1_price, priceChange: false })
        if(va2_name) setSelected({ ...selected, price: va1_items[0].va2_items[0].va2_price, priceChange: false })
      }
    }
  }, [quantity])

  const showNoteHandler = () => { setShowNote(true) }
  const closeNoteHandler = () => { setShowNote(false) }

  const quantityHandler = (e, val) => {
    if(val == "input") setQuantity(e)
    if(val === "min"){
      if(quantity == 1) e.stopPropagation()
      else setQuantity(quantity-1)
    }
    if(val === "plus"){
      if(quantity >= selected.stock ) e.stopPropagation()
      else setQuantity(quantity+1) 
    }
  }

  const variantChangeHandler = (e, var2) => {
    const item = e.target.data
    const value = e.target.value

    console.log(value)
    if(countVariation == 1){
      setSelected({ ...selected, price: item.va1_price, stock: item.va1_stock })
    }
    if(countVariation == 2){
      if(var2){
        setSelected({ ...selected, price: item.va2_price, stock: item.va2_stock })
      } else {
        const sumStock = item.reduce((n, {va2_stock}) => n + va2_stock, 0)
        setSelected({ ...selected, price: item[0].va2_price, stock: sumStock })
        setVa2Items(item)
      }
    }
  }

  const wholesaleContent = (
    <Table 
      size="small"
      columns={columnsGrosir} 
      pagination={false}
      dataSource={wholesaleList} 
      className="table-striped-rows"
    />
  )

  return(
    <>
      {/* PRICE PRODUCTS INFORMATION */}
      <div className="media info-product">
        <h5 className="info-product-left">Harga</h5>
        <div className="media-body info-product-body">
          <div className="fs-14 font-weight-light">
            {selected && selected.price && (
              <div>
                <span className="info-product-body-price font-weight-bold h6 fs-14-s">
                  Rp.{formatNumber(selected.price)}
                </span>
                <Tag className="grosir-tag align-text-bottom mb-0 m-l-5" visible={selected.priceChange}>Grosir</Tag>
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
            <Radio.Group onChange={variantChangeHandler} defaultValue="a">
              {variation.va1_items && variation.va1_items.map(item => (
                <Radio.Button 
                  key={item.va1_id} 
                  data={item} 
                  value={item.va1_id}
                  disabled={item.va1_stock <= 0}
                  className="variant-radio-button-wrapper noselect"
                >
                  {item.va1_option}
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
              <Radio.Group onChange={variantChangeHandler} defaultValue="a">
                {variation.va1_items && variation.va1_items.map(item => {
                  const sumStock = item.va2_items.reduce((n, {va2_stock}) => n + va2_stock, 0)
                  return (
                    <Radio.Button 
                      key={item.va1_option} 
                      data={item.va2_items} 
                      value={item.va1_option}
                      disabled={sumStock <= 0}
                      className="variant-radio-button-wrapper noselect"
                    >
                      {item.va1_option}
                    </Radio.Button>
                  )
                })}
              </Radio.Group>
            </div>
          </div>

          <div className="media info-product">
            <h5 className="info-product-left">{variation.va2_name}</h5>
            <div className="media-body info-product-body">
              <Radio.Group onChange={e => variantChangeHandler(e, true)} defaultValue="a">
                {va2Items && va2Items.length > 0 && va2Items.map(item => (
                  <Radio.Button 
                    key={item.va2_id} 
                    data={item} 
                    value={item.va2_id}
                    disabled={item.va2_stock <= 0}
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
            Tersedia {selected.stock} pcs
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
              max={selected.stock}
              value={quantity} 
              onChange={(e) => quantityHandler(e, 'input')} 
            />
            <Button 
              disabled={quantity == selected.stock}
              icon={<i className="far fa-plus" />} 
              onClick={(e) => quantityHandler(e, 'plus')} 
            />
            {wholesaleList.length > 0 && (
              <span className="m-l-5 fs-14 text-muted noselect">
                Lebih banyak, lebih murah! 
                <Popover content={wholesaleContent} placement="bottom" overlayClassName="wholesale-info noselect">
                  <i className="fas fa-info-circle m-l-2" />
                </Popover>
              </span>
            )}
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
          margin-right: 5px;
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
        
      `}</style>
    </>
  )
}

export default Variants
