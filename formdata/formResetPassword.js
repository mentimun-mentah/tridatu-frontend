import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'

export const formReset = {
  email: { value: "", isValid: true, message: "" },
  password: { value: "", isValid: true, message: "" },
  confirm_password: { value: "", isValid: true, message: "" },
}

export const formResetIsValid = (state, setState, t) => {
  const email = { ...state.email }
  const password = { ...state.password }
  const confirm_password = { ...state.confirm_password }
  let isGood = true

  if(!isEmail(email.value)){
    isGood = false;
    email.isValid = false;
    email.message = t.validation.invalid_email;
  }

  if(!isLength(password.value, { min: 6, max: 100 })){
    isGood = false;
    password.isValid = false;
    password.message = t.validation.empty_password;
  }

  if(!isLength(confirm_password.value, { min: 6, max: 100 })){
    isGood = false;
    confirm_password.isValid = false;
    confirm_password.message = t.validation.empty_password;
  }

  if(!isGood) setState({ ...state, email, password, confirm_password })

  return isGood
}
