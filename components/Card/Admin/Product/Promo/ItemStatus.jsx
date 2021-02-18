import { Badge } from 'antd'
import { not_active, will_come, ongoing, have_ended } from './statusType'

const ItemStatusPromo = ({ statusPromo }) => (
  <>
    <div className="noselect">
      {statusPromo === not_active && <Badge color="#6c757d" text="Tidak Aktif" />}
      {statusPromo === will_come && <Badge color="yellow" text="Akan Datang" />}
      {statusPromo === ongoing && <Badge className="badge-green-processing" status="processing" color="green" text="Sedang Berjalan" />}
      {statusPromo === have_ended && <Badge color="orange" text="Telah Berakhir" />}
    </div>
    <style jsx>{`
      :global(.badge-green-processing > .ant-badge-status-processing::after){
        border: 1px solid #53c519;
      }
    `}</style>
  </>
)

export default ItemStatusPromo
