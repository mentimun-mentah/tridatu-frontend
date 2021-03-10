import { Row, Col, Input, Select } from 'antd'

import Masonry from 'react-masonry-css'
import ColB from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Card from "react-bootstrap/Card";
import Container from 'react-bootstrap/Container'

import CardVoucherOnly from "components/Card/Admin/Voucher/VoucherOnly";
import CardVoucherOnly1 from "components/Card/Admin/Voucher/VoucherOnly1";
import CardPromo from "components/Card/Admin/Voucher/Card";
import CardPromo1 from "components/Card/Admin/Voucher/Card1";
import CardPromo2 from "components/Card/Admin/Voucher/Card2";
import CardPromo3 from "components/Card/Admin/Voucher/Card3";
import EmptyPromo from "components/Card/Empty/Promo";

import { promos } from "data/promoData";

const CardPromoMemo = React.memo(CardPromo);

const orderList = [
  { name: "Semua Promo", value: "all" },
  { name: "Tanpa Kode Promo", value: "without_promo", },
  { name: "Dengan Kode Promo", value: "with_promo", },
  { name: "Promo Tidak Ditampilkan", value: "nolive_promo", }
]

const orderListStatus = [
  { label: "Semua Status", value: "" },
  { label: "Akan Datang", value: "with_promo", },
  { label: "Sedang Berjalan", value: "nolive_promo", },
  { label: "Telah Berakhir", value: "have_ended", }
]

const breakpointColumnsObj = {
  default: 3,
  1200: 2,
  992: 2,
  576: 1
};

const Promo = () => {
  return(
    <>
      <Card className="border-0 shadow-none card-add-product">
        <Card.Body className="p-3 border-bottom">
          <h5 className="mb-0 fs-16-s">Kelola Promo</h5>
        </Card.Body>
        <Card.Body className="p-3">
          <Form>
            <Form.Row>
              <Form.Group as={ColB} lg={4} md={12}>
                <Input 
                  className="h-35"
                  placeholder="Cari berdasarkan nama" 
                  prefix={<i className="far fa-search" />}
                  // value={search}
                  // onChange={onSearchChange}
                />
              </Form.Group>
              <Form.Group as={ColB} lg={4} md={12}>
                <Select 
                  placeholder="Urutkan" 
                  style={{ width: "100%"}}
                  className="product-search-select"
                  defaultValue="all"
                  // value={order_by}
                  // onChange={onOrderChange}
                >
                  {orderList.map((list, i) => (
                    <Select.Option key={i} value={list.value}>{list.name}</Select.Option>
                  ))}
                </Select>
              </Form.Group>
              <Form.Group as={ColB} lg={4} md={12}>
                <Select 
                  placeholder="Status" 
                  style={{ width: "100%"}}
                  className="product-search-select"
                  defaultValue=""
                >
                  {orderListStatus.map((list, i) => (
                    <Select.Option key={i} value={list.value}>{list.label}</Select.Option>
                  ))}
                </Select>
              </Form.Group>
            </Form.Row>
          </Form>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            <CardPromoMemo image='/static/images/promo/2.jpeg' />
            <CardPromo1 image='/static/images/promo/used.jpg' />
            <CardPromo2 image='https://ecs7.tokopedia.net/img/blog/promo/2020/01/Thumbnail_600x3282.jpg' />
            <CardPromo3 image='/static/images/promo/no-image.jpg' />
          </Masonry>

          {/*
            <Row gutter={[16, 16]} className="make-columns">
              <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                <CardPromoMemo image='/static/images/promo/2.jpeg' />
              </Col>
              <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                <CardPromo1 image='/static/images/promo/used.jpg' />
              </Col>
              <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                <CardPromo2 image='https://ecs7.tokopedia.net/img/blog/promo/2020/01/Thumbnail_600x3282.jpg' />
              </Col>
              <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                <CardPromo3 image='/static/images/promo/no-image.jpg' />
              </Col>
            </Row>
          */}
        </Card.Body>
      </Card>

      <style jsx global>{`
        .my-masonry-grid {
          display: -webkit-box; /* Not needed if autoprefixing */
          display: -ms-flexbox; /* Not needed if autoprefixing */
          display: flex;
          margin-left: -16px; /* gutter size offset */
          width: auto;
        }
        .my-masonry-grid_column {
          padding-left: 16px; /* gutter size */
          background-clip: padding-box;
        }
         
        /* Style your items */
        .my-masonry-grid_column > div { /* change div to reference your elements you put in <Masonry> */
          margin-bottom: 16px;
        }
      `}</style>
    </>
  )
}

export default Promo
