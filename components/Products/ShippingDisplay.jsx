import { useSelector } from 'react-redux'
import { Skeleton } from 'antd';

import formatNumber from "lib/formatNumber";

const ShippingDisplayContainer = ({ data }) => {
  if(typeof data == "object") data = JSON.stringify(data)
  if(typeof data == "string") data = JSON.parse(data)

  const loadingCost = useSelector(state => state.shipping.loading)

  return(
    <>
      <div className="d-flex justify-content-between noselect h-100">
        <div className="lh-1-5 h-100" style={{ width: 'calc(100%/2)' }}>
          <p className="mb-0 text-muted"><small>Kurir</small></p>
          {loadingCost ? (
            <Skeleton.Button active className="w-100 h-23 m-t-2" />
          ) : (
            <p className="mb-0 text-uppercase text-truncate courier-code"> 
              {data.code && <img src={`/static/images/couriers/${data.code}.png`} className="courier-img" />}
              {data.code || "-"} {data.services || "-"}
            </p>
          )}
        </div>
        <div className="lh-1-5 h-100">
          <p className="mb-1 text-muted"><small>Estimasi</small></p>
          {loadingCost ? (
            <Skeleton.Button active className="w-100 h-23" />
          ) : (
            <p className="mb-0 text-truncate"> {data.etd || 0} hari </p>
          )}
        </div>
        <div className="lh-1-5 h-100">
          <p className="mb-1 text-muted"><small>Harga</small></p>
          {loadingCost ? (
            <Skeleton.Button active className="w-100 h-23" />
          ) : (
            <p className="mb-0 text-truncate"> Rp.{formatNumber(data.cost || 0)} </p>
          )}
        </div>
      </div>

      <style jsx>{`
        :global(.h-23){
          height: 23px !important;
        }
        :global(.h-26){
          height: 26px !important;
        }
        .lh-1-5{
          line-height: 1.4;
        }
        .courier-code{
          margin-top: -5px;
        }
        .courier-img{
          height: 35px;
          margin-left: -5px;
        }
      `}</style>
    </>
  )
}

export default ShippingDisplayContainer
