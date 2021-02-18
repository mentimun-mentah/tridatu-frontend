import Container from 'react-bootstrap/Container'
import Image from 'next/image'

let year = new Date()
year = year.getFullYear()

const IMG_SOS = '/static/images/social-media'
const IMG_COURIER = '/static/images/couriers'

const social_list = ['facebook', 'instagram', 'twitter', 'tiktok']
const courier_list = ['jne', 'jet', 'lion', 'pos', 'tiki']
const payment_list = ['mandiri', 'permata', 'bni', 'bri', 'bca', 'go-pay', 'ovo']

const Footer = () => {
  return(
    <>
      <footer className="border-top">
        <div id="id-footer" className="row justify-content-around mb-0 pt-2 pb-0 mx-0">
          <div className="col-sm-12 col-md-12 col-lg-11">
            <Container>
              <div className="row justify-content-center">

                <div className="col-md-12 col-lg-3 col-12 font-italic align-items-center mt-md-3 mt-4">
                  <h5 className="mb-0">
                    <span className="d-inline-block">
                      <Image
                        width={27}
                        height={40}
                        className="img-fit rounded"
                        src="/tridatu-icon.png"
                        alt="Tridatu Bali ID"
                      />
                    </span>
                    <b className="text-dark va-super fs-26-t fs-24">
                      Tridatu<span className="text-muted"> Bali ID</span>
                    </b>
                  </h5>
                  <div className="social mt-3 mb-3">
                    {social_list.map((data, i) => (
                      <Image
                        key={i}
                        width={23}
                        height={23}
                        src={`${IMG_SOS}/${data}.png`}
                        className="social-img"
                        alt="tridatu-bali"
                      />
                    ))}
                  </div>
                  <br />
                  <small className="copy-rights cursor-pointer">
                    Ⓒ {year} Tridatu Bali ID
                  </small>
                  <br />
                  <small>All Right Reserved</small>
                </div>

                <div className="col-md-12 col-lg-3 col-12 my-0">
                  <ul className="list-unstyled">
                    <li className="mt-md-3 mt-4">Kontak</li>
                    <li>
                      <i className="fab fa-whatsapp mr-2 fs-18" />
                      +628113885929
                    </li>
                    <li>
                      <i className="far fa-envelope mr-2" />
                      support@tridatu-bali.id
                    </li>
                    <li>
                      Jl. Muding Tengah, Bougenville No. 18 Kerobokan, Kuta Utara,
                      Badung, Bali 80361
                    </li>
                  </ul>
                </div>

                <div className="col-md-12 col-lg-3 col-12 my-sm-0 mt-5 mt-0-s">
                  <ul className="list-unstyled ml-5 ml-0-s">
                    <li className="mt-md-3 mt-4">Informasi</li>
                    <li>Tentang Kami</li>
                    <li>Panduan Belanja</li>
                    <li>Syarat &amp; Ketentuan</li>
                    <li>Kebijakan Privasi</li>
                  </ul>
                </div>

                <div className="col-md-12 col-lg-3 col-12 my-sm-0 mt-5 mt-0-s">
                  <ul className="list-unstyled multi-bank">
                    <li className="mt-md-3 mt-4 mb-2">Metode Pembayaran</li>
                    <div className="img-bank">
                      {payment_list.map((data, i) => (
                        <Image
                          key={i}
                          width={48}
                          height={48}
                          src={`https://www.gramedia.com/assets/bank/payment-${data}.png`}
                          className="payment-info"
                          alt="tridatu-bali"
                        />
                      ))}
                    </div>
                  </ul>
                  <ul className="list-unstyled multi-bank">
                    <li className="mt-md-3 mt-4 mb-2">Metode Pengiriman</li>
                    <div className="img-bank ml-n3">
                      {courier_list.map((data, i) => (
                        <Image
                          key={i}
                          width={70}
                          height={36}
                          src={`${IMG_COURIER}/${data}.png`}
                          className="payment-info"
                          alt="tridatu-bali"
                        />
                      ))}
                    </div>
                  </ul>
                </div>

              </div>
            </Container>
          </div>
        </div>
      </footer>
      
      <style jsx>{`
        .social {
          position: relative;
          display: inline-flex;
        }
        :global(.social > div){
          margin-right: 10px !important;
        }
        :global(.social .social-img){
          opacity: .6;
        }

        .cursor-pointer {
          cursor: pointer !important;
          color: green;
          font-weight: bold;
        }

        h5 {
          font-size: calc(
            20px + (28 - 20) * ((100vw - 360px) / (1600 - 360))
          ) !important;
        }

        li {
          margin-top: 10px;
          margin-bottom: 10px;
        }

        img {
          vertical-align: middle !important;
          width: 100%;
          height: auto;
          width: calc(17px + 6 * ((100vw - 320px) / 680));
        }

        li:first-child {
          font-size: 21px !important;
          font-weight: bold;
          margin-bottom: calc(
            20px + (48 - 40) * ((100vw - 360px) / (1600 - 360))
          );
          color: #757575 !important;
        }

        footer {
          color: #757575 !important;
        }
        :global(.payment-info) {
          margin: 0px 2px;
        }
        .img-bank {
          display: flex;
          flex-wrap: wrap;
        }
        .multi-bank {
          max-width: 216px;
        }

        /* Medium devices (tablets, less than 992px) */
        @media (max-width: 991.98px) {
          .ml-0-s {
            margin-left: 0!important;
          }
          .mt-0-s {
            margin-top: 0!important;
          }
        }
      `}</style>
    </>
  )
}

export default Footer
