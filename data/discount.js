import { Switch, InputNumber } from "antd";

import kFormatter from "lib/kFormatter";
import formatNumber from "lib/formatNumber";

import ItemInfoPromo from "components/Card/Admin/Product/Promo/ItemInfo";
import ItemPricePromo from "components/Card/Admin/Product/Promo/ItemPrice";
import ItemPeriodPromo from "components/Card/Admin/Product/Promo/ItemPeriod";
import ItemStatusPromo from "components/Card/Admin/Product/Promo/ItemStatus";
import { not_active, will_come, ongoing, have_ended } from 'components/Card/Admin/Product/Promo/statusType'

export const orderList = (t) => [
  { label: t.status_type.all_status, value: "" },
  { label: t.status_type.ongoing, value: ongoing },
  { label: t.status_type.will_come, value: will_come },
  { label: t.status_type.not_active, value: not_active },
  { label: t.status_type.have_ended, value: have_ended },
];

export const columns = (t) => [
  {
    title: t.product,
    dataIndex: "products",
    key: "product",
    width: 270,
    ellipsis: true,
    className: "p-l-8",
    render: (item) => (
      <ItemInfoPromo
        image={item.products_image_product}
        name={item.products_name}
        slug={item.products_slug}
      />
    ),
  },
  {
    title: t.price,
    dataIndex: "products",
    key: "price",
    width: 180,
    ellipsis: true,
    className: "p-l-8",
    render: (item) => (
      <ItemPricePromo
        discount={item.variants_discount}
        minPrice={+item.variants_min_price}
        maxPrice={+item.variants_max_price}
      />
    ),
  },
  {
    title: t.stock,
    dataIndex: "products",
    key: "stock",
    width: 100,
    ellipsis: true,
    className: "p-l-8",
    render: (item) => <span>{kFormatter(+item.variants_total_stock, 'k')}</span>,
  },
  {
    title: t.periode,
    dataIndex: "products",
    key: "period",
    width: 200,
    ellipsis: true,
    className: "p-l-8",
    render: (item) => (
      <ItemPeriodPromo
        statusPromo={item.products_discount_status}
        start={item.products_discount_start}
        end={item.products_discount_end}
        t={t}
      />
    ),
  },
  {
    title: t.status_discount,
    dataIndex: "products",
    key: "status",
    width: 200,
    ellipsis: true,
    className: "p-l-8",
    render: (item) => <ItemStatusPromo statusPromo={item.products_discount_status} t={t} />,
  },
  {
    title: t.action,
    dataIndex: "products",
    key: "action",
    width: 200,
    action: true,
    className: "p-l-8",
  },
];


/* ################## */
/* ################## */
export const columnsProductNoVariant = (t) => [
  {
    title: t.modal.normal_price,
    dataIndex: "product",
    key: "price",
    align: "center",
    width: 200,
    render: (item) => (
      <p className="mb-0"> Rp.{formatNumber(+item.normal_price)} </p>
    ),
  },
  {
    title: t.modal.discount_price,
    dataIndex: "product",
    key: "discount_price",
    align: "center",
    editable: true,
    type: "price",
    width: 200,
  },
  {
    title: t.modal.discount + " (%)",
    dataIndex: "product",
    key: "discount",
    align: "center",
    editable: true,
    type: "discount",
    width: 200,
  },
  {
    title: t.modal.stock,
    dataIndex: "product",
    key: "stock",
    width: 150,
    align: "center",
    render: (item) => <p className="mb-0">{+item.stock}</p>,
  },
  {
    title: t.modal.active_inactive,
    dataIndex: "product",
    key: "active",
    align: "center",
    width: 150,
    editable: true,
    type: "discount_active",
  },
];

export const columnsProductVariant = (t) =>[
  {
    // title: t.modal.variant,
    title: "Variasi",
    colSpan: 0,
    dataIndex: "product",
    key: "variant",
    align: "center",
    width: 120,
    render: (item) => <p className="mb-0">{item.va_option}</p>
  },
  {
    title: t.modal.normal_price,
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
    title: t.modal.discount_price,
    dataIndex: "product",
    key: "discount_price",
    align: "center",
    editable: true,
    type: "price",
    width: 200,
  },
  {
    title: t.modal.discount + " (%)",
    dataIndex: "product",
    key: "discount",
    align: "center",
    editable: true,
    type: "discount",
    width: 200,
  },
  {
    title: t.modal.stock,
    dataIndex: "product",
    key: "stock",
    width: 130,
    align: "center",
    render: (item) => <p className="mb-0">{+item.stock}</p>,
  },
  {
    title: t.modal.active_inactive,
    dataIndex: "product",
    key: "active",
    align: "center",
    editable: true,
    width: 130,
    type: "discount_active",
  },
];
