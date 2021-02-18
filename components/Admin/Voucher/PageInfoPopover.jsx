import { Space } from 'antd'
import Image from 'next/image'

const PageInfoPopover = () => (
  <div className="p-4">
    {/* <small className="form-text text-center mb-4 text-muted"> */}
    {/*   Voucher akan otomatis ditampilkan di Halaman Promo, Halaman Detail Produk, <br/> dan Halaman Keranjang Belanja. */}
    {/* </small> */}
    <Space align="center">
      {[...Array(3)].map((_, i) => (
        <div key={i}>
          <p className="text-center mb-1">Halaman {i == 0 && "Promo" || i == 1 && "Detail Produk" || "Keranjang Belanja"}</p>
          <Image 
            width={200} 
            height={200} 
            src="/static/images/promo/v2.png"
            className="align-self-center bor-rad-2rem" 
          />
        </div>
      ))}
    </Space>
  </div>
)

export default PageInfoPopover
