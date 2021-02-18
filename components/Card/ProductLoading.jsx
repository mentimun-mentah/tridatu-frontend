import { motion } from 'framer-motion'
import { Skeleton } from 'antd';

import Card from "react-bootstrap/Card";

const ProductLoading = () => {
  return(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: ".2" }}
      >
        <Card className="border-0 shadow h-100">
          <div className="loading-square-img">
            <Skeleton.Avatar shape="square" active className="loading-content-img" />
          </div>
          <Card.Body className="p-2 card-body-height">
            <Skeleton className="loading-card" active paragraph={{ rows: 3 }}/>
          </Card.Body>
        </Card>
      </motion.div>

      <style jsx>{`
      :global(.loading-square-img){
        position: relative;
        width: 100%;
      }
      :global(.loading-square-img:after) {
        content: "";
        display: block;
        padding-bottom: 100%;
      }
      :global(.loading-content-img){
        position: absolute;
        width: 100%;
        height: 100%;
      }
      :global(.loading-content-img.ant-skeleton-element .ant-skeleton-avatar){
        width: 100%;
        height: 100%;
        border-top-left-radius: .25rem;
        border-top-right-radius: .25rem;
      }
      :global(
        .loading-card .ant-skeleton-content .ant-skeleton-title + .ant-skeleton-paragraph, 
        .loading-card .ant-skeleton-content .ant-skeleton-title
      ){
        margin-top: 0px;
      }
      :global(.loading-card .ant-skeleton-content .ant-skeleton-title){
        margin-bottom: 11px;
      }
      :global(.loading-card .ant-skeleton-content .ant-skeleton-paragraph > li + li){
        margin-top: 10px;
      }
      `}</style>
    </>
  )
}

export default ProductLoading
