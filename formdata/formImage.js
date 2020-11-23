export const formImage = {
  file: { value: [], isValid: true, message: null },
};

export const formImageIsValid = (state, setState) => {
  const file = { ...state.file };
  let isGood = true;

  if (file.value.length < 1) {
    isGood = false;
    file.isValid = false;
    file.message = "Image cannot be empty!";
  }
  if (!isGood) setState({ ...state, file });
  return isGood;
};
