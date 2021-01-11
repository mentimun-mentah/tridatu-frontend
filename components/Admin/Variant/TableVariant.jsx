import { useState, useEffect } from 'react'
import { Table, Input, Form, InputNumber, Row, Col } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons'

import Card from 'react-bootstrap/Card'
import Media from 'react-bootstrap/Media'
import ButtonColor from "antd-button-color"
import isIn from 'validator/lib/isIn'
import isEmpty from 'validator/lib/isEmpty'

import makeid from 'lib/makeid'
import getIndex from 'lib/getIndex'
import EditableCell from 'components/Admin/Variant/Cell'
import ErrorTooltip from "components/ErrorMessage/Tooltip";
import { formVariantLayout, createNewArr } from 'data/productsAdmin'
import { formImage } from 'formdata/formImage'

const emptyMessage = "Variasi tidak boleh kosong"
const emptyColumnMessage = "Kolom tidak boleh kosong"
const duplicateMessage = "Pilihan variasi harus berbeda."
const stockMessage = "Stok tidak boleh kurang dari 0."
const priceMessage = "Harga harus lebih dari 1."

const nameTitle1 = "Masukkan Nama Variasi, contoh: Warna, dll."
const nameTitle2 = "Masukkan Nama Variasi, contoh: Ukuran, dll."
const nameVariant1 = "Masukkan Pilihan Variasi, contoh: Merah, dll."
const nameVariant2 = "Masukkan Pilihan Variasi, contoh: S, M, dll."
const maxNameTitle = 15, maxNameVariant = 20, maxCode = 50;

const arrProp = ["price", "stock", "code", "barcode"]
const initialValue = { value: "", isValid: true, message: null }
const additional = { price: initialValue, stock: initialValue, code: initialValue, barcode: initialValue } 
const components = { body: { cell: EditableCell } };
const CountChar = ({children}) => <span className="text-muted noselect border-left pl-2 fs-12">{children}</span>

const TableVariant = ({
  isActiveVariation, setIsActiveVariation, dataSource, setDataSource, columns, setColumns, vaOption, setVaOption, 
  imageVariants, setImageVariants, onRemoveVariant
}) => {
  const [count, setCount] = useState(0)
  // const [columns, setColumns] = useState(initialColumn)
  // const [dataSource, setDataSource] = useState([])
  // const [vaOption, setVaOption] = useState({ va1Option: [], va2Option: [], va1Total: 0, va2Total: 0 })
  // const [isActiveVariation, setIsActiveVariation] = useState({ active: false, countVariation: 0 })
  const [infoVariant, setInfoVariant] = useState(additional)
  const [isSetAll, setIsSetAll] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { countVariation } = isActiveVariation
  const { va1Option, va2Option, va1Total, va2Total } = vaOption

  const resetValidation = () => {
    const state = JSON.parse(JSON.stringify(dataSource));
    for (let key in state) {
      for(let prop of arrProp){
        if(state[key][prop].hasOwnProperty("isValid")){
          state[key][prop].isValid = true
          state[key][prop].message = null
        }
      }
    }
    setDataSource(state)
  }

  const addVariant = (variant) => {
    setIsSetAll(false)
    const dataLength = dataSource.length
    const va2Length = va2Option.length
    if(variant == 1){
      const data = {
        ...vaOption,
        va1Option: [
          ...va1Option, {
            key: `va${variant}_option${dataLength+1+count}_${makeid(10)}`, 
            va1_option: { value: "", isValid: true, message: null }, 
            ...additional
          }
        ],
        va1Total: va1Total + 1
      }
      setVaOption(data)
      const dataImgVariants = {
        ...imageVariants,
        file: { value: [...imageVariants.file.value, {}], isValid: true, message: null }
      }
      setImageVariants(dataImgVariants)

    }
    if(variant == 2){
      const data = {
        ...vaOption,
        va2Option: [
          ...va2Option, {
            key: `va${variant}_option${va2Length}_${makeid(10)}`, 
            va2_option: { value: "", isValid: true, message: null }, 
            ...additional
          }
        ],
        va2Total: va2Total + 1
      }
      setVaOption(data)
    }
    resetValidation()
  }

  const addColumVariantHandler = (variant) => {
    // const copyColumns = columns.splice(0)
    const copyColumns = [...columns]
    let data = {
      title: `Nama`,
      dataIndex: `va${variant}_option`,
      key: `va${variant}_option`,
      fixed: 'left',
      width: 152,
      align: "center",
      isValid: true,
      message: null,
      render: (value) => value,
    }
    if(variant == 2){
      copyColumns[0] = {
        ...copyColumns[0],
        fixed: 'left',
        width: 150,
        render: (value, row) => {
          return {
            children: value,
            props: { rowSpan: row.rowSpan }
          }
        } // render
      }
    }
    setColumns(copyColumns)
    copyColumns.splice(variant-1, 0, data)
  }

  const activeVariantHandler = (variant) => {
    setIsActiveVariation({ ...isActiveVariation, active: true, countVariation: countVariation + 1 })
    addColumVariantHandler(variant)
    addVariant(variant)
    setIsSetAll(false)
  }

  const onVariantHeadChange = valKey => e => {
    const value = e.target.value
    const idx = getIndex(valKey, columns, 'key')
    const listVariantHeads = []
    for(let i = 0; i < countVariation; i++){
      listVariantHeads.push(columns[i].title)
    }

    let newColumns = [...columns]
    if(isEmpty(value || "", { ignore_whitespace: true })){
      newColumns[idx].title = value || "Nama"
      newColumns[idx].isValid = false
      newColumns[idx].message = emptyMessage
      setColumns(newColumns)
    } else {
      newColumns[idx].title = value || "Nama"
      newColumns[idx].isValid = true
      newColumns[idx].message = null
      setColumns(newColumns)
    }
    if(value && isIn(value, listVariantHeads)){
      newColumns[idx].title = value || "Nama"
      newColumns[idx].isValid = false
      newColumns[idx].message = duplicateMessage
      setColumns(newColumns)
    }
  }

  const onValidateVariantHeadCheck = valKey => e => {
    const value = e.target.value
    const idx = getIndex(valKey, columns, 'key')

    let newColumns = [...columns]
    if(isEmpty(value || "", { ignore_whitespace: true })){
      newColumns[idx].title = value || "Nama"
      newColumns[idx].isValid = false
      newColumns[idx].message = emptyMessage
      setColumns(newColumns)
    }
  }

  const onVariantOptionChange = (idx, variant) => e => {
    const value = e.target.value
    const listVariants = vaOption[`va${variant}Option`].map(data => data[`va${variant}_option`].value)

    let newVaOption = [...vaOption[`va${variant}Option`]]
    if(isEmpty(value || "", { ignore_whitespace: true })){
      newVaOption[idx][`va${variant}_option`].value = value
      newVaOption[idx][`va${variant}_option`].isValid = false
      newVaOption[idx][`va${variant}_option`].message = emptyMessage 
      setVaOption({ ...vaOption, [`va${variant}Option`]: newVaOption })
    } else {
      newVaOption[idx][`va${variant}_option`].value = value
      newVaOption[idx][`va${variant}_option`].isValid = true
      newVaOption[idx][`va${variant}_option`].message = null
      setVaOption({ ...vaOption, [`va${variant}Option`]: newVaOption })
    }
    if(value && isIn(value, listVariants)){
      newVaOption[idx][`va${variant}_option`].value = value
      newVaOption[idx][`va${variant}_option`].isValid = false
      newVaOption[idx][`va${variant}_option`].message = duplicateMessage
      setVaOption({ ...vaOption, [`va${variant}Option`]: newVaOption })
    }
  }

  const onValidateVariantCheck = (idx, variant) => e => {
    const value = e.target.value

    let newVaOption = [...vaOption[`va${variant}Option`]]
    if(isEmpty(value || "", { ignore_whitespace: true })){
      newVaOption[idx][`va${variant}_option`].value = value
      newVaOption[idx][`va${variant}_option`].isValid = false
      newVaOption[idx][`va${variant}_option`].message = emptyMessage 
      setVaOption({ ...vaOption, [`va${variant}Option`]: newVaOption })
    }
  }

  const deleteGroupVariantsHandler = (variant) => {
    setIsActiveVariation({ ...isActiveVariation, active: countVariation == 1 ? false : true,  countVariation: countVariation - 1 })
    if(countVariation == 1) {
      setCount(0)
      setInfoVariant(additional)
    }

    let oldVa2 = [...vaOption.va2Option]
    let oldColumns = [...columns]; // make a separate copy of the array
    oldColumns.splice(variant-1, 1);
    setColumns(oldColumns);

    if(variant == 1){
      for(let i = 0; i < imageVariants.file.value.length; i++){
        onRemoveVariant(i)
      }
    }

    if(variant == 1 && va2Total > 0){
      oldVa2.map(obj => {
        obj[`va1_option`] = obj[`va2_option`]
        delete obj[`va2_option`]
        return obj
      })

      oldColumns[0] = {
        ...oldColumns[0],
        dataIndex: `va${variant}_option`,
        key: `va${variant}_option`,
      }

      const data = {
        ...vaOption, 
        va1Option: oldVa2, 
        va2Option: [],
        va1Total: va2Total,
        va2Total: 0,
      }

      setVaOption(data);
      setColumns(oldColumns);

      const emptyObj = {}
      const dataImgVariants = {
        ...imageVariants,
        file: { value: [...Array(va2Total)].map(() => emptyObj) , isValid: true, message: null }
      }
      setImageVariants(dataImgVariants)
    }

    if(variant == 1 && va2Total == 0){
      setVaOption({ ...vaOption, va1Option: [], va1Total: 0, va2Total: 0 })
      setImageVariants(formImage)
    }

    if(variant == 2){
      oldColumns.map(obj => {
        delete obj.render
        return obj
      })
      setVaOption({ ...vaOption, va2Option: [], va2Total: 0 });
      setColumns(oldColumns);
    }
  }


  const deleteVariantHandler = (variant, index) => {
    resetValidation()
    setIsDeleting(true)
    if(variant == 1){
      onRemoveVariant(index)
    }
    if(countVariation == 1 && variant == 1) {
      setDataSource(dataSource.filter((_, i) => i !== index))
    }
    if(countVariation == 2 && variant == 1) {
      setDataSource(dataSource.filter(data => data.va1_key !== index))
    }
    if(countVariation == 2 && variant == 2) {
      setDataSource(dataSource.filter(data => data.va2_key !== index))
    }
    const data = {
      ...vaOption,
      [`va${variant}Option`]: vaOption[`va${variant}Option`].filter((_, i) => i !== index),
      [`va${variant}Total`]: vaOption[`va${variant}Total`] - 1
    }
    setVaOption(data)
    return
  }

  const infoVariantChange = (e, item) => {
    const name = !item && e.target.name;
    const value = !item && e.target.value;

    if(item){
      const data = {
        ...infoVariant,
        [item]: { value: e, isValid: true, message: null }
      }
      setInfoVariant(data)
    }
    else{
      const data = {
        ...infoVariant,
        [name]: { value: value, isValid: true, message: null }
      }
      setInfoVariant(data)
    }
  }

  const setInfoVariantHandler = () => {
    setIsSetAll(true)
    if(countVariation == 2){
      const { price, stock, code, barcode } = infoVariant
      let oldVa2 = [...va2Option]

      oldVa2.map(obj => {
        if(price.value) obj.price = price
        if(stock.value || stock.value == 0) obj.stock = stock
        if(code.value) obj.code = code
        if(barcode.value) obj.barcode = barcode
        return obj
      })
      setVaOption({ ...vaOption, va2Option: oldVa2 })
    }
  }

  useEffect(() => {
    let variants = []
    const copyDataSource = [...dataSource]

    for(let [key1, val1] of Object.entries(va1Option)){
      let variant_tmp = []
      if(vaOption.va2Option.length){
        for(let [key2, val2] of Object.entries(va2Option)){
          const initialData = {
            key: val1.key+val2.key,
            va1_key: +key1,
            va2_key: +key2,
            va1_option: val1.va1_option.value ? val1.va1_option.value : `Pilihan ${+key1+1}`,
            va2_option: val2.va2_option.value ? val2.va2_option.value : `Pilihan ${+key2+1}`,
          }
          if(isDeleting || isSetAll){
            variant_tmp.push({
              ...initialData,
            })
            isSetAll && setIsSetAll(false)
          } else {
            if(!isSetAll){
              variant_tmp.push({
                ...initialData,
                price: { value: val2.price.value, isValid: true, message: null },
                stock: { value: val2.stock.value, isValid: true, message: null },
                code: { value: val2.code.value, isValid: true, message: null },
                barcode: { value: val2.barcode.value, isValid: true, message: null },
              })
            }
          }
        }
      }
      else{
        const initialData = {
          key: val1.key,
          va1_option: val1.va1_option.value ? val1.va1_option.value : `Pilihan ${+key1+1}`,
        }
        if(isSetAll && !isDeleting){
          const { price, stock, code, barcode } = infoVariant
          const priceVal = price.value
          const stockVal = stock.value
          const codeVal = code.value
          const barcodeVal = barcode.value
          const stockDSValue = copyDataSource[key1].stock.value

          let finalStockValue = 0
          if(stockVal === null){
            if(stockDSValue !== ""){
              finalStockValue = stockDSValue
            } else {
              finalStockValue = 0
            }
          } else if(stockVal === "") {
            if(stockDSValue !== ""){
              finalStockValue = stockDSValue
            } else {
              finalStockValue = 0
            }
          } else {
            finalStockValue = stockVal
          }

          variant_tmp.push({
            ...initialData,
            price: { 
              value: priceVal ? priceVal : copyDataSource[key1].price.value, 
              isValid: priceVal ? true : copyDataSource[key1].price.isValid, 
              message: priceVal ? null : copyDataSource[key1].price.message
            },
            stock: { 
              // value: stockVal !== "" ? stockVal : copyDataSource[key1].stock.value ? copyDataSource[key1].stock.value : stockDataSource,
              // value: stockVal || stockVal == 0 ? stockVal : copyDataSource[key1].stock.value, 
              value: finalStockValue,
              isValid: stockVal ? true : copyDataSource[key1].stock.isValid, 
              message: stockVal ? null : copyDataSource[key1].stock.message
            },
            code: { 
              value: codeVal ? codeVal : copyDataSource[key1].code.value, 
              isValid: codeVal ? true : copyDataSource[key1].code.isValid, 
              message: codeVal ? null : copyDataSource[key1].code.message
            },
            barcode: { 
              value: barcodeVal ? barcodeVal : copyDataSource[key1].barcode.value, 
              isValid: barcodeVal ? true : copyDataSource[key1].barcode.isValid, 
              message: barcodeVal ? null : copyDataSource[key1].barcode.message
            },
          })
          isSetAll && setIsSetAll(false)
        }
        if(isDeleting){
          variant_tmp.push({
            ...initialData,
          })
        } else {
          if(!isSetAll){
            variant_tmp.push({
              ...initialData,
              price: { value: val1.price.value, isValid: true, message: null },
              stock: { value: val1.stock.value, isValid: true, message: null },
              code: { value: val1.code.value, isValid: true, message: null },
              barcode: { value: val1.barcode.value, isValid: true, message: null },
            })
          }
        }
      }
      for(let item of variant_tmp){
        variants.push(item)
      }
    }

    if(countVariation == 2 && isSetAll){
      const tmpVar = copyDataSource.map(data => data.key)
      const { price, stock, code, barcode } = infoVariant
      const priceVal = price.value
      const stockVal = stock.value
      const codeVal = code.value
      const barcodeVal = barcode.value

      for(var i = 0; i < variants.length; i++){
        const dataPrice = copyDataSource[getIndex(tmpVar[i], copyDataSource, "key")].price
        const dataStock = copyDataSource[getIndex(tmpVar[i], copyDataSource, "key")].stock
        const dataCode = copyDataSource[getIndex(tmpVar[i], copyDataSource, "key")].code
        const dataBarcode = copyDataSource[getIndex(tmpVar[i], copyDataSource, "key")].barcode

        let finalStockValue = 0
        if(stockVal === null){
          if(dataStock.value !== ""){
            finalStockValue = dataStock.value
          } else {
            finalStockValue = 0
          }
        } else if(stockVal === "") {
          if(dataStock.value!== ""){
            finalStockValue = dataStock.value
          } else {
            finalStockValue = 0
          }
        } else {
          finalStockValue = stockVal
        }

        variants[i] = {
          ...variants[i],
          price: { 
            value: priceVal ? priceVal : dataPrice.value, 
            isValid: priceVal ? true : dataPrice.isValid, 
            message: priceVal ? null : dataPrice.message
          },
          stock: { 
            // value: stockVal || stockVal == 0 ? stockVal : dataStock.value, 
            value: finalStockValue, 
            isValid: stockVal ? true : dataStock.isValid, 
            message: stockVal ? null : dataStock.message
          },
          code: { 
            value: codeVal ? codeVal : dataCode.value, 
            isValid: codeVal ? true : dataCode.isValid, 
            message: codeVal ? null : dataCode.message
          },
          barcode: { 
            value: barcodeVal ? barcodeVal : dataBarcode.value, 
            isValid: barcodeVal ? true : dataBarcode.isValid, 
            message: barcodeVal ? null : dataBarcode.message
          }
        }
      }
    }

    if(isDeleting){
      isSetAll && setIsSetAll(false)
      const tmpVar = copyDataSource.map(data => data.key)
      const tmpDataSource = variants.map(data => data.key)

      for(var i = 0; i < variants.length; i++){
        for(let val of tmpVar){
          if(variants[i].key === val){
            for(let prop of arrProp){
              variants[i][prop] = {
                value:   copyDataSource[getIndex(val, copyDataSource, "key")][prop].value,
                isValid: true,
                message: null,
              }
            }
          }
        }
        for(let val of tmpDataSource.filter(x => !tmpVar.includes(x))){
          if(variants[i].key === val){
            for(let prop of arrProp){
              variants[i][prop] = {
                value: "",
                isValid: true,
                message: null,
              }
            }
          }
        }
      }
      setIsDeleting(false)
    }

    if(!isSetAll && !isDeleting){
      const tmpVar = copyDataSource.map(data => data.key)
      const tmpDataSource = variants.map(data => data.key)

      for(var i = 0; i < variants.length; i++){
        for(let val of tmpVar){
          if(variants[i].key === val){
            for(let prop of arrProp){
              variants[i][prop] = {
                value: copyDataSource[getIndex(val, copyDataSource, "key")][prop].value,
                isValid: copyDataSource[getIndex(val, copyDataSource, "key")][prop].isValid,
                message: copyDataSource[getIndex(val, copyDataSource, "key")][prop].message,
              }
            }
          }
        }
        for(let val of tmpDataSource.filter(x => !tmpVar.includes(x))){
          if(variants[i].key === val){
            variants[i]['price'] = { value: "", isValid: true, message: null, }
            variants[i]['stock'] = { value: "0", isValid: true, message: null, }
            variants[i]['code'] = { value: "", isValid: true, message: null, }
            variants[i]['barcode'] = { value: "", isValid: true, message: null, }
          }
        }
      }
    }

    setDataSource(variants)
  },[vaOption, isDeleting, isSetAll])

  const onTableChange = (e, item, index) => {
    const newData = [...dataSource]
    const name = !item && e.target.name;
    const value = !item && e.target.value;

    if(item) {
      newData[index][item].value = e
      newData[index][item].isValid = true
      newData[index][item].message = null
    }
    else {
      newData[index][name].value = value
      newData[index][name].isValid = true
      newData[index][name].message = null
    }
    if((item == "stock" && e < 0) || (item == "price" && e < 1)) {
      newData[index][item].value = e
      newData[index][item].isValid = false
      newData[index][item].message = item == "stock" ? stockMessage : priceMessage
    }
    if(item && e !== 0 && isEmpty(e ? e.toString() : "", { ignore_whitespace: true })) {
      newData[index][item].value = e
      newData[index][item].isValid = false
      newData[index][item].message = emptyColumnMessage
    }

    setDataSource(newData)
  }

  const onValidateTableVariantCheck = (e, item, index) => {
    const newData = [...dataSource]

    if(item && isEmpty(e.target.value || "", { ignore_whitespace: true })) {
      newData[index][item].isValid = false
      newData[index][item].message = emptyColumnMessage
    }
    setDataSource(newData)
  }

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;

    return {
      ...col,
      onCell: (record, index) => ({
        record,
        index: index,
        title: col.title,
        editable: col.editable,
        dataIndex: col.dataIndex,
        inputType: col.inputType,
        onChange: e => onTableChange(e, !isIn(col.inputType, ["code", "barcode"]) && col.inputType, index),
        onBlur: e => onValidateTableVariantCheck(e, !isIn(col.inputType, ["code", "barcode"]) && col.inputType, index),
        maxCode: maxCode
      }),
    };
  });

  const ButtonAddVariant = ({ count, children }) => (
    <Form.Item className="my-1">
      <Media className="align-items-center">
        <ButtonColor 
          block with="dashed" 
          type="primary" 
          className="h-35" 
          icon={<PlusCircleOutlined />} 
          onClick={() => addVariant(count+1)}
        >
          {children}
        </ButtonColor>
        <Media.Body> <div style={{ width: 22 }} /> </Media.Body>
      </Media>
    </Form.Item>
  )

  return(
    <>
      <Row>
        <Col xs={24} sm={24} md={18} lg={16} xl={14}>
          {[...Array(countVariation)].map((_, i) => (
            <React.Fragment key={i}>
            <Card.Body className="p-3 bg-light mb-3 bor-rad-5px">
              <p className="fs-15 mb-3 w-100 fw-500">
                Variasi {i+1}
                <span className="hover-pointer text-dark float-right" onClick={() => deleteGroupVariantsHandler(i+1)}>
                  <i className="fal fa-times fs-16" />
                </span>
              </p>
              <Form layout="vertical" {...formVariantLayout} name="head_title">
                <Form.Item 
                  className="mb-3"
                  label="Nama"
                  name={`va${i+1}_option`}
                  validateStatus={!columns[i].isValid && columns[i].message && "error"}
                >
                  <Media className="align-items-center">
                    <Input 
                      name={`va${i+1}_name`}
                      className="h-35"
                      value={columns[i].title.split(" ")[0] === "Nama" ? "" : columns[i].title} 
                      placeholder={ i == 0 ? nameTitle1 : i == 1 ? nameTitle2 : "" } 
                      onBlur={onValidateVariantHeadCheck(`va${i+1}_option`)}
                      onChange={onVariantHeadChange(`va${i+1}_option`)}
                      maxLength={maxNameTitle}
                      suffix={ columns[i].title.split(" ")[0] === "Nama" ? <CountChar>0/{maxNameTitle}</CountChar> : <CountChar>{columns[i].title.length}/{maxNameTitle}</CountChar> }
                    />
                    <ErrorTooltip item={columns[i]} />
                    <Media.Body>
                      <div style={{ width: 22 }} />
                    </Media.Body>
                  </Media>
                </Form.Item>
              </Form>

              <Form layout="vertical" {...formVariantLayout} name={`variants_${i+1}`}>
                {/* VARIANT 1 */}
                {i == 0 && [...Array(va1Total)].map((_,idx) => (
                  <Form.Item 
                    key={idx}
                    label={idx === 0 && 'Pilihan'} 
                    className="my-2 w-100" 
                    name={`variants_${idx+1}`} 
                    validateStatus={!va1Option[idx].va1_option.isValid && va1Option[idx].va1_option.message && "error"}
                  >
                    <Media className="align-items-center">
                      <Input 
                        className="h-35" 
                        name="va1_option"
                        value={va1Option[idx].va1_option.value} 
                        onChange={onVariantOptionChange(idx, i+1)}
                        onBlur={onValidateVariantCheck(idx, i+1)}
                        placeholder={ i == 0 ? nameVariant1 : i == 1 ? nameVariant2 : "" } 
                        maxLength={maxNameVariant}
                        suffix={<CountChar>{va1Option[idx].va1_option.value.length}/{maxNameVariant}</CountChar>}
                      />
                      <ErrorTooltip item={va1Option[idx].va1_option} />
                      <Media.Body> 
                        {idx == 0 && <div style={{ width: 22 }} />} {idx == 1 && <div style={{ width: 22 }} />}
                        {va1Total > 1 ? (
                        <i className="fal fa-trash-alt ml-2 hover-pointer text-secondary" onClick={() => deleteVariantHandler(i+1, idx)} />
                        ) : null}
                      </Media.Body> 
                    </Media>
                  </Form.Item>
                ))}

                {/* VARIANT 2 */}
                {i == 1 && [...Array(va2Total)].map((_,idx) => (
                  <Form.Item 
                    key={idx}
                    label={idx === 0 && 'Pilihan'} 
                    className="my-2 w-100" 
                    name={`variants_${idx+1}`} 
                    validateStatus={!va2Option[idx].va2_option.isValid && va2Option[idx].va2_option.message && "error"}
                  >
                    <Media className="align-items-center">
                      <Input 
                        className="h-35" 
                        name="va2_option"
                        value={va2Option[idx].va2_option.value} 
                        onChange={onVariantOptionChange(idx, i+1)}
                        onBlur={onValidateVariantCheck(idx, i+1)}
                        placeholder={ i == 0 ? nameVariant1 : i == 1 ? nameVariant2 : "" }
                        maxLength={maxNameVariant}
                        suffix={<CountChar>{va2Option[idx].va2_option.value.length}/{maxNameVariant}</CountChar>}
                      />
                      <ErrorTooltip item={va2Option[idx].va2_option} />
                      <Media.Body> 
                        {idx == 0 && <div style={{ width: 22 }} />} {idx == 1 && <div style={{ width: 22 }} />}
                        {va2Total > 1 ? (
                        <i className="fal fa-trash-alt ml-2 hover-pointer text-secondary" onClick={() => deleteVariantHandler(i+1, idx)} />
                        ) : null}
                      </Media.Body>
                    </Media>
                  </Form.Item>
                ))}

                {i == 0 && va1Total < 20 && <ButtonAddVariant count={i}>Tambahkan Pilihan ({va1Total+1}/20)</ButtonAddVariant> }
                {i == 1 && va2Total < 20 && <ButtonAddVariant count={i}>Tambahkan Pilihan ({va2Total+1}/20)</ButtonAddVariant> }

              </Form>

            </Card.Body>
            </React.Fragment>
          ))}

          {countVariation < 2 && (
            <Card.Body className="p-0 pb-1">
              <p className="fs-14 mb-3 w-100">Variasi {countVariation+1 == 2 && countVariation+1}</p>
              <ButtonColor
                block with="dashed" type="primary" 
                className="h-35" icon={<PlusCircleOutlined />}
                onClick={() => activeVariantHandler(countVariation+1)}
              >
                {countVariation < 1 ? "Aktifkan Variasi" : "Tambah"}
              </ButtonColor>
            </Card.Body>
          )}
        </Col>
      </Row>

      {isActiveVariation.active && (
        <>
          <Card.Body className="p-0 py-3">
            <Form layout="vertical">
              <Form.Item className="mb-0" label="Informasi Variasi" >
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={24} md={17} lg={18} xl={18}>
                    <Input.Group compact className="info-variasi-input">
                      <div className="ant-input-group-wrapper" style={{ width: 'calc(100%/4)' }}>
                        <div className="ant-input-wrapper ant-input-group" style={{ zIndex: 1 }}>
                          <span className="ant-input-group-addon noselect">Rp</span>
                          <InputNumber
                            min={1}
                            name="price"
                            placeholder="Harga"
                            value={infoVariant.price.value}
                            onChange={e => infoVariantChange(e, "price")}
                            className="w-100 bor-left-rad-0 bor-right-rad-0 h-33-custom-input h-35"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                            parser={value => value.replace(/\Rp\s?|(\.*)/g, '')}
                          />
                        </div>
                      </div>
                      <InputNumber 
                        min={0} 
                        name="stock"
                        className="h-35" 
                        placeholder="Stok" 
                        value={infoVariant.stock.value}
                        onChange={e => infoVariantChange(e, "stock")}
                        style={{ width: 'calc(100%/4)', marginLeft: '-1px' }} 
                      />
                      <Input 
                        name="code"
                        className="h-35" 
                        placeholder="Kode" 
                        maxLength={maxCode}
                        value={infoVariant.code.value}
                        onChange={e => infoVariantChange(e)}
                        style={{ width: 'calc(100%/4)' }} 
                      />
                      <Input 
                        name="barcode"
                        className="h-35" 
                        placeholder="Barcode" 
                        maxLength={maxCode}
                        value={infoVariant.barcode.value}
                        onChange={e => infoVariantChange(e)}
                        style={{ width: 'calc(100%/4)', borderTopRightRadius: '.25rem', borderBottomRightRadius: '.25rem' }} 
                      />
                    </Input.Group>
                  </Col>

                  <Col xs={24} sm={24} md={7} lg={6} xl={6}>
                    <ButtonColor
                      block
                      disabled={!infoVariant.price.value && !infoVariant.stock.value && !infoVariant.code.value && !infoVariant.barcode.value}
                      type="primary" 
                      className="h-35"
                      onClick={setInfoVariantHandler}
                    >
                      Terapkan ke Semua
                    </ButtonColor>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </Card.Body>

          <Card.Body className="p-0">
            <Table
              bordered
              pagination={false} 
              className="variant-table"
              size="middle"
              rowClassName={() => 'variant-row'}
              components={components}
              columns={mergedColumns} 
              dataSource={createNewArr(dataSource)} 
            />
          </Card.Body>
        </>
      )}

      <style jsx>{`
        :global(.ant-input-number-input){
          position: relative;
        }
        :global(.info-variasi-input .ant-input-number:focus, .info-variasi-input .ant-input-number-focused, .info-variasi-input .ant-input-number:hover){
          z-index: 3;
        }
        :global(.info-variasi-input .ant-input:focus, .info-variasi-input .ant-input-focused, .info-variasi-input .ant-input:focus){
          box-shadow: none;
        }
        :global(.variant-table .ant-table-tbody > tr.ant-table-row:hover > td){
          background: transparent;
        }
        :global(.variant-row > td:first-child){
          font-size: 13px;
          padding: 5px 8px !important;
        }
      `}</style>
    </>
  )
}

export default TableVariant
