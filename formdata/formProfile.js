import isEmpty from 'validator/lib/isEmpty'
import isLength from 'validator/lib/isLength'

export const formProfile = {
  username: { value: "", isValid: true, message: "" },
  email: { value: "", isValid: true, message: "" },
  phone: { value: "", isValid: true, message: "" },
  gender: { value: [], isValid: true, message: "" },
}

export const formProfileIsValid = (state, setState, t) => {
  const username = { ...state.username }
  const phone = { ...state.phone} 
  const gender = { ...state.gender} 
  let isGood = true

  if(!isLength(username.value, { min: 3, max: 100 })){
    isGood = false;
    username.isValid = false;
    username.message = t.validation.username;
  }

  if(isEmpty(phone.value ? phone.value : "")){
    isGood = false;
    phone.isValid = false;
    phone.message = t.validation.empty;
  }

  if(isEmpty(gender.value ? gender.value : "")){
    isGood = false;
    gender.isValid = false;
    gender.message = t.validation.empty;
  }

  if(!isGood) setState({ ...state, username, phone, gender })

  return isGood
}
