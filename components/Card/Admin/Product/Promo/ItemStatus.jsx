import { Badge } from 'antd'
import { not_active, will_come, ongoing, have_ended } from './statusType'

const ItemStatusPromo = ({ statusPromo, t }) => (
  <>
    <div className="noselect">
      {statusPromo === not_active && <Badge color="#6c757d" text={t.status_type.not_active} />}
      {statusPromo === will_come && <Badge color="yellow" text={t.status_type.will_come} />}
      {statusPromo === ongoing && <Badge className="badge-green-processing" status="processing" color="green" text={t.status_type.ongoing} />}
      {statusPromo === have_ended && <Badge color="orange" text={t.status_type.have_ended} />}
    </div>
    <style jsx>{`
      :global(.badge-green-processing > .ant-badge-status-processing::after){
        border: 1px solid #53c519;
      }
    `}</style>
  </>
)

export default ItemStatusPromo
