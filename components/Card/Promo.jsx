import { Typography } from 'antd';

import Link from 'next/link';
import Image from 'next/image';
import Card from "react-bootstrap/Card";

const Paragraph = Typography.Paragraph ;

const CardPromo = ({ image, idx }) => {
  return(
    <>
      <Card className="border-0 shadow-sm h-100">
        <Image 
          width={600}
          height={328}
          src={image}
          alt="Tridatu Bali"
          className="img-fit radius-top-img-card"
        />
        <Card.Body className="p-3">
          <Card.Text className="text-dark truncate-2 fs-14 fw-500">
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
              {idx === 0 && (
                <div className="promotion-box-label">Tanpa Kode Promo</div>
              )}
              {idx % 2 !== 0 && (
                <>
                <div className="promotion-box-label">Kode Promo</div>
                <div className="promotion-box__value">
                  <Paragraph className="text-tridatu copy-code-btn mb-0" copyable>
                    MARCHFIT
                  </Paragraph>
                </div>
                </>
              )}
              {idx % 2 == 0 && idx !== 0 && (
                <div className="promotion-box-label">{idx} Kode Promo</div>
              )}
            </div>
          </div>
        </Card.Body>

      </Card>

      <style jsx>{`
        :global(.copy-code-btn .ant-typography-copy){
          color: #999;
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

        .promotion-code-detail, .promotion-date-detail {
          position: relative;
          padding-left: 30px;
        }

        .promotion-date-detail:before {
          background-image: url('/static/svg/timer.svg');
        }
        .promotion-code-detail:before {
          background-image: url('/static/svg/discount-voucher.svg');
        }

        .promotion-date-detail:before, .promotion-code-detail:before {
          position: absolute;
          content: " ";
          left: 0;
          top: 50%;
          background-repeat: no-repeat;
          background-size: 20px 20px;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
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
