import { Modal, Image } from 'antd'

const SizeGuide = ({ show, close, image }) => {
  return(
    <>
      <Modal
        centered
        title=" "
        visible={show}
        onCancel={close}
        zIndex="3030"
        closeIcon={<i className="fas fa-times" />}
        footer={null}
        className="modal-sizeguide"
        width={650}
        bodyStyle={{padding: '0'}}
      >
        <Image src={image} preview={false} />
      </Modal>

      <style jsx>{`
      :global(.modal-sizeguide > .ant-modal-content, 
        .modal-sizeguide > .ant-modal-content > .ant-modal-header) {
        border: unset;
      }
      `}</style>
    </>
  )
}

export default SizeGuide
