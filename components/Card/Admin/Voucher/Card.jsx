import { Card as CardAnt, Typography, Popconfirm, Collapse, Badge } from 'antd';
import { SettingOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion'

import formatNumber from 'lib/formatNumber'
import moment from 'moment'
import Link from 'next/link'
import Image from 'next/image'
import Card from 'react-bootstrap/Card'

const Paragraph = Typography.Paragraph;

const AdminCardVoucher = ({ data }) => {
  const { promos_name, promos_image } = data
  const { promos_period_start, promos_period_end, promos_period_status, promos_code } = data

  const renderStatus = () => {
    switch(promos_period_status){
      case 'ongoing':
        return <Badge className="badge-green-processing" status="processing" color="green" text="Sedang Berjalan" />
      case 'will_come':
        return <Badge color="yellow" text="Akan Datang" />
      case 'have_ended':
        return <Badge color="orange" text="Telah Berakhir" />
      default:
        return <Badge color="orange" text="Telah Berakhir" />
    }
  }

  const renderTitleCode = (promo) => {
    switch(promo.promo_codes_kind){
      case 'discount_up_to':
        return <>Diskon {promo.promo_codes_percent}% hingga Rp.{formatNumber(promo.promo_codes_max_discount)}</>
      case 'discount':
        return <>Diskon Rp.{formatNumber(promo.promo_codes_nominal)}</>
      case 'ongkir':
        return <>Gratis ongkir</>
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
            header={`${promos_code.length} Kode Promo`} 
            extra={<SettingOutlined onClick={e => e.stopPropagation()} />}
          >
            {promos_code.map(promo => (
              <div className="promotion-code" key={promo.promo_codes_id}>
                <b>{renderTitleCode(promo)}</b>
                {promo.promo_codes_min_transaction ? 
                  <p className="fs-12 text-muted mb-0">Minimum transaksi Rp.{formatNumber(promo.promo_codes_min_transaction)}</p> :
                  <p className="fs-12 text-muted mb-0">Tanpa minimum transaksi</p>
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
          <Collapse.Panel showArrow={false} header="Tanpa Kode Promo" />
        </Collapse>
      )
    }
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
          <a className="text-decoration-none">
            <EditOutlined key="edit" />
          </a>,
           <Popconfirm 
            title="Hapus promo ini?"
             onConfirm={() => {}}
            okText="Ya"
            cancelText="Batal"
            placement="bottom"
            arrowPointAtCenter
          >
            <DeleteOutlined key="delete" />
          </Popconfirm>
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
              <div className="promotion-box-label">Periode Promo</div>
              <div className="promotion-box__value mb-1">
                {moment(promos_period_start).format('d MMM')} - {moment(promos_period_end).format('d MMM YYYY')}
              </div>
            </div>
          </div>
          <div className="promotion-date">
            <div className="promotion-date-detail">
              <div className="promotion-box-label">Status Promo</div>
              <div className="promotion-box__value">
                {renderStatus()}
              </div>
            </div>
          </div>

          {renderPromoCode()}

        </Card.Body>

      </CardAnt>
        </motion.div>
  
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
