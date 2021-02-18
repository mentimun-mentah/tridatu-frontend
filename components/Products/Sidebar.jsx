import { useSelector } from "react-redux";
import { DownOutlined } from '@ant-design/icons';
import { Menu, Rate, InputNumber, Checkbox, Tree } from 'antd';

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

const renderTitle = (title) => <b className="text-dark">{title}</b> 

const SidebarContainer = ({ 
  treeData, filterState, categoryKeys,
  onChange, onCategoryChange, onConditionChange, onWholesaleChange, onBrandChange, 
  onPreOrderChange, onDiscountChange
}) => {

  const brands = useSelector(state => state.brand.brand)
  const { rating, brand, p_min, p_max, pre_order, is_discount, condition, wholesale } = filterState;

  return(
    <>
      <Col className="col-3 d-none d-lg-block ">
        <h6>Filter</h6>
        <Card className="border-0 shadow-filter">
          <Menu
            mode="inline"
            multiple={true}
            className="filter-menu noselect"
            defaultOpenKeys={['kategori', 'rating', 'harga', 'brand', 'penawaran', 'kondisi', 'lainnya']}
          >

            <Menu.SubMenu key="kategori" className="title-filter" title={renderTitle('Kategori')} >
              <div className="p-l-20 p-r-20 scrollable-submenu-category">
                <Tree
                  blockNode
                  autoExpandParent
                  treeData={treeData}
                  className="tree-category"
                  onSelect={onCategoryChange}
                  selectedKeys={categoryKeys}
                  defaultExpandedKeys={categoryKeys}
                  switcherIcon={<DownOutlined className="text-muted" />}
                />
              </div>
            </Menu.SubMenu>

            <Menu.SubMenu key="harga" className="filter-checkbox title-filter" title={renderTitle('Harga')}>
              <div className="p-l-20 p-r-20 mt-3">
                <Form.Group>
                  <Form.Label className="text-secondary m-b-13">Harga Minimum</Form.Label>
                  <InputNumber formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    parser={value => value.replace(/\Rp\s?|(\.*)/g, "")}
                    min={1}
                    className="w-100"
                    value={p_min.value}
                    onChange={(e) => onChange(e, "p_min")}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label className="text-secondary m-b-13">Harga Maksimum</Form.Label>
                  <InputNumber formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    parser={value => value.replace(/\Rp\s?|(\.*)/g, "")}
                    min={2}
                    className="w-100"
                    value={p_max.value}
                    onChange={(e) => onChange(e, "p_max")}
                  />
                </Form.Group>
              </div>
            </Menu.SubMenu>

            <Menu.SubMenu key="kondisi" className="scrollable-submenu title-filter" title={renderTitle('Kondisi')}>
              <div className="p-l-20 p-r-20">
                <Checkbox.Group className="w-100" onChange={onConditionChange} value={condition.value}>
                  <Checkbox 
                    value="true"
                    label="Baru" 
                    className="rating-checkbox" 
                    onChange={(e) => onConditionChange(e, "label")}
                  >
                    <span className="text-secondary">Baru</span>
                  </Checkbox>
                  <Checkbox 
                    value="false"
                    label="Bekas" 
                    className="rating-checkbox" 
                    onChange={(e) => onConditionChange(e, "label")}
                  >
                    <span className="text-secondary">Bekas</span>
                  </Checkbox>
                </Checkbox.Group>
              </div>
            </Menu.SubMenu>

            <Menu.SubMenu key="rating" className="filter-checkbox title-filter" title={renderTitle('Rating')}>
              <div className="p-l-20 p-r-20">
                <Checkbox.Group className="w-100" /*onChange={onRatingChange} value={rating.value}*/>
                  <Checkbox value="4" className="rating-checkbox mt-0">
                    <Rate disabled defaultValue={1} count={1} className="filter-rate fs-14" />
                    <span className="text-secondary">4 Keatas</span>
                  </Checkbox>
                </Checkbox.Group>
              </div>
            </Menu.SubMenu>

            <Menu.SubMenu key="penawaran" className="scrollable-submenu title-filter" title={renderTitle('Penawaran')}>
              <div className="p-l-20 p-r-20">
                <Checkbox.Group className="w-100" onChange={onDiscountChange} value={is_discount.value}>
                  <Checkbox 
                    value="true"
                    label="Diskon" 
                    className="rating-checkbox" 
                    onChange={(e) => onDiscountChange(e, "label")}
                  >
                    <span className="text-secondary">Diskon</span>
                  </Checkbox>
                </Checkbox.Group>
                <Checkbox.Group className="w-100" onChange={onWholesaleChange} value={wholesale.value}>
                  <Checkbox 
                    value="true"
                    label="Harga Grosir" 
                    className="rating-checkbox" 
                    onChange={(e) => onWholesaleChange(e, "label")}
                  >
                    <span className="text-secondary">Harga Grosir</span>
                  </Checkbox>
                </Checkbox.Group>
              </div>
            </Menu.SubMenu>

            <Menu.SubMenu key="brand" className="scrollable-submenu-brand title-filter" title={renderTitle('Brand')}>
              <div className="p-l-20 p-r-20">
                <Checkbox.Group className="w-100" onChange={onBrandChange} value={brand.value}>
                  {brands && brands.length > 0 && brands.map(({id, name}) => (
                    <Checkbox 
                      key={id} 
                      value={id} 
                      label={name} 
                      className="rating-checkbox" 
                      onChange={(e) => onBrandChange(e, "label")}
                    >
                      <span className="text-secondary">{name}</span>
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </div>
            </Menu.SubMenu>

            <Menu.SubMenu key="lainnya" className="scrollable-submenu title-filter" title={renderTitle('Lainnya')}>
              <div className="p-l-20 p-r-20">
                <Checkbox.Group className="w-100" onChange={onPreOrderChange} value={pre_order.value}>
                  <Checkbox 
                    value="true"
                    label="Pre Order" 
                    className="rating-checkbox" 
                    onChange={(e) => onPreOrderChange(e, "label")}
                  >
                    <span className="text-secondary">Pre Order</span>
                  </Checkbox>
                  <Checkbox 
                    value="false"
                    label="Ready Stock" 
                    className="rating-checkbox" 
                    onChange={(e) => onPreOrderChange(e, "label")}
                  >
                    <span className="text-secondary">Ready Stock</span>
                  </Checkbox>
                </Checkbox.Group>
              </div>
            </Menu.SubMenu>

          </Menu>
        </Card>
      </Col>

      <style jsx>{`
        :global(.rating-checkbox){
          width: 100%;
          line-height: 30px;
          display: block;
          margin-left: 0px!important;
          margin-top: 4px;
          margin-bottom: 5px;
        }
        :global(.tree-category .ant-tree-switcher){
          width: 14px;
          text-align: left;
        }
        :global(.tree-category .ant-tree-switcher.ant-tree-switcher-noop){
          width: 0px;
        }
        :global(.tree-category.ant-tree){
          color: #6c757d;
        }
        :global(.tree-category.ant-tree .ant-tree-node-content-wrapper){
          min-height: 28px;
          line-height: 28px;
          border-radius: .25rem;
        }
        :global(.tree-category.ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected){
          font-weight: bold;
          background-color: transparent;
        }
        :global(.tree-category.ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected:hover){
          background-color: #f5f5f5;
        }
      `}</style>
    </>
  )
}

export default SidebarContainer
