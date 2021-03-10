import { useState } from "react";
import { Modal, notification } from "antd";
import { AnimatePresence, motion } from "framer-motion";

import axios from "lib/axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { formEmail, formEmailIsValid } from "formdata/formEmail";
import ErrorMessage from "components/ErrorMessage";

const RESET  = "reset",
      RESEND = "resend";

const ExtraAuth = ({ show, handler, close, type, t }) => {
  const [loading, setLoading] = useState(false);
  const [extraAuth, setExtraAuth] = useState(formEmail);

  const { email } = extraAuth;

  const closeModalHandler = () => {
    close();
    setExtraAuth(formEmail);
  };

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const data = {
      ...extraAuth,
      [name]: {
        ...extraAuth[name],
        value: value,
        isValid: true,
        message: null,
      },
    };
    setExtraAuth(data);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (formEmailIsValid(extraAuth, setExtraAuth, t)) {
      setLoading(true);
      const data = { email: email.value };

      let url = "/users/password-reset/send";
      if (type === RESEND) url = "/users/resend-email";

      axios
        .post(url, data)
        .then((res) => {
          setLoading(false);
          closeModalHandler();
          if(res.status >= 400 && res.status < 500){
            notification.error({
              closeIcon: <i className="far fa-times" />,
              message: "Error",
              description: res.data.detail,
              placement: "bottomRight",
            });
          }
          if(res.status >= 200 && res.status < 300){
            notification.success({
              closeIcon: <i className="far fa-times" />,
              message: "Success",
              description: res.data.detail,
              placement: "bottomRight",
            });
          }
        })
        .catch((err) => {
          setLoading(false);
          const errDetail = err.response.data.detail;
          if (typeof errDetail === "string") {
            const state = JSON.parse(JSON.stringify(extraAuth));
            state.email.value = state.email.value;
            state.email.isValid = false;
            state.email.message = errDetail;
            setExtraAuth(state);
          } else {
            const state = JSON.parse(JSON.stringify(extraAuth));
            errDetail.map((data) => {
              const key = data.loc[data.loc.length - 1];
              if (state[key]) {
                state[key].value = state[key].value;
                state[key].isValid = false;
                state[key].message = data.msg;
              }
            });
            setExtraAuth(state);
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
          {type === RESET && t.reset_password}
          {type === RESEND && t.resend_email_verification}
        </h4>

        <p className="text-muted fs-12-s">
          {type === RESET && t.reset_password_text}
          {type === RESEND && t.resend_email_verification_text}
        </p>

        <Form className="my-3 mb-3">
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

          <Button
            className="mt-4 btn-tridatu mb-0"
            block
            onClick={submitHandler}
          >
            {t.send}
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

        <p className="text-muted mb-0 fs-12">
          {t.dont_have_account}?
          <strong>
            <span
              className="text-tridatu hover-pointer noselect"
              onClick={handler}
            >
              {" "}
              {t.register}
            </span>
          </strong>
        </p>
      </Modal>
    </>
  );
};

export default ExtraAuth;
