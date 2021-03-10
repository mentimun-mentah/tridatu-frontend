import { useState } from "react";
import { Modal, Divider, notification } from "antd";
import { AnimatePresence, motion } from "framer-motion";

import axios from "lib/axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import SocialLogin from "./SocialLogin";
import ErrorMessage from "components/ErrorMessage";

import { formRegister, formRegisterIsValid } from "formdata/formRegister";

const Register = ({ show, handler, close, t }) => {
  const [loading, setLoading] = useState(false);
  const [register, setRegister] = useState(formRegister);

  const { username, email, password, confirm_password } = register;

  const closeModalHandler = () => {
    close();
    setRegister(formRegister);
  };

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const data = {
      ...register,
      [name]: {
        ...register[name],
        value: value,
        isValid: true,
        message: null,
      },
    };
    setRegister(data);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (formRegisterIsValid(register, setRegister, t)) {
      setLoading(true);
      const data = {
        username: username.value,
        email: email.value,
        password: password.value,
        confirm_password: confirm_password.value,
      };

      axios
        .post("/users/register", data)
        .then((res) => {
          setLoading(false);
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
            const state = JSON.parse(JSON.stringify(register));
            state.email.value = state.email.value;
            state.email.isValid = false;
            state.email.message = errDetail;
            setRegister(state);
          } else {
            const state = JSON.parse(JSON.stringify(register));
            errDetail.map((data) => {
              const key = data.loc[data.loc.length - 1];
              if (state[key]) {
                state[key].value = state[key].value;
                state[key].isValid = false;
                state[key].message = data.msg;
              }
            });
            setRegister(state);
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
          {t.register}
          <a
            href="#"
            className="fs-12 float-right text-secondary pt-2"
            onClick={handler}
          >
            {t.login}
          </a>
        </h4>

        <Form className="my-4">
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Username"
              value={username.value}
              onChange={inputChangeHandler}
            />
            <ErrorMessage item={username} />
          </Form.Group>

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

          <Form.Group>
            <Form.Label>Confirmation Password</Form.Label>
            <Form.Control
              type="password"
              name="confirm_password"
              placeholder="Confirmation Password"
              value={confirm_password.value}
              onChange={inputChangeHandler}
            />
            <ErrorMessage item={confirm_password} />
          </Form.Group>

          <div className="mt-4 text-secondary">
            <span>{t.approval_text}</span>
            <a className="text-tridatu"> {t.term_condition}</a>
            <span> {t.and} </span>
            <a className="text-tridatu">{t.privacy}</a>
          </div>

          <Button className="mt-3 btn-tridatu" block onClick={submitHandler}>
            {t.register}
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
          <span className="text-muted">{t.or_register_with}</span>
        </Divider>

        <SocialLogin text={t.register_with} />
      </Modal>
    </>
  );
};

export default Register;
