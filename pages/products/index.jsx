import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from "react-redux";
import { Menu, Rate, Tag, InputNumber, Checkbox, Drawer, Tabs, Select, Collapse, Col, Row, Empty } from 'antd';

import RowB from "react-bootstrap/Row";
import ColB from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import ButtonBoot from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import CardProduct from "components/Card/Product";
import Pagination from "components/Pagination";
import formFilter from "formdata/formFilter";

import ProductsStyle from "components/Products/style";

const CardProductMemo = React.memo(CardProduct);

const renderTitle = (title) => <b className="text-dark">{title}</b> 
const renderSubTitle = (title) => <span className="text-muted">{title}</span>

const brandList = ['Adidas', 'Billabong', 'Bershka', 'Converse', 'Deus', 'GAP', 'Giordano', 'Gucci', 'H&M', 'Mango', 'New Balance', 'Pull & Bear', 'Louis Vuitton', 'Levis', 'Nike', 'Top Man', 'Uniqlo', 'Supreme', 'Zara']
const sortList = ['Paling Sesuai', 'Harga Tertinggi', 'Harga Terendah']
const ratingList = ['4 Ketas', '3 Keatas']

const ProductContainer = () => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState(formFilter);

  const allCategories = useSelector(state => state.categories.allCategories)

  const { sort, category, rating, brand } = activeFilter;

  const showDrawer = () => { setVisible(true); };
  const onClose = () => { setVisible(false); };

  const onSortChange = e => {
    const data = { ...activeFilter, sort: {...sort, value: [e]} }
    setActiveFilter(data)
  }
  const onSortMobileChange = e => {
    const data = { ...activeFilter, sort: {...sort, value: [e]} }
    setActiveFilter(data)
  }
  const onCategoryChange = (e, fn) => {
    const data = { ...activeFilter, category: {...category, value: [e.key]} }
    const emptydata = { ...activeFilter, category: {...category, value: []} }
    if(fn === "select") setActiveFilter(data)
    if(fn === "deselect") setActiveFilter(emptydata)
  }
  const onCategoryChangeMobile = e => {
    const data = { ...activeFilter, category: {...category, value: [e.slice(-1)[0]]} }
    const emptydata = { ...activeFilter, category: {...category, value: []} }
    if(e.slice(-1)[0] !== undefined) setActiveFilter(data)
    else setActiveFilter(emptydata)
  }
  const onRatingChange = e => {
    const data = { ...activeFilter, rating: {...rating, value: [e.slice(-1)[0]]} }
    const emptydata = { ...activeFilter, rating: {...rating, value: []} }
    if(e.slice(-1)[0] !== undefined) setActiveFilter(data)
    else setActiveFilter(emptydata)
  }
  const onBrandChange = e => {
    const data = { ...activeFilter, brand: {...brand, value: e} }
    setActiveFilter(data)
  }

  const onRemoveFilter = (key, value) => {
    const state = JSON.parse(JSON.stringify(activeFilter));
    state[key].value = state[key].value.filter(e => e !== value)
    setActiveFilter(state)
  }
  const onRemoveAllFilter = () => {
    setActiveFilter(formFilter)
  }

  const renderFilterList = () => {
    let list = []
    for(let key in activeFilter){
      let tmp = []
      if(key !== 'sort'){
        if(activeFilter[key].hasOwnProperty("value")){
          if(activeFilter[key].value.length > 0){
            activeFilter[key].value.forEach(x => tmp.push({value: x, key: key}))
          }
        }
      }

      tmp.forEach(x => list.push(
        <Tag key={x.value} closable 
          className="filter-tag"
          closeIcon={<i className="fas fa-times" />}
          onClose={() => onRemoveFilter(x.key, x.value)}
        >
          {x.value}
        </Tag>
      ))
    }
     return list
  }

  return(
    <>
      <Container className="pt-4 pb-2">

        <RowB>
          <ColB className="align-self-center">
            <span className="text-secondary fs-14-s">
              Hasil pencarian dari "<span className="text-dark">{router.query.q ? router.query.q : "Semua"}</span>"
            </span>
          </ColB>
          <ColB className="d-none d-lg-block">
            <Form inline className="float-right">
              <Form.Label className="my-1 mr-2">
                Urutkan:
              </Form.Label>
              <Select value={sort.value} style={{ width: 150 }} onChange={onSortChange} dropdownClassName="idx-1020">
                {sortList.map(x => (
                  <Select.Option key={x} value={x}>{x}</Select.Option>
                ))}
              </Select>
            </Form>
          </ColB>
        </RowB>
      </Container>
      <hr />

      <Container className="pb-3 pt-3">
        <RowB>
          <ColB className="col-3 d-none d-lg-block ">
            <h6>Filter</h6>
            <Card className="border-0 shadow-filter">
              <Menu
                className="filter-menu noselect"
                defaultOpenKeys={['kategori', 'rating', 'harga', 'brand']}
                mode="inline"
                multiple={true}
                selectedKeys={category.value}
                onSelect={(e) => onCategoryChange(e, "select")}
                onDeselect={(e) => onCategoryChange(e, "deselect")}
              >
                <Menu.SubMenu 
                  key="kategori" 
                  className="title-filter" 
                  title={renderTitle('Kategori')} 
                >
                  {allCategories.map(category => (
                    <Menu.SubMenu key={category.id_category} title={renderSubTitle(category.name_category)}>
                      {category.sub_categories.map(sub => (
                        <Menu.SubMenu key={sub.id_sub_category} title={renderSubTitle(sub.name_sub_category)} className="pl-3">
                          {sub.item_sub_categories.map(item => (
                            <Menu.Item 
                              key={item.id_item_sub_category} 
                              className="text-secondary"
                            >
                              {item.name_item_sub_category}
                            </Menu.Item>
                          ))}
                        </Menu.SubMenu>
                      ))}
                    </Menu.SubMenu>
                  ))}
                </Menu.SubMenu>

                <Menu.SubMenu key="rating" className="filter-checkbox title-filter" title={renderTitle('Rating')}>
                  <div className="p-l-20 p-r-20">
                    <Checkbox.Group className="w-100" onChange={onRatingChange} value={rating.value}>
                      {ratingList.map(x => (
                        <Checkbox value={x} className="rating-checkbox" key={x}>
                          <Rate disabled defaultValue={1} count={1} className="filter-rate fs-14" />
                          <span className="text-secondary">{x}</span>
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  </div>
                </Menu.SubMenu>

                <Menu.SubMenu key="harga" className="filter-checkbox title-filter" title={renderTitle('Harga')}>
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

                <Menu.SubMenu key="brand" className="scrollable-submenu title-filter" title={renderTitle('Brand')}>
                  <div className="p-l-20 p-r-20">
                    <Checkbox.Group className="w-100" onChange={onBrandChange} value={brand.value}>
                      {brandList.map(x => (
                        <Checkbox value={x} className="rating-checkbox" key={x}>
                          <span className="text-secondary">{x}</span>
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  </div>
                </Menu.SubMenu>

              </Menu>
            </Card>
          </ColB> 

          <ColB>
            <h4 className="mb-2 d-none d-lg-block">Produk</h4>
            {renderFilterList().length > 0 && (
              <div className="mb-3 d-none d-lg-block noselect">
                <span className="text-secondary font-weight-light">Filter aktif: </span>
                {renderFilterList()}
                <a className="text-tridatu fs-14" onClick={onRemoveAllFilter}>Hapus Semua</a>
              </div>
            )}

            <Row gutter={[16, 16]}>
              {[...Array(10)].map((_, i) => (
                <Col key={i} lg={6} md={8} sm={12} xs={12}>
                  <CardProductMemo />
                </Col>
              ))}
            </Row>

            <RowB className="mt-4">
              <ColB className="align-self-center text-center">
                <Pagination />
              </ColB>
            </RowB>
          </ColB>
        </RowB>

        <RowB className="fixed-bottom text-center mb-3 d-lg-none">
          <ColB>
            <ButtonBoot variant="dark" className="badge-pill px-3 py-2 fs-14 shadow" onClick={showDrawer}>
              {renderFilterList().length > 0 ? (
                <Badge variant="light" className="mr-2">{renderFilterList().length}</Badge>
              ) : (
                <>
                  <i className="far fa-filter mr-2" />
                </>
              )}
              Filter
            </ButtonBoot>
          </ColB>
        </RowB>
      </Container>

      {/*FILTER MOBILE*/}

      <Drawer
        placement="bottom"
        title="Filter"
        closeIcon={
          <span 
            onClick={onRemoveAllFilter}
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
                checked={sort.value.indexOf(tag) > -1}
                onChange={() => onSortMobileChange(tag)}
                className="filter-tag filter-tag-mobile"
              >
                {tag}
              </Tag.CheckableTag>
            ))}
          </Card.Body>
        </Card>

        <Card className="border-0 rounded-0 w-100 card-mobile-filter noselect">
          <Card.Body>
            <h6>Kategori</h6>
            {allCategories.length == 0 && (
              <Empty className="my-5" description={<span className="text-secondary">Kategori tidak tersedia</span>} />
            )}
            <Tabs>
              {allCategories.map(category => (
                <Tabs.TabPane tab={category.name_category} key={category.id_category}>
                  <Collapse className="category-mobile scrollable-submenu" expandIconPosition="right" accordion>
                    {category.sub_categories.map(sub => (
                      <Collapse.Panel header={sub.name_sub_category} key={sub.id_sub_category}>
                        <Checkbox.Group
                          className="w-100" 
                          onChange={onCategoryChangeMobile} 
                          value={category.value}
                        >
                          {sub.item_sub_categories.map(item => (
                            <Checkbox value={item.name_item_sub_category} className="rating-checkbox" key={item.id_item_sub_category}>
                              <span className="text-secondary">{item.name_item_sub_category}</span>
                            </Checkbox>
                          ))}
                        </Checkbox.Group>
                      </Collapse.Panel>
                    ))}
                  </Collapse>
                </Tabs.TabPane>
              ))}

            </Tabs>
          </Card.Body>
        </Card>

        <Card className="border-0 rounded-0 w-100 card-mobile-filter noselect">
          <Card.Body>
            <h6>Rating</h6>
            <Checkbox.Group className="w-100" onChange={onRatingChange} value={rating.value}>
              {ratingList.map(x => (
                <Checkbox value={x} className="rating-checkbox" key={x}>
                  <Rate disabled defaultValue={1} count={1} className="filter-rate" />
                  <span className="text-secondary pl-1">{x}</span>
                </Checkbox>
              ))}
            </Checkbox.Group>
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
            <Form.Group className="mb-1 noselect">
              <Checkbox className="w-100">
                <span className="text-secondary">Diskon</span>
              </Checkbox>
            </Form.Group>
          </Card.Body>
        </Card>

        <Card className="border-0 rounded-0 w-100 card-mobile-filter noselect">
          <Card.Body>
            <h6>Brand</h6>
            <Checkbox.Group className="w-100 scrollable-submenu" onChange={onBrandChange} value={brand.value}>
              {brandList.map(x => (
                <Checkbox value={x} className="rating-checkbox" key={x}>
                  <span className="text-secondary">{x}</span>
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Card.Body>
        </Card>

      </Drawer>

      <style jsx>{ProductsStyle}</style>
      <style jsx>{`
        :global(.filter-tag-mobile.ant-tag-checkable){
          border: 1px solid #d9d9d9;
        }
        :global(.rating-checkbox){
          width: 100%;
          line-height: 30px;
          display: block;
          margin-left: 0px!important;
          margin-top: 4px;
          margin-bottom: 5px;
        }
        :global(.category-mobile){
          background-color: white;
          border: 0;
        }
        :global(.ant-collapse.category-mobile > .ant-collapse-item:last-of-type){
          border: 0;
        }
        :global(.ant-collapse-icon-position-right.category-mobile > .ant-collapse-item > .ant-collapse-header){
          padding-left: 0;
        }
      `}</style>
    </>
  )
}

export default ProductContainer
