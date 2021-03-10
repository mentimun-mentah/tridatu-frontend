import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Button, Radio, Empty } from 'antd'
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from 'framer-motion'

import id from 'locales/id/account/address'
import en from 'locales/en/account/address'

import nookies from "nookies";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'

import { withAuth } from 'lib/withAuth'
import { formAddress } from 'formdata/formAddress'
import axios, { jsonHeaderHandler, signature_exp, resNotification } from "lib/axios";
import * as actions from "store/actions";
import Pagination from "components/Pagination";
import AddAddressModal from 'components/Modal/AddAddress'
import EditAddressModal from 'components/Modal/EditAddress'
import AddressList from 'components/Account/Address'

const perPage = 10;
const Address = () => {
  const router = useRouter();

  const { locale } = router
  const t = locale === "en" ? en : id

  const dispatch = useDispatch()
  const addresses = useSelector(state => state.address.address)
  const loading = useSelector(state => state.address.loading)

  const [currentPage, setCurrentPage] = useState(1)
  const [currentAddress, setCurrentAddress] = useState(formAddress)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [showEditAddressModal, setShowEditAddressModal] = useState(false)

  const showAddressModalHandler = () => {
    setShowAddressModal(true)
  }

  const closeAddressModalHandler = () => {
    setShowAddressModal(false)
  }

  const closeEditAddressModalHandler = () => {
    setShowEditAddressModal(false)
  }

  const editData = (res, setState) => {
    const { id, label, main_address, phone, postal_code, receiver, recipient_address, region } = res.data
    // let phoneData = "";
    // if(phone){
    //   phoneData = phone.split(" ")[phone.split(" ").length - 1]
    //   phoneData = phoneData.split("-").join("")
    // }
    const data = {
      id: id,
      main_address: main_address,
      label: { value: label, isValid: true, message: null },
      phone: { value: phone, isValid: true, message: null },
      postal_code: { value: postal_code, isValid: true, message: null },
      receiver: { value: receiver, isValid: true, message: null },
      recipient_address: { value: recipient_address, isValid: true, message: null },
      region: { value: region, isValid: true, message: null },
    }
    setState(data)
  }

  const editAddressHandler = id => {
    axios.get(`/address/my-address/${id}`)
      .then(res => {
        if(res.status >= 400 && res.status < 500){
          resNotification("error", "Error", res.data.detail)
        }
        if(res.status >= 200 && res.status < 300){
          editData(res, setCurrentAddress)
          setShowEditAddressModal(true)
        }
      })
      .catch(err => {
        const errDetail = err.response.data.detail
        if(errDetail == signature_exp){
          axios.get(`/address/my-address/${id}`)
            .then(res => {
              if(res.status >= 400 && res.status < 500){
                resNotification("error", "Error", res.data.detail)
              }
              if(res.status >= 200 && res.status < 300){
                editData(res, setCurrentAddress)
                setShowEditAddressModal(true)
              }
            })
            .catch(() => {})
        } else if(typeof(errDetail) === "string") {
          resNotification("error", "Error", errDetail)
        } else {
          resNotification("error", "Error", errDetail[0].msg)
        }
      })
  }

  const changeMainAddress = (e, isMobile) => {
    const id = isMobile ? e : e.target.text;
    axios.put(`/address/main-address-true/${id}`, null, jsonHeaderHandler())
      .then(res => {
        dispatch(actions.getAddress(perPage, currentPage))
        if(res.status >= 400 && res.status < 500){
          resNotification("error", "Error", res.data.detail)
        }
        if(res.status >= 200 && res.status < 300){
          resNotification("success", "Success", res.data.detail)
        }
      })
      .catch(err => {
        const errDetail = err.response.data.detail
        if(errDetail == signature_exp){
          dispatch(actions.getAddress(perPage, currentPage))
          // resNotification("success", "Success", "Successfully set the address to main address.")
        } else if(typeof(errDetail) === "string") {
          resNotification("error", "Error", errDetail)
        } else {
          resNotification("error", "Error", errDetail[0].msg)
        }
      })
  }

  const deleteAddressHanler = id => {
    let page = currentPage;
    if(addresses.data.length === 1 && page > 1){
      page = currentPage - 1
      setCurrentPage(page)
    } else {
      page = 1
      setCurrentPage(page)
    }
    axios.delete(`/address/delete/${id}`, jsonHeaderHandler())
      .then(res => {
        if(res.status >= 400 && res.status < 500){
          resNotification("error", "Error", res.data.detail)
        }
        if(res.status >= 200 && res.status < 300){
          dispatch(actions.getAddress(perPage, page))
          resNotification("success", "Success", res.data.detail)
        }
      })
      .catch(err => {
        const errDetail = err.response.data.detail
        if(errDetail == signature_exp){
          dispatch(actions.getAddress(perPage, page))
          // resNotification("success", "Success", "Successfully delete the address.")
        } else if(typeof(errDetail) === "string") {
          resNotification("error", "Error", errDetail)
        } else {
          resNotification("error", "Error", errDetail[0].msg)
        }
      })
  }

  const pageChange = page => {
    setCurrentPage(page)
    setCurrentAddress(formAddress)
    dispatch(actions.getAddress(perPage, page))
  }

  useEffect(() => {
    const { csrf_access_token, csrf_refresh_token } = nookies.get();
    if(csrf_access_token && csrf_refresh_token){
      dispatch(actions.getAddress(perPage, currentPage))
    }
    if(addresses !== null){
      setCurrentPage(addresses.page)
    }
  },[])

  return(
    <>
      <Card className="card-container">
        <Card.Header className="bg-transparent border-bottom">
          <Row className="justify-content-between">
            <Col className="align-self-center">
              <h1 className="fs-16 mb-0">{t.my_address}</h1>
            </Col>
            <Col>
              <Button 
                onClick={showAddressModalHandler}
                className="btn-tridatu float-right align-self-center"
                icon={<i className="far fa-plus pr-2" />}
              >
                {t.add_address}
              </Button>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          <AnimatePresence>
            {!loading && (addresses == null || addresses.data.length == 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: ".2" }}
              >
                <Empty className="my-5" description={<span className="text-secondary">{t.empty_address}</span>} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {(addresses && addresses.data.length > 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: ".2" }}
              >
                <Radio.Group onChange={changeMainAddress} value={true} className="w-100">
                  {addresses && addresses.data.map(data => (
                    <AddressList 
                      t={t}
                      key={data.id} 
                      data={data} 
                      showEditHandler={() => editAddressHandler(data.id)}
                      deleteHandler={() => deleteAddressHanler(data.id)}
                      changeMainAddress={() => changeMainAddress(data.id, true)}
                    />)
                  )}
                </Radio.Group>
              </motion.div>
            )}
          </AnimatePresence>
        </Card.Body>

        {addresses !== null && (
          <Card.Body className="text-center">
            <Pagination 
              total={addresses.total} 
              goTo={pageChange} 
              current={currentPage} 
              hideOnSinglePage 
              pageSize={perPage}
            />
          </Card.Body>
        )}
      </Card>

      <AddAddressModal
        t={t}
        show={showAddressModal}
        close={closeAddressModalHandler}
        perPage={perPage}
        currentPage={currentPage}
      />

      <EditAddressModal
        t={t}
        show={showEditAddressModal}
        close={closeEditAddressModalHandler}
        perPage={perPage}
        currentPage={currentPage}
        currentAddress={currentAddress}
      />

      <style jsx>{`
        :global(.d-last-none:last-of-type){
          display: none;
        }
      `}</style>
    </>
  )
}

Address.getInitialProps = async ctx => {
  const { csrf_access_token, csrf_refresh_token, access_token_cookie } = nookies.get(ctx);

  if(csrf_access_token && csrf_refresh_token && access_token_cookie){
    if(ctx.req) axios.defaults.headers.get.Cookie = ctx.req.headers.cookie;
    try{
      ctx.store.dispatch(actions.getAddressStart())
      const res = await axios.get(`/address/my-address?per_page=${perPage}&page=1`)
      ctx.store.dispatch(actions.getAddressSuccess(res.data))
    }
    catch (err){
      ctx.store.dispatch(actions.getAddressFail(err))
    }
  }
}

export default withAuth(Address)
