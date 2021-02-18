import { Skeleton } from 'antd';
import { motion } from 'framer-motion'

import Card from "react-bootstrap/Card";

const CardBannerLoading = () => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: ".2" }}
      >
        <Card className="border-0">
          <div className="banner-loading-square-img">
            <Skeleton.Avatar shape="square" active className="banner-loading-content-img" />
          </div>
        </Card>
      </motion.div>

      <style jsx>{`
      :global(.banner-loading-square-img){
        position: relative;
        width: 100%;
      }
      :global(.banner-loading-square-img:after) {
        content: "";
        display: block;
        padding-bottom: 57%;
      }
      :global(.banner-loading-content-img){
        position: absolute;
        width: 100%;
        height: 100%;
      }
      :global(.banner-loading-content-img.ant-skeleton-element .ant-skeleton-avatar){
        width: 100%;
        height: 100%;
        border-radius: .2rem;
      }
      `}</style>
    </>
  );
};

export default CardBannerLoading;
