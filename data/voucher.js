import { Tooltip } from 'antd'

export const columnsVoucher = [
  {
    key: 'code',
    title: (
      <span>
        Kode Voucher 
        <Tooltip title={<small className="noselect">Kode voucher mengandung Alfabet (A-Z) dan Angka (0-9)</small>}>
        <i className="fal fa-info-circle text-muted ml-1" />
        </Tooltip>
      </span>
    ),
    dataIndex: 'voucher',
    type: 'code',
    editable: true,
    // width: 250,
  },
  {
    key: 'kuota',
    title: (
      <span>
        Kuota Klaim
        <Tooltip title={<small className="noselect">Jumlah voucher dapat diklaim pengguna</small>}>
        <i className="fal fa-info-circle text-muted ml-1" />
        </Tooltip>
      </span>
    ),
    dataIndex: 'voucher',
    type: 'kuota',
    editable: true,
    // width: 250,
  },
  {
    key: 'min_transaction',
    title: 'Min. Transaksi',
    dataIndex: 'voucher',
    type: 'minimum',
    editable: true,
    // width: 250,
  },
  {
    key: 'nominal',
    title: 'Nominal/Persentase',
    dataIndex: 'voucher',
    type: 'nominal',
    editable: true,
    // width: 250,
  },
  {
    key: 'max_discount',
    title: 'Max. Discount',
    dataIndex: 'voucher',
    type: 'max_discount',
    editable: true,
    // width: 250,
  },
  {
    key: 'action',
    title: 'Aksi',
    align: 'center',
    type: 'action',
    editable: true,
    render: () => <a><i className="fal fa-trash-alt text-center" /></a>,
  }
]

export const columnsOngkir = [
  {
    key: 'code',
    title: (
      <span>
        Kode Voucher 
        <Tooltip title={<small className="noselect">Kode voucher mengandung Alfabet (A-Z) dan Angka (0-9)</small>}>
        <i className="fal fa-info-circle text-muted ml-1" />
        </Tooltip>
      </span>
    ),
    dataIndex: 'voucher',
    type: 'code',
    editable: true,
  },
  {
    key: 'kuota',
    title: (
      <span>
        Kuota Klaim
        <Tooltip title={<small className="noselect">Jumlah voucher dapat diklaim pengguna</small>}>
        <i className="fal fa-info-circle text-muted ml-1" />
        </Tooltip>
      </span>
    ),
    dataIndex: 'voucher',
    type: 'kuota',
    editable: true,
  },
  {
    key: 'min_transaction',
    title: 'Min. Transaksi',
    dataIndex: 'voucher',
    type: 'minimum',
    editable: true,
  },
  {
    key: 'action',
    title: 'Aksi',
    align: 'center',
    type: 'action',
    editable: true,
    render: () => <a><i className="fal fa-trash-alt text-center" /></a>,
  }
]
