import { parseCookies } from "nookies"
import { Space, Avatar, Tooltip } from "antd";
import Button from "antd-button-color";

import id from 'locales/id/admin/product/new'
import en from 'locales/en/admin/product/new'

export const createNewArr = (data) => {
  return data
    .reduce((result, item) => {
      if (result.indexOf(item.va1_option) < 0) {
        result.push(item.va1_option);
      }
      return result;
    }, [])
    .reduce((result, va1_option) => {
      const children = data.filter((item) => item.va1_option === va1_option);
      result = result.concat(
        children.map((item, index) => ({
          ...item,
          rowSpan: index === 0 ? children.length : 0,
        }))
      );
      return result;
    }, []);
};

export const formVariantLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 24 },
    xl: { span: 24 },
  },
};

export const formItemLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 24 },
    xl: { span: 24 },
  },
};

const initCol = () => {
  const cookies = parseCookies()
  const { NEXT_LOCALE } = cookies
  const locale = NEXT_LOCALE ? NEXT_LOCALE : "id"
  const t = locale === "en" ? en : id

  return [
    {
      title: t.sales_information.variant.price,
      dataIndex: "price",
      key: "price",
      inputType: "price",
      editable: true,
      align: "center",
      width: 150,
    },
    {
      title: t.sales_information.variant.stock,
      dataIndex: "stock",
      key: "stock",
      inputType: "stock",
      editable: true,
      align: "center",
      width: 150,
    },
    {
      title: t.sales_information.variant.code,
      dataIndex: "code",
      key: "code",
      inputType: "code",
      editable: true,
      align: "center",
      width: 150,
    },
    {
      title: t.sales_information.variant.barcode,
      dataIndex: "barcode",
      key: "barcode",
      inputType: "barcode",
      editable: true,
      align: "center",
      width: 150,
    },
  ]
};

export const initialColumn = initCol;

// NOT USE IN BELOW
export const productsColumns = [
  {
    fixed: "left",
    title: "Nama Produk",
    dataIndex: "product",
    key: "product",
    width: 200,
    render: (item) => (
      <a className="text-truncate text-dark text-decoration-none">
        <Avatar size={50} shape="square" src={item.image} />
        <span className="ml-2 text-wrap va-top">{item.name}</span>
      </a>
    ),
  },
  {
    title: "Harga",
    dataIndex: "price",
    key: "price",
    width: 150,
    render: (price) => "Rp." + price,
  },
  {
    title: "Variasi",
    dataIndex: "variation",
    key: "variation",
    width: 100,
    render: (items) => {
      return items.map((item) => {
        return item.detail.map((data) => (
          <p key={data.size}>
            {item.color}, {data.size}
          </p>
        ));
      });
    },
  },
  {
    title: "Stok",
    dataIndex: "variation",
    key: "stock",
    align: "center",
    width: 100,
    render: (items) => {
      return items.map((item) => {
        return item.detail.map((data) => <p key={data.size}>{data.stock}</p>);
      });
    },
  },
  {
    title: "Penjualan",
    dataIndex: "variation",
    key: "sales",
    align: "center",
    width: 100,
    render: (items) => {
      return items.map((item) => {
        return item.detail.map((data) => <p key={data.size}>{data.sales}</p>);
      });
    },
  },
  {
    title: "Action",
    key: "action",
    align: "center",
    width: 130,
    render: () => (
      <Space size="small">
        <Tooltip title="Ubah">
          <Button
            size="small"
            type="primary"
            ghost
            icon={<i className="fal fa-edit" />}
          />
        </Tooltip>
        <Tooltip title="Tampilkan">
          <Button
            size="small"
            type="success"
            ghost
            icon={<i className="fal fa-eye" />}
          />
        </Tooltip>
        <Tooltip title="Hapus">
          <Button
            size="small"
            danger
            ghost
            icon={<i className="fal fa-trash-alt" />}
          />
        </Tooltip>
      </Space>
    ),
  },
];

export const productsData = [
  {
    key: "1",
    product: {
      name: "Jaket GAP Grey",
      image:
        "https://ecs7.tokopedia.net/img/cache/700/product-1/2019/5/18/3453155/3453155_bdfa5991-04e9-49a3-8246-34f9d270b180_1438_1438.webp",
    },
    price: "200.000",
    variation: [
      {
        color: "Putih",
        detail: [
          { size: "S", stock: 3, sales: 0 },
          { size: "M", stock: 9, sales: 3 },
          { size: "L", stock: 1, sales: 1 },
          { size: "XL", stock: 8, sales: 0 },
        ],
      },
      {
        color: "Hitam",
        detail: [
          { size: "S", stock: 3, sales: 0 },
          { size: "M", stock: 9, sales: 3 },
          { size: "L", stock: 1, sales: 1 },
          { size: "XL", stock: 8, sales: 0 },
        ],
      },
    ],
  },
  {
    key: "2",
    product: {
      name: "Flannel Uniqlo",
      image:
        "https://ecs7.tokopedia.net/img/cache/700/product-1/2019/5/18/3453155/3453155_bdfa5991-04e9-49a3-8246-34f9d270b180_1438_1438.webp",
    },
    price: "450.000",
    variation: [
      {
        color: "Merah",
        detail: [
          { size: "S", stock: 0, sales: 9 },
          { size: "XL", stock: 1, sales: 2 },
        ],
      },
      {
        color: "Biru",
        detail: [
          { size: "S", stock: 3, sales: 0 },
          { size: "XL", stock: 8, sales: 0 },
        ],
      },
    ],
  },
];
