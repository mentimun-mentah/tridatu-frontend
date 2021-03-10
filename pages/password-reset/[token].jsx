import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Divider, notification } from "antd";
import { AnimatePresence, motion } from "framer-motion";

import id from 'locales/id/password-reset'
import en from 'locales/en/password-reset'

import axios from "lib/axios";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import ErrorMessage from "components/ErrorMessage";

import { isValidForm } from "formdata/formValidation";
import { formReset, formResetIsValid } from "formdata/formResetPassword";

const ResetPassword = () => {
  const router = useRouter();

  const { locale } = router
  const t = locale === "en" ? en : id

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [reset, setReset] = useState(formReset);

  const { email, password, confirm_password } = reset;

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const data = {
      ...reset,
      [name]: {
        ...reset[name],
        value: value,
        isValid: true,
        message: null,
      },
    };
    setReset(data);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (formResetIsValid(reset, setReset, t) && isValidForm(reset)) {
      setLoading(true);
      const data = {
        email: email.value,
        password: password.value,
        confirm_password: confirm_password.value,
      };

      axios
        .put(`/users/password-reset/${token}`, data)
        .then((res) => {
          setLoading(false);
          setReset(formReset);
          notification.success({
            closeIcon: <i className="far fa-times" />,
            message: "Success",
            description: res.data.detail,
            placement: "bottomRight",
          });
          router.replace(`/${locale !== "id" ? locale : ""}`);
        })
        .catch((err) => {
          setLoading(false);
          const errDetail = err.response.data.detail;
          if (typeof errDetail === "string") {
            const state = JSON.parse(JSON.stringify(reset));
            state.email.value = state.email.value;
            state.email.isValid = false;
            state.email.message = errDetail;
            setReset(state);
          } else {
            const state = JSON.parse(JSON.stringify(reset));
            errDetail.map((data) => {
              const key = data.loc[data.loc.length - 1];
              if (state[key]) {
                state[key].value = state[key].value;
                state[key].isValid = false;
                state[key].message = data.msg;
              }
            });
            setReset(state);
          }
        });
    }
  };

  useEffect(() => {
    const { token } = router.query;
    setToken(token);
  }, []);

  return (
    <>
      <Container className="py-3">
        <Row className="justify-content-center mt-3">
          <Col sm={12} md={8}>
            <h4>Reset Password</h4>
            <Divider />
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

              <Button
                className="mt-4 btn-tridatu"
                block
                onClick={submitHandler}
              >
                {t.change_password}
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
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ResetPassword;
