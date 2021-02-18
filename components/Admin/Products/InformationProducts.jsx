import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { Form, Input, Select, Cascader } from 'antd'
import { AnimatePresence, motion } from "framer-motion";


import _ from 'lodash'
import Card from 'react-bootstrap/Card'
import axios, { jsonHeaderHandler, formHeaderHandler, resNotification, signature_exp } from 'lib/axios'

import { formImage, formImageIsValid } from 'formdata/formImage'
import { imagePreview, uploadButton } from 'lib/imageUploader'
import { imageValidationProduct, multipleImageValidation } from 'lib/imageProductUploader'

import ErrorTooltip from "components/ErrorMessage/Tooltip";

import { formItemLayout, initialColumn } from 'data/productsAdmin'

import { formNoVariantIsValid, formVa1OptionSingleVariantIsValid, formTableIsValid, formVariantTitleIsValid } from 'formdata/formProduct'
import { formVa2OptionDoubleVariantIsValid, formTitleIsValid } from 'formdata/formProduct'

import * as actions from "store/actions";

const InformationProducts = ({ 
  informationProduct, onInformationProductChange, cascaderValue, cascaderIsShow, onCascaderChange, allCategoriesList, onFocusCascader, 
  filter 
}) => {
  const dispatch = useDispatch()

  const { name, desc, item_sub_category_id, brand_id, condition } = informationProduct;

  const brandsData = useSelector(state => state.brand.brand)

  const fetchBrands = () => {
    dispatch(actions.getBrand())
  }

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
                <Select.Option value="" key={null}>Tidak ada brand</Select.Option>
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
    </>
  )
}

export default InformationProducts
