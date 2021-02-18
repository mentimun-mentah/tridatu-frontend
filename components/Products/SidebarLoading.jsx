import { Menu, Skeleton } from 'antd';
import { AnimatePresence, motion } from 'framer-motion'
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

const SidebarLoadingContainer = () => {
  return(
    <>
      <Col className="col-3 d-none d-lg-block ">
        <h6>Filter</h6>
        <div className="card border-0 shadow-filter">
          <Menu
            className="filter-menu filter-menu-loading noselect"
            openKeys={["0","1","2","3","4"]}
            mode="inline"
            selectable={false}
            expandIcon={<></>}
          >
            {[...Array(5)].map((_, i) => (
              <Menu.SubMenu key={i}
                className="title-filter" 
                title={<Skeleton.Input className="w-75 bor-rad-25rem va-sub" active={true} size="small" />} 
              >
                <div className="p-l-20 p-r-20 pt-1">
                  <Form.Group>
                    {[...Array(3)].map((_,idx) => (
                      <Skeleton.Input className="w-100 mb-1 bor-rad-25rem va-sub" active={true} size="small" key={idx} />
                    ))} 
                    <Skeleton.Input className="w-100 bor-rad-25rem va-sub" active={true} size="small" />
                  </Form.Group>
                </div>
              </Menu.SubMenu>
            ))}
          </Menu>
        </div>
      </Col>

      <style jsx>{`
        :global(.filter-menu.filter-menu-loading .ant-menu-submenu-title){
          padding-left: 15px !important;
          margin-left: 0px !important;
        }
        :global(.filter-menu.filter-menu-loading .ant-menu-item:active, .ant-menu-submenu-title:active){
          background-color: transparent;
        }
      `}</style>
    </>
  )
}

export default SidebarLoadingContainer
