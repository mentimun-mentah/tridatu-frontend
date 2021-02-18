import formatNumber from "lib/formatNumber";

export const productsData = [
  "Jaket GAP Grey",
  "Flannel Uniqlo Biru",
  "Kemeja Converse Panjang",
];

export const sortListProduct = [
  { value: "", label: "Paling Sesuai" }, 
  { value: "newest", label: "Terbaru" }, 
  { value: "high_price", label: "Harga Tertinggi" }, 
  { value: "low_price", label: "Harga Terendah" }
] 

export const formItemLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 24 },
    xl: { span: 24 },
  },
};

export const initialColumn = [
  {
    title: "Harga",
    dataIndex: "price",
    key: "price",
    inputType: "price",
    editable: true,
    align: "center",
    width: 150,
  },
  {
    title: "Stok",
    dataIndex: "stock",
    key: "stock",
    inputType: "stock",
    editable: true,
    align: "center",
    width: 150,
  },
  {
    title: "Kode Variasi",
    dataIndex: "code",
    key: "code",
    inputType: "code",
    editable: true,
    align: "center",
    width: 150,
  },
];

export const columnsGrosir = [
  {
    title: "Beli",
    dataIndex: "wholesale_min_qty",
    key: "sell",
    render: (item) => <span className="fs-12">≥ {item}</span>,
  },
  {
    title: "Harga/pcs",
    dataIndex: "wholesale_price",
    key: "price",
    render: (item) => <span className="fs-12">Rp.{formatNumber(item)}</span>,
  },
];
