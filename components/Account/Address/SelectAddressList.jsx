import { Button } from "antd";
import { motion } from "framer-motion";
import { LoadingOutlined } from "@ant-design/icons";

import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Media from "react-bootstrap/Media";

const SelectAddressList = ({ data, changeMainAddress, loading }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: ".2" }}
        className={`card card-address fs-12-s ${data.main_address && "card-list-address-border-active"}`}
      >
        <Media>
          <Media.Body>
            <Card.Body>
              <p className="user-address-title mb-0 fw-500">
                {data.receiver}{" "}
                <span className="font-weight-light">({data.label}) </span>
                {data.main_address && <Badge variant="primary">Utama</Badge>}
              </p>
              <p className="font-weight-light user-phone mb-0">{data.phone}</p>
              <p className="text-secondary mb-0">
                {data.recipient_address}
                <br />
                {data.region}, {data.postal_code}
              </p>
            </Card.Body>
          </Media.Body>
          {!data.main_address && (
            <Button
              className="align-self-center btn-tridatu m-r-20 d-none d-sm-block"
              onClick={changeMainAddress}
              style={{ width: 107 }}
              disabled={loading}
            >
              {loading ? <LoadingOutlined /> : "Pilih Alamat"}
            </Button>
          )}
          </Media>

        {!data.main_address && (
          <Button
            block
            disabled={loading}
            className="align-self-center btn-tridatu d-block d-sm-none bor-rad-top-0 fs-12"
            onClick={changeMainAddress}
          >
            {loading ? <LoadingOutlined /> : "Pilih Alamat"}
          </Button>
        )}
      </motion.div>

      <style jsx>{`
        :global(.card-list-address-border-active){
          border: 1px solid #ffa0a2!important;
        }
        :global(.bor-rad-top-0){
          border-top-left-radius: 0!important;
          border-top-right-radius: 0!important;
        }
      `}</style>
    </>
  );
};

export default SelectAddressList;
