import { Badge } from 'antd'
import { countDiscPrice } from 'lib/utility'
import formatNumber from 'lib/formatNumber'

const ItemPricePromo = ({ discount, maxPrice, minPrice }) => {
  if(countDiscPrice(discount, minPrice) === countDiscPrice(discount, maxPrice) && discount) {
    return (
      <div className="w-100">
        <div className="d-flex align-items-center">
          <small className="mb-0 text-truncate"><s>Rp.{formatNumber(maxPrice)}</s></small>
          <Badge count={`${discount}%`} size="small" className="nav-notification noselect ml-1" />
        </div>
        <p className="mb-0 text-truncate">Rp.{formatNumber(countDiscPrice(discount, maxPrice))}</p>
      </div>
    )
  } 
  else if(countDiscPrice(discount, minPrice) === countDiscPrice(discount, maxPrice) && !discount) {
    return <p className="mb-0 text-truncate">Rp.{formatNumber(minPrice)}</p>
  } 
  else if(countDiscPrice(discount, minPrice) !== countDiscPrice(discount, maxPrice) && discount) {
    return (
      <div className="w-100">
        <div className="d-flex align-items-center">
          <p className="mb-0 text-truncate">Rp.{formatNumber(minPrice)} - {" "}
            <Badge count={`${discount}%`} size="small" className="nav-notification noselect ml-1" />
          </p>
        </div>
        <p className="mb-0 text-truncate">Rp.{formatNumber(maxPrice)}</p>
      </div>
    )
  }
  else if(countDiscPrice(discount, minPrice) !== countDiscPrice(discount, maxPrice) && !discount) {
    return (
      <div className="w-100">
        <div className="d-flex">
          <p className="mb-0 text-truncate">Rp.{formatNumber(minPrice)} -{" "}</p>
        </div>
        <p className="mb-0 text-truncate">Rp.{formatNumber(maxPrice)}</p>
      </div>
    )
  } else {
    return <p className="mb-0 text-truncate">Rp.{formatNumber(minPrice)}</p>
  }
}

export default ItemPricePromo
