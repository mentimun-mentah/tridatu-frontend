import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { LogoGoogle, LogoFacebook } from "./logo";

const SocialLogin = ({ text }) => {
  return(
    <>
      <Row>
        <Col md={12} lg={6}>
          <a href={`${process.env.NEXT_PUBLIC_API_URL}/login/google`} className="text-decoration-none">
            <button className="btn-login btn mb-2">
              <div className="btn-login-icon">
                <LogoGoogle />
              </div>
              <span>{text} dengan Google</span>
            </button>
          </a>
        </Col>
        <Col md={12} lg={6}>
          <a href={`${process.env.NEXT_PUBLIC_API_URL}/login/facebook`} className="text-decoration-none">
            <button className="btn-login btn mb-2">
              <div className="btn-login-icon">
                <LogoFacebook />
              </div>
              <span>{text} dengan Facebook</span>
            </button>
          </a>
        </Col>
      </Row>

      <style jsx>{`
        .btn-login {
          background-color: rgb(255, 255, 255);
          display: inline-flex;
          align-items: center;
          color: rgba(0, 0, 0, 0.54);
          padding: 0px;
          border-radius: .25rem;
          border: 1px solid #ced4da;
          font-size: 14px;
          font-weight: 500;
          font-family: Roboto, sans-serif;
          width: 100%;
        }
        .btn-login-icon {
          margin-right: 10px;
          background: rgb(255, 255, 255);
          border-radius: .25rem;
          padding: 6px;
        }
      `}</style>
    </>
  )
}

export default SocialLogin
