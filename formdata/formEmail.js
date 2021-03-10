import isEmail from 'validator/lib/isEmail'

export const formEmail = {
  email: { value: "", isValid: true, message: "" },
}

export const formEmailIsValid = (state, setState, t) => {
  const email = { ...state.email }
  let isGood = true

  if(!isEmail(email.value)){
    isGood = false;
    email.isValid = false;
    email.message = t.validation.invalid_email;
  }

  if(!isGood) setState({ ...state, email })

  return isGood
}
