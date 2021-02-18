import { withAuth } from 'lib/withAuth'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { Form, Input, InputNumber, Button, Space, Upload, Row, Col, Radio, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { AnimatePresence, motion } from "framer-motion";

import _ from 'lodash'
import cx from 'classnames'
import Router from "next/router";
import Link from "next/link";
import isIn from 'validator/lib/isIn'
import isEmpty from 'validator/lib/isEmpty'
import Card from 'react-bootstrap/Card'
import axios, { jsonHeaderHandler, formHeaderHandler, resNotification, signature_exp, formErrorMessage } from 'lib/axios'

import makeid from 'lib/makeid'
import getIndex from 'lib/getIndex'
import { formImage, formImageIsValid } from 'formdata/formImage'
import { imagePreview, uploadButton } from 'lib/imageUploader'
import { imageValidationProduct, multipleImageValidation, checkVariantImage } from 'lib/imageProductUploader'
import SizeGuideModal from 'components/Modal/Admin/Products/SizeGuide'

import InformationProducts from 'components/Admin/Products/InformationProducts'
import NoVariantComponent from 'components/Admin/Products/NoVariant'
import TableGrosir from 'components/Admin/Products/Grosir'

import ErrorTooltip from "components/ErrorMessage/Tooltip";
import TableVariant from 'components/Admin/Variant/TableVariant'
import AddStyleAdmin from 'components/Admin/addStyle'

import { initialColumn } from 'data/productsAdmin'
import { not_active } from 'components/Card/Admin/Product/Promo/statusType'

import { formInformationProduct, formNoVariant } from 'formdata/formProduct'
import { formNoVariantIsValid, formVa1OptionSingleVariantIsValid, formTableIsValid, formVariantTitleIsValid } from 'formdata/formProduct'
import { formVa2OptionDoubleVariantIsValid, formTitleIsValid } from 'formdata/formProduct'
import { isValidProductInformation } from 'formdata/formProduct'
import { validateFormGrosirPrice, validateFormGrosirQty } from 'formdata/formGrosir.js'

import * as actions from "store/actions";

import { addColumVariantHandler, additional, initialValue } from 'components/Admin/Variant/TableVariant'

const initialVaOption = { va1Option: [], va2Option: [], va1Total: 0, va2Total: 0 }
const initialActiveVariation = { active: false, countVariation: 0 }
const initialActiveGrosir = { activeGrosir: false, countGrosir: 0 }
const formGrosirPrice = { price: { value: "", isValid: true, message: null } }
const checkMessage = "Pastikan kolom sudah terisi semua."

/*
 * TODO:
 * image variant ✅
 * grosir update
 */

const UpdateProduct = ({ productData }) => {
  const dispatch = useDispatch()
  const [imageList, setImageList] = useState(formImage);
  const [imageVariants, setImageVariants] = useState(formImage);
  const [imageSizeGuide, setImageSizeGuide] = useState(formImage);
  const [removedProductImage, setRemovedProductImage] = useState([]);
  const [removedSizeGuideImage, setRemovedSizeGuideImage] = useState([]);

  const [initialFetch, setInitialFetch] = useState({isInit: false, data: null})
  const [loading, setLoading] = useState(false)
  const [isPreorder, setIsPreorder] = useState(false)
  const [loadingImageProduct, setLoadingImageProduct] = useState(false)
  const [loadingImageVariant, setLoadingImageVariant] = useState(false)
  const [loadingImageSizeGuide, setLoadingImageSizeGuide] = useState(false)

  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [allCategoriesList, setAllCategoriesList] = useState([])

  const [discountStatus, setDiscountStatus] = useState(not_active)
  const [columns, setColumns] = useState(initialColumn)
  const [dataSource, setDataSource] = useState([])
  const [vaOption, setVaOption] = useState(initialVaOption)
  const [isActiveVariation, setIsActiveVariation] = useState(initialActiveVariation)
  const [isActiveGrosir, setIsActiveGrosir] = useState(initialActiveGrosir)

  const [informationProduct, setInformationProduct] = useState(formInformationProduct)
  const [noVariant, setNoVariant] = useState(formNoVariant)
  const [grosirPrice, setGrosirPrice] = useState(formGrosirPrice)
  const [grosir, setGrosir] = useState([])

  const [cascaderIsShow, setCascaderIsShow] = useState(false)
  const [cascaderValue, setCascaderValue] = useState([])

  const collapsed = useSelector(state => state.layout.adminCollapsed)
  const isMobile = useSelector(state => state.layout.adminIsMobile)

  const allCategoriesData = useSelector(state => state.categories.allCategories)

  const { activeGrosir } = isActiveGrosir
  const { va1Option, va1Total, va2Total } = vaOption

  /* Destructuring Object Product */
  const { name, desc, item_sub_category_id, brand_id, condition, weight, preorder, video } = informationProduct;
  const { va1_id, va1_price, va1_stock, va1_code, va1_barcode, va1_discount, va1_discount_active } = noVariant
  /* Destructuring Object Product */

  /*SET DATA FROM SERVER*/
  /*SET DATA FROM SERVER*/
  useEffect(() => {
    if(productData){

      dispatch(actions.getAllCategories())
      dispatch(actions.getBrand())
      const image_product = []
      const { products_brand, products_category, products_image_size_guide, products_slug, products_image_product } = productData
      const { products_preorder, products_variant, products_wholesale, products_discount_status } = productData
      setInitialFetch({isInit: true, dataVariant: products_variant})

      const stateProductInformation = JSON.parse(JSON.stringify(informationProduct))

      for(let key in productData){
        let newKey = key.split("_")[1]
        if(stateProductInformation[newKey]){
          stateProductInformation[newKey].value = productData[key]
        }
      }
      if(products_discount_status){
        setDiscountStatus(products_discount_status)
      }
      if(products_preorder){
        setIsPreorder(true)
      }
      if(products_brand.brands_id){
        stateProductInformation.brand_id.value = products_brand.brands_id
      }
      if(products_category){
        const { categories_name, sub_categories_name, item_sub_categories_name, item_sub_categories_id } = products_category
        setCascaderValue([categories_name, sub_categories_name, item_sub_categories_name])
        stateProductInformation.item_sub_category_id.value = item_sub_categories_id
      }
      if(products_image_size_guide){
        const imageData = {
          uid: -Math.abs(Math.random()),
          url: `${process.env.NEXT_PUBLIC_API_URL}/static/products/${products_slug}/${products_image_size_guide}`
        }
        const data = {
          ...imageSizeGuide,
          file: {value: [imageData], isValid: true, message: null}
        }
        setImageSizeGuide(data)
      }
      if(products_image_product){
        for (const [key, value] of Object.entries(products_image_product)) {
          image_product.push({
            uid: -Math.abs(+key + 1),
            url: `${process.env.NEXT_PUBLIC_API_URL}/static/products/${products_slug}/${value}`
          })
        }
        const data = {
          ...imageList,
          file: {value: image_product, isValid: true, message: null}
        }
        setImageList(data)
      }

      /* SET VARIANT FROM SERVER */
      if(products_variant){
        console.log(JSON.stringify(products_variant, null, 2))
        const { va1_name, va2_name, va1_items } = products_variant

        /* NO VARIANT DATA */
        if(va1_items && !va1_name && !va2_name){ 
          const stateNoVariant = JSON.parse(JSON.stringify(noVariant))
          for(let va1_item of va1_items){
            for(let key in va1_item){
              if(stateNoVariant[key]){
                stateNoVariant[key].value = va1_item[key]
              }
              if(key === "va1_price"){
                stateNoVariant[key].value = +va1_item[key]
              }
            }
          }
          setNoVariant(stateNoVariant)
          setIsActiveVariation({ active: false, countVariation: 0 })
          setInitialFetch({isInit: false, dataVariant: null})
        }

        /* ONLY ONE VARIANT DATA */
        if(va1_name && va1_items && !va2_name){
          setIsActiveVariation({ active: true, countVariation: 1 })
          addColumVariantHandler(1, columns, setColumns)

          const newData = []
          const va1Data = []
          const image_variant = []
          for(let [key, item] of Object.entries(va1_items)){
            va1Data.push({
              ...additional,
              key: `va1_option_${makeid(10)}`, 
              id: { value: item.va1_id, isValid: true, message: null },
              va1_option: { value: item.va1_option, isValid: true, message: null }, 
              discount: { value: item.va1_discount, isValid: true, message: null },
              discount_active: { value: item.va1_discount_active, isValid: true, message: null },
            })
            if(item.va1_image){
              image_variant.push({
                uid: -Math.abs(+key + 1),
                url: `${process.env.NEXT_PUBLIC_API_URL}/static/products/${products_slug}/${item.va1_image}`
              })
            } else {
              image_variant.push({})
            }
            newData.push({
              id: { ...initialValue, value: item.va1_id },
              price: { ...initialValue, value: +item.va1_price },
              stock: { ...initialValue, value: +item.va1_stock },
              code: { ...initialValue, value: item.va1_code || "" },
              barcode: { ...initialValue, value: item.va1_barcode || "" },
              discount: { ...initialValue, value: item.va1_discount },
              discount_active: { ...initialValue, value: item.va1_discount_active },
            })
          }
          const data = {
            ...vaOption,
            va1Option: va1Data,
            va1Total: va1Total + va1_items.length
          }
          const dataImageVariant = {
            ...imageVariants,
            file: {value: image_variant, isValid: true, message: null}
          }
          console.log(JSON.stringify(newData, null, 2))
          setImageVariants(dataImageVariant)
          setVaOption(data)
          setDataSource(newData)
        }


        if(va2_name){
          const propsColumn = { fixed: 'left', width: 152, align: "center", isValid: true, message: null, }
          const col1 = {
            ...propsColumn,
            title: va1_name,
            dataIndex: `va1_option`,
            key: `va1_option`,
            render: (value, row) => {
              return {
                children: value,
                props: { rowSpan: row.rowSpan }
              }
            } // render
          }
          const col2 = {
            ...propsColumn,
            title: va2_name,
            dataIndex: `va2_option`,
            key: `va2_option`,
            render: (value) => value,
          }

          let variant = []
          let va1Option = []
          let va2Option = []
          let discountActiveArray = []
          let variantOption = []

          for(let [key1, val1] of Object.entries(va1_items)){
            let variant_tmp = []
            for(let [key2, val2] of Object.entries(val1.va2_items)){
              discountActiveArray.push(val2.va2_discount_active.toString())
              variantOption.push({[val2.va2_option]: val1.va1_option })
              const initialData = {
                key: makeid(10), 
                va1_key: +key1,
                va2_key: +key2,
                va1_option: val1.va1_option,
                va2_option: val2.va2_option,
                id: { value: val2.va2_id, isValid: true, message: null },
                price: { value: +val2.va2_price, isValid: true, message: null },
                stock: { value: +val2.va2_stock, isValid: true, message: null },
                code: { value: val2.va2_code || "", isValid: true, message: null },
                barcode: { value: val2.va2_barcode || "", isValid: true, message: null },
                discount: { value: val2.va2_discount, isValid: true, message: null },
                discount_active: { value: val2.va2_discount_active, isValid: true, message: null },
              }
              variant_tmp.push(initialData)
            }
            for(let item of variant_tmp){
              variant.push(item)
            }
          }
          // console.log(variantOption)

          for(let [key1, val1] of Object.entries(va1_items)){
            let activeDiscountArrayInArray = _.chunk(discountActiveArray, va1_items[0].va2_items.length)
            va1Option.push({
              ...additional,
              key: `va1_option_${makeid(10)}`, 
              va1_option: { value: val1.va1_option, isValid: true, message: null }, 
              discount_active: { value: isIn("true", activeDiscountArrayInArray[key1]) ? true : false, isValid: true, message: null }
            })
          }

          for(let val2 of va1_items[0].va2_items){
            let discountActive = false
            let uniqVa2 = _.groupBy(variant, obj => obj.va2_option)
            let checkActiveDiscount = _.map(uniqVa2[val2.va2_option], obj => obj.discount_active.value)
            // console.log(checkActiveDiscount)

            if(isIn("true", checkActiveDiscount)) discountActive = true
            va2Option.push({
              ...additional,
              key: `va2_option_${makeid(10)}`, 
              va2_option: { value: val2.va2_option, isValid: true, message: null }, 
              discount: { value: val2.va2_discount, isValid: true, message: null },
              discount_active: { value: discountActive, isValid: true, message: null },
            })
            va2Option = _.uniqBy(va2Option, obj => obj.va2_option.value)
          }
          
          const image_variant = []
          for(let [key, item] of Object.entries(va1_items)){
            if(item.va1_image){
              image_variant.push({
                uid: -Math.abs(+key + 1),
                url: `${process.env.NEXT_PUBLIC_API_URL}/static/products/${products_slug}/${item.va1_image}`
              })
            } else {
              image_variant.push({})
            }
          }

          const data = {
            ...vaOption,
            va1Option: va1Option,
            va2Option: va2Option,
            va1Total: va1Total + va1_items.length,
            va2Total: va2Total + va1_items[0].va2_items.length
          }
          setVaOption(data)

          const dataImageVariant = {
            ...imageVariants,
            file: {value: image_variant, isValid: true, message: null}
          }
          setImageVariants(dataImageVariant)
          setColumns(column => [col1, col2, ...column])
          setIsActiveVariation({ active: true, countVariation: 2 })
          setDataSource(variant)
          console.log(JSON.stringify(variant, null, 2))
        }
      }
      /* SET VARIANT FROM SERVER */

      /* SET GROSIR FROM SERVER */
      if(products_wholesale.length){
        let dataGrosir = []

        for(let val of products_wholesale){
          dataGrosir.push({ 
            id: val.wholesale_id, 
            min_qty: { value: val.wholesale_min_qty, isValid: true, message: null },
            price: { value: +val.wholesale_price, isValid: true, message: null },
          })
        }
        setGrosir(dataGrosir)
        setIsActiveGrosir({ activeGrosir: true, countGrosir: products_wholesale.length })
      }
      /* SET GROSIR FROM SERVER */

      setInformationProduct(stateProductInformation)
    }
  }, [])
  /*SET DATA FROM SERVER*/
  /*SET DATA FROM SERVER*/

  useEffect(() => {
    let copyCategory = _.cloneDeep(allCategoriesData)
    copyCategory = copyCategory.filter(d => d.sub_categories.length > 0)

    if(copyCategory.length){
      copyCategory.forEach(category => {
        category.id = category.categories_id;
        category.label = category.categories_name;
        category.value = category.categories_name;
        category.children = category.sub_categories;
        delete category.categories_id;
        delete category.categories_name;
        delete category.sub_categories;

        category && category.children && category.children.length > 0 && category.children.forEach(sub => {
          sub.id = sub.sub_categories_id;
          sub.label = sub.sub_categories_name;
          sub.value = sub.sub_categories_name;
          sub.disabled = sub.item_sub_categories.length < 1;
          sub.children = sub.item_sub_categories;
          delete sub.sub_categories_id;
          delete sub.sub_categories_name;
          delete sub.item_sub_categories;

          sub && sub.children.length > 0 && sub.children.forEach(item => {
            item.id = item.item_sub_categories_id;
            item.label = item.item_sub_categories_name;
            item.value = item.item_sub_categories_name;
            delete item.item_sub_categories_id;
            delete item.item_sub_categories_name;
          })
        })
      })
      setAllCategoriesList(copyCategory)
    }

  },[allCategoriesData])

  /* Cascader category */
  const onFocusCascader = () => {
    setCascaderIsShow(true)
    dispatch(actions.getAllCategories())
  }

  const onCascaderChange = (value, selectedOptions) => {
    setCascaderValue(value)
    setCascaderIsShow(selectedOptions.length !== 3)
    const category_id = selectedOptions[selectedOptions.length - 1]['id']
    const data = {
      ...informationProduct,
      item_sub_category_id: { ...item_sub_category_id, value: category_id, isValid: true, message: null }
    }
    setInformationProduct(data)
  }

  const filter = (search, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(search.toLowerCase()) > -1);
  }
  /* Cascader category */

  /* Information product change handler */
  const onInformationProductChange = (e, item) => {
    const name = !item && e.target.name;
    const value = !item && e.target.value;

    if(item){
      const data = {
        ...informationProduct,
        [item]: { ...informationProduct[item], value: e, isValid: true, message: null }
      }
      setInformationProduct(data)
    } else {
      const data = {
        ...informationProduct,
        [name]: { ...informationProduct[name], value: value, isValid: true, message: null }
      }
      setInformationProduct(data)
    }
  }
  /* Information product change handler */

  /* No variant product change handler */
  const onNoVariantChangeHandler = (e, item) => {
    const name = !item && e.target.name;
    const value = !item && e.target.value;

    if(item){
      const data = {
        ...noVariant,
        [item]: { ...noVariant[item], value: e, isValid: true, message: null }
      }
      setNoVariant(data)
    } else {
      const data = {
        ...noVariant,
        [name]: { ...noVariant[name], value: value, isValid: true, message: null }
      }
      setNoVariant(data)
    }
  }
  /* No variant product change handler */

  /* Function for image changing */
  const imageChangeHandler = ({ fileList: newFileList }) => {
    const data = {
      ...imageList,
      file: { value: newFileList, isValid: true, message: null }
    }
    setImageList(data)
  };

  const imageVariantChangeHandler = i => ({ fileList: newFileList, file }) => {
    if(file.status === "done"){
      const variants = [...imageVariants.file.value]
      variants.splice(i, 1, newFileList[0])
      const data = {
        ...imageVariants,
        file: { value: variants, isValid: true, message: null }
      }
      setImageVariants(data)
    }
  };

  const onRemoveImageVariant = i => {
    const copyImageVariants = [...imageVariants.file.value]
    copyImageVariants.splice(i, 1, {})

    const dataImgVariants = {
      ...imageVariants,
      file: { value: copyImageVariants, isValid: true, message: null }
    }
    setImageVariants(dataImgVariants)
  }

  const onRemoveVariant = i => {
    const element = document.getElementById(`variant-upload-${i}`)
    const child = element.childNodes[0].childNodes[0].childNodes[0]
    const deleteBtn = child.childNodes[0].childNodes[1].childNodes[1]
    if(deleteBtn.childNodes[0].childNodes[0]){
      deleteBtn.click()
    }
    const copyImageVariants = [...imageVariants.file.value]
    copyImageVariants.splice(i, 1)
    const data = {
      ...imageVariants,
      file: { value: copyImageVariants, isValid: true, message: null }
    }
    setImageVariants(data)
  }

  const imageSizeGuideChangeHandler = ({ fileList: newFileList }) => {
    const data = {
      ...imageSizeGuide,
      file: { value: newFileList, isValid: true, message: null }
    }
    setImageSizeGuide(data)
  };

  const onRemoveImageProduct = file => {
    if(file.url){
      const imgSplit = file.url.split("/")
      const imgUrl = imgSplit[imgSplit.length - 1]
      setRemovedProductImage(str => str.concat(imgUrl))
    }
  }

  const onRemoveImageSizeGuide = file => {
    if(file.url){
      const imgSplit = file.url.split("/")
      const imgUrl = imgSplit[imgSplit.length - 1]
      setRemovedSizeGuideImage(str => str.concat(imgUrl))
    }
  }
  /* Function for image changing */

  const onPreorderChange = e => {
    const value = e.target.value;
    setIsPreorder(value)
    if(!value){
      const data = {
        ...informationProduct,
        preorder: { ...informationProduct.preorder, value: "", isValid: true, message: null }
      }
      setInformationProduct(data)
    }
  }

  const resetAllData = () => {
    setIsActiveVariation(initialActiveVariation)
    setIsActiveGrosir(initialActiveGrosir)
    setColumns(initialColumn)
    setDataSource([])
    setVaOption(initialVaOption)
    setGrosirPrice(formGrosirPrice)
    setGrosir([])

    setDiscountStatus(not_active)
    setInformationProduct(formInformationProduct)
    setNoVariant(formNoVariant)

    setImageList(formImage)
    setImageVariants(formImage)
    setImageSizeGuide(formImage)

    setIsPreorder(false)
    setLoadingImageProduct(false)
    setLoadingImageVariant(false)
    setLoadingImageSizeGuide(false)

    setCascaderIsShow(false)
    setCascaderValue([])
  }

  const onSubmitProduct = (ticket_variant, ticket_grosir) => {
    const formData = new FormData();

    formData.append("name", name.value);
    formData.append("desc", desc.value);
    formData.append("condition", condition.value);
    formData.append("weight", weight.value);
    formData.append("item_sub_category_id", item_sub_category_id.value);
    formData.append("ticket_variant", ticket_variant);
    imageList.file.value.forEach(file => {
      if(!file.hasOwnProperty('url')) formData.append('image_product', file.originFileObj)
    })

    //optional
    if(ticket_grosir) formData.append("ticket_wholesale", ticket_grosir);
    if(!isEmpty(video.value)) formData.append("video", video.value);
    if(isPreorder && preorder.value !== null && !isEmpty(preorder.value.toString())) formData.append("preorder", preorder.value);
    if(brand_id.value !== "" && brand_id.value.length !== 0 && !isEmpty(brand_id.value.toString())){
      formData.append("brand_id", brand_id.value);
    }
    if(isActiveVariation.active && imageVariants.file.value.length > 0){
      imageVariants.file.value.forEach(file => {
        if(file.hasOwnProperty("originFileObj")) formData.append("image_variant", file.originFileObj)
      })
    }
    if(imageSizeGuide.file.value.length > 0){
      imageSizeGuide.file.value.forEach(file => {
        if(file.hasOwnProperty("originFileObj")) formData.append("image_size_guide", file.originFileObj)
      })
    }
    if(removedProductImage.length > 0){
      formData.append("image_product_delete", removedProductImage.join(","))
    }
    if(removedSizeGuideImage.length > 0){
      formData.append("image_size_guide_delete", removedSizeGuideImage.join())
    }

    setLoading(true)
    axios.put(`/products/update/${productData.products_id}`, formData, formHeaderHandler())
      .then(res => {
        setLoading(false)
        resNotification("success", "Success", res.data.detail)
        resetAllData()
        Router.push("/admin/products")
      })
      .catch(err => {
        setLoading(false)
        const errDetail = err.response.data.detail;
        const uniqueImage = "Each image must be unique."
        const variantImage = "You must fill all variant images or even without images."
        const errName = "The name has already been taken."
        if(errDetail == signature_exp){
          resNotification("success", "Success", "Successfully add a new product.")
          Router.push("/admin/products")
        } else if (typeof errDetail === "string" && errDetail === errName) {
          const state = JSON.parse(JSON.stringify(informationProduct));
          state.name.value = state.name.value;
          state.name.isValid = false;
          state.name.message = errDetail;
          setInformationProduct(state)
          formErrorMessage(errDetail)
        } else if(typeof errDetail === "string" && errDetail === uniqueImage){
          formErrorMessage(errDetail)
        } else if(typeof errDetail === "string" && errDetail === variantImage){
          formErrorMessage(errDetail)
        } else {
          const state = JSON.parse(JSON.stringify(informationProduct));
          errDetail.map(data => {
            const key = data.loc[data.loc.length - 1];
            /*
             * TODO:
             * Image validator from server
             */
            if(key === "image_product"){
              message.error({ 
                content: "image product " + data.msg, 
                style: { marginTop: '10vh' },
              });
              const imgProduct = {
                ...imageList,
                file: { ...imageList.file, isValid: false, message: null }
              }
              setImageList(imgProduct)
            }
            if(state[key]){
              state[key].value = state[key].value;
              state[key].isValid = false;
              state[key].message = data.msg;
            }
            if(key !== "image_product"){
              formErrorMessage(checkMessage)
            }
          })
          setInformationProduct(state)
        }
      })
  }

  const onSubmitGrosir = (ticket_variant) => {
    if(!activeGrosir) return

    const urlGrosir = "/wholesale/create-ticket"
    const grosirList = grosir.map(data => {
      const container = {}
      container["min_qty"] = data.min_qty.value;
      container["price"] = data.price.value.toString();
      return container
    })

    if(validateFormGrosirPrice(grosir, setGrosir, grosirPrice.price, va1_price, isActiveVariation.active) && 
       validateFormGrosirQty(grosir, setGrosir)
    ){
      const data = {
        variant: ticket_variant,
        items: grosirList
      }

      console.log(JSON.stringify(data, null, 2))
      axios.post(urlGrosir, data, jsonHeaderHandler())
        .then(res => {
          onSubmitProduct(ticket_variant, res.data.ticket)
        })
        .catch(err => {
          console.log(err.response.data)
          const errDetail = err.response.data.detail;
          if(errDetail == signature_exp){
            axios.post(urlGrosir, data, jsonHeaderHandler())
              .then(res => {
                onSubmitProduct(ticket_variant, res.data.ticket)
              })
          } else if(typeof(errDetail) === "string" && errDetail !== signature_exp){
            resNotification("error", "Error", errDetail)
          } else {
            errDetail.map(data => {
              const newGrosir = [...grosir]
              if(isIn(data.loc.join(" "), ["min_qty", "price"])){
                const key = data.loc[data.loc.length - 1];
                const idx = data.loc[data.loc.length - 2];
                newGrosir[idx][key].isValid = false
                newGrosir[idx][key].message = data.msg
              } else {
                if(isIn(data.msg, ["min_qty", "price"])){
                  const key = data.msg.split(" ")[0]
                  const idx = parseInt(data.msg.split(" ")[1])
                  const msgSplit = data.msg.split(":")
                  newGrosir[idx][key].isValid = false
                  newGrosir[idx][key].message = msgSplit[0].split(" ")[0] + " " + (parseInt(msgSplit[0].split(" ")[1])+1) +":" + msgSplit[1]
                } 
                else if(isIn(data.loc[data.loc.length - 1], ["price", "min_qty"])){
                  const key = data.loc[data.loc.length - 1];
                  const idx = data.loc[data.loc.length - 2];
                  newGrosir[idx][key].isValid = false
                  newGrosir[idx][key].message = data.msg
                }
                else {
                  formErrorMessage(checkMessage)
                }
              }
              setGrosir(newGrosir)
            })
          }

        })
    }
  }

  const onSubmitHandler = e => {
    e.preventDefault()
    const newProductData = { ...productData }
    const productVariant = { ...productData.products_variant }
    const { va2_name, va1_items } = productVariant
    const urlVariant = "/variants/create-ticket"

    if(!isActiveVariation.active && 
       isValidProductInformation(informationProduct, setInformationProduct, isPreorder) &&
       formNoVariantIsValid(noVariant, setNoVariant) &&
       formImageIsValid(imageList, setImageList, "Foto produk tidak boleh kosong")
    ){

      const data = {
        va1_product_id: newProductData.products_id,
        va1_items: [{
          va1_id: va1_id.value.toString(),
          va1_price: va1_price.value.toString(),
          va1_stock: va1_stock.value.toString(),
          va1_code: va1_code.value || null,
          va1_barcode: va1_barcode.value || null,
          va1_discount: va1_discount.value,
          va1_discount_active: va1_discount_active.value
        }]
      }
          

      console.log(JSON.stringify(data, null, 2))
      axios.post(urlVariant, data, jsonHeaderHandler())
        .then(res => {
          if(activeGrosir){
            onSubmitGrosir(res.data.ticket)
          } else {
            onSubmitProduct(res.data.ticket, false)
          }
        })
        .catch(err => {
          const errDetail = err.response.data.detail;
          console.log(errDetail)
          if(errDetail == signature_exp){
            axios.post(urlVariant, data, jsonHeaderHandler())
              .then(res => {
                if(activeGrosir){
                  onSubmitGrosir(res.data.ticket)
                } else {
                  onSubmitProduct(res.data.ticket, false)
                }
              })
          } else if(typeof(errDetail) === "string" && errDetail !== signature_exp){
            resNotification("error", "Error", errDetail)
          } else {
            formErrorMessage(checkMessage)
            const state = JSON.parse(JSON.stringify(noVariant));
            errDetail.map(data => {
              const key = data.loc[data.loc.length - 1];
              if(key === "va1_items"){
                let newKey = data.msg.split(" ")[1]
                if(state[newKey]){
                  state[newKey].value = state[newKey].value;
                  state[newKey].isValid = false;
                  state[newKey].message = `ensure ${newKey.split("_")[1]} value is not null`;
                }
              } else {
                if(state[key]){
                  state[key].value = state[key].value;
                  state[key].isValid = false;
                  state[key].message = data.msg;
                }
              }
            })
            setNoVariant(state)
          }
        })
    } // end of no variant
      // end of no variant
    else {
      if(!isActiveVariation.active){
        formErrorMessage(checkMessage)
      }
    }


    if(isActiveVariation.active && isActiveVariation.countVariation === 1){
      let formIsValid = false;
      let tableIsValid = false;
      const items = []
      const variantIsValid = vaOption[`va1Option`].map(data => data[`va1_option`].isValid)

      for(let i = 0; i < va1Total; i++){
        const imageVariantsObj = imageVariants.file.value[i]
        const imgSplit = imageVariantsObj.hasOwnProperty("url") && imageVariantsObj.url.split("/")
        const imgUrl = imgSplit[imgSplit.length - 1]

        const item = {
          va1_id: va1Option[i].id.value.toString(),
          va1_option: va1Option[i].va1_option.value,
          va1_price: dataSource[i].price.value.toString(),
          va1_stock: dataSource[i].stock.value.toString(),
          va1_code: dataSource[i].code.value || null,
          va1_barcode: dataSource[i].barcode.value || null,
          va1_discount: dataSource[i].discount.value,
          va1_discount_active: dataSource[i].discount_active.value,
          va1_image: imageVariantsObj.hasOwnProperty("url") ? imgUrl : null
        }
        items.push(item)
        formIsValid = formVa1OptionSingleVariantIsValid(vaOption, setVaOption, i)
        tableIsValid = formTableIsValid(dataSource, setDataSource, i)
      }
      if(formVariantTitleIsValid(columns, setColumns) && 
         isValidProductInformation(informationProduct, setInformationProduct) &&
         formIsValid && tableIsValid && !isIn("false", variantIsValid) &&
         formImageIsValid(imageList, setImageList, "Foto produk tidak boleh kosong")
      ){
        const data = {
          va1_product_id: newProductData.products_id,
          va1_name: columns[0].title == "Nama" ?  "" : columns[0].title,
          va1_items: items
        }

        console.log(JSON.stringify(data, null, 2))
        axios.post(urlVariant, data, jsonHeaderHandler())
          .then(res => {
            if(activeGrosir){
              onSubmitGrosir(res.data.ticket)
            } else {
              onSubmitProduct(res.data.ticket, false)
            }
          })
          .catch(err => {
            const errDetail = err.response.data.detail;
            console.log(errDetail)
            if(errDetail == signature_exp){
              axios.post(urlVariant, data, jsonHeaderHandler())
                .then(res => {
                  if(activeGrosir){
                    onSubmitGrosir(res.data.ticket)
                  } else {
                    onSubmitProduct(res.data.ticket, false)
                  }
                })
            } else if(typeof(errDetail) === "string" && errDetail !== signature_exp){
              resNotification("error", "Error", errDetail)
            } else {
              formErrorMessage(checkMessage)
              errDetail.map(data => {
                const key = data.loc[data.loc.length - 1];
                const idx = data.loc[data.loc.length - 2];
                if(key === "va1_name"){
                  const newColumns = [...columns]
                  const index = getIndex("va1_option", columns, 'key')
                  newColumns[index].value = newColumns[index].value;
                  newColumns[index].isValid = false;
                  newColumns[index].message = data.msg;
                  setColumns(newColumns)
                }
                if(key === "va1_option"){
                  const newVaOption = [...vaOption[`va1Option`]]
                  newVaOption[idx][`va1_option`].value = newVaOption[idx][`va1_option`].value;
                  newVaOption[idx][`va1_option`].isValid = false;
                  newVaOption[idx][`va1_option`].message = data.msg;
                  setVaOption({ ...vaOption, va1Option: newVaOption })
                }
                if(isIn(key, ["va1_price", "va1_stock", "va1_code", "va1_barcode"])){
                  const newDataSource = [...dataSource]
                  const newKey = key.split("_")[1]
                  newDataSource[idx][newKey].value = newDataSource[idx][newKey].value;
                  newDataSource[idx][newKey].isValid = false;
                  newDataSource[idx][newKey].message = data.msg;
                  setDataSource(newDataSource)
                }
              })
            }
          })
      }
      else {
        formErrorMessage(checkMessage)
      }
    } // end of single variant
      // end of single variant


    if(isActiveVariation.active && isActiveVariation.countVariation === 2){
      let formVa1IsValid = false;
      let formVa2IsValid = false;
      let tableIsValid = false;
      const variant1IsValid = vaOption[`va1Option`].map(data => data[`va1_option`].isValid)
      const variant2IsValid = vaOption[`va2Option`].map(data => data[`va2_option`].isValid)

      for(let i = 0; i < va1Total; i++){
        formVa1IsValid = formVa1OptionSingleVariantIsValid(vaOption, setVaOption, i)
      }
      for(let i = 0; i < va2Total; i++){
        formVa2IsValid = formVa2OptionDoubleVariantIsValid(vaOption, setVaOption, i)
      }
      for(let i = 0; i < dataSource.length; i++){
        tableIsValid = formTableIsValid(dataSource, setDataSource, i)
      }

      let va1 = dataSource.map(x => x.va1_option)
      va1 = va1.filter((item, index, array) => array.indexOf(item) === index)

      let variants = []
      for(let i in va1){
        const imageVariantsObj = imageVariants.file.value[i]
        const imgSplit = imageVariantsObj.hasOwnProperty("url") && imageVariantsObj.url.split("/")
        const imgUrl = imgSplit[imgSplit.length - 1]

        const va1_items = {
          va1_option: va1[i].split(" ")[0] === "Pilihan" ? "" : va1[i],
          va1_image: imageVariantsObj.hasOwnProperty("url") ? imgUrl : null,
          va2_items: []
        }
        for(let val of dataSource){
          if(val.va1_option === va1[i]){
            const va2_data = {
              va2_id: val.id ? val.id.value.toString() : "0",
              va2_option: val.va2_option.split(" ")[0] === "Pilihan" ? "" : val.va2_option,
              va2_price: val.price.value.toString(),
              va2_stock: val.stock.value.toString(),
              va2_code: val.code.value || null,
              va2_barcode: val.barcode.value || null,
              va2_discount: val.discount.value,
              va2_discount_active: val.discount_active.value,
            }
            va1_items.va2_items.push(va2_data)
          }
        }
        variants.push(va1_items)
      }

      if(formTitleIsValid(columns, setColumns) && 
         formVa1IsValid && formVa2IsValid && tableIsValid && 
         !isIn("false", variant1IsValid) && !isIn("false", variant2IsValid) &&
         isValidProductInformation(informationProduct, setInformationProduct) &&
         formImageIsValid(imageList, setImageList, "Foto produk tidak boleh kosong")
      ){
        const data = {
          va1_product_id: newProductData.products_id,
          va1_name: columns[0].title == "Nama" ?  "" : columns[0].title,
          va2_name: columns[1].title == "Nama" ?  "" : columns[1].title,
          va1_items: variants
        }

        console.log(JSON.stringify(data, null, 2))
        axios.post(urlVariant, data, jsonHeaderHandler())
          .then(res => {
            if(activeGrosir){
              onSubmitGrosir(res.data.ticket)
            } else {
              onSubmitProduct(res.data.ticket, false)
            }
          })
          .catch(err => {
            console.log(err)
            const errDetail = err.response.data.detail;
            console.log(errDetail)
            if(errDetail == signature_exp){
              axios.post(urlVariant, data, jsonHeaderHandler())
                .then(res => {
                  if(activeGrosir){
                    onSubmitGrosir(res.data.ticket)
                  } else {
                    onSubmitProduct(res.data.ticket, false)
                  }
                })
            } else if(typeof(errDetail) === "string" && errDetail !== signature_exp){
              resNotification("error", "Error", errDetail)
            } else {
              formErrorMessage(checkMessage)
              errDetail.map(data => {
                const key = data.loc[data.loc.length - 1];
                const idx = data.loc[data.loc.length - 2];
                if(key === "va1_name"){
                  const newColumns = [...columns]
                  const index = getIndex("va1_option", columns, 'key')
                  newColumns[index].value = newColumns[index].value;
                  newColumns[index].isValid = false;
                  newColumns[index].message = data.msg;
                  setColumns(newColumns)
                }
                if(key === "va2_name"){
                  const newColumns = [...columns]
                  const index = getIndex("va2_option", columns, 'key')
                  newColumns[index].value = newColumns[index].value;
                  newColumns[index].isValid = false;
                  newColumns[index].message = data.msg;
                  setColumns(newColumns)
                }
                if(key === "va1_option"){
                  const newVaOption = [...vaOption[`va1Option`]]
                  newVaOption[idx][`va1_option`].value = newVaOption[idx][`va1_option`].value;
                  newVaOption[idx][`va1_option`].isValid = false;
                  newVaOption[idx][`va1_option`].message = data.msg;
                  setVaOption({ ...vaOption, va1Option: newVaOption })
                }
                if(key === "va2_option"){
                  const newVaOption = [...vaOption[`va2Option`]]
                  newVaOption[idx][`va2_option`].value = newVaOption[idx][`va2_option`].value;
                  newVaOption[idx][`va2_option`].isValid = false;
                  newVaOption[idx][`va2_option`].message = data.msg;
                  setVaOption({ ...vaOption, va2Option: newVaOption })
                }
                if(isIn(key, ["va2_price", "va2_stock", "va2_code", "va2_barcode"])){
                  const newDataSource = [...dataSource]
                  const va1_key = data.loc[2];
                  const va2_key = data.loc[data.loc.length - 2];
                  const newKey = key.split("_")[1]

                  for(let i = 0; i < newDataSource.length; i++){
                    if(newDataSource[i].va1_key === va1_key && newDataSource[i].va2_key === va2_key){
                      newDataSource[i][newKey].value = newDataSource[i][newKey].value;
                      newDataSource[i][newKey].isValid = false;
                      newDataSource[i][newKey].message = data.msg;
                    }
                  }
                  setDataSource(newDataSource)
                }
              })
            }
          })
      }
      else {
        formErrorMessage(checkMessage)
      }
    } // end of two variant

  }

  useEffect(() => {
    if(isActiveVariation.active) {
      setNoVariant(formNoVariant)
    }
  }, [isActiveVariation])

  useEffect(() => {
    checkVariantImage(imageVariants.file.value)
  }, [va1Total])

  const invalidProductImage = cx({ "invalid-upload": !imageList.file.isValid });

  return(
    <>
      <InformationProducts 
        informationProduct={informationProduct}
        onInformationProductChange={onInformationProductChange}
        cascaderValue={cascaderValue}
        cascaderIsShow={cascaderIsShow}
        onCascaderChange={onCascaderChange}
        allCategoriesList={allCategoriesList} 
        onFocusCascader={onFocusCascader}
        filter={filter}
      />

      <Card className="border-0 shadow-sm card-add-product">
        <Card.Body className="p-3 border-bottom">
          <h5 className="mb-0 fs-16-s">Informasi Penjualan</h5>
        </Card.Body>
        <Card.Body className="p-3">

          {!isActiveVariation.active && (
            <NoVariantComponent 
              noVariant={noVariant}
              onNoVariantChangeHandler={onNoVariantChangeHandler}
              isActiveGrosir={isActiveGrosir}
              discountStatus={discountStatus}
            />
          )}

          <TableVariant 
            isActiveVariation={isActiveVariation}
            setIsActiveVariation={setIsActiveVariation}
            columns={columns}
            setColumns={setColumns}
            dataSource={dataSource}
            setDataSource={setDataSource}
            vaOption={vaOption}
            setVaOption={setVaOption}
            imageVariants={imageVariants}
            setImageVariants={setImageVariants}
            onRemoveVariant={onRemoveVariant}
            initialFetch={initialFetch}
            setInitialFetch={setInitialFetch}
            activeGrosir={activeGrosir}
            grosirPrice={grosirPrice}
            setGrosirPrice={setGrosirPrice}
            noVariant={noVariant}
            discountStatus={discountStatus}
          />

          <TableGrosir
            isActiveVariation={isActiveVariation}
            isActiveGrosir={isActiveGrosir}
            setIsActiveGrosir={setIsActiveGrosir}
            grosirPrice={grosirPrice}
            setGrosirPrice={setGrosirPrice}
            dataSource={dataSource}
            setDataSource={setDataSource}
            noVariant={noVariant}
            onNoVariantChangeHandler={onNoVariantChangeHandler}
            grosir={grosir}
            setGrosir={setGrosir}
            discountStatus={discountStatus}
          />

        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm card-add-product">
        <Card.Body className="p-3 border-bottom">
          <h5 className="mb-0 fs-16-s">Pengaturan Media</h5>
        </Card.Body>
        <Card.Body className="p-3">

          <Form layout="vertical">
            <Form.Item label="Foto Produk" className="" required>
              <Upload
                accept="image/*"
                listType="picture-card"
                className={`avatar-uploader ${invalidProductImage}`}
                disabled={loadingImageProduct}
                onPreview={imagePreview}
                fileList={imageList.file.value}
                onChange={imageChangeHandler}
                onRemove={onRemoveImageProduct}
                beforeUpload={(file) => multipleImageValidation(file, imageList.file.value, "image_product", "/products/create", "post", setLoadingImageProduct)}
              >
                {imageList.file.value.length >= 10 ? null : uploadButton(loadingImageProduct)}
              </Upload>
            </Form.Item>

            {isActiveVariation.active && (
              <Form.Item label={columns[0].title.split(" ")[0] === "Nama" ? "Variasi 1" : columns[0].title} className="mb-0">
                <Row gutter={[8, 16]}>
                  {va1Option.map((va, i) => (
                    <Col key={i} id={`variant-upload-${i}`}>
                      <Upload
                        accept="image/*"
                        listType="picture-card"
                        className="variant-uploader"
                        disabled={loadingImageVariant}
                        onPreview={imagePreview}
                        onRemove={() => onRemoveImageVariant(i)}
                        fileList={imageVariants.file && imageVariants.file.value && 
                                  imageVariants.file.value[i] && imageVariants.file.value[i].uid && 
                                  imageVariants.file.value.length > 0 && [imageVariants.file.value[i]]
                        }
                        onChange={imageVariantChangeHandler(i)}
                        beforeUpload={(file) => multipleImageValidation(file, imageVariants.file.value, "image_variant", "/products/create", "post", setLoadingImageVariant )}
                      >
                        {va1Total ? uploadButton(loadingImageVariant) : null}
                      </Upload>
                      <p className="text-center noselect">
                        {va.va1_option.value || "Pilihan"} {imageList.file.value.length == va1Total}
                      </p>
                    </Col>
                  ))}
                </Row>
              </Form.Item>
            )}

            <Form.Item label="Panduan Ukuran" className="mb-0">
              <div className="w-min-content">
                <Upload
                  accept="image/*"
                  listType="picture-card"
                  className="size-guide-uploader"
                  disabled={loadingImageSizeGuide}
                  onPreview={imagePreview}
                  fileList={imageSizeGuide.file.value}
                  onChange={imageSizeGuideChangeHandler}
                  onRemove={onRemoveImageSizeGuide}
                  beforeUpload={(file) => imageValidationProduct(file, "image_size_guide", "/products/create", "post", setLoadingImageSizeGuide)}
                >
                  {imageSizeGuide.file.value.length >= 1 ? null : uploadButton(loadingImageSizeGuide)}
                </Upload>
                <p className="text-center text-secondary noselect hover-pointer" onClick={() => setShowSizeGuide(true)}>Contoh</p>
              </div>
            </Form.Item>

            <Form.Item 
              label="Video Produk" 
              className="mb-0"
              validateStatus={!video.isValid && video.message && "error"}
            >
              <Input 
                className="h-35" 
                name="video"
                placeholder="Youtube embed link" 
                value={video.value}
                onChange={e => onInformationProductChange(e)}
              />
              <ErrorTooltip item={video} />
            </Form.Item>
          </Form>

        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm card-add-product">
        <Card.Body className="p-3 border-bottom">
          <h5 className="mb-0 fs-16-s">Pengiriman</h5>
        </Card.Body>
        <Card.Body className="p-3">

          <Form layout="vertical">
            <Form.Item 
              required
              label="Berat" 
              validateStatus={!weight.isValid && weight.message && "error"}
            >
              <div className="ant-input-group-wrapper">
                <div className="ant-input-wrapper ant-input-group">
                  <InputNumber
                    min={1}
                    name="weight"
                    placeholder="Berat paket"
                    className="w-100 bor-right-rad-0 h-33-custom-input"
                    value={weight.value}
                    onChange={e => onInformationProductChange(e, "weight")}
                  />
                  <span className="ant-input-group-addon noselect">gr</span>
                </div>
              </div>
              <ErrorTooltip item={weight} />
            </Form.Item>

            <Form.Item 
              label="Preorder"
              validateStatus={!preorder.isValid && preorder.message && "error"}
            >
              <Radio.Group value={isPreorder} onChange={onPreorderChange}>
                <Radio className="noselect" value={false}>Tidak</Radio>
                <Radio className="noselect" value={true}>Ya</Radio>
              </Radio.Group>
              <AnimatePresence>
                {isPreorder && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: .05 }}
                  >
                    <div className="ant-input-group-wrapper mt-2">
                      <div className="ant-input-wrapper ant-input-group">
                        <InputNumber
                          min={1}
                          max={500}
                          name="preorder"
                          placeholder="Preorder"
                          className="w-100 bor-right-rad-0 h-33-custom-input"
                          value={preorder.value}
                          onChange={e => onInformationProductChange(e, "preorder")}
                        />
                        <span className="ant-input-group-addon noselect">hari</span>
                      </div>
                    </div>
                    <ErrorTooltip item={preorder} />
                  </motion.div>
                )}
              </AnimatePresence>
            </Form.Item>
          </Form>

        </Card.Body>
      </Card>

      <Space>
        <Button className="btn-tridatu" onClick={onSubmitHandler} disabled={loading}>
          {loading ? <LoadingOutlined /> : "Simpan"}
        </Button>
        <Link href="/admin/products">
          <Button>Batal</Button>
        </Link>
      </Space>

      <SizeGuideModal 
        show={showSizeGuide} 
        close={() => setShowSizeGuide(false)}
        image="/static/images/size-guide.jpg"
      />

      <style jsx>{`
        :global(.h-33-custom-input .ant-input-number-input){
          height: 33px;
        }
        :global(.size-guide-uploader .ant-upload.ant-upload-select-picture-card){
          margin-right: 0;
          margin-bottom: 5px;
        }
        :global(.variant-uploader .ant-upload-list-picture-card-container){
          margin-right: 0;
        }
        :global(.variant-uploader .ant-upload.ant-upload-select-picture-card:not(:first-of-type)){
          display: none;
        }

        :global(.cascader-category-menus){
          width: ${isMobile ? "calc(100% - 32px)" : `calc(100% - ${collapsed ? "160px" : "332px"})`};
        }
        :global(.cascader-category-menus .ant-cascader-menu){
          width: calc(100% / 3);
        }
      `}</style>
      <style jsx>{AddStyleAdmin}</style>
    </>
  )
}

UpdateProduct.getInitialProps = async ctx => {
  const { slug } = ctx.query
  try{
    const res = await axios.get(`/products/${slug}?recommendation=false`, jsonHeaderHandler())
    if(res.status == 404){
      process.browser
        ? Router.replace("/admin/products", "/admin/products") //Redirec from Client Side
        : ctx.res.writeHead(302, { Location: "/admin/products" }); //Redirec from Server Side
      !process.browser && ctx.res.end()
    } else {
      return {
        productData: res.data
      }
    }
  }
  catch (err) {
    const res = await axios.get(`/products/${slug}?recommendation=false`)
    if(res.status == 404){
      process.browser
        ? Router.replace("/admin/products", "/admin/products") //Redirec from Client Side
        : ctx.res.writeHead(302, { Location: "/admin/products" }); //Redirec from Server Side
      !process.browser && ctx.res.end()
    } else {
      return {
        productData: res.data
      }
    }
  }
}

export default withAuth(UpdateProduct)
