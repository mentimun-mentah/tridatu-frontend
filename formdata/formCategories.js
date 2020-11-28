import isLength from 'validator/lib/isLength'

export const formCategories = {
  name_category: { value: "", isValid: true, message: "" },
}

export const formSubCategories = {
  category_id: { value: [], isValid: true, message: "" },
  name_sub_category: { value: "", isValid: true, message: "" },
}

export const formItemSubCategories = {
  sub_category_id: { value: [], isValid: true, message: "" },
  name_item_sub_category: { value: "", isValid: true, message: "" },
}



export const formCategoriesIsValid = (state, setState) => {
  const name_category = { ...state.name_category }
  let isGood = true

  if(!isLength(name_category.value, { min: 3, max: 100 })){
    isGood = false;
    name_category.isValid = false;
    name_category.message = "ensure this value has at least 3 - 100 characters";
  }

  if(!isGood) setState({ ...state, name_category })

  return isGood
}

export const formSubCategoriesIsValid = (state, setState) => {
  const category_id = { ...state.category_id }
  const name_sub_category = { ...state.name_sub_category }
  let isGood = true

  if(category_id.value.length < 1){
    isGood = false;
    category_id.isValid = false;
    category_id.message = "Category can't be empty"
  }

  if(!isLength(name_sub_category.value, { min: 3, max: 100 })){
    isGood = false;
    name_sub_category.isValid = false;
    name_sub_category.message = "ensure this value has at least 3 - 100 characters";
  }

  if(!isGood) setState({ ...state, category_id, name_sub_category })

  return isGood
}

export const formItemSubCategoriesIsValid = (state, setState) => {
  const sub_category_id = { ...state.sub_category_id }
  const name_item_sub_category = { ...state.name_item_sub_category }
  let isGood = true

  if(sub_category_id.value.length < 1){
    isGood = false;
    sub_category_id.isValid = false;
    sub_category_id.message = "Sub Category can't be empty"
  }

  if(!isLength(name_item_sub_category.value, { min: 3, max: 100 })){
    isGood = false;
    name_item_sub_category.isValid = false;
    name_item_sub_category.message = "ensure this value has at least 3 - 100 characters";
  }

  if(!isGood) setState({ ...state, sub_category_id, name_item_sub_category })

  return isGood
}
