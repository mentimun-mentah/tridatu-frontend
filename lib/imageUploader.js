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

export const getImgUrl = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export const imageValidation = (file, name, url, method, setLoading, dispatch, successResponse) => {
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
        const errDetail = err.response.data.detail;
        if(errDetail == signature_exp){
          dispatch()
          setLoading(false);
          resolve(file);
          resNotification("success", "Success", successResponse)
          // axios[method](url, formData, formHeaderHandler())
          //   .then(res => {
          //     resolve(file);
          //     setLoading(false);
          //     dispatch()
          //     resNotification("success", "Success", res.data.detail)
          //   })
          //   .catch(err => {
          //     const errDetail = err.response.data.detail;
          //     axios.delete("/users/delete-cookies")
          //     setLoading(false);
          //     if(typeof errDetail === "string"){
          //       reject(file);
          //       message.error({ 
          //         content: err.response.data.detail, 
          //         style: { marginTop: '10vh' },
          //       });
          //     } else {
          //       resolve(file);
          //     }
          //   })
        } 
        else {
          setLoading(false);
          if(typeof errDetail === "string"){
            reject(file);
            message.error({ 
              content: errDetail, 
              style: { marginTop: '10vh' },
            });
          } else {
            resolve(file);
          }
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
  <div className="noselect">
    {loading ? <LoadingOutlined /> : <PlusOutlined />}
    <div>Upload{loading ? <>ing</> : null}</div>
  </div>
);
