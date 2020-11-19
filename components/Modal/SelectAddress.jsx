import { useEffect, useState } from "react";
import { Button, Modal, Empty } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";

import nookies from "nookies";
import * as actions from "store/actions";
import axios, { jsonHeaderHandler, signature_exp, resNotification } from "lib/axios";
import SelectAddressList from "components/Account/Address/SelectAddressList";

const SelectAddressModal = ({ show, close, showAddAddress }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const addresses = useSelector((state) => state.address.address);

  const onShowAddAddressHandler = () => {
    close();
    showAddAddress();
  };

  const changeMainAddress = (id) => {
    setLoading(true)
    axios.put(`/address/main-address-true/${id}`, null, jsonHeaderHandler())
      .then(res => {
        close()
        setLoading(false)
        dispatch(actions.getAddress(100000, 1));
        resNotification("success", "Success", res.data.detail)
      })
      .catch(err => {
        const errDetail = err.response.data.detail
        if(errDetail == signature_exp){
          dispatch(actions.getAddress(100000, 1));
          close()
          setLoading(false)
          resNotification("success", "Success", "Successfully set the address to main address.")
        } else if(typeof(errDetail) === "string") {
          setLoading(false)
          resNotification("error", "Error", errDetail)
        } else {
          setLoading(false)
          resNotification("error", "Error", errDetail[0].msg)
        }
      })
  }

  useEffect(() => {
    const { csrf_access_token, csrf_refresh_token } = nookies.get();
    if (csrf_access_token && csrf_refresh_token) {
      dispatch(actions.getAddress(100000, 1));
    }
  }, []);

  return (
    <>
      <Modal
        centered
        title={ <div className="text-center"> <span className="ant-modal-title">Pilih Alamat Pengiriman</span> </div> }
        visible={show}
        zIndex="1030"
        closeIcon={<i className="fas fa-times" />}
        onCancel={close}
        footer={false}
        className="modal-rad-10"
        width={700}
        bodyStyle={{
          padding: "10px 20px 20px 20px",
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        <Button
          type="dashed"
          block
          style={{ height: 45 }}
          className="text-secondary fs-12-s"
          onClick={onShowAddAddressHandler}
        >
          Tambah Alamat Baru
        </Button>

        <AnimatePresence>
          {(addresses == null || addresses.data.length == 0) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: ".2" }}
            >
              <Empty className="my-5" description={<span className="text-secondary">Kamu belum memiliki alamat</span>} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(addresses && addresses.data.length > 0) && addresses.data.map(data => (
            <SelectAddressList 
              data={data} 
              key={data.id}
              changeMainAddress={() => changeMainAddress(data.id)}
              loading={loading}
            />
          ))}
        </AnimatePresence>

      </Modal>

      <style jsx>{`
        :global(.card-address) {
          border-radius: 5px;
          margin-top: 20px;
        }
      `}</style>
    </>
  );
};

export default SelectAddressModal;
