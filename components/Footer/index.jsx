import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import Image from 'next/image'
import Container from 'react-bootstrap/Container'

import id from 'locales/id/footer'
import en from 'locales/en/footer'

let year = new Date()
year = year.getFullYear()

const IMG_SOS = '/static/images/social-media'
const IMG_COURIER = '/static/images/couriers'

const social_list = ['facebook', 'instagram', 'twitter', 'tiktok']
const courier_list = ['jne', 'jet', 'lion', 'pos', 'tiki']
const payment_list = ['mandiri', 'permata', 'bni', 'bri', 'bca', 'go-pay', 'ovo']

const Footer = () => {
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : id

  const [localeState, setLocalState] = useState(locale)

  const changeLanguage = e => {
    const locale = e.target.value
    setLocalState(locale)
  }

  useEffect(() => {
    setTimeout(() => {
      router.replace(router.asPath, router.asPath, { locale: localeState, scroll: false })
    }, 450)
  }, [localeState])

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
                  <br />
                  <div className="change-language-container bor-rad-5px mt-2">
                    <div className="card bg-transparent p-1 bor-rad-5px w-100 border-0">
                      <form className="tabber idx-1">
                        <label htmlFor="t1" className={`${localeState === "id" && "text-white"}`}>Indonesia</label>
                        <input 
                          id="t1" value="id" 
                          name="lang" type="radio" 
                          onChange={changeLanguage} 
                          defaultChecked={localeState === "id"} 
                        />
                        <label htmlFor="t2" className={`${localeState === "en" && "text-white"}`}>English</label>
                        <input 
                          id="t2" value="en" 
                          name="lang" type="radio" 
                          onChange={changeLanguage} 
                          defaultChecked={localeState === "en"} 
                        />
                        <div className="blob"></div>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="col-md-12 col-lg-3 col-12 my-0">
                  <ul className="list-unstyled">
                    <li className="mt-md-3 mt-4">{t.contact}</li>
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
                    <li className="mt-md-3 mt-4">{t.information}</li>
                    <li>{t.information_data.about_us}</li>
                    <li>{t.information_data.shopping_guide}</li>
                    <li>{t.information_data.term}</li>
                    <li>{t.information_data.privacy}</li>
                  </ul>
                </div>

                <div className="col-md-12 col-lg-3 col-12 my-sm-0 mt-5 mt-0-s">
                  <ul className="list-unstyled multi-bank">
                    <li className="mt-md-3 mt-4 mb-2">{t.payment_method}</li>
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
                    <li className="mt-md-3 mt-4 mb-2">{t.shipping_method}</li>
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

        /* LANGUAGE CHANGER */
        .change-language-container {
          display: flex;
          background-color: rgb(243, 244, 245);
        }
        .tabber {
          position: relative;
          display: flex;
          align-items: stretch;
          justify-content: stretch;
        }
        .tabber label {
          -webkit-user-select: none;
             -moz-user-select: none;
              -ms-user-select: none;
                  user-select: none;
          padding: .2rem 1rem;
          margin-bottom: 0;
          cursor: pointer;
          font-size: 14px;
          font-style: normal;
          font-weight: bold;
          will-change: transform;
          transform: translateZ(0px);
          transition: transform 100ms ease-in-out, filter 100ms ease-in-out;
          width: 100%;
          text-align: center;
        }
        .tabber input[type=radio] {
          display: none;
        }
        .tabber input[type=radio]#t1 ~ .blob {
          transform-origin: right center;
        }
        .tabber input[type=radio]#t2 ~ .blob {
          transform-origin: left center;
        }
        .tabber input[type=radio]#t1:checked ~ .blob {
          background-color: #ff4d4f;
          -webkit-animation-name: stretchyRev;
                  animation-name: stretchyRev;
        }
        .tabber input[type=radio]#t2:checked ~ .blob {
          background-color: #ff4d4f;
          -webkit-animation-name: stretchy;
                  animation-name: stretchy;
        }
        .tabber .blob {
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          position: absolute;
          z-index: -1;
          border-radius: .25rem;
          -webkit-animation-duration: 0.5s;
                  animation-duration: 0.5s;
          -webkit-animation-direction: forwards;
                  animation-direction: forwards;
          -webkit-animation-iteration-count: 1;
                  animation-iteration-count: 1;
          -webkit-animation-fill-mode: forwards;
                  animation-fill-mode: forwards;
          transition: transform 100ms ease, background 100ms ease;
        }
        .tabber .blob:before {
          left: 0;
          -webkit-animation-delay: 0.15s;
                  animation-delay: 0.15s;
        }
        .tabber .blob:after {
          right: 0;
        }

        @-webkit-keyframes stretchy {
          0% {
            transform: translateX(0) scaleX(1);
          }
          50% {
            transform: translateX(0) scaleX(2);
          }
          100% {
            transform: translateX(100%) scaleX(1);
          }
        }

        @keyframes stretchy {
          0% {
            transform: translateX(0) scaleX(1);
          }
          50% {
            transform: translateX(0) scaleX(2);
          }
          100% {
            transform: translateX(100%) scaleX(1);
          }
        }
        @-webkit-keyframes stretchyRev {
          0% {
            transform: translateX(100%) scaleX(1);
          }
          50% {
            transform: translateX(0) scaleX(2);
          }
          100% {
            transform: translateX(0) scaleX(1);
          }
        }
        @keyframes stretchyRev {
          0% {
            transform: translateX(100%) scaleX(1);
          }
          50% {
            transform: translateX(0) scaleX(2);
          }
          100% {
            transform: translateX(0) scaleX(1);
          }
        }
        /* LANGUAGE CHANGER */
      `}</style>
    </>
  )
}

export default Footer
