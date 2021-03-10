import isLength from 'validator/lib/isLength'

export const formCategories = {
  name: { value: "", isValid: true, message: "" },
}

export const formSubCategories = {
  category_id: { value: [], isValid: true, message: "" },
  name: { value: "", isValid: true, message: "" },
}

export const formItemSubCategories = {
  sub_category_id: { value: [], isValid: true, message: "" },
  name: { value: "", isValid: true, message: "" },
}

export const formCategoriesIsValid = (state, setState, t) => {
  const name = { ...state.name }
  let isGood = true

  if(!isLength(name.value, { min: 3, max: 100 })){
    isGood = false;
    name.isValid = false;
    name.message = t.validation.category_length;
  }

  if(!isGood) setState({ ...state, name })

  return isGood
}

export const formSubCategoriesIsValid = (state, setState, t) => {
  const category_id = { ...state.category_id }
  const name = { ...state.name }
  let isGood = true

  if(category_id.value.length < 1){
    isGood = false;
    category_id.isValid = false;
    category_id.message = t.validation.empty;
  }

  if(!isLength(name.value, { min: 3, max: 100 })){
    isGood = false;
    name.isValid = false;
    name.message = t.validation.category_length;
  }

  if(!isGood) setState({ ...state, category_id, name })

  return isGood
}

export const formItemSubCategoriesIsValid = (state, setState, t) => {
  const sub_category_id = { ...state.sub_category_id }
  const name = { ...state.name }
  let isGood = true

  if(sub_category_id.value.length < 1){
    isGood = false;
    sub_category_id.isValid = false;
    sub_category_id.message = t.validation.empty
  }

  if(!isLength(name.value, { min: 3, max: 100 })){
    isGood = false;
    name.isValid = false;
    name.message = t.validation.category_length;
  }

  if(!isGood) setState({ ...state, sub_category_id, name })

  return isGood
}
