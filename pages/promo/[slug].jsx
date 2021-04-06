import { useEffect } from 'react'
import { Collapse, Typography, Badge, Space, Tooltip } from 'antd';

import Link from 'next/link'
import Image from "next/image";
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'

import CardPromo from "components/Card/Promo";
import SlugStyle from 'components/Promo/SlugStyle'

const CardPromoMemo = React.memo(CardPromo);

let promos = ['/static/images/promo/new-promo.jpeg', '/static/images/promo/new-promo-1.jpeg', '/static/images/promo/new-promo-2.jpeg']

let terms_conditions = "<ol><li><span style=\"box-sizing: border-box; font-weight: 400;\">Promo berlaku selama periode<span>&nbsp;</span><strong>17</strong></span><strong>-21</strong><strong>&nbsp;Maret 2021</strong></li><li><span style=\"box-sizing: border-box; font-weight: 400;\">Promo</span><strong>&nbsp;</strong><span style=\"box-sizing: border-box; font-weight: 400;\">hanya berlaku untuk pembelian produk di<span>&nbsp;</span></span><a href=\"https://www.tokopedia.com/discovery/fit-and-fun\"><strong>halaman ini</strong><span style=\"box-sizing: border-box; font-weight: 400;\">.</span></a></li><li><span style=\"box-sizing: border-box; font-weight: 400;\">Untuk menikmati<span>&nbsp;</span></span><strong>cashback 5% hingga Rp100.000</strong><span style=\"box-sizing: border-box; font-weight: 400;\">, pembeli harus memasukkan kode promo<span>&nbsp;</span></span><strong>MARCHFIT<span>&nbsp;</span></strong><span style=\"box-sizing: border-box; font-weight: 400;\">di halaman pembayaran.</span></li><li><strong>Cashback 5% hingga Rp100.000 berlaku untuk minimum pembelian Rp100.000</strong><span style=\"box-sizing: border-box; font-weight: 400;\"><span>&nbsp;</span>(belum termasuk ongkos kirim dan biaya tambahan lainnya).</span></li><li><span style=\"box-sizing: border-box; font-weight: 400;\">Untuk menikmati<span>&nbsp;</span></span><strong>cashback 3% hingga Rp300.000</strong><span style=\"box-sizing: border-box; font-weight: 400;\">, pembeli harus memasukkan kode promo<span>&nbsp;</span></span><strong>MARCHFUN<span>&nbsp;</span></strong><span style=\"box-sizing: border-box; font-weight: 400;\">di halaman pembayaran.</span></li><li><strong>Cashback 3% hingga Rp300.000 berlaku untuk minimum pembelian Rp300.000</strong><span style=\"box-sizing: border-box; font-weight: 400;\"><span>&nbsp;</span>(belum termasuk ongkos kirim dan biaya tambahan lainnya).</span></li><li><span style=\"box-sizing: border-box; font-weight: 400;\">Cashback akan masuk ke OVO Points. Pastikan Anda sudah mengaktifkan OVO untuk tetap bisa menikmati cashback dari promo ini.</span></li><li>Benefit cashback akan diberikan secara pro-rata jika menggunakan pembayaran sebagian OVO Point.</li><li>Cashback yang diberikan disesuaikan dengan jumlah pembayaran yang digunakan selain OVO Point.</li><li>Apabila terjadi pengembalian dana sebagian maka terdapat penyesuaian cashback.</li><li>Penggunaan kupon atau kode promo akan dibatalkan jika tidak memenuhi minimum transaksi penggunaan promo setelah dikurangi OVO Point yang digunakan atau pembayaran penuh dengan OVO Points.</li><li><span style=\"box-sizing: border-box; font-weight: 400;\">Cashback akan diterima maksimal 1 x 24 jam setelah transaksi berhasil serta sesuai dengan Syarat dan Ketentuan yang berlaku.</span></li><li><span style=\"box-sizing: border-box; font-weight: 400;\">Satu (1) pengguna Tokopedia hanya boleh menggunakan satu (1) akun Tokopedia untuk mengikuti promo ini. Jika ditemukan pembuatan lebih dari satu (1) akun oleh satu (1) pengguna yang sama dan/atau nomor handphone yang sama dan/atau alamat yang sama dan/atau ID pelanggan yang sama dan/atau identitas pembayaran yang sama dan/atau riwayat transaksi yang sama, maka pengguna tidak akan mendapatkan benefit dari promo Tokopedia.</span></li><li><span style=\"box-sizing: border-box; font-weight: 400;\">Satu (1) akun Tokopedia hanya bisa menggunakan kode promo sebanyak satu (1) kali selama periode promo.</span></li><li><span style=\"box-sizing: border-box; font-weight: 400;\">Kuota cashback<span>&nbsp;</span></span><strong>kode promo MARCHFIT<span>&nbsp;</span></strong><span style=\"box-sizing: border-box; font-weight: 400;\">terbatas untuk<span>&nbsp;</span></span><strong>300 pembeli pertama.</strong></li><li><span style=\"box-sizing: border-box; font-weight: 400;\">Kuota cashback<span>&nbsp;</span></span><strong>kode promo MARCHFUN<span>&nbsp;</span></strong><span style=\"box-sizing: border-box; font-weight: 400;\">terbatas untuk<span>&nbsp;</span></span><strong>100 pembeli pertama.</strong></li><li><span style=\"box-sizing: border-box; font-weight: 400;\">Promo tidak dapat digabung dengan promo lain.</span></li><li><span style=\"box-sizing: border-box; font-weight: 400;\">Kupon/Kode Promo ini tidak berlaku untuk pembelian Emas dan Voucher/Deals.</span></li><li><span style=\"box-sizing: border-box; font-weight: 400;\">Jika transaksi dibatalkan atau masuk ke Pusat Resolusi, dana yang kembali ke pembeli akan sesuai dengan nominal pembayaran yang dilakukan (tidak termasuk subsidi ongkir).</span></li><li><span style=\"box-sizing: border-box; font-weight: 400;\">Tokopedia berhak melakukan tindakan-tindakan yang diperlukan seperti pembatalan benefit jika ditemukan transaksi yang melanggar syarat &amp; ketentuan Tokopedia.</span></li><li><span style=\"box-sizing: border-box; font-weight: 400;\">Syarat dan Ketentuan promo ini merupakan bagian yang tidak terpisahkan dan satu kesatuan dengan</span><a href=\"https://www.tokopedia.com/terms.pl\"><span>&nbsp;</span><span style=\"box-sizing: border-box; font-weight: 400;\">Syarat dan Ketentuan Tokopedia</span></a><span style=\"box-sizing: border-box; font-weight: 400;\">,</span><span style=\"box-sizing: border-box; font-weight: 400;\"><span>&nbsp;</span>serta dapat berubah sewaktu-waktu untuk disesuaikan dengan kebijakan sehubungan dengan promo ini.</span></li><li><span style=\"box-sizing: border-box; font-weight: 400;\">Dengan mengikuti promo ini, pengguna dianggap mengerti dan menyetujui semua syarat &amp; ketentuan berlaku.</span></li><li>Promo berlaku dengan minimum pembayaran produk sebesar<span>&nbsp;</span><strong>Rp 100.000<span>&nbsp;</span></strong>untuk Cashback 5% hingga Rp100.000 dan<span>&nbsp;</span><strong>Rp 300.000<span>&nbsp;</span></strong>untuk Cashback 3%<span>&nbsp;</span><span style=\"box-sizing: border-box; font-weight: 400;\">hingga Rp300.000<span>&nbsp;</span></span>setelah dikurangi penggunaan OVO Point</li></ol><p><span style=\"box-sizing: border-box; font-weight: 400;\">Beli produk Fit and Fun Spectasale terbaru secara online di Tokopedia. Belanja online jadi lebih hemat dengan gunakan promo Tokopedia! Temukan promo beragam peralatan gaming, perlengkapan olahraga serta koleksi mainan &amp; hobi terbaru dari Puma, MultiGame, Decathlon, Flexzone, Lego &amp; Hotwheels di Tokopedia untuk dapatkan berbagai keuntungan. Belanja mudah banyak diskon ya di Tokopedia aja!</span></p>"


const PromoDetail = () => {
  useEffect(() => {
    let listTable = document.getElementById("terms-conditions-id").getElementsByTagName("table")
    let listTableMobile = document.getElementById("terms-conditions-id-mobile").getElementsByTagName("table")
    for(let i = 0; i < listTable.length; i++){
      listTable[i].classList.add("table-sm", "table-bordered", "table-responsive", "border-0")
    }
    for(let i = 0; i < listTableMobile.length; i++){
      listTableMobile[i].classList.add("table-sm", "table-bordered", "table-responsive", "border-0")
    }
  }, [])

  return(
    <>
      <Container fluid="md">
        <section>
          <Row>
            <Col md="8" className="main-column">
              <main className="main-content">
                <div className="post-image">
                  <Image 
                    width={1200}
                    height={630}
                    layout="responsive"
                    src="/static/images/promo/new-promo.jpeg"
                    alt="Tridatu Bali"
                    className="radius-top-img-card"
                  />
                </div>{/*post-image*/}
                <div className="post-body">
                  <Row>
                    <Col sm="12">
                      <div className="mb-4">
                        <h3 className="fs-18">Jaga Daya Tahanmu + Bikin Hari Lebih Seru, Harga Mulai dari Seribu</h3>
                      </div>

                      <div className="mb-0 mb-md-4">
                        <h4 className="fs-12 text-uppercase text-black font-weight-bold">deskripsi</h4>
                        <p className="mb-0">
                          Fit and Fun Spectasale Mulai dari Seribu Rupiah + Cashback hingga Rp300 Ribu, Mau?
                        </p>
                      </div>

                      <div className="mb-4 d-none d-md-block">
                        <h4 className="fs-12 text-uppercase text-black font-weight-bold">Syarat dan ketentuan</h4>
                        <div id="terms-conditions-id" dangerouslySetInnerHTML={{__html: terms_conditions}} />
                      </div>

                    </Col>
                  </Row>
                </div>{/*post-body*/}
              </main>
            </Col>

            <Col md="4">
              <div className="post-sidebar">
                <div className="postbox">
                  <div className="postbox-header">
                    <h4 className="fs-16 text-black mb-0">Info Promo</h4>
                  </div>{/*postbox-header*/}

                  <div className="postbox-content">
                    <div className="postbox-content-detail border-bottom-0">
                      <img src="/static/svg/timer.svg" width="30" height="30" className="mb-3" />
                      {/* <i className="fad fa-stopwatch text-black-50 fa-2x d-block m-b-10" /> */}
                      <p className="fs-12 mb-0 text-secondary">Periode Promo</p>
                      <p className="fs-14 mb-0 ls-n1 fw-500">17 - 21 Mar 2021</p>
                    </div>{/*postbox-content-detail*/}
                    <div className="postbox-content-detail border-left-0 border-bottom-0">
                      <img src="/static/svg/money.svg" width="30" height="30" className="mb-3" />
                      {/* <i className="fad fa-money-bill-wave text-black-50 fa-2x d-block m-b-10" /> */}
                      <p className="fs-12 mb-0 text-secondary">Minimum Transaksi</p>
                      <p className="fs-14 mb-0 ls-n1 fw-500">Rp.100.000</p>
                    </div>{/*postbox-content-detail*/}
                  </div>{/*postbox-content*/}

                  <div className="postbox-content">
                    <div className="postbox-content-detail postbox-content--group-code text-left">
                      <Collapse bordered={false} defaultActiveKey={['0']} ghost expandIconPosition="right" className="group-code-collapse">
                        {[...Array(3)].map((_, x) => (
                          <Collapse.Panel 
                            key={x} className={x > 0 && "border-top-code-promo"}
                            header={<span className="fw-500 noselect">Diskon hingga Rp.{x+1}00.000</span>} 
                          >
                            <div className="fs-12 mb-2 text-muted">
                              <p className="mb-3">Minimum transaksi Rp.{x+1}00.000</p>
                              {/*
                              <p className="noselect mb-3">
                                <blockquote>Kode Promo
                                  <Tooltip 
                                    overlayClassName="tooltip-info-promo"
                                    title={<small className="text-center">Masukkan kode promo di halaman pembayaran</small>}
                                  >
                                    <i className="fad fa-info-circle m-l-3 text-black-50 va-middle fs-11 hover-pointer" />
                                  </Tooltip>
                                </blockquote>
                              </p>
                              */}
                            </div>
                            <Space size={[8, 12]} wrap>
                              {[...Array(1)].map((_, i) => (
                                <Badge count={i+1} className="badge-count-code" size="small" key={i}>
                                  <Card className="w-fit-content bg-light">
                                    <Card.Body className="p-2 fs-12">
                                      <Typography.Paragraph copyable className="mb-0 text-tridatu copy-code-btn">
                                        MARCHFIT{x+1+i}
                                      </Typography.Paragraph>
                                    </Card.Body>
                                  </Card>
                                </Badge>
                              ))}
                            </Space>
                          </Collapse.Panel>
                        ))}
                      </Collapse>
                    </div>{/*postbox-content--group-code*/}
                  </div>{/*postbox-content*/}

                  <div className="postbox-content d-none">
                    <div className="postbox-content-detail border-top-0">
                      <p className="fs-14 mb-0 text-secondary noselect">
                        <i className="fad fs-14 fa-badge-percent text-black-50 m-r-5 va-middle" />Tanpa kode promo
                      </p>
                    </div>{/*postbox-content-detail*/}
                  </div>{/*postbox-content*/}

                </div>{/*postbox*/}
              </div>{/*post-sidebar*/}

            </Col>
          </Row>

          <Row className="d-md-none">
            <Col>
              <div className="postbox-content mt-4">
                <div className="postbox-content-detail">
                  <h4 className="mb-0 fs-12 text-uppercase text-black font-weight-bold">Syarat dan ketentuan</h4>
                </div>{/*postbox-content-detail*/}
              </div>{/*postbox-content*/}
              <div className="postbox-content postbox-content-mobile">
                <div className="postbox-content-detail border-top-0">
                  <div id="terms-conditions-id-mobile" dangerouslySetInnerHTML={{__html: terms_conditions}} />
                </div>{/*postbox-content-detail*/}
              </div>{/*postbox-content*/}
            </Col>
          </Row>
        </section>
      </Container>

      <Container>
        <section>
          <h4 className="fs-20 text-center text-dark mb-4">Promo Lainnya</h4>
          <Row>
            {promos.reverse().map((data, i) => (
              <Col md={4} sm={6} key={i}>
                <CardPromoMemo image={data} idx={i} />
              </Col>
            ))}
          </Row>

          <div className="text-center mb-5 mt-5">
            <Link href="/promo" as="/promo">
              <Button as="a" className="btn-dark-tridatu-outline mx-auto">Lihat Semua Promo</Button>
            </Link>
          </div>

        </section>
      </Container>

      <style jsx>{SlugStyle}</style>
      <style jsx>{`
        :global(.copy-code){
          color: #d63031;
          margin-bottom: 0px !important;
        }
        :global(.copy-code > .ant-typography-copy){
          vertical-align: text-bottom;
        }
      `}</style>
    </>
  )
}

export default PromoDetail
