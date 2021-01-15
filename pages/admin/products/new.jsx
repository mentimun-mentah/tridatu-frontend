import { withAuth } from 'lib/withAuth'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { Form, Input, Select, InputNumber, Button, Cascader, Space, Upload, Row, Col, Radio, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { AnimatePresence, motion } from "framer-motion";

import _ from 'lodash'
import cx from 'classnames'
import isIn from 'validator/lib/isIn'
import isEmpty from 'validator/lib/isEmpty'
import Card from 'react-bootstrap/Card'
import axios, { jsonHeaderHandler, formHeaderHandler, resNotification, signature_exp } from 'lib/axios'

import getIndex from 'lib/getIndex'
import { formImage, formImageIsValid } from 'formdata/formImage'
import { imagePreview, uploadButton } from 'lib/imageUploader'
import { imageValidationProduct, multipleImageValidation } from 'lib/imageProductUploader'
import SizeGuideModal from 'components/Modal/Admin/Products/SizeGuide'

import ErrorTooltip from "components/ErrorMessage/Tooltip";
// import ErrorMessage from "components/ErrorMessage";
import TableVariant from 'components/Admin/Variant/TableVariant'
import AddStyleAdmin from 'components/Admin/addStyle'

// import { categoryData } from 'components/Header/categoryData'
// import { brandData } from 'data/brand'

import { formItemLayout, initialColumn } from 'data/productsAdmin'

import { formInformationProduct, formNoVariant } from 'formdata/formProduct'
import { formNoVariantIsValid, formVa1OptionSingleVariantIsValid, formTableIsValid, formVariantTitleIsValid } from 'formdata/formProduct'
import { formVa2OptionDoubleVariantIsValid, formTitleIsValid } from 'formdata/formProduct'
import { isValidProductInformation } from 'formdata/formProduct'

import * as actions from "store/actions";

/*
 * TODO:
 * search in select categories ✅
 * variant images ✅
 * validation error input ✅
 * check in all variant test ✅
 * validation images ✅
 * delete each variant not syncron with the image variant ✅
 * improve variant component 
 * connect to backend ✅
 */

const initialVaOption = { va1Option: [], va2Option: [], va1Total: 0, va2Total: 0 }
const initialActiveVariation = { active: false, countVariation: 0 }

const NewProduct = () => {
  const dispatch = useDispatch()

  const [imageList, setImageList] = useState(formImage);
  const [imageVariants, setImageVariants] = useState(formImage);
  const [imageSizeGuide, setImageSizeGuide] = useState(formImage);

  const [loading, setLoading] = useState(false)
  const [isPreorder, setIsPreorder] = useState(false)
  const [loadingImageProduct, setLoadingImageProduct] = useState(false)
  const [loadingImageVariant, setLoadingImageVariant] = useState(false)
  const [loadingImageSizeGuide, setLoadingImageSizeGuide] = useState(false)

  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [allCategoriesList, setAllCategoriesList] = useState([])

  const [columns, setColumns] = useState(initialColumn)
  const [dataSource, setDataSource] = useState([])
  const [vaOption, setVaOption] = useState(initialVaOption)
  const [isActiveVariation, setIsActiveVariation] = useState(initialActiveVariation)

  const [informationProduct, setInformationProduct] = useState(formInformationProduct)
  const [noVariant, setNoVariant] = useState(formNoVariant)

  const [cascaderIsShow, setCascaderIsShow] = useState(false)
  const [cascaderValue, setCascaderValue] = useState([])

  const collapsed = useSelector(state => state.layout.adminCollapsed)
  const isMobile = useSelector(state => state.layout.adminIsMobile)

  const brandsData = useSelector(state => state.brand.brand)
  const allCategoriesData = useSelector(state => state.categories.allCategories)

  const { va1Option, va1Total, va2Total } = vaOption

  /* Destructuring Object Product */
  const { name, desc, item_sub_category_id, brand_id, condition, weight, preorder, video } = informationProduct;
  const { va1_price, va1_stock, va1_code, va1_barcode } = noVariant
  /* Destructuring Object Product */

  const fetchBrands = () => {
    dispatch(actions.getBrand())
  }

  const fetchCategories = () => {
    dispatch(actions.getAllCategories())
  }

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
    fetchCategories()
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
    setColumns(initialColumn)
    setDataSource([])
    setVaOption(initialVaOption)

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

  const onSubmitProduct = (ticket) => {
    const formData = new FormData();

    formData.append("name", name.value);
    formData.append("desc", desc.value);
    formData.append("condition", condition.value);
    formData.append("weight", weight.value);
    formData.append("item_sub_category_id", item_sub_category_id.value);
    formData.append("ticket_variant", ticket);
    imageList.file.value.forEach(file => {
      formData.append("image_product", file.originFileObj)
    })

    //optional
    if(!isEmpty(video.value)) formData.append("video", video.value);
    if(isPreorder && preorder.value !== null && !isEmpty(preorder.value.toString())) formData.append("preorder", preorder.value);
    if(brand_id.value.length !== 0 && !isEmpty(brand_id.value.toString())) formData.append("brand_id", brand_id.value);
    if(isActiveVariation.active && imageVariants.file.value.length > 0){
      imageVariants.file.value.forEach(file => {
        if(file.hasOwnProperty("originFileObj")) formData.append("image_variant", file.originFileObj)
      })
    }
    if(imageSizeGuide.file.value.length > 0){
      imageSizeGuide.file.value.forEach(file => {
        formData.append("image_size_guide", file.originFileObj)
      })
    }

    setLoading(true)
    axios.post("/products/create", formData, formHeaderHandler())
      .then(res => {
        setLoading(false)
        resNotification("success", "Success", res.data.detail)
        resetAllData()
      })
      .catch(err => {
        setLoading(false)
        const errDetail = err.response.data.detail;
        console.log(errDetail)
        const uniqueImage = "Each image must be unique."
        const variantImage = "You must fill all variant images or even without images."
        const errName = "The name has already been taken."
        if(errDetail == signature_exp){
          resNotification("success", "Success", "Successfully add a new product.")
        } else if (typeof errDetail === "string" && errDetail === errName) {
          const state = JSON.parse(JSON.stringify(informationProduct));
          state.name.value = state.name.value;
          state.name.isValid = false;
          state.name.message = errDetail;
          setInformationProduct(state)
        } else if(typeof errDetail === "string" && errDetail === uniqueImage){
          message.error({ 
            content: errDetail, 
            style: { marginTop: '10vh' },
          });
        } else if(typeof errDetail === "string" && errDetail === variantImage){
          message.error({ 
            content: errDetail, 
            style: { marginTop: '10vh' },
          });
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

          })
          setInformationProduct(state)
        }
      })
  }

  const onSubmitHandler = e => {
    e.preventDefault()
    const urlVariant = "/variants/create-ticket"

    if(!isActiveVariation.active && 
       isValidProductInformation(informationProduct, setInformationProduct, isPreorder) &&
       formNoVariantIsValid(noVariant, setNoVariant) &&
       formImageIsValid(imageList, setImageList, "Foto produk tidak boleh kosong")
    ){
      const data = {
        va1_items: [
          {
            va1_price: va1_price.value,
            va1_stock: va1_stock.value,
            va1_code: va1_code.value || null,
            va1_barcode: va1_barcode.value || null
          }
        ]
      }

      console.log(JSON.stringify(data, null, 2))
      axios.post(urlVariant, data, jsonHeaderHandler())
        .then(res => {
          onSubmitProduct(res.data.ticket)
        })
        .catch(err => {
          const errDetail = err.response.data.detail;
          if(errDetail == signature_exp){
            axios.post(urlVariant, data, jsonHeaderHandler())
              .then(res => {
                onSubmitProduct(res.data.ticket)
              })
          } else if(typeof(errDetail) === "string" && errDetail !== signature_exp){
            resNotification("error", "Error", errDetail)
          } else {
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


    if(isActiveVariation.active && isActiveVariation.countVariation === 1){
      let formIsValid = false;
      let tableIsValid = false;
      const items = []
      const variantIsValid = vaOption[`va1Option`].map(data => data[`va1_option`].isValid)
      for(let i = 0; i < va1Total; i++){
        const item = {
          va1_option: va1Option[i].va1_option.value,
          va1_price: +dataSource[i].price.value,
          va1_stock: +dataSource[i].stock.value,
          va1_code: dataSource[i].code.value || null,
          va1_barcode: dataSource[i].barcode.value || null
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
          va1_name: columns[0].title == "Nama" ?  "" : columns[0].title,
          va1_items: items
        }

        console.log(JSON.stringify(data, null, 2))
        axios.post(urlVariant, data, jsonHeaderHandler())
          .then(res => {
            onSubmitProduct(res.data.ticket)
          })
          .catch(err => {
            const errDetail = err.response.data.detail;
            if(errDetail == signature_exp){
              axios.post(urlVariant, data, jsonHeaderHandler())
                .then(res => {
                  onSubmitProduct(res.data.ticket)
                })
            } else if(typeof(errDetail) === "string" && errDetail !== signature_exp){
              resNotification("error", "Error", errDetail)
            } else {
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
      for(let check of va1){
        const va1_items = {
          va1_option: check.split(" ")[0] === "Pilihan" ? "" : check,
          va2_items: []
        }
        for(let val of dataSource){
          if(val.va1_option === check){
            const va2_data = {
              va2_option: val.va2_option.split(" ")[0] === "Pilihan" ? "" : val.va2_option,
              va2_price: +val.price.value,
              va2_stock: +val.stock.value,
              va2_code: val.code.value || null,
              va2_barcode: val.barcode.value || null
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
          va1_name: columns[0].title == "Nama" ?  "" : columns[0].title,
          va2_name: columns[1].title == "Nama" ?  "" : columns[1].title,
          va1_items: variants
        }

        console.log(JSON.stringify(data, null, 2))

        axios.post(urlVariant, data, jsonHeaderHandler())
          .then(res => {
            onSubmitProduct(res.data.ticket)
          })
          .catch(err => {
            const errDetail = err.response.data.detail;
            console.log(errDetail)
            if(errDetail == signature_exp){
              axios.post(urlVariant, data, jsonHeaderHandler())
                .then(res => {
                  onSubmitProduct(res.data.ticket)
                })
            } else if(typeof(errDetail) === "string" && errDetail !== signature_exp){
              resNotification("error", "Error", errDetail)
            } else {
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

    } // end of two variant
  }

  useEffect(() => {
    if(isActiveVariation.active) {
      setNoVariant(formNoVariant)
    }
  }, [isActiveVariation])

  const invalidProductImage = cx({ "invalid-upload": !imageList.file.isValid });

  return(
    <>
      <Card className="border-0 shadow-sm card-add-product">
        <Card.Body className="p-3 border-bottom">
          <h5 className="mb-0 fs-16-s">Informasi Produk</h5>
        </Card.Body>
        <Card.Body className="p-3">

          <Form layout="vertical">
            <Form.Item 
              required
              label="Nama Produk" 
              validateStatus={!name.isValid && name.message && "error"}
            >
              <Input 
                name="name"
                placeholder="Nama Produk" 
                className="h-35" 
                value={name.value}
                onChange={e => onInformationProductChange(e)}
              />
              <ErrorTooltip item={name} />
            </Form.Item>
            <Form.Item 
              required
              label="Deskripsi Produk" 
              validateStatus={!desc.isValid && desc.message && "error"}
            >
              <Input.TextArea 
                name="desc"
                autoSize={{ minRows: 8, maxRows: 10 }} 
                placeholder="Deskripsi produk" 
                value={desc.value}
                onChange={e => onInformationProductChange(e)}
              />
              <ErrorTooltip item={desc} />
            </Form.Item>
            <Form.Item 
              required
              label="Kategori" 
              validateStatus={!item_sub_category_id.isValid && item_sub_category_id.message && "error"}
            >
              <Cascader 
                changeOnSelect
                allowClear={false}
                value={cascaderValue}
                popupVisible={cascaderIsShow}
                showSearch={{ filter }}
                onChange={onCascaderChange}
                options={allCategoriesList} 
                onFocus={onFocusCascader}
                placeholder="Ketik dan cari / pilih Kategori" 
                popupClassName="cascader-category-menus"
              />
              <ErrorTooltip item={item_sub_category_id} />
            </Form.Item>
            <Form.Item 
              label="Brand"
              validateStatus={!brand_id.isValid && brand_id.message && "error"}
            >
              <Select
                showSearch
                name="brand_id"
                placeholder="Buat Brand"
                value={brand_id.value}
                onFocus={() => fetchBrands()}
                onSelect={e => onInformationProductChange(e, "brand_id")}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {brandsData.map(data => (
                  <Select.Option value={data.id} key={data.id}>{data.name}</Select.Option>
                ))}
              </Select>
              <ErrorTooltip item={brand_id} />
            </Form.Item>
            <Form.Item 
              required
              label="Kondisi" 
              validateStatus={!condition.isValid && condition.message && "error"}
            >
              <Select 
                name="condition"
                placeholder="Kondisi produk" 
                value={condition.value}
                onSelect={e => onInformationProductChange(e, "condition")}
              >
                <Select.Option value={true}>Baru</Select.Option>
                <Select.Option value={false}>Bekas</Select.Option>
              </Select>
              <ErrorTooltip item={condition} />
            </Form.Item>
          </Form>

        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm card-add-product">
        <Card.Body className="p-3 border-bottom">
          <h5 className="mb-0 fs-16-s">Informasi Penjualan</h5>
        </Card.Body>
        <Card.Body className="p-3">

          {!isActiveVariation.active && (
            <Form layout="vertical" {...formItemLayout}>
              <Form.Item 
                required
                label="Harga" 
                validateStatus={!va1_price.isValid && va1_price.message && "error"}
              >
                <div className="ant-input-group-wrapper">
                  <div className="ant-input-wrapper ant-input-group">
                    <span className="ant-input-group-addon noselect">Rp</span>
                    <InputNumber
                      min={1}
                      name="va_1price"
                      className="w-100 bor-left-rad-0 h-33-custom-input"
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                      parser={value => value.replace(/\Rp\s?|(\.*)/g, '')}
                      value={va1_price.value}
                      onChange={e => onNoVariantChangeHandler(e, "va1_price")}
                    />
                  </div>
                </div>
                <ErrorTooltip item={va1_price} />
              </Form.Item>

              <Form.Item 
                required
                label="Stok" 
                validateStatus={!va1_stock.isValid && va1_stock.message && "error"}
              >
                <InputNumber 
                  min={0} 
                  name="va1_stock"
                  placeholder="Jumlah Stok"
                  className="w-100 h-33-custom-input" 
                  value={va1_stock.value}
                  onChange={e => onNoVariantChangeHandler(e, "va1_stock")}
                />
                <ErrorTooltip item={va1_stock} />
              </Form.Item>

              <Form.Item 
                label="Kode Variasi"
                validateStatus={!va1_code.isValid && va1_code.message && "error"}
              >
                <Input 
                  className="h-35" 
                  name="va1_code"
                  placeholder="Kode Variasi" 
                  value={va1_code.value}
                  onChange={e => onNoVariantChangeHandler(e)}
                />
                <ErrorTooltip item={va1_code} />
              </Form.Item>

              <Form.Item 
                label="Barcode" 
                className="mb-4"
                validateStatus={!va1_barcode.isValid && va1_barcode.message && "error"}
              >
                <Input 
                  className="h-35" 
                  name="va1_barcode"
                  placeholder="Barcode" 
                  value={va1_barcode.value}
                  onChange={e => onNoVariantChangeHandler(e)}
                />
                <ErrorTooltip item={va1_barcode} />
              </Form.Item>

            </Form>
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
            initialFetch={{ isInit: false, dataVariant: null }}
            setInitialFetch={() => {}}
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
        <Button onClick={resetAllData}>Batal</Button>
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

export default withAuth(NewProduct)
