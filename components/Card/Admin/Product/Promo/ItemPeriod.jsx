import moment from 'moment'
import isIn from 'validator/lib/isIn'

import { not_active } from './statusType'

const ItemPeriodPromo = ({ statusPromo, start, end }) => {
  if(isIn(not_active, [ statusPromo ])){
    return <p className="date-discount">Belum Ada Diskon</p>
  } 
  else {
    return (
      <>
        <small className="text-black-50">Mulai</small>
        <p className="date-discount">{moment(start).format("DD MMM YYYY HH:mm")}</p>
        <small className="text-muted">Selesai</small>
        <p className="date-discount">{moment(end).format("DD MMM YYYY HH:mm")}</p>
      </>
    )
  }
}

export default ItemPeriodPromo
