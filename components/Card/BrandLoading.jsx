import Link from "next/link";
import Card from "react-bootstrap/Card";
import { Skeleton } from 'antd';
import { motion } from 'framer-motion'

const CardBrand = ({ name, image }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: ".2" }}
      >
        <Card className="border-0 shadow text-center p-t-20">
          <Link href="/products" as="/products">
            <a className="text-decoration-none text-dark text-center mx-auto brand-image">
              <div className="brand-loading-square-img">
                <Skeleton.Avatar shape="square" active className="brand-loading-content-img" />
              </div>
              <Card.Body className="pt-2 p-b-10">
                <Skeleton.Button active size="small" shape="square" />
              </Card.Body>
            </a>
          </Link>
        </Card>
      </motion.div>

      <style jsx>{`
      :global(.brand-image > div){
        margin-left: auto!important;
        margin-right: auto!important;
        margin-bottom: 4px;
      }

      :global(.brand-loading-square-img){
        position: relative;
        width: 100%;
      }
      :global(.brand-loading-square-img:after) {
        content: "";
        display: block;
        padding-bottom: 100%;
      }
      :global(.brand-loading-content-img){
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
      }
      :global(.brand-loading-content-img.ant-skeleton-element .ant-skeleton-avatar){
        width: 100%;
        height: 100%;
        border-radius: .2rem;
      }
      `}</style>
    </>
  );
};

export default CardBrand;
