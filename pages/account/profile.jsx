import { withAuth } from 'lib/withAuth'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Select, Button, Upload, Input } from 'antd'
import { useDispatch, useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";

import id from 'locales/id/account/profile'
import en from 'locales/en/account/profile'

import axios, { jsonHeaderHandler, resNotification, signature_exp } from 'lib/axios'
import isIn from 'validator/lib/isIn'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import * as actions from "store/actions";
import ErrorMessage from "components/ErrorMessage";

import { formImage } from 'formdata/formImage'
import { formProfile, formProfileIsValid } from 'formdata/formProfile'
import { uploadButton, imagePreview, imageValidation } from 'lib/imageUploader'

const genderList = ['Laki-laki', 'Perempuan', 'Lainnya']

const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { locale } = router
  const t = locale === "en" ? en : id

  const [loading, setLoading] = useState(false)
  const [loadingProfie, setLoadingProfie] = useState(false)
  const [avatar, setAvatar] = useState(formImage)
  const [profile, setProfile] = useState(formProfile)
  const [oldData, setOldData] = useState(formProfile)

  const user = useSelector(state => state.auth.user)

  const { username, email, phone, gender } = profile;
  const avatarImage = avatar.file;
  const oldUsername = oldData.username.value;
  const oldPhone = oldData.phone.value;
  const oldGender = oldData.gender.value;

  let saveDisable = (oldUsername === username.value) && (oldPhone === phone.value) && (oldGender === gender.value)

  const inputChangeHandler = (e, item) => {
    const name = !item && e.target.name;
    const value = !item && e.target.value;

    if(item){
      const data = {
        ...profile,
        [item]: { ...profile[item], value: e, isValid: true, message: null }
      }
      setProfile(data)
    }
    else {
      const data = {
        ...profile,
        [name]: { ...profile[name], value: value, isValid: true, message: null }
      }
      setProfile(data)
    }
  }

  const onSubmitHandler = e => {
    e.preventDefault()
    if(formProfileIsValid(profile, setProfile, t)){
      setLoadingProfie(true)
      const data = {
        username: username.value,
        phone: phone.value,
        gender: gender.value
      }

      axios.put('/users/update-account', data, jsonHeaderHandler())
        .then(res => {
          setLoadingProfie(false)
          resNotification("success", "Success", res.data.detail)
          dispatch(actions.getUser())
        })
        .catch(err => {
          const errDetail = err.response.data.detail;
          const errPhone = ["The phone number has already been taken.", "Nomor telepon sudah dipakai orang lain."]
          if(errDetail === signature_exp){
            axios.put('/users/update-account', data, jsonHeaderHandler())
              .then(res => {
                setLoadingProfie(false)
                resNotification("success", "Success", res.data.detail)
                dispatch(actions.getUser())
              })
              .catch(() => {
                setLoadingProfie(false)
                axios.delete("/users/delete-cookies")
              })
          }
          if (typeof errDetail === "string" && isIn(errDetail, errPhone)) {
            setLoadingProfie(false)
            const state = JSON.parse(JSON.stringify(profile));
            state.phone.value = state.phone.value;
            state.phone.isValid = false;
            state.phone.message = errDetail;
            setProfile(state);
          }
          if (typeof errDetail !== "string") {
            setLoadingProfie(false)
            const state = JSON.parse(JSON.stringify(profile));
            errDetail.map((data) => {
              const key = data.loc[data.loc.length - 1];
              if (state[key]) {
                state[key].value = state[key].value;
                state[key].isValid = false;
                state[key].message = data.msg;
              }
            });
            setProfile(state);
          } 
          setLoadingProfie(false)
        })
    }
  }

  useEffect(() => {
    if(user !== null){
      // let phone = "";
      // if(user.phone){
      //   console.log(user.phone)
      //   phone = user.phone.split(" ")[user.phone.split(" ").length - 1]
      //   phone = phone.split("-").join("")
      // }
      const data = {
        ...profile,
        username: { value: user.username, isValid: true, message: null },
        email: { value: user.email, isValid: true, message: null },
        // phone: { value: phone, isValid: true, message: null },
        phone: { value: user.phone, isValid: true, message: null },
        gender: { value: user.gender, isValid: true, message: null },
      };
      setProfile(data)
      setOldData(data)
      const avatarData = {
        file: { 
          value: [{
            uid: -Math.abs(Math.random()),
            url: `${process.env.NEXT_PUBLIC_API_URL}/static/avatars/${user.avatar}`
          }], 
          isValid: true, 
          message: null 
        },
      }
      setAvatar(avatarData)
    }
  },[user])

  return(
    <>
      <Card className="card-container">
        <Card.Header className="bg-transparent border-bottom">
          <h1 className="fs-16 mt-1 mb-0">{t.my_account}</h1>
          <small>
            {t.my_account_text}
          </small>
        </Card.Header>
        <Row noGutters>
          <Col lg={8} className="border-right-profile fs-14 order-lg-1 order-md-12 order-12">
            <Card.Body>
              <Form>
                <Form.Row>
                  <Form.Group as={Col} lg={6} md={6} sm={12}>
                    <Form.Label>{t.data_input.username}</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="username" 
                      placeholder="Username"
                      value={username.value}
                      onChange={e => inputChangeHandler(e)}
                    />
                    <ErrorMessage item={username} />
                  </Form.Group>

                  <Form.Group as={Col} lg={6} md={6} sm={12}>
                    <Form.Label>{t.data_input.email}</Form.Label>
                    <Form.Control 
                      disabled 
                      type="email" 
                      placeholder={email.value ? email.value : "user@example.com"}
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} lg={6} md={6} sm={12}>
                    <Form.Label>{t.data_input.phone_number}</Form.Label>
                    <Input 
                      name="phone" 
                      // addonBefore="+62" 
                      className="input-h-35 h-35"
                      placeholder={t.data_input.phone_number} 
                      value={phone.value}
                      onChange={e => inputChangeHandler(e)}
                    />
                    <ErrorMessage item={phone} />
                  </Form.Group>

                  <Form.Group as={Col} lg={6} md={6} sm={12}>
                    <Form.Label>{t.data_input.gender}</Form.Label>
                    <Select 
                      name="gender" 
                      className="w-100" 
                      placeholder={t.data_input.gender_placeholder}
                      value={gender.value}
                      onChange={e => inputChangeHandler(e, "gender")}
                    >
                      {genderList.map(gen => (
                        <Select.Option key={gen} value={gen}>{gen}</Select.Option>
                      ))}
                    </Select>
                    <ErrorMessage item={gender} />
                  </Form.Group>
                </Form.Row>
                
                <Button className="btn-tridatu" onClick={onSubmitHandler} style={{ width: 80 }} disabled={saveDisable}>
                  {loadingProfie ? <LoadingOutlined /> : t.save}
                </Button> 

              </Form>
            </Card.Body>
          </Col>

          <Col lg={4} className="text-center order-lg-12 order-md-1 order-1 align-self-center">
            <Card className="border-0">
              <Card.Body>
                <Upload
                  accept="image/*"
                  listType="picture-card"
                  className="avatar-uploader"
                  onPreview={imagePreview}
                  fileList={avatarImage.value}
                  showUploadList={{showRemoveIcon: false, showPreviewIcon: true}}
                >
                  {avatarImage.value.length >= 1 ? null : uploadButton(loading)}
                </Upload>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={(file) => imageValidation(file, "file", "/users/update-avatar", "put", setLoading, () => dispatch(actions.getUser()), "The image profile has updated.")}
                >
                  <Button style={{ width: 'auto' }} disabled={loading}>
                    {loading ? <LoadingOutlined /> : t.data_avatar.select_photo}
                  </Button>
                </Upload>
                <p className="fs-12 mb-0 mt-3 text-secondary mt-0">
                  {t.data_avatar.img_size} 4 MB
                </p>
                <p className="fs-12 text-secondary mt-0">
                  {t.data_avatar.img_format}: .JPEG, .JPG, .PNG
                </p>
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Card>

      <style jsx>{`
        :global(.avatar-uploader .ant-upload){
          vertical-align: middle;
          border-radius: 50%;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        :global(.avatar-uploader .ant-upload-list-picture-card-container){
          margin-right: 0;
          border-radius: 50%;
        }
        :global(.avatar-uploader .ant-upload-list-item-info,
                .avatar-uploader .ant-upload-list-picture-card .ant-upload-list-item-info::before){
          border-radius: 50%;
        }
        :global(.avatar-uploader .ant-upload-list-picture-card .ant-upload-list-item){
          padding: 5px;
          border-radius: 50%;
        }

        :global(.border-right-profile){
          border-right: 1px solid #dee2e6!important;
        }

        :global(.input-h-35 .ant-input){
          height: 35px;
        }

        @media only screen and (max-width: 992px){
          :global(.border-right-profile){
            border-right: 0!important;
          }
        }
      `}</style>
    </>
  )
}

export default withAuth(Profile)
