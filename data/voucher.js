import { Tooltip } from 'antd'

import kFormatter from "lib/kFormatter";
import ItemInfoPromo from "components/Card/Admin/Product/Promo/ItemInfo";
import ItemPricePromo from "components/Card/Admin/Product/Promo/ItemPrice";

import ItemBrandInfo from "components/Card/Admin/Brands/ItemInfo";

export const columnsVoucher = (t) => [
  {
    key: 'code',
    title: (
      <span>
        {t.bonus_settings.voucher_code}
        <Tooltip title={<small className="noselect">{t.bonus_settings.tooltip.voucher_code}</small>}>
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
    key: 'quota',
    title: (
      <span>
        {t.bonus_settings.claim_quota}
        <Tooltip title={<small className="noselect">{t.bonus_settings.tooltip.claim_quota}</small>}>
        <i className="fal fa-info-circle text-muted ml-1" />
        </Tooltip>
      </span>
    ),
    dataIndex: 'voucher',
    type: 'quota',
    editable: true,
    // width: 250,
  },
  {
    key: 'min_transaction',
    title: (
      <span>
        {t.bonus_settings.min_transaction}
        <Tooltip title={<small className="noselect">{t.bonus_settings.tooltip.min_transaction}</small>}>
        <i className="fal fa-info-circle text-muted ml-1" />
        </Tooltip>
      </span>
    ),
    dataIndex: 'voucher',
    type: 'min_transaction',
    editable: true,
    // width: 250,
  },
  {
    key: 'nominal-percent',
    title: t.bonus_settings.nominal_percent,
    dataIndex: 'voucher',
    type: 'nominal-percent',
    editable: true,
    // width: 250,
  },
  {
    key: 'max_discount',
    title: t.bonus_settings.max_discount,
    dataIndex: 'voucher',
    type: 'max_discount',
    editable: true,
    // width: 250,
  },
  {
    key: 'action',
    title: t.bonus_settings.action,
    align: 'center',
    type: 'action',
    editable: true,
    render: () => <a><i className="fal fa-trash-alt text-center" /></a>,
  }
]

export const columnsVoucherUpdate = [
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
    title: (
      <span>
        Min. Transaksi
        <Tooltip title={<small className="noselect">Minimum transaksi dapat dikosongkan</small>}>
        <i className="fal fa-info-circle text-muted ml-1" />
        </Tooltip>
      </span>
    ),
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
  }
]

export const columnsOngkirUpdate = [
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
    key: 'quota',
    title: (
      <span>
        Kuota Klaim
        <Tooltip title={<small className="noselect">Jumlah voucher dapat diklaim pengguna</small>}>
        <i className="fal fa-info-circle text-muted ml-1" />
        </Tooltip>
      </span>
    ),
    dataIndex: 'voucher',
    type: 'quota',
    editable: true,
  },
  {
    key: 'min_transaction',
    title: "Min. Transaksi",
    dataIndex: 'voucher',
    type: 'min_transaction',
    editable: true,
  },
  {
    key: 'action',
    title: "Aksi",
    align: 'center',
    type: 'action',
    editable: true,
    render: () => <a><i className="fal fa-trash-alt text-center" /></a>,
  }
]

export const columnsOngkir = (t) => [
  {
    key: 'code',
    title: (
      <span>
        {t.bonus_settings.voucher_code}
        <Tooltip title={<small className="noselect">{t.bonus_settings.tooltip.voucher_code}</small>}>
        <i className="fal fa-info-circle text-muted ml-1" />
        </Tooltip>
      </span>
    ),
    dataIndex: 'voucher',
    type: 'code',
    editable: true,
  },
  {
    key: 'quota',
    title: (
      <span>
        {t.bonus_settings.claim_quota}
        <Tooltip title={<small className="noselect">{t.bonus_settings.tooltip.claim_quota}</small>}>
        <i className="fal fa-info-circle text-muted ml-1" />
        </Tooltip>
      </span>
    ),
    dataIndex: 'voucher',
    type: 'quota',
    editable: true,
  },
  {
    key: 'min_transaction',
    title: t.bonus_settings.min_transaction,
    dataIndex: 'voucher',
    type: 'min_transaction',
    editable: true,
  },
  {
    key: 'action',
    title: t.bonus_settings.action,
    align: 'center',
    type: 'action',
    editable: true,
    render: () => <a><i className="fal fa-trash-alt text-center" /></a>,
  }
]

export const columnsVoucherProduct = (t) => [
  {
    title: t.basic_details.product,
    dataIndex: "products",
    key: "product",
    width: 270,
    ellipsis: true,
    render: (item) => (
      <ItemInfoPromo
        image={item.products_image_product}
        name={item.products_name}
        slug={item.products_slug}
      />
    ),
  },
  {
    title: t.basic_details.price,
    dataIndex: "products",
    key: "price",
    width: 180,
    ellipsis: true,
    sorter: true,
    // sorter: (a, b) => +a.products.variants_max_price - +b.products.variants_max_price,
    render: (item) => (
      <ItemPricePromo
        discount={item.variants_discount}
        minPrice={+item.variants_min_price}
        maxPrice={+item.variants_max_price}
      />
    ),
  },
  {
    title: t.basic_details.stock,
    dataIndex: "products",
    key: "stock",
    width: 150,
    align: "center",
    render: (item) => <span>{kFormatter(+item.variants_total_stock, 'k')}</span>,
  },
]

export const columnsSelectedProduct = [
  {
    title: "Produk",
    dataIndex: "products",
    key: "product",
    width: "40%",
    ellipsis: true,
    render: (item) => (
      <ItemInfoPromo
        image={item.products_image_product}
        name={item.products_name}
        slug={item.products_slug}
      />
    ),
  },
  {
    title: "Harga",
    dataIndex: "products",
    key: "price",
    width: "20%",
    ellipsis: true,
    render: (item) => (
      <ItemPricePromo
        discount={item.variants_discount}
        minPrice={+item.variants_min_price}
        maxPrice={+item.variants_max_price}
      />
    ),
  },
  {
    title: "Stok",
    dataIndex: "products",
    key: "stock",
    width: "20%",
    align: "center",
    render: (item) => <span>{kFormatter(+item.variants_total_stock, 'k')}</span>,
  },
  {
    key: 'action',
    title: 'Aksi',
    align: 'center',
    type: 'action',
    width: "20%",
    editable: true,
    render: () => <a><i className="fal fa-trash-alt text-center" /></a>,
  }
]

export const columnsVoucherBrand = (t) => [
  {
    title: t.basic_details.brand,
    dataIndex: "brand",
    key: "brand",
    width: 270,
    ellipsis: true,
    render: (item) => <ItemBrandInfo image={item.image} name={item.name} />
  },
]

export const columnsSelectedBrand = [
  {
    title: "Brand",
    dataIndex: "brand",
    key: "brand",
    ellipsis: true,
    width: "80%",
    render: (item) => <ItemBrandInfo image={item.image} name={item.name} />
  },
  {
    key: 'action',
    title: 'Aksi',
    align: 'center',
    type: 'action',
    width: "20%",
    editable: true,
    render: () => <a><i className="fal fa-trash-alt text-center" /></a>,
  }
]

export const columnsVoucherCategory = (t) => [
  {
    title: t.basic_details.category,
    dataIndex: "category",
    key: "category",
    render: (item) => <span>{item.categories_name}</span>
  },
]

export const columnsSelectedCategory = [
  {
    title: "Kategori",
    dataIndex: "category",
    key: "category",
    ellipsis: true,
    width: "80%",
    render: (item) => <span>{item.categories_name}</span>
  },
  {
    key: 'action',
    title: 'Aksi',
    align: 'center',
    type: 'action',
    editable: true,
    width: "20%",
    render: () => <a><i className="fal fa-trash-alt text-center" /></a>,
  }
]

export const columnsVoucherSubCategory = (t) => [
  {
    title: t.basic_details.sub_category,
    dataIndex: "category",
    key: "category",
    render: (item) => (
      <div className="text-secondary">{item.categories_name} / <span className="text-dark">{item.sub_categories_name}</span></div>
    )
  },
]

export const columnsSelectedSubCategory = [
  {
    title: "Sub Kategori",
    dataIndex: "category",
    key: "category",
    ellipsis: true,
    width: "80%",
    render: (item) => (
      <div className="text-secondary">{item.categories_name} / <span className="text-dark">{item.sub_categories_name}</span></div>
    )
  },
  {
    key: 'action',
    title: 'Aksi',
    align: 'center',
    type: 'action',
    width: "20%",
    editable: true,
    render: () => <a><i className="fal fa-trash-alt text-center" /></a>,
  }
]

export const columnsVoucherItemSubCategory = (t) => [
  {
    title: t.basic_details.item_sub_category,
    dataIndex: "category",
    key: "category",
    render: (item) => <span>{item.name}</span>
  },
]

export const columnsSelectedItemSubCategory = [
  {
    title: "Item Sub Kategori",
    dataIndex: "category",
    key: "category",
    ellipsis: true,
    width: "80%",
    render: (item) => <span>{item.name}</span>
  },
  {
    key: 'action',
    title: 'Aksi',
    align: 'center',
    type: 'action',
    width: "20%",
    editable: true,
    render: () => <a><i className="fal fa-trash-alt text-center" /></a>,
  }
]
