import { DatePicker, Table, Modal, Form, Row, Col } from 'antd'

const SetupProduct = ({ visible, onClose }) => {
  if(!visible) return null

  return(
    <>
      <Modal centered width={1000} 
        zIndex={3000} visible={visible}
        title="Pilih Produk" closable={false}
        onOk={onClose} onCancel={onClose}
        maskClosable={false}
        // footer={buttonActions}
      >
      </Modal>
    </>
  )
}

export default SetupProduct
