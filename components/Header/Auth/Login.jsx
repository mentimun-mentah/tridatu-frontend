import { useState } from "react";
import { Modal, Divider, Row, Col, notification } from "antd";
import { AnimatePresence, motion } from "framer-motion";

import axios from "lib/axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import SocialLogin from "./SocialLogin";

import { formLogin, formLoginIsValid } from "formdata/formLogin";

const Login = ({ show, handler, close, switchToExtraAuth }) => {
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState(formLogin);

  const { email, password } = login;

  const closeModalHandler = () => {
    close()
    setLogin(formLogin)
  }

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const data = {
      ...login,
      [name]: {
        ...login[name],
        value: value, isValid: true, message: null,
      },
    };
    setLogin(data);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (formLoginIsValid(login, setLogin)) {
      setLoading(true)
      const data = {
        email: email.value,
        password: password.value,
      };

      axios.post("/users/login", data)
        .then(res => {
          setLoading(false)
          notification.success({
            closeIcon: <i className="far fa-times" />,
            message: 'Success',
            description: res.data.detail,
            placement: 'bottomRight',
          });
          closeModalHandler()
        })
        .catch(err => {
          setLoading(false)
          const errDetail = err.response.data.detail
          if(typeof(errDetail) === "string"){
            const state = JSON.parse(JSON.stringify(login));
            state.password.value = state.password.value
            state.password.isValid = false
            state.password.message = errDetail
            setLogin(state)
          } else {
            const state = JSON.parse(JSON.stringify(login));
            errDetail.map(data => {
              const key = data.loc[data.loc.length - 1]
              if(state[key]){
                state[key].value = state[key].value;
                state[key].isValid = false;
                state[key].message = data.msg;
              }
            })
            setLogin(state)
          }
        })
    }
  };

  return (
    <>
      <Modal
        centered
        title=" "
        footer={null}
        visible={show}
        onOk={closeModalHandler}
        onCancel={closeModalHandler}
        className="modal-login"
        zIndex="1030"
        closeIcon={<i className="fas fa-times" />}
      >
        <h4 className="fs-20-s">
          Masuk
          <a
            href="#"
            className="fs-12 float-right text-secondary pt-2"
            onClick={handler}
          >
            Daftar
          </a>
        </h4>

        <Form className="my-4">
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              value={email.value}
              onChange={inputChangeHandler}
            />
            {!email.isValid && ( <small className="form-text text-left text-danger mb-n1">{email.message}</small>)}
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={password.value}
              onChange={inputChangeHandler}
            />
            {!password.isValid && ( <small className="form-text text-left text-danger mb-n1">{password.message}</small>)}
          </Form.Group>

          <Row justify="space-between">
            <Col md={12}>
              <span className="text-dark hov_pointer" onClick={() => switchToExtraAuth("reset")}>
                <a className="fs-12 text-reset text-muted">Lupa Password ?</a>
              </span>
            </Col>
            <Col md={12} className="text-right">
              <span className="text-dark hov_pointer" onClick={() => switchToExtraAuth("resend")}>
                <a className="fs-12 text-reset text-muted">Kirim ulang verifikasi</a>
              </span>
            </Col>
          </Row>

          <Button className="mt-4 btn-tridatu" block onClick={submitHandler}>
            Masuk
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="spinner-border spinner-border-sm ml-2" 
                />
              )}
            </AnimatePresence>
          </Button>
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
