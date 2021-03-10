import formatNumber from "lib/formatNumber";

export const productsData = [
  "Jaket GAP Grey",
  "Flannel Uniqlo Biru",
  "Kemeja Converse Panjang",
];

export const sortListProduct = (t) => [
  { value: "", label: t.sort.most_suitable }, 
  { value: "newest", label: t.sort.newest }, 
  { value: "high_price", label: t.sort.high_price }, 
  { value: "low_price", label: t.sort.low_price }
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
    title: "Jumlah",
    dataIndex: "wholesale_min_qty",
    key: "sell",
    render: (item) => <span className="fs-12">≥ {item}</span>,
  },
  {
    title: "Harga Satuan",
    dataIndex: "wholesale_price",
    key: "price",
    render: (item) => <span className="fs-12">Rp.{formatNumber(item)}</span>,
  },
];
