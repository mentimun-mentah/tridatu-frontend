import moment from 'moment'
import isIn from 'validator/lib/isIn'

import { not_active } from './statusType'

const ItemPeriodPromo = ({ statusPromo, start, end, t }) => {
  if(isIn(not_active, [ statusPromo ])){
    return <p className="date-discount">{t.no_discount}</p>
  } 
  else {
    return (
      <>
        <small className="text-black-50">{t.start}</small>
        <p className="date-discount">{moment(start).format("DD MMM YYYY HH:mm")}</p>
        <small className="text-muted">{t.finish}</small>
        <p className="date-discount">{moment(end).format("DD MMM YYYY HH:mm")}</p>
      </>
    )
  }
}

export default ItemPeriodPromo
