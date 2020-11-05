export const courierEstimation = [
  {
    code: "jne",
    name: "Jalur Nugraha Ekakurir (JNE)",
    costs: [
      {
        service: "OKE",
        description: "Ongkos Kirim Ekonomis",
        cost: [
          {
            value: 38000,
            etd: "4-5",
            note: "",
          },
        ],
      },
      {
        service: "REG",
        description: "Layanan Reguler",
        cost: [
          {
            value: 44000,
            etd: "2-3",
            note: "",
          },
        ],
      },
      {
        service: "SPS",
        description: "Super Speed",
        cost: [
          {
            value: 349000,
            etd: "",
            note: "",
          },
        ],
      },
      {
        service: "YES",
        description: "Yakin Esok Sampai",
        cost: [
          {
            value: 98000,
            etd: "1-1",
            note: "",
          },
        ],
      },
    ],
  },
  {
    code: "tiki",
    name: "Citra Van Titipan Kilat (TIKI)",
    costs: [
      {
        service: "ECO",
        description: "Economy Service",
        cost: [
          {
            value: 48000,
            etd: "4",
            note: "",
          },
        ],
      },
      {
        service: "REG",
        description: "Regular Service",
        cost: [
          {
            value: 54000,
            etd: "2",
            note: "",
          },
        ],
      },
      {
        service: "ONS",
        description: "Over Night Service",
        cost: [
          {
            value: 80000,
            etd: "1",
            note: "",
          },
        ],
      },
    ],
  },
];
