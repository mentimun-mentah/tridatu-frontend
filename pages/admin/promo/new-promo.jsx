import { withAuth } from 'lib/withAuth'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Form, Input, Radio, Popover, Space, Upload, DatePicker } from 'antd'
import { LoadingOutlined } from "@ant-design/icons";

import id from 'locales/id/admin/promo/new-promo'
import en from 'locales/en/admin/promo/new-promo'

import _ from 'lodash'
import moment from 'moment'
import dynamic from 'next/dynamic'
import isIn from 'validator/lib/isIn'
import isEmpty from 'validator/lib/isEmpty'
import isLength from 'validator/lib/isLength'
import Button from 'antd-button-color'
import Card from 'react-bootstrap/Card'
import ErrorMessage from "components/ErrorMessage";

import { formImage, formImageIsValid } from 'formdata/formImage'
import { columnsVoucher, columnsOngkir } from 'data/voucher'
import { imageValidation, uploadButton } from 'lib/imageUploader'
import { dateTimeFormat, disabledDate, disabledRangeSameTime } from 'lib/utility'
import axios, { formHeaderHandler, resNotification, signature_exp } from 'lib/axios'
import { formPromo, formTermsCondition, formPromoIsValid } from 'formdata/formPromo'

import AddStyleAdmin from 'components/Admin/addStyle'
const Editor = dynamic(import('../../../components/Editor'), { ssr: false })

import PageInfoPopover from 'components/Admin/Voucher/PageInfoPopover'

const NewPromo = () => {
  const router = useRouter()

  const { locale } = router
  const t = locale === "en" ? en : id

  const [loading, setLoading] = useState(false)
  const [imageList, setImageList] = useState(formImage)
  const [promo, setPromo] = useState(formPromo)
  const [termsCondition, setTermsCondition] = useState(formTermsCondition)

  const { name, desc, seen, period_start, period_end } = promo
  const { terms_condition } = termsCondition

  const onChangeHandler = e => {
    const name = e.target.name
    const value = e.target.value
    const data = {
      ...promo,
      [name]: {
        ...promo[name], value: value, isValid: true, message: null
      }
    }
    setPromo(data)
  }

  const onSeenChange = e => {
    const value = e.target.value
    const data = {
      ...promo,
      seen: { value: value, isValid: true, message: null },
      desc: { value: "", isValid: true, message: null },
    }
    setPromo(data)
    setImageList(formImage)
    setTermsCondition(formTermsCondition)
  }

  const onTermsConditionChange = val => {
    setTermsCondition({ terms_condition: { value: val, isValid: true, message: null } })
  }

  const dateChange = (_, dateStrings) => {
    let startVal = dateStrings[0]
    let endVal = dateStrings[1]

    if(moment(startVal) <= moment()) startVal = moment().add(15, "minute")
    if(!moment(endVal).diff(moment(startVal), 'days')) endVal = moment(startVal).add(1, "days")

    const data = {
      ...promo,
      period_start: { value: startVal, isValid: true, message: null },
      period_end: { value: moment(startVal).add(1, "days").format(dateTimeFormat), isValid: true, message: null },
    }
    setPromo(data)
  }

  const onOkDateChange = (date) => {
    let startVal = date[0] || ""
    let endVal = date[1] || ""

    if(moment(startVal) <= moment()) startVal = moment().add(15, "minute")
    if(!moment(endVal).diff(moment(startVal), 'days')) endVal = moment(startVal).add(1, "days")

    const data = {
      ...promo,
      period_start: { value: startVal, isValid: true, message: null },
      period_end: { value: endVal, isValid: true, message: null },
    }
    setPromo(data)
  }

  const imageChangeHandler = ({ fileList: newFileList }) => {
    const data = {
      ...imageList,
      file: { value: newFileList, isValid: true, message: null }
    }
    setImageList(data)
  };

  useEffect(() => {
    const start = moment().add(15, "minutes").format(dateTimeFormat)
    const data = {
      ...promo,
      period_start: { value: start, isValid: true, message: null },
      period_end: { value: moment(start).add(1, "days").format(dateTimeFormat), isValid: true, message: null },
    }
    setPromo(data)
  }, [])

  const resetAllHandler = () => {
    const start = moment().add(15, "minutes").format(dateTimeFormat)
    const inititalData = {
      ...formPromo,
      period_start: { value: start, isValid: true, message: null },
      period_end: { value: moment(start).add(1, "days").format(dateTimeFormat), isValid: true, message: null },
    }
    setPromo(inititalData)
    setImageList(formImage)
    setTermsCondition(formTermsCondition)
  }

  const onSubmitHandler = e => {
    e.preventDefault()
    if(formPromoIsValid(promo, setPromo, termsCondition, setTermsCondition, t)){
      setLoading(true)
      const formData = new FormData()
      formData.append("name", name.value);
      formData.append("seen", seen.value);
      formData.append("period_start", moment(period_start.value).format(dateTimeFormat));
      formData.append("period_end", moment(period_end.value).format(dateTimeFormat));

      if(seen.value){
        let plainText = terms_condition.value.replace(/<[^>]+>/g, '');
        let finalText = plainText.replace(/&nbsp;/g, " ");

        if(isEmpty(finalText)) finalText = finalText
        else {
          if(isLength(finalText, { min: 5, max: undefined })) finalText = terms_condition.value
          else finalText = finalText
        }

        formData.append("desc", desc.value);
        formData.append("terms_condition", finalText);

        if(formImageIsValid(imageList, setImageList, t.validation.empty_img)){
          _.forEach(imageList.file.value, file => {
            formData.append("image", file.originFileObj)
          })
        }
      }

      axios.post("/promos/create", formData, formHeaderHandler())
        .then(res => {
          setLoading(false)
          resetAllHandler()
          resNotification("success", "Success", res.data.detail)
        })
        .catch(err => {
          const errDetail = err.response.data.detail;
          const errName = ["The name has already been taken.", "Nama sudah dipakai."]
          setLoading(false)
          if(errDetail == signature_exp){
            resetAllHandler()
            resNotification("success", "Success", t.success_response)
          }
          else if(typeof(errDetail) === "string" && isIn(errDetail, errName)){
            const state = JSON.parse(JSON.stringify(promo));
            state.name.value = state.name.value
            state.name.isValid = false
            state.name.message = errDetail
            setPromo(state)
          }
          else if(typeof(errDetail) === "string" && !isIn(errDetail, errName)){
            resNotification("error", "Error", errDetail)
          }
          else{
            const promoState = JSON.parse(JSON.stringify(promo))
            const termsConditionState = JSON.parse(JSON.stringify(termsCondition))
            errDetail.map((data) => {
              const key = data.loc[data.loc.length - 1];
              if(promoState[key]){
                promoState[key].isValid = false
                promoState[key].message = data.msg
              }
              if(termsConditionState[key]){
                termsConditionState[key].isValid = false
                termsConditionState[key].message = data.msg
              }
              setPromo(promoState)
              setTermsCondition(termsConditionState)
            });
          }
        })
    }
  }

  return(
    <>
      <Card className="border-0 shadow-sm card-add-product">
        <Card.Body className="p-3 border-bottom">
          <h5 className="mb-0 fs-16-s">{t.basic_details.title}</h5>
        </Card.Body>
        <Card.Body className="p-3">
          <Form layout="vertical">
            <Form.Item 
              required
              label={t.basic_details.promo_name} 
              validateStatus={!name.isValid && name.message && "error"}
            >
              <Input name="name"
                value={name.value}
                onChange={onChangeHandler}
                placeholder={t.basic_details.promo_name}
              />
              {name.isValid ? (
                <small className="form-text text-left text-muted">
                  {t.basic_details.example_name}
                </small>
              ):(
                <ErrorMessage item={name} />
              )}
            </Form.Item>
            
            <Form.Item 
              required
              label={t.basic_details.claim_period} 
              validateStatus={(!period_start.isValid && period_start.message || !period_end.isValid && period_end.message) && "error"}
            >
              <DatePicker.RangePicker 
                showTime 
                inputReadOnly
                onChange={dateChange}
                onOk={onOkDateChange}
                format={dateTimeFormat}
                disabledDate={(current, start) => disabledDate(current, start)}
                disabledTime={(current, type) => disabledRangeSameTime(current, type, moment(period_start.value))}
                value={[period_start.value !== "" && moment(period_start.value), period_end.value !== "" && moment(period_end.value)]}
              />
              <span className="ml-2">WITA</span>
              <ErrorMessage item={period_start || period_end} />
            </Form.Item>

            <Form.Item 
              required 
              className="mb-0"
              label={t.basic_details.display_settings} 
              validateStatus={!seen.isValid && seen.message && "error"}
            >
              <Radio.Group name="seen" value={seen.value} onChange={onSeenChange}>
                <Radio value={true} className="noselect d-block h-30">
                  {t.basic_details.show_on_all_pages}
                  <Popover placement="bottomLeft" content={<PageInfoPopover t={t} />}>
                    <i className="fal fa-question-circle ml-1" />
                  </Popover>
                </Radio>
                <Radio value={false} className="noselect d-block h-30">
                  {t.basic_details.not_shown}
                  <Popover placement="bottomLeft" content={
                    <small className="form-text text-left text-muted mt-0 text-wrap text-center">
                      {t.basic_details.not_shown_info1} <br/>{t.basic_details.not_shown_info2}
                    </small>
                    }
                  >
                    <i className="fal fa-question-circle ml-1" />
                  </Popover>
                </Radio>
              </Radio.Group>
              <ErrorMessage item={seen} />
            </Form.Item>

          </Form>
        </Card.Body>
      </Card>

      {seen.value && (
        <Card className="border-0 shadow-sm card-add-product">
          <Card.Body className="p-3 border-bottom">
            <h5 className="mb-0 fs-16-s">{t.information_settings.title}</h5>
          </Card.Body>
          <Card.Body className="p-3">
            <Form layout="vertical">
              <Form.Item label={`${t.information_settings.promo_photos} (600 × 328 px)`} className="mb-0">
                <Upload
                  accept="image/*"
                  listType="picture-card"
                  className="avatar-uploader"
                  disabled={loading}
                  onChange={imageChangeHandler}
                  fileList={imageList.file.value}
                  beforeUpload={(f) => imageValidation(f, "image", "/promos/create", "post", () => {}, () => {}, "")}
                >
                  {imageList.file.value.length >= 1 ? null : uploadButton(loading)}
                </Upload>
              </Form.Item>
              <small className="text-muted fs-12">
                {t.validation.img_format} .jpg .jpeg .png<br/>
                {t.validation.img_size} 4 MB
              </small>

              <Form.Item 
                className="m-t-20"
                label={t.information_settings.promo_description}
                validateStatus={!desc.isValid && desc.message && "error"}
              >
                <Input.TextArea 
                  name="desc"
                  placeholder={t.information_settings.promo_description}
                  value={desc.value}
                  onChange={onChangeHandler}
                  autoSize={{ minRows: 8, maxRows: 10 }} 
                />
                <ErrorMessage item={desc} />
              </Form.Item>
              
              <Form.Item 
                label={t.information_settings.terms_conditions}
                validateStatus={!terms_condition.isValid && terms_condition.message && "error"}
              >
                <Editor 
                  initialValue={terms_condition.value}
                  setContent={onTermsConditionChange} 
                  height="200"
                />
                <ErrorMessage item={terms_condition} />
              </Form.Item>

            </Form>
          </Card.Body>
        </Card>
      )}

      <Space>
        <Button className="btn-tridatu" onClick={onSubmitHandler} disabled={loading}>
          {loading ? <LoadingOutlined /> : t.save}
        </Button>
        <Button onClick={resetAllHandler}>{t.cancel}</Button>
      </Space>

      <style jsx>{AddStyleAdmin}</style>
      <style jsx>{`
        :global(.voucher-radio-button-wrapper, .voucher-radio-button-wrapper:first-child, .ant-radio-button-wrapper:last-child){
          margin-right: 8px;
          margin-bottom: 8px;
          border-radius: .25rem;
          border-left-width: 1px!important;
          height: auto;
          padding: 5px 15px;
        }
        :global(.ant-radio-button-wrapper:last-child){
          margin-right: 0px;
        }
        :global(.voucher-radio-button-wrapper:hover){
          color: rgba(0, 0, 0, 0.85);
          box-shadow: rgb(49 53 59 / 16%) 0px 2px 6px 0px;
        }
        :global(
          .voucher-radio-button-wrapper:not(:first-child)::before, 
          .voucher-radio-button-wrapper.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before
        ){
          width: 0px;
        }
        :global(.voucher-radio-button-wrapper.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):focus-within){
          box-shadow: 0 0 0 3px #ff434412;
        }
        :global(.voucher-radio-button-wrapper.ant-radio-button-wrapper-checked:not([class*=' ant-radio-button-wrapper-disabled']).ant-radio-button-wrapper:first-child) {
          border-right-color: #d63031;
        }
        :global(.voucher-radio-button-wrapper.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)){
          color: #d63031;
          background: #d630310a;
          border-color: #d63031;
        }
        :global(.voucher-radio-button-wrapper.ant-radio-button-wrapper-disabled:hover){
          color: rgba(0, 0, 0, 0.25);
          box-shadow: unset;
        }
      `}</style>
    </>
  )
}

export default withAuth(NewPromo)
