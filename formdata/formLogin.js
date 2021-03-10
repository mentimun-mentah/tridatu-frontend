import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'

export const formLogin = {
  email: { value: "", isValid: true, message: "" },
  password: { value: "", isValid: true, message: "" },
}

export const formLoginIsValid = (state, setState, t) => {
  const email = { ...state.email }
  const password = { ...state.password }
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

  if(!isGood) setState({ ...state, email, password })

  return isGood
}
