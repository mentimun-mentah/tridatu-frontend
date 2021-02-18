import { Row, Col, Tabs } from 'antd'
import Container from 'react-bootstrap/Container'
import Card from "react-bootstrap/Card";

import CardVoucherOnly from "components/Card/Admin/Voucher/VoucherOnly";
import CardVoucherOnly1 from "components/Card/Admin/Voucher/VoucherOnly1";
import CardPromo from "components/Card/Admin/Voucher/Card";
import CardPromo1 from "components/Card/Admin/Voucher/Card1";
import CardPromo2 from "components/Card/Admin/Voucher/Card2";
import CardPromo3 from "components/Card/Admin/Voucher/Card3";
import EmptyPromo from "components/Card/Empty/Promo";

import { promos } from "data/promoData";

const CardPromoMemo = React.memo(CardPromo);

const Promo = () => {
  return(
    <>
      <Card className="border-0 shadow-none card-add-product">
        <Card.Body className="p-3 border-bottom">
          <h5 className="mb-0 fs-16-s">Kelola Promo</h5>
        </Card.Body>
        <Card.Body className="p-3">
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
        </Card.Body>
      </Card>
    </>
  )
}

export default Promo
