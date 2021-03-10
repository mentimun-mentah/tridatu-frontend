import { useState } from "react";
import { Button, Modal } from "antd";
import { withAuth } from 'lib/withAuth'
import { useRouter } from 'next/router'
import { useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";

import id from 'locales/id/account/password'
import en from 'locales/en/account/password'

import axios, { jsonHeaderHandler, resNotification, signature_exp } from "lib/axios";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

import ErrorMessage from "components/ErrorMessage";

import { formConfigPassword, formVerifyPassword, formConfigPasswordIsValid, formVerifyPasswordIsValid } from "formdata/formConfigPassword";

const Password = () => {
  const router = useRouter();

  const { locale } = router
  const t = locale === "en" ? en : id

  const [loading, setLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formPassword, setFormPassword] = useState(formConfigPassword);
  const [verifyPassword, setVerifyPassword] = useState(formVerifyPassword);

  const user = useSelector(state => state.auth.user)

  const isUpdate = user !== null ? user.password : false;

  const { old_password, password, confirm_password } = formPassword;
  const { verify_password } = verifyPassword;

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const data = {
      ...formPassword,
      [name]: {
        ...formPassword[name],
        value: value,
        isValid: true,
        message: null,
      },
    };
    setFormPassword(data);
  };

  const verifyPasswordHandler = (e) => {
    const value = e.target.value;
    const data = {
      ...verifyPassword,
      verify_password: {
        ...verifyPassword.verify_password,
        value: value,
        isValid: true,
        message: null
      }
    }
    setVerifyPassword(data);
  }

  const submitHandler = (e) => {
    e.persist()
    if (formConfigPasswordIsValid(formPassword, setFormPassword, isUpdate, t)) {
      setLoading(true);
      let url = "/users/add-password";
      let method = "post";
      let data = {
        password: password.value,
        confirm_password: confirm_password.value,
      };

      if (isUpdate) {
        data = { ...data, old_password: old_password.value };
        url = "/users/update-password";
        method = "put";
      }

      axios[method](url, data, jsonHeaderHandler())
        .then((res) => {
          setLoading(false);
          setFormPassword(formConfigPassword)
          resNotification("success", "Success", res.data.detail)
        })
        .catch((err) => {
          setLoading(false);
          const errDetail = err.response.data.detail;
          const freshRequired = "Fresh token required";
          if (typeof errDetail === "string" && errDetail === freshRequired) {
            setShowConfirmPassword(true);
          }
          else if (typeof errDetail === "string" && errDetail) {
            const state = JSON.parse(JSON.stringify(formPassword));
            if(isUpdate){
              state.old_password.value = state.old_password.value;
              state.old_password.isValid = false;
              state.old_password.message = errDetail;
              setFormPassword(state);
            } else {
              state.password.value = state.password.value;
              state.password.isValid = false;
              state.password.message = errDetail;
              setFormPassword(state);
            }
          } else {
            const state = JSON.parse(JSON.stringify(formPassword));
            errDetail.map((data) => {
              const key = data.loc[data.loc.length - 1];
              if (state[key]) {
                state[key].value = state[key].value;
                state[key].isValid = false;
                state[key].message = data.msg;
              }
            });
            setFormPassword(state);
          }
        });
    }
  };

  const submitVerifyPassword = (e) => {
    e.persist()
    if (formVerifyPasswordIsValid(verifyPassword, setVerifyPassword, t)){
      setLoading(true);
      const data = {
        password: verify_password.value
      }

      axios.post("/users/fresh-token", data, jsonHeaderHandler())
        .then(() => {
          submitHandler(e)
          setLoading(true);
          setShowConfirmPassword(false)
          setVerifyPassword(formVerifyPassword)
        })
        .catch(err => {
          const errDetail = err.response.data.detail;
          if (typeof errDetail === "string" && errDetail === signature_exp) {
            axios.post("/users/fresh-token", data, jsonHeaderHandler())
              .then(() => {
                submitHandler(e)
                setLoading(true);
                setShowConfirmPassword(false);
                setVerifyPassword(formVerifyPassword)
              })
          }
          if (typeof errDetail === "string" && errDetail !== signature_exp) {
            setLoading(false);
            const state = JSON.parse(JSON.stringify(verifyPassword));
            state.verify_password.value = state.verify_password.value;
            state.verify_password.isValid = false;
            state.verify_password.message = errDetail;
            setVerifyPassword(state);
          } 
          if (typeof errDetail !== "string") {
            setLoading(false);
            const state = JSON.parse(JSON.stringify(verifyPassword));
            errDetail.map((data) => {
              let key = data.loc[data.loc.length - 1] === "password" ? "verify_password" : "verify_password";
              if (state[key]) {
                state[key].value = state[key].value;
                state[key].isValid = false;
                state[key].message = data.msg;
              }
            });
            setVerifyPassword(state);
          }
        })
    }
  }

  return (
    <>
      <Card className="card-container">
        <Card.Header className="bg-transparent border-bottom">
          <h1 className="fs-16 mt-1 mb-0">{t.set_password}</h1>
          <small>
            {t.set_password_text}
          </small>
        </Card.Header>
        <Card.Body>
          <Form>
            {isUpdate && (
              <Form.Row>
                <Form.Group as={Col} lg={8} md={8} sm={12}>
                  <Form.Label>{t.current_password}</Form.Label>
                  <Form.Control
                    type="password"
                    name="old_password"
                    placeholder={t.current_password}
                    value={old_password.value}
                    onChange={inputChangeHandler}
                  />
                  <ErrorMessage item={old_password} />
                </Form.Group>
              </Form.Row>
            )}

            <Form.Row>
              <Form.Group as={Col} lg={8} md={8} sm={12}>
                <Form.Label>{t.new_password}</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder={t.new_password}
                  value={password.value}
                  onChange={inputChangeHandler}
                />
                <ErrorMessage item={password} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} lg={8} md={8} sm={12}>
                <Form.Label>{t.confirm_password}</Form.Label>
                <Form.Control
                  type="password"
                  name="confirm_password"
                  placeholder={t.confirm_password}
                  value={confirm_password.value}
                  onChange={inputChangeHandler}
                />
                <ErrorMessage item={confirm_password} />
              </Form.Group>
            </Form.Row>

            <Button className="btn-tridatu" onClick={submitHandler} style={{ width: 80 }}>
              {!showConfirmPassword && loading ? <LoadingOutlined /> : t.save}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Modal
        centered
        title=" "
        footer={null}
        visible={showConfirmPassword}
        maskClosable={false}
        onOk={() => setShowConfirmPassword(false)}
        onCancel={() => setShowConfirmPassword(false)}
        className="modal-login"
        zIndex="1030"
        width={400}
        closeIcon={<i className="fas fa-times" />}
        maskStyle={{backgroundColor: "#000000c7"}}
      >
        <h4 className="fs-20-s">
          {t.confirm_password}
        </h4>
        <p className="text-muted fs-12-s">
          {t.confirm_password_modal_text}
        </p>

        <Form className="mt-3 mb-0">
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={verify_password.value}
              onChange={verifyPasswordHandler}
            />
            <ErrorMessage item={verify_password} />
          </Form.Group>

          <Button
            block
            className="mt-1 btn-tridatu mb-0"
            onClick={submitVerifyPassword}
          >
            {showConfirmPassword && loading ? <LoadingOutlined /> : t.confirm_password}
          </Button>
        </Form>

      </Modal>
    </>
  );
};

export default withAuth(Password);
