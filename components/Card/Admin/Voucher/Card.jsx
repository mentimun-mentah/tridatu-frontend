import { useState } from 'react'
import { Card as CardAnt, Typography, Collapse, Badge, Modal, Space, Button } from 'antd';
import { SettingOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion'

import formatNumber from 'lib/formatNumber'
import moment from 'moment'
import Link from 'next/link'
import Image from 'next/image'
import Card from 'react-bootstrap/Card'

const Paragraph = Typography.Paragraph;

const AdminCardVoucher = ({ t, data, deletePromo }) => {
  const { promos_id, promos_name, promos_image } = data
  const { promos_period_start, promos_period_end, promos_period_status, promos_code } = data

  const [showModal, setShowModal] = useState(false)

  const renderStatus = () => {
    switch(promos_period_status){
      case 'ongoing':
        return <Badge className="badge-green-processing" status="processing" color="green" text={t.status_type.ongoing} />
      case 'will_come':
        return <Badge color="yellow" text={t.status_type.will_come} />
      case 'have_ended':
        return <Badge color="orange" text={t.status_type.have_ended} />
      default:
        return <Badge color="orange" text={t.status_type.have_ended} />
    }
  }

  const renderTitleCode = (promo) => {
    switch(promo.promo_codes_kind){
      case 'discount_up_to':
        return <>{t.card.discount} {promo.promo_codes_percent}% {t.card.up_to} Rp.{formatNumber(promo.promo_codes_max_discount)}</>
      case 'discount':
        return <>{t.card.discount} Rp.{formatNumber(promo.promo_codes_nominal)}</>
      case 'ongkir':
        return <>{t.card.free_shipping}</>
      default: 
        return ""
    }
  }

  const renderPromoCode = () => {
    if(promos_code.length){
      return(
        <Collapse expandIconPosition="left">
          <Collapse.Panel 
            key="1" 
            header={`${promos_code.length} ${t.card.promo_code}`} 
            extra={<SettingOutlined onClick={e => e.stopPropagation()} />}
          >
            {promos_code.map(promo => (
              <div className="promotion-code" key={promo.promo_codes_id}>
                <b>{renderTitleCode(promo)}</b>
                {promo.promo_codes_min_transaction ? 
                  <p className="fs-12 text-muted mb-0">{t.card.min_transaction} Rp.{formatNumber(promo.promo_codes_min_transaction)}</p> :
                  <p className="fs-12 text-muted mb-0">{t.card.no_min_transaction}</p>
                }
                <div className="promotion-box__value d-flex align-items-center">
                  <Paragraph className="copy-code mb-0">
                    {promo.promo_codes_code}
                  </Paragraph>
                </div>
              </div>
            ))}
          </Collapse.Panel>
        </Collapse>
      )
    }
    else{
      return(
        <Collapse collapsible="disabled" className="collapse-no-code">
          <Collapse.Panel showArrow={false} header={t.card.no_promo_code} />
        </Collapse>
      )
    }
  }

  const onDeletePromo = () =>{
    deletePromo(promos_id)
    setShowModal(false)
  }

  return(
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: ".2" }}
      >
        <CardAnt 
          className="shadow-sm"
          bodyStyle={{ padding: 0 }}
          actions={[
            <a className="text-decoration-none" key="edit">
              <EditOutlined />
            </a>,
            <a className="text-decoration-none" key="delete" onClick={() => setShowModal(true)}>
              <DeleteOutlined key="delete" />
            </a>,
          ]}
        >
          <Image 
            width={800}
            height={400}
            src={promos_image ? `${process.env.NEXT_PUBLIC_API_URL}/static/promos/${promos_image}` : '/static/images/promo/no-image.jpg'}
            alt="Tridatu Bali"
            className="img-fit radius-top-img-card"
          />
          <Card.Body className="p-3">
            <Card.Text className="text-dark truncate-2 fs-14-s">
              <Link href="/promo/belanja-diskon-serbu" as="/promo/belanja-diskon-serbu">
                <a className="text-reset">{promos_name}</a>
              </Link>
            </Card.Text>
            <div className="promotion-date">
              <div className="promotion-date-detail">
                <div className="promotion-box-label">{t.card.promo_period}</div>
                <div className="promotion-box__value mb-1">
                  {moment(promos_period_start).format('d MMM')} - {moment(promos_period_end).format('d MMM YYYY')}
                </div>
              </div>
            </div>
            <div className="promotion-date">
              <div className="promotion-date-detail">
                <div className="promotion-box-label">{t.card.promo_status}</div>
                <div className="promotion-box__value">
                  {renderStatus()}
                </div>
              </div>
            </div>

            {renderPromoCode()}

          </Card.Body>
        </CardAnt>
      </motion.div>


      <Modal
        centered
        visible={showModal}
        zIndex={3000}
        width={416}
        closable={false}
        footer={null}
        className="modal-rad-10 text-center"
      >
        <div className="text-dark">
          <h5 className="mb-3">{t.modal.title}</h5>
          <p className="text-black-50 fs-14">{promos_name}</p>
          <p className="text-black-50 mb-4">{t.modal.sub}</p>

          <Space>
            <Button onClick={() => setShowModal(false)}>{t.modal.cancel}</Button>
            <Button type="primary" className="btn-tridatu" onClick={onDeletePromo}>{t.modal.delete_promo}</Button>
          </Space>
        </div>
      </Modal>
  
      <style jsx>{`
        :global(.ant-collapse.collapse-no-code .ant-collapse-item-disabled > .ant-collapse-header, 
                .ant-collapse.collapse-no-code .ant-collapse-item-disabled > .ant-collapse-header > .arrow){
          color: unset;
          cursor: auto;
        }
        :global(.copy-code){
          color: #d63031;
        }
        :global(.copy-code > .ant-typography-copy){
          vertical-align: text-bottom;
        }
        .promotion-date .promotion-box-label{
          font-size: 12px;
          line-height: 16px;
          color: rgba(0,0,0,.6);
        }
        .promotion-date .promotion-box__value{
          font-size: 14px;
          color: rgba(0,0,0,.87);
          margin-bottom: 16px;
        }

        :global(.promotion-code:not(:last-child)){
          margin-bottom: .5rem;
          padding-bottom: .5rem;
          border-bottom: 1px solid #f0f0f0;
        }
        :global(.promotion-code .promotion-box-label){
          font-size: 12px;
          line-height: 16px;
          color: rgba(0,0,0,.6);
        }
        :global(.promotion-code .promotion-box__value){
          font-size: 14px;
          font-weight: 600;
        }

        @media(max-width:767px){
          .promotion-image {
            height:auto;
          }
        }
        @media(min-width: 992px) {
          .promotion-image {
            height: 154px;
          }
        }
        @media(min-width: 1200px) {
          .promotion-image {
            height: 189px;
          }
        }
      `}</style>
    </>
  )
}

export default AdminCardVoucher
