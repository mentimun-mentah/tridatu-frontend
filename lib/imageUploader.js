import { message } from "antd";
import axios, { formHeaderHandler, resNotification } from "./axios";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

message.config({ duration: 5, maxCount: 1 });

export const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export const imageValidation = (file, name, url, method, setLoading, dispatch) => {
  const formData = new FormData();
  formData.append(name, file);
  
  let promise = new Promise((resolve, reject) => {
    setLoading(true);

    axios[method](url, formData, formHeaderHandler())
      .then(res => {
        resolve(file);
        setLoading(false);
        dispatch()
        resNotification("success", "Success", res.data.detail)
      })
      .catch(err => {
        const signature_exp = "Signature has expired"
        if(err.response.data.detail == signature_exp){
          axios[method](url, formData, formHeaderHandler())
            .then(res => {
              resolve(file);
              setLoading(false);
              dispatch()
              resNotification("success", "Success", res.data.detail)
            })
            .catch(err => {
              axios.delete("/users/delete-cookies")
              setLoading(false);
              reject(file);
              message.error({ 
                content: err.response.data.detail, 
                style: { marginTop: '10vh' },
              });
            })
        } 
        else {
          setLoading(false);
          reject(file);
          message.error({ 
            content: err.response.data.detail, 
            style: { marginTop: '10vh' },
          });
        }
      })
  })
  return promise;
}

export const imagePreview = async file => {
  let src = file.url;
  if (!src) {
    src = await new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => resolve(reader.result);
    });
  }
  const image = new Image();
  image.src = src;
  const imgWindow = window.open(src);
  imgWindow.document.write(image.outerHTML);
};

export const uploadButton = loading => (
  <div>
    {loading ? <LoadingOutlined /> : <PlusOutlined />}
    <div>Upload{loading ? <>ing</> : null}</div>
  </div>
);
