// import { withAuth } from 'lib/withAuth'
import { useState, useEffect } from 'react'
import { Select, Button, Upload, Input } from 'antd'
import { useDispatch, useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";

import axios, { jsonHeaderHandler, resNotification, signature_exp } from 'lib/axios'
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
  const [loading, setLoading] = useState(false)
  const [loadingProfie, setLoadingProfie] = useState(false)
  const [avatar, setAvatar] = useState(formImage)
  const [profile, setProfile] = useState(formProfile)
  const [oldData, setOldData] = useState(formProfile)

  const user = useSelector(state => state.auth.user)

  const { username, email, phone, gender } = profile;
  const avatarImage = avatar.image;
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
    if(formProfileIsValid(profile, setProfile)){
      setLoadingProfie(true)
      const data = {
        username: username.value,
        phone: "+62" + phone.value,
        gender: gender.value
      }

      axios.put('/users/update-account', data, jsonHeaderHandler())
        .then(res => {
          setLoadingProfie(false)
          resNotification("success", res.data.detail)
          dispatch(actions.getUser())
        })
        .catch(err => {
          const errDetail = err.response.data.detail;
          const errPhone = "The phone number has already been taken."
          if(errDetail === signature_exp){
            axios.put('/users/update-account', data, jsonHeaderHandler())
              .then(res => {
                setLoadingProfie(false)
                resNotification("success", res.data.detail)
                dispatch(actions.getUser())
              })
              .catch(() => {
                setLoadingProfie(false)
                axios.delete("/users/delete-cookies")
              })
          }
          if (typeof errDetail === "string" && errDetail === errPhone) {
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
      let phone = "";
      if(user.phone){
        phone = user.phone.split(" ")[user.phone.split(" ").length - 1]
        phone = phone.split("-").join("")
      }
      const data = {
        ...profile,
        username: { value: user.username, isValid: true, message: null },
        email: { value: user.email, isValid: true, message: null },
        phone: { value: phone, isValid: true, message: null },
        gender: { value: user.gender, isValid: true, message: null },
      };
      setProfile(data)
      setOldData(data)
      const avatarData = {
        image: { 
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
          <h1 className="fs-16 mt-1 mb-0">Akun Saya</h1>
          <small>
            Kelola informasi profil Anda untuk mengontrol dan melindungi akun anda
          </small>
        </Card.Header>
        <Row noGutters>
          <Col lg={8} className="border-right-profile fs-14 order-lg-1 order-md-12 order-12">
            <Card.Body>
              <Form>
                <Form.Row>
                  <Form.Group as={Col} lg={6} md={6} sm={12}>
                    <Form.Label>Username</Form.Label>
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
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                      disabled 
                      type="email" 
                      placeholder={email.value ? email.value : "user@example.com"}
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} lg={6} md={6} sm={12}>
                    <Form.Label>Nomor Telepon</Form.Label>
                    <Input 
                      name="phone" 
                      addonBefore="+62" 
                      className="input-h-35" 
                      placeholder="Nomor Telepon" 
                      value={phone.value}
                      onChange={e => inputChangeHandler(e)}
                    />
                    <ErrorMessage item={phone} />
                  </Form.Group>

                  <Form.Group as={Col} lg={6} md={6} sm={12}>
                    <Form.Label>Jenis Kelamin</Form.Label>
                    <Select 
                      name="gender" 
                      className="w-100" 
                      placeholder="Pilih jenis kelamin"
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
                  {loadingProfie ? <LoadingOutlined /> : "Simpan"}
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
                  beforeUpload={(file) => imageValidation(file, "file", "/users/update-avatar", "put", setLoading, () => dispatch(actions.getUser()))}
                >
                  <Button style={{ width: 91 }} disabled={loading}>
                    {loading ? <LoadingOutlined /> : "Pilih Foto"}
                  </Button>
                </Upload>
                <p className="fs-12 mb-0 mt-3 text-secondary mt-0">
                  Ukuran gambar: maks. 4 MB
                </p>
                <p className="fs-12 text-secondary mt-0">
                  Format gambar: .JPEG, .JPG, .PNG
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

export default Profile
