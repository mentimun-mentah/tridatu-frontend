import { Modal, Divider } from "antd";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import SocialLogin from "./SocialLogin";

const Login = ({ show, handler, close, login }) => {

  const loginHandler = () => {
    login();
    close();
  }

  return (
    <>
      <Modal
        centered
        title=" "
        footer={null}
        visible={show}
        onOk={close}
        onCancel={close}
        className="modal-login"
        zIndex="1030"
        closeIcon={<i className="fas fa-times" />}
      >
        <h4 className="fs-20-s">
          Masuk
          <a href="#" className="fs-12 float-right text-secondary pt-2" onClick={handler}>
            Daftar
          </a>
        </h4>

        <Form className="my-4">
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Email" />
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>

          <Button className="mt-4 btn-tridatu" block onClick={loginHandler}>Masuk</Button>
        </Form>

        <Divider className="mb-4" plain>
          <span className="text-muted">atau masuk dengan</span>
        </Divider>

        <SocialLogin text="Masuk" />
      </Modal>
    </>
  );
};

export default Login;
