import { useState, useEffect } from 'react'
import { useDispatch } from "react-redux";
import { Button, Modal, Select, Input } from 'antd'
import { LoadingOutlined } from "@ant-design/icons";

import axios, { jsonHeaderHandler, resNotification, signature_exp } from 'lib/axios'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import * as actions from "store/actions";
import ErrorMessage from "components/ErrorMessage";

import { formAddress, formAddressIsValid } from 'formdata/formAddress'

const EditAddressModal = ({ t, show, close, perPage, currentPage, currentAddress }) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [addressList, setAddressList] = useState([])
  const [postalCode, setPostalCode] = useState([])
  const [address, setAddress] = useState(formAddress)
  const [notFound, setNotFound] = useState({text: t.initial_text_search})

  const { label, receiver, phone, region, postal_code, recipient_address } = address

  const fetchAddress = value => {
    let text = t.initial_text_search
    if(value.length < 3){
      let min = 3
      text = `${t.serach_min_text_1} ${min - value.length} ${t.serach_min_text_2}`
      setAddressList([])
      setPostalCode([])
      setNotFound({text: text})
      const data = {
        ...address,
        region: { value: null, isValid: true, message: null },
        postal_code: { value: null, isValid: true, message: null },
      }
      setAddress(data)
    }
    else {
      axios.get(`/address/search/city-or-district?q=${value}`)
        .then(res => {
          if(res.data.length > 0 && value.length >= 3) setAddressList(res.data)
          else {
            text = t.not_found
            value.length >= 3 && setNotFound({text: text})
            setAddressList([])
          }
        })
        .catch(() => {
          setAddressList([])
          setPostalCode([])
        })
    }
  }

  const inputChangeHandler = (e, item) => {
    const name = !item && e.target.name;
    const value = !item && e.target.value;

    if(item === "region"){
      const data = {
        ...address,
        region: { value: e, isValid: true, message: null },
        postal_code: { value: null, isValid: true, message: null },
      }
      setAddress(data)
    } else {
      const data = {
        ...address,
        [item]: { ...address[item], value: e, isValid: true, message: null }
      }
      setAddress(data)
    }
    if(!item){
      const data = {
        ...address,
        [name]: { ...address[name], value: value, isValid: true, message: null }
      }
      setAddress(data)
    }
  }

  const closeModalHandler = () => {
    close()
    setAddressList([])
    setPostalCode([])
    setAddress(formAddress);
    setNotFound({text: t.initial_text_search})
  }

  const submitHandler = e => {
    e.preventDefault()
    if(formAddressIsValid(address, setAddress, t)){
      setLoading(true)
      const data = {
        label: label.value,
        receiver: receiver.value,
        phone: phone.value,
        region: region.value,
        postal_code: postal_code.value,
        recipient_address: recipient_address.value, 
      }

      axios.put(`/address/update/${address.id}`, data, jsonHeaderHandler())
        .then((res) => {
          setLoading(false)
          closeModalHandler()
          dispatch(actions.getAddress(perPage, currentPage))
          resNotification("success", "Success", res.data.detail)
        })
        .catch((err) => {
          const errDetail = err.response.data.detail;
          if(errDetail == signature_exp){
            setLoading(false)
            closeModalHandler()
            dispatch(actions.getAddress(perPage, currentPage))
            // resNotification("success", "Success", "Successfully add a new address.")
          } else if(typeof(errDetail) === "string") {
            setLoading(false)
            resNotification("error", "Error", errDetail)
          } else {
            setLoading(false)
            const state = JSON.parse(JSON.stringify(address));
            errDetail.map((data) => {
              const key = data.loc[data.loc.length - 1];
              if (state[key]) {
                state[key].value = state[key].value;
                state[key].isValid = false;
                state[key].message = data.msg;
              }
            });
            setAddress(state);
          }
        })
    }
  }

  useEffect(() => {
    setAddress(currentAddress)
  },[currentAddress])

  return(
    <>
      <Modal
        centered
        title={t.edit_address_modal}
        visible={show}
        maskClosable
        onCancel={closeModalHandler}
        zIndex="1030"
        closeIcon={<i className="fas fa-times" />}
        footer={[
          <Button key="back" onClick={closeModalHandler}>
            {t.cancel}
          </Button>,
          <Button key="submit" type="primary" className="btn-tridatu" onClick={submitHandler} style={{ width: 80 }}>
            {loading ? <LoadingOutlined /> : t.save}
          </Button>,
        ]}
        className="modal-rad-10"
        bodyStyle={{padding: '0'}}
      >
        <Card.Body>
          <Form>
            <Form.Group>
              <Form.Label>{t.data_input.label_address}</Form.Label>
              <Form.Control 
                name="label"
                placeholder={t.data_input.label_address_placeholder}
                value={label.value}
                onChange={e => inputChangeHandler(e)}
              />
              <ErrorMessage item={label} />
            </Form.Group>

            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>{t.data_input.receiver_name}</Form.Label>
                <Form.Control 
                  type="text" 
                  name="receiver" 
                  placeholder={t.data_input.receiver_name_placeholder} 
                  value={receiver.value}
                  onChange={e => inputChangeHandler(e)}
                />
                <ErrorMessage item={receiver} />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>{t.data_input.phone_number}</Form.Label>
                <Input 
                  name="phone"
                  // addonBefore="+62" 
                  placeholder={t.data_input.phone_number} 
                  className="input-h-35 h-35" 
                  value={phone.value}
                  onChange={e => inputChangeHandler(e)}
                />
                <ErrorMessage item={phone} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} md={8} sm={12}>
                <Form.Label>{t.data_input.city_or_district}</Form.Label>
                <Select
                  showSearch
                  showArrow={false}
                  name="region"
                  className="w-100"
                  placeholder={t.data_input.city_or_district_placeholder}
                  onSearch={fetchAddress}
                  value={region.value}
                  onSelect={e => inputChangeHandler(e, "region")}
                  notFoundContent={
                    <p className="text-center mb-2">
                      <i className="fad fa-map-marked-alt fs-35 text-center d-block my-2" />
                      <span className="text-center">{notFound.text}</span>
                    </p>
                  }
                >
                  {addressList.map((data, i) => (
                    <Select.Option key={i} value={data.value} className="custom-option">
                      <div onClick={() => setPostalCode(data.postal_code)} className="div-option">
                        {data.value}
                      </div>
                    </Select.Option>
                  ))}
                </Select>
                <ErrorMessage item={region} />
              </Form.Group>

              <Form.Group as={Col} md={4} sm={12}>
                <Form.Label>{t.data_input.postal_code}</Form.Label>
                <Select
                  showSearch
                  showArrow={false}
                  name="postal_code"
                  className="w-100 height-100"
                  placeholder={t.data_input.postal_code}
                  value={postal_code.value}
                  disabled={postalCode.length < 1}
                  onSelect={e => inputChangeHandler(e, "postal_code")}
                >
                  {postalCode.map((data, i) => (
                    <Select.Option key={i} value={data}>
                      {data}
                    </Select.Option>
                  ))}
                </Select>
                <ErrorMessage item={postal_code} />
              </Form.Group>
            </Form.Row>

            <Form.Group className="mb-0">
              <Form.Label>{t.data_input.address}</Form.Label>
              <Form.Control 
                rows={3} 
                as="textarea" 
                name="recipient_address"
                placeholder={t.data_input.address_placeholder} 
                value={recipient_address.value}
                onChange={e => inputChangeHandler(e)}
              />
              <ErrorMessage item={recipient_address} />
            </Form.Group>

          </Form>
        </Card.Body>
      </Modal>

      <style jsx>{`
        :global(.input-h-35 .ant-input){
          height: 35px;
        }
        :global(.custom-option){
          padding: 0;
        }
        :global(.custom-option > .ant-select-item-option-content){
          white-space: pre-wrap;
        }
        :global(.ant-select-selection-item > .div-option){
          padding: 0;
        }
        :global(.div-option){
          padding: 5px 12px;
        }
      `}</style>
    </>
  )
}

export default EditAddressModal
