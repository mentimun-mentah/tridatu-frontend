import { useState } from 'react';
import { Tabs, Input, Select, Row as AntRow, Col as AntCol } from 'antd';

import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Form from "react-bootstrap/Form";

import CardPromo from "components/Card/Promo";
// import EmptyPromo from "components/Card/Empty/Promo";

import { promos } from "data/promoData";

const CardPromoMemo = React.memo(CardPromo);
// const EmptyPromoMemo = React.memo(EmptyPromo);

const TabPane = Tabs.TabPane ;

const ALL_PROMO = 'ALL_PROMO'
const SPECIAL_PROMO = 'SPECIAL_PROMO'
const MONTHLY_PROMO = 'MONTHLY_PROMO'

const Promo = () => {
  const [activeTab, setActiveTab] = useState()

  const callback = (key) => {
    setActiveTab(key);
  }

  return(
    <>
      <div className="slider-container">
        <div className="slider-wrapper">
          <img src="/static/images/promo/banner-promo.jpeg" className="slider-image" alt="Tridatu Bali ID" />
        </div>
      </div>

      <Tabs activeKey={activeTab} onChange={callback} centered className="px-1 noselect">
        <TabPane tab="Semua Promo (12)" key={ALL_PROMO}>
        </TabPane>

        <TabPane tab="Promo Diskon (4)" key={SPECIAL_PROMO}>
        </TabPane>

        <TabPane tab="Promo Gratis Ongkir (0)" key={MONTHLY_PROMO}>
        </TabPane>
      </Tabs>

      <Container fluid="lg">

        <section className="mt-4">
          <Form>
            <Form.Row>
              <Form.Group as={Col} lg={6} md={12}>
                <Input 
                  className="h-35"
                  placeholder="Cari promo" 
                  suffix={<i className="far fa-search text-black-50" />}
                />
              </Form.Group>
              <Form.Group as={Col} lg={6} md={12}>
                <Select 
                  placeholder="Urutkan"
                  style={{ width: "100%"}}
                  className="product-search-select"
                >
                  <Select.Option value="2">Promo Terbaru</Select.Option>
                  <Select.Option value="1">Promo Terlama</Select.Option>
                </Select>
              </Form.Group>
            </Form.Row>
          </Form>
        </section>

        <section>
          <AntRow gutter={[16,16]}>
            {promos.reverse().map((data, i) => (
              <AntCol xs={24} sm={12} md={8} lg={8} key={i}>
                <CardPromoMemo image={data} idx={i} />
              </AntCol>
            ))}
          </AntRow>
        </section>
      </Container>

      <style jsx>{`
        .slider-container{
          width: 100%;
          height: 240px;
          margin-left: auto;
          margin-right: auto;
          position: relative;
          overflow: hidden;
          z-index: 1;
          margin-bottom: 0;
        }
        .slider-wrapper{
          height: 100%;
        }
        .slider-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        :global(.promo-search .ant-input-search > .ant-input-group > .ant-input-group-addon .ant-input-search-button){
          border-top-right-radius: 0.25rem;
          border-bottom-right-radius: 0.25rem;
        }
        @media only screen and (max-width: 480px){
          .slider-container{
            height: 120px;
          }
        }
      `}</style>
    </>
  )
}

export default Promo
