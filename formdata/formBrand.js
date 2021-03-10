import isLength from 'validator/lib/isLength'

export const formBrand = {
  name: { value: "", isValid: true, message: "" },
}

export const formBrandIsValid = (state, setState, t) => {
  const name = { ...state.name}
  let isGood = true

  if(!isLength(name.value, { min: 2, max: 100 })){
    isGood = false;
    name.isValid = false;
    name.message = t.validation.value_length;
  }

  if(!isGood) setState({ ...state, name })

  return isGood
}
