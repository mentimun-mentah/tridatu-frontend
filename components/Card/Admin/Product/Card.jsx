import { Checkbox, Card as CardAnt, Dropdown, Menu } from 'antd'
import { EditOutlined, EllipsisOutlined } from '@ant-design/icons'

import Image from "next/image";
import Card from 'react-bootstrap/Card'
import Button from "antd-button-color"

const CardProductAdmin = ({ i }) => {
  return(
    <>
      <CardAnt
        className="product-card-admin"
        bodyStyle={{ padding: 0 }}
        actions={[
          <EditOutlined key="edit" />,
          <Dropdown 
            placement="bottomRight" 
            trigger={['click']}
            overlay={
              <Menu>
                <Menu.Item>
                  {i % 4 === 0 ? "Tampilkan" : "Arisipkan" }
                </Menu.Item>
              </Menu>
            } 
          >
            <EllipsisOutlined key="more" />
          </Dropdown>
        ]}
      >
        <div className="position-relative">
          <Checkbox value={i} className="position-absolute idx-1 p-l-6 p-t-4" />
          <div className="text-center">
            <Image 
              width={270}
              height={270}
              src="/static/images/products/detail/3.jpeg"
              alt="Tridatu Bali"
            />
          </div>
          {i % 4 === 0 && (
            <>
            <div className="item-overlay text-center text-white">
              <h4 className="mb-2">
                <i className="fas fa-lock-alt text-white" />
              </h4>
              <p className="fs-12 mb-2">Diarsipkan</p>
              <Button ghost className="btn-product-overlay fs-12">Tampilkan</Button>
            </div>
            <div className="image-overlay"></div>
            </>
          )}
        </div>
        <Card.Body className="fs-13 fs-14-m py-1 px-2">
          <div style={{ height: "44px" }}>
            {i % 2 == 0 ? (
              <p className="mb-0 font-weight-light text-break truncate-2">
                Kaos - Baju - Tshirt Deus Ex Machina 02 - Putih, M Kaos - Baju - Tshirt Deus Ex Machina 02 - Putih, M
              </p>
            ) : (
              <p className="mb-0 font-weight-light text-break truncate-2">
                Kaos - Baju
              </p>
            )}
          </div>
          <p className="mb-0 text-tridatu text-truncate">Rp. 1.000.000.000</p>
          <p className="mb-1 text-muted text-truncate">
            Stok <span className="text-dark text-truncate">30</span>
          </p>
        </Card.Body>
      </CardAnt>

      <style jsx>{`
        :global(.product-card-admin .ant-card-actions > li){
          margin: 5px 0;
        }
        .image-overlay {
          position: absolute;
          top: 0;
          bottom: 6px;
          left: 0;
          right: 0;
          width: 100%;
          background: rgba(0, 0, 0, 0.6);
        }
        .item-overlay{
          position: absolute;
          z-index: 20;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          -ms-transform: translate(-50%, -50%);
        }
        :global(.btn-product-overlay){
          color: white !important;
          border-color: #e5e5e5 !important;
          padding: 0px 10px;
        }
        :global(.btn-product-overlay:hover, .btn-product-overlay:focus, .btn-product-overlay:active){
          color: white !important;
          border-color: #e5e5e5 !important;
          background-color: rgba(255,255,255,.1) !important;
        }

      `}</style>
    </>
  )
}

export default CardProductAdmin
