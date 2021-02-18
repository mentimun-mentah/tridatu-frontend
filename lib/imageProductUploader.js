import { message } from "antd";
import axios, { formHeaderHandler } from "./axios";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

message.config({ duration: 5, maxCount: 1 });

export const multipleImageValidation = (file, imageList, name, url, method, setLoading) => {
  const formData = new FormData();

  imageList.forEach(file => {
    if(file.hasOwnProperty("originFileObj")) formData.append(name, file.originFileObj)
  })
  formData.append(name, file);

  let promise = new Promise((resolve, reject) => {
    setLoading(true);

    axios[method](url, formData, formHeaderHandler())
      .then(() => {
        resolve(file);
        setLoading(false);
      })
      .catch(err => {
        const signature_exp = "Signature has expired"
        const errDetail = err.response.data.detail;
        if(errDetail == signature_exp){
          setLoading(false);
          resolve(file);
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
  return promise
}

export const imageValidationProduct = (file, name, url, method, setLoading) => {
  const formData = new FormData();
  formData.append(name, file);
  
  let promise = new Promise((resolve, reject) => {
    setLoading(true);

    axios[method](url, formData, formHeaderHandler())
      .then(() => {
        resolve(file);
        setLoading(false);
      })
      .catch(err => {
        const signature_exp = "Signature has expired"
        const errDetail = err.response.data.detail;
        if(errDetail == signature_exp){
          setLoading(false);
          resolve(file);
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

export const checkVariantImage = (state) => {
  for(let i = 0; i < state.length; i++){
    if(!state[i].hasOwnProperty("uid")){
      const element = document.getElementById(`variant-upload-${i}`)
      const child = element && element.childNodes[0].childNodes[0].childNodes[0]
      const deleteBtn = child && child.childNodes[0].childNodes[1].childNodes[1]
      if(deleteBtn && deleteBtn.childNodes[0].childNodes[0]){
        deleteBtn.click()
      }
    }
  }
}
