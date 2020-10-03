import { useState } from 'react';
import { Menu, Rate, Tag, InputNumber, Radio, Checkbox, Drawer, Tabs, Input, Select } from 'antd';

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import ButtonBoot from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import CardProduct from "components/Card/Product";
import Pagination from "components/Pagination";
import formFilter from "formdata/formFilter";

import ProductsStyle, { radioStyle } from "components/Products/style";

const CardProductMemo = React.memo(CardProduct);

const renderTitle = (title) => <b className="text-dark">{title}</b> 
const renderSubTitle = (title) => <span className="text-muted">{title}</span>

const listFilter = ['Kemeja', 'Batik', 'Kaos', 'Jaket', 'Jeans', 'Celana', 'Ikat Pinggang', 'Tas Selempang', 'Kemeja', 'Batik', 'Kaos', 'Jaket', 'Jeans', 'Celana', 'Ikat Pinggang', 'Tas Selempang'];

const listCategory = [ { title: "Baju", child: ['Kaos', 'Kemeja'] }, { title: "Ikat Pinggang", child: ['Kulit', 'Kanvas'] }, { title: "Celana", child: ['Kain', 'Jeans', 'Panjang', 'Pendek'] }, { title: "Jaket", child: ['Kain', 'Kulit', 'Kanvas'] }, { title: "Tas Selempang", child: ['Kain', 'Kulit', 'Kanvas'] } ]

const genderList = ['Pria', 'Wanita', 'Uniseks'];
const brandList = ['Adidas', 'Billabong', 'Bershka', 'Converse', 'Deus', 'GAP', 'Giordano', 'Gucci', 'H&M', 'Mango', 'New Balance', 'Pull & Bear', 'Louis Vuitton', 'Levis', 'Nike', 'Top Man', 'Uniqlo', 'Supreme', 'Zara']
const sortList = ['Paling Sesuai', 'Harga Tertinggi', 'Harga Terendah']

import { category_data } from 'components/Header/data'

const ProductContainer = () => {
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState(formFilter);
  const [activeFilter, setActiveFilter] = useState({
    category: {value: []},
  });

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onCategoryChange = e => {
    const tmp = e.keyPath.join("")
    const data = { ...activeFilter, category: {value: [e.key]} }
    const emptydata = { ...activeFilter, category: {value: []} }
    console.log(e)
    setActiveFilter(data)
  }

  return(
    <>
      <Container className="pt-4 pb-2">

        <section className="banner-section d-lg-none">
          <Form inline className="mx-lg-2 w-100">
            <div className="w-100 nav-search product-search">
              <Input.Search size="large" placeholder="Search" />
            </div>
          </Form>
        </section>

        <Row>
          <Col>
            <span className="text-secondary">Hasil pencarian dari "<span className="text-dark">Baju</span>"</span>
          </Col>
          <Col className="d-none d-lg-block">
            <Form inline className="float-right">
              <Form.Label className="my-1 mr-2">
                Urutkan:
              </Form.Label>
              <Select defaultValue={sortList[0]} style={{ width: 150 }}>
                {sortList.map(x => (
                  <Select.Option value={x}>{x}</Select.Option>
                ))}
              </Select>
            </Form>
          </Col>
        </Row>
      </Container>
      <hr />
      <pre>
        {JSON.stringify(activeFilter, null, 4)}
      </pre>
      <Container className="pb-3 pt-3">
        <Row>
          <Col className="col-3 d-none d-lg-block ">
            <h6>Filter</h6>
            <Card className="border-0 shadow-filter">
              <Menu
                className="filter-menu noselect"
                defaultOpenKeys={['sub1', 'sub6', 'sub7', 'sub2', 'sub8']}
                mode="inline"
              >
                <Menu.SubMenu 
                  key="sub1" 
                  className="title-filter" 
                  title={renderTitle('Kategori')} 
                  onClick={onCategoryChange}
                >
                  {category_data.map((data, i) => (
                    <Menu.SubMenu key={data.category + i} title={renderSubTitle(data.category)}>
                      {data.sub.map((child, ii) => (
                        <Menu.SubMenu key={child.title + (i + ii)} title={renderSubTitle(child.title)} className="pl-3">
                          {child.child.map(dataChild => (
                            <Menu.Item key={dataChild} className="text-secondary">{dataChild}</Menu.Item>
                          ))}
                        </Menu.SubMenu>
                      ))}
                    </Menu.SubMenu>
                  ))}
                </Menu.SubMenu>

                <Menu.SubMenu key="sub7" className="filter-checkbox title-filter" title={renderTitle('Rating')}>
                  <Menu.Item className="checkbox-item">
                    <Radio.Group className="w-100">
                      <Radio style={radioStyle} value={3}>
                        <span className="text-secondary m-l-2">Lihat semua</span>
                      </Radio>
                      <Radio style={radioStyle} value={1}>
                        <Rate disabled defaultValue={1} count={1} className="filter-rate" />
                        <span className="text-secondary">4 Keatas</span>
                      </Radio>
                      <Radio style={radioStyle} value={2}>
                        <Rate disabled defaultValue={1} count={1} className="filter-rate" />
                        <span className="text-secondary">3 Keatas</span>
                      </Radio>
                    </Radio.Group>
                  </Menu.Item>
                </Menu.SubMenu>

                <Menu.SubMenu key="sub6" className="filter-checkbox title-filter" title={renderTitle('Harga')}>
                  <div className="p-l-20 p-r-20 mt-3">
                    <Form.Group>
                      <Form.Label className="text-secondary m-b-13">Harga Minimum</Form.Label>
                      <InputNumber formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        parser={value => value.replace(/\Rp\s?|(\.*)/g, "")}
                        className={`w-100`}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="text-secondary m-b-13">Harga Maksimum</Form.Label>
                      <InputNumber formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        parser={value => value.replace(/\Rp\s?|(\.*)/g, "")}
                        className={`w-100`}
                      />
                    </Form.Group>
                  </div>
                  <Menu.Item className="checkbox-item">
                    <Checkbox>
                      <span className="text-secondary">Diskon</span>
                    </Checkbox>
                  </Menu.Item>
                </Menu.SubMenu>

                <Menu.SubMenu key="sub8" className="scrollable-submenu title-filter" title={renderTitle('Brand')}>
                  {brandList.map(x => (
                    <Menu.Item className="checkbox-item" key={x}>
                      <Checkbox>
                        <span className="text-secondary">{x}</span>
                      </Checkbox>
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>

              </Menu>
            </Card>
          </Col> 

          <Col>
            <h4 className="mb-2 d-none d-lg-block">Produk</h4>
            {/*
            {filter.length > 0 && (
              <div className="mb-3 d-none d-lg-block noselect">
                <span className="text-secondary font-weight-light">Filter aktif: </span>
                {filter.map((data, i) => (
                  <Tag key={i} 
                    closable 
                    className="filter-tag"
                    closeIcon={<i className="fas fa-times" />}
                  >
                    {data}
                  </Tag>
                ))}
                <a href="#" className="text-tridatu fs-14" onClick={() => setFilter([])}>Hapus Semua</a>
              </div>
            )}
            */}

            <Row className="row-cols-2 row-cols-md-3 row-cols-lg-3 row-cols-xl-4 custom-gutters">
              {[...Array(10)].map((_, i) => (
                <Col key={i}>
                  <CardProductMemo />
                </Col>
              ))}
            </Row>

            <Row className="mt-4">
              <Col className="align-self-center text-center">
                <Pagination />
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="fixed-bottom text-center mb-3 d-lg-none">
          <Col>
            <ButtonBoot variant="dark" className="badge-pill px-3 py-2 fs-14 shadow" onClick={showDrawer}>
              <i className="far fa-filter mr-2" />Filter
            </ButtonBoot>
          </Col>
        </Row>
      </Container>

      {/*FILTER MOBILE*/}

      <Drawer
        placement="bottom"
        title="Filter"
        closeIcon={
          <span 
            onClick={(e) => {e.stopPropagation(); console.log('close click')}}
            className="font-weight-lighter fs-14 text-tridatu"
          >
            Reset
          </span>
        }
        onClose={onClose}
        visible={visible}
        bodyStyle={{padding: 0, backgroundColor:'#f5f5f5'}}
        className="d-block d-sm-block d-md-block d-lg-none d-xl-none"
        height="100%"
        zIndex="1030"
        headerStyle={{ border: '0px', boxShadow:'rgba(0,0,0,0.18) 0px 1px 15px', zIndex: '1' }}
        footer={
          <div style={{ textAlign: 'right' }} >
           <ButtonBoot 
             variant="link" 
             className="mr-2 rounded-0 text-reset"
             onClick={onClose}
           >
             Batal
           </ButtonBoot>
           <ButtonBoot 
             className="btn-tridatu rounded-0"
             onClick={onClose}
           > 
             Terapkan
           </ButtonBoot>
          </div>
        }
      >
        <Card className="border-0 rounded-0 w-100 card-mobile-filter">
          <Card.Body>
            <h6 className="mb-3">Urutkan</h6>
            {sortList.map(tag => (
              <Tag.CheckableTag
                key={tag}
                className="filter-tag filter-tag-mobile"
              >
                {tag}
              </Tag.CheckableTag>
            ))}
            <Form.Group className="mb-1">
              <Radio.Group className="w-100">
                <Radio style={radioStyle} value={3}>
                  <span className="text-secondary m-l-2">Paling Sesuai</span>
                </Radio>
                <Radio style={radioStyle} value={1}>
                  <span className="text-secondary m-l-2">Harga Tertinggi</span>
                </Radio>
                <Radio style={radioStyle} value={2}>
                  <span className="text-secondary m-l-2">Harga Terendah</span>
                </Radio>
              </Radio.Group>
            </Form.Group>
          </Card.Body>
        </Card>

        <Card className="border-0 rounded-0 w-100 card-mobile-filter">
          <Card.Body>
            <h6>Kategori</h6>
            <Tabs>
              {listCategory.map((x, i) => (
                <Tabs.TabPane tab={x.title} key={i}>
                  <Form.Group className="mb-0 filter-category-body">
                    <Radio.Group className="w-100">
                      <Radio style={radioStyle} value={x.title}>
                        <span className="text-secondary m-l-2">Lihat Semua {x.title}</span>
                      </Radio>
                      {x.child.map((x, i) => (
                        <Radio style={radioStyle} value={x} key={i}>
                          <span className="text-secondary m-l-2">{x}</span>
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Group>
                </Tabs.TabPane>
              ))}
            </Tabs>
          </Card.Body>
        </Card>

        <Card className="border-0 rounded-0 w-100 card-mobile-filter">
          <Card.Body>
            <h6>Jenis Kelamin</h6>
            {genderList.map(tag => (
              <Tag.CheckableTag
                key={tag}
                className="filter-tag filter-tag-mobile"
              >
                {tag}
              </Tag.CheckableTag>
            ))}
          </Card.Body>
        </Card>

        <Card className="border-0 rounded-0 w-100 card-mobile-filter">
          <Card.Body>
            <h6>Harga</h6>
            <Form.Group>
              <Form.Label className="text-secondary m-b-0">Minimum</Form.Label>
              <InputNumber formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                parser={value => value.replace(/\Rp\s?|(\.*)/g, "")}
                className={`w-100`}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="text-secondary m-b-0">Maksimum</Form.Label>
              <InputNumber formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                parser={value => value.replace(/\Rp\s?|(\.*)/g, "")}
                className={`w-100`}
              />
            </Form.Group>
            <Form.Group className="mb-1">
              <Checkbox className="w-100">
                <span className="text-secondary">Diskon</span>
              </Checkbox>
            </Form.Group>
          </Card.Body>
        </Card>

        <Card className="border-0 rounded-0 w-100 card-mobile-filter">
          <Card.Body>
            <h6>Rating</h6>
            <Form.Group className="mb-1">
              <Radio.Group className="w-100">
                <Radio style={radioStyle} value={3}>
                  <span className="text-secondary m-l-2">Lihat semua</span>
                </Radio>
                <Radio style={radioStyle} value={1}>
                  <Rate disabled defaultValue={1} count={1} className="filter-rate" />
                  <span className="text-secondary pl-1">4 Keatas</span>
                </Radio>
                <Radio style={radioStyle} value={2}>
                  <Rate disabled defaultValue={1} count={1} className="filter-rate" />
                  <span className="text-secondary pl-1">3 Keatas</span>
                </Radio>
              </Radio.Group>
            </Form.Group>
          </Card.Body>
        </Card>
      </Drawer>

      <style jsx>{ProductsStyle}</style>
      <style jsx>{`
        :global(.filter-tag-mobile.ant-tag-checkable){
          border: 1px solid #d9d9d9;
        }
      `}</style>
    </>
  )
}

export default ProductContainer
