import { useState } from "react";
import { useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { Modal, Divider, Row, Col, notification } from "antd";

import axios from "lib/axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import SocialLogin from "./SocialLogin";
import ErrorMessage from "components/ErrorMessage";

import * as actions from "store/actions";
import { formLogin, formLoginIsValid } from "formdata/formLogin";

const Login = ({ show, handler, close, switchToExtraAuth, t }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState(formLogin);

  const { email, password } = login;

  const closeModalHandler = () => {
    close();
    setLogin(formLogin);
  };

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const data = {
      ...login,
      [name]: {
        ...login[name],
        value: value,
        isValid: true,
        message: null,
      },
    };
    setLogin(data);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (formLoginIsValid(login, setLogin, t)) {
      setLoading(true);
      const data = {
        email: email.value,
        password: password.value,
      };

      axios
        .post("/users/login", data)
        .then((res) => {
          setLoading(false);
          dispatch(actions.getUser())
          notification.success({
            closeIcon: <i className="far fa-times" />,
            message: "Success",
            description: res.data.detail,
            placement: "bottomRight",
          });
          closeModalHandler();
        })
        .catch((err) => {
          setLoading(false);
          const errDetail = err.response.data.detail;
          if (typeof errDetail === "string") {
            const state = JSON.parse(JSON.stringify(login));
            state.password.value = state.password.value;
            state.password.isValid = false;
            state.password.message = errDetail;
            setLogin(state);
          } else {
            const state = JSON.parse(JSON.stringify(login));
            errDetail.map((data) => {
              const key = data.loc[data.loc.length - 1];
              if (state[key]) {
                state[key].value = state[key].value;
                state[key].isValid = false;
                state[key].message = data.msg;
              }
            });
            setLogin(state);
          }
        });
    }
  };

  return (
    <>
      <Modal
        centered
        title=" "
        footer={null}
        visible={show}
        maskClosable={false}
        onOk={closeModalHandler}
        onCancel={closeModalHandler}
        className="modal-login"
        zIndex="1030"
        closeIcon={<i className="fas fa-times" />}
      >
        <h4 className="fs-20-s">
          {t.login}
          <a
            href="#"
            className="fs-12 float-right text-secondary pt-2"
            onClick={handler}
          >
            {t.register}
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
            <ErrorMessage item={email} />
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
            <ErrorMessage item={password} />
          </Form.Group>

          <Row justify="space-between">
            <Col md={12}>
              <span
                className="text-dark hov_pointer"
                onClick={() => switchToExtraAuth("reset")}
              >
                <a className="fs-12 text-reset text-muted">{t.forgot_password} ?</a>
              </span>
            </Col>
            <Col md={12} className="text-right">
              <span
                className="text-dark hov_pointer"
                onClick={() => switchToExtraAuth("resend")}
              >
                <a className="fs-12 text-reset text-muted">
                  {t.resend_verification}
                </a>
              </span>
            </Col>
          </Row>

          <Button className="mt-4 btn-tridatu" block onClick={submitHandler}>
            {t.login}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="spinner-border spinner-border-sm ml-2"
                />
              )}
            </AnimatePresence>
          </Button>
        </Form>

        <Divider className="mb-4" plain>
          <span className="text-muted">{t.or_login_with}</span>
        </Divider>

        <SocialLogin text={t.login_with} />
      </Modal>
    </>
  );
};

export default Login;
