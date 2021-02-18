import { Switch, InputNumber } from "antd";

import formatNumber from "lib/formatNumber";

import ItemInfoPromo from "components/Card/Admin/Product/Promo/ItemInfo";
import ItemPricePromo from "components/Card/Admin/Product/Promo/ItemPrice";
import ItemPeriodPromo from "components/Card/Admin/Product/Promo/ItemPeriod";
import ItemStatusPromo from "components/Card/Admin/Product/Promo/ItemStatus";
import { not_active, will_come, ongoing, have_ended } from 'components/Card/Admin/Product/Promo/statusType'

export const orderList = [
  { label: "Semua Status", value: "" },
  { label: "Sedang Berjalan", value: ongoing },
  { label: "Akan Datang", value: will_come },
  { label: "Tidak Aktif", value: not_active },
  { label: "Telah Berakhir", value: have_ended },
];

export const columns = [
  {
    title: "Produk",
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
    title: "Harga",
    dataIndex: "products",
    key: "price",
    width: 180,
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
    title: "Periode Diskon",
    dataIndex: "products",
    key: "period",
    width: 200,
    ellipsis: true,
    render: (item) => (
      <ItemPeriodPromo
        statusPromo={item.products_discount_status}
        start={item.products_discount_start}
        end={item.products_discount_end}
      />
    ),
  },
  {
    title: "Status",
    dataIndex: "products",
    key: "status",
    width: 200,
    ellipsis: true,
    render: (item) => <ItemStatusPromo statusPromo={item.products_discount_status} />,
  },
  {
    title: "Aksi",
    dataIndex: "products",
    key: "action",
    width: 200,
    action: true,
  },
];


/* ################## */
/* ################## */
export const columnsProductNoVariant = [
  {
    title: "Harga Normal",
    dataIndex: "product",
    key: "price",
    align: "center",
    width: 200,
    render: (item) => (
      <p className="mb-0"> Rp.{formatNumber(+item.normal_price)} </p>
    ),
  },
  {
    title: "Harga Diskon",
    dataIndex: "product",
    key: "discount_price",
    align: "center",
    editable: true,
    type: "price",
    width: 200,
  },
  {
    title: "Diskon (%)",
    dataIndex: "product",
    key: "discount",
    align: "center",
    editable: true,
    type: "discount",
    width: 200,
  },
  {
    title: "Stok",
    dataIndex: "product",
    key: "stock",
    width: 150,
    align: "center",
    render: (item) => <p className="mb-0">{+item.stock}</p>,
  },
  {
    title: "Aktif/Nonaktif",
    dataIndex: "product",
    key: "active",
    align: "center",
    width: 150,
    editable: true,
    type: "discount_active",
  },
];

export const columnsProductVariant = [
  {
    title: "Variasi",
    colSpan: 0,
    dataIndex: "product",
    key: "variant",
    align: "center",
    width: 120,
    render: (item) => <p className="mb-0">{item.va_option}</p>
  },
  {
    title: "Harga Normal",
    colSpan: 2,
    dataIndex: "product",
    key: "price",
    align: "center",
    width: 120,
    render: (item) => (
      <p className="mb-0"> Rp.{formatNumber(+item.normal_price)} </p>
    ),
  },
  {
    title: "Harga Diskon",
    dataIndex: "product",
    key: "discount_price",
    align: "center",
    editable: true,
    type: "price",
    width: 200,
  },
  {
    title: "Diskon (%)",
    dataIndex: "product",
    key: "discount",
    align: "center",
    editable: true,
    type: "discount",
    width: 200,
  },
  {
    title: "Stok",
    dataIndex: "product",
    key: "stock",
    width: 130,
    align: "center",
    render: (item) => <p className="mb-0">{+item.stock}</p>,
  },
  {
    title: "Aktif/Nonaktif",
    dataIndex: "product",
    key: "active",
    align: "center",
    editable: true,
    width: 130,
    type: "discount_active",
  },
];
