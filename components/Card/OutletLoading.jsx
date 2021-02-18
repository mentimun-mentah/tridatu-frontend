import { Skeleton } from "antd";
import { motion } from 'framer-motion'

const OutletImageLoading = () => {
  return(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: ".2" }}
      >
        <div className="outlet-loading-square-img">
          <Skeleton.Avatar shape="square" active className="outlet-loading-content-img" />
        </div>
      </motion.div>

      <style jsx>{`
        :global(.outlet-loading-square-img){
          position: relative;
          width: 100%;
        }
        :global(.outlet-loading-square-img:after) {
          content: "";
          display: block;
          padding-bottom: 100%;
        }
        :global(.outlet-loading-content-img){
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
        }
        :global(.outlet-loading-content-img.ant-skeleton-element .ant-skeleton-avatar){
          width: 100%;
          height: 100%;
          border-radius: .2rem;
        }
      `}</style>
    </>
  )
}

export default OutletImageLoading
