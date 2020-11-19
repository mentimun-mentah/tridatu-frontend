import isLength from 'validator/lib/isLength'
import isMobilePhone from 'validator/lib/isMobilePhone'

export const formAddress = {
  label: { value: "Rumah", isValid: true, message: false },
  receiver: { value: "", isValid: true, message: false },
  phone: { value: "", isValid: true, message: false },
  region: { value: [], isValid: true, message: false },
  postal_code: { value: [], isValid: true, message: false },
  recipient_address: { value: "", isValid: true, message: false },
};

export const formAddressIsValid = (state, setState) => {
  const label = { ...state.label }
  const receiver = { ...state.receiver }
  const phone = { ...state.phone }
  const region = { ...state.region }
  const postal_code = { ...state.postal_code }
  const recipient_address = { ...state.recipient_address }
  let isGood = true

  if(!isLength(label.value, { min: 1, max: 100 })){
    isGood = false;
    label.isValid = false;
    label.message = "ensure this value has at least 1 - 100 characters";
  }

  if(!isLength(receiver.value, { min: 1, max: 100 })){
    isGood = false;
    receiver.isValid = false;
    receiver.message = "ensure this value has at least 1 - 100 characters";
  }

  if(!isMobilePhone("+62"+phone.value, ['id-ID'])){
    isGood = false;
    phone.isValid = false;
    phone.message = "Please provide a valid mobile phone number";
  }

  if(region.value == null || !isLength(region.value.length > 0 ? region.value : "", { min: 1, max: undefined })){
    isGood = false;
    region.isValid = false;
    region.message = "ensure this value has at least 1 characters";
  }

  if(postal_code.value == null || postal_code.value.length < 1){
    isGood = false;
    postal_code.isValid = false;
    postal_code.message = "postal code can't be empty";
  }

  if(!isLength(recipient_address.value, { min: 1, max: undefined })){
    isGood = false;
    recipient_address.isValid = false;
    recipient_address.message = "ensure this value has at least 1 characters";
  }

  if(!isGood) setState({ ...state, label, receiver, phone, region, postal_code, recipient_address })

  return isGood
}
