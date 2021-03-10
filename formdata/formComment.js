import isLength from 'validator/lib/isLength'

export const formComment = {
  message: { value: "", isValid: true, message: null },
}

export const formCommentIsValid = (state, setState) => {
  const message = { ...state.message }
  let isGood = true

  if(!isLength(message.value, { min: 5 })){
    isGood = false;
    message.isValid = false;
    message.message = "Pastikan value ini memiliki setidaknya 5 karakter";
  }

  if(!isGood) setState({ ...state, message })

  return isGood
}

export const onChangeMessage = (e, state, setState) => {
  const value = e.target.value
  const name = e.target.name

  const data = {
    ...state,
    [name]: {
      ...state[name], 
      value: value, isValid: true, message: null
    }
  }

  return setState(data)
}
