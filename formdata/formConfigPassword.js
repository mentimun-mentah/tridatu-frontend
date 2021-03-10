// import isEqual from 'validator/lib/equals'
import isLength from 'validator/lib/isLength'

export const formConfigPassword = {
  old_password: { value: "", isValid: true, message: "" },
  password: { value: "", isValid: true, message: "" },
  confirm_password: { value: "", isValid: true, message: "" },
}

export const formVerifyPassword = {
  verify_password: { value: "", isValid: true, message: "" },
}

export const formConfigPasswordIsValid = (state, setState, isUpdate, t) => {
  let old_password = {}
  if(isUpdate) old_password = { ...state.old_password }
  const password = { ...state.password }
  const confirm_password = { ...state.confirm_password }
  let isGood = true

  if(isUpdate){
    if(!isLength(old_password.value, { min: 6, max: 100 })){
      isGood = false;
      old_password.isValid = false;
      old_password.message = t.validation.value_length;
    }
  }

  if(!isLength(password.value, { min: 6, max: 100 })){
    isGood = false;
    password.isValid = false;
    password.message = t.validation.value_length;
  }

  // if(!isEqual(password.value, confirm_password.value)){
  //   isGood = false;
  //   password.isValid = false;
  //   password.message = "Password must match with confirmation.";
  // }

  if(!isLength(confirm_password.value, { min: 6, max: 100 })){
    isGood = false;
    confirm_password.isValid = false;
    confirm_password.message = t.validation.value_length;
  }

  if(isUpdate){
    if(!isGood) setState({ ...state, old_password, password, confirm_password })
  } else {
    if(!isGood) setState({ ...state, password, confirm_password })
  }

  return isGood
}

export const formVerifyPasswordIsValid = (state, setState, t) => {
  const verify_password = { ...state.verify_password }
  let isGood = true

  if(!isLength(verify_password.value, { min: 6, max: 100 })){
    isGood = false;
    verify_password.isValid = false;
    verify_password.message = t.validation.value_length;
  }

  if(!isGood) setState({ ...state, verify_password })

  return isGood
}
