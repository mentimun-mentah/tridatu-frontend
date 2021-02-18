import { useRouter } from 'next/router';
import { Typography, Space, Button, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import Link from 'next/link';
import Image from 'next/image';
import Card from "react-bootstrap/Card";

const Paragraph = Typography.Paragraph ;

const CardPromo = ({ image }) => {
  const router = useRouter()

  const isPromoAdmin = router.pathname.startsWith('/admin')

  return(
    <>
      <Card className={isPromoAdmin ? "mb-0" : "mb-4 border-0 shadow"}>
        <Image 
          width={600}
          height={328}
          src={image}
          alt="Tridatu Bali"
          className="img-fit radius-top-img-card"
        />
        {/* <Card.Img */}
        {/*   variant="top" */}
        {/*   src={image} */}
        {/*   alt="Tridatu Bali" */}
        {/*   className="img-fit img-fluid" */}
        {/* /> */}
        <Card.Body className="p-3">
          <Card.Text className="text-dark truncate-2 fs-14-s">
            <Link href="/promo/belanja-diskon-serbu" as="/promo/belanja-diskon-serbu">
              <a className="text-reset">
                Belanja Gadget dan Electronic Ter-update Diskon Rp 200ribu dengan Kartu Kredit Belanja Gadget dan Electronic Ter-update Diskon Rp 200ribu dengan Kartu Kredit
              </a>
            </Link>
          </Card.Text>
          <div className="promotion-date">
            <div className="promotion-date-detail">
              <div className="promotion-box-label">Periode Promo</div>
              <div className="promotion-box__value">10 Sep - 29 Okt 2020</div>
            </div>
          </div>
          <div className="promotion-code">
            <div className="promotion-code-detail">
              <div className="promotion-box-label">Kode Promo</div>
              <div className="promotion-box__value">
                <Paragraph copyable className="copy-code mb-0">
                  BRINUF4BRINUF4
                </Paragraph>
              </div>
            </div>
          </div>
        </Card.Body>

        {isPromoAdmin && (
          <Card.Body className="border-top py-3 text-center">
            <Space>
              <Button size="small" type="primary">Ubah</Button>
              <Popconfirm title="Are you sure？" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                <Button size="small" type="primary" danger>Hapus</Button>
              </Popconfirm>
            </Space>
          </Card.Body>
        )}

      </Card>

      <style jsx>{`
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

        .promotion-code .promotion-box-label{
          font-size: 12px;
          line-height: 16px;
          color: rgba(0,0,0,.6);
        }
        .promotion-code .promotion-box__value{
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

export default CardPromo
