export const priceMessage = "Harga harus lebih dari 1."
export const priceSmallerMessage = "Harga satuan harus lebih rendah dari harga utama"
export const price50SmallerMessage = "Harga satuan tidak boleh 50% lebih rendah dari harga utama"
export const priceSmallerBefore = "Harga satuan harus lebih rendah dari harga yang sebelumnya"

export const validateFormGrosirPrice = (grosir, setGrosir, price, va1_price, active) => {
  let newGrosir = [... grosir]
  const checkPrice = active ? price.value : va1_price.value
  const initialPrice = Math.round(checkPrice/2)
  let isGood = true

  for(let i = 0; i < newGrosir.length; i++){
    if(newGrosir[i].price.value !== "" || typeof newGrosir[i].price.value !== "string"){
      if(newGrosir[i].price.value >= checkPrice){
        isGood = false;
        newGrosir[i]["price"].isValid = false
        newGrosir[i]["price"].message = priceSmallerMessage
      }
      if(newGrosir[i].price.value < initialPrice){
        isGood = false;
        newGrosir[i]["price"].isValid = false
        newGrosir[i]["price"].message = price50SmallerMessage
      }
      if(newGrosir[i].price.value >= initialPrice && newGrosir[i].price.value < checkPrice){
        isGood = true;
        newGrosir[i]["price"].isValid = true
        newGrosir[i]["price"].message = null
        setGrosir(newGrosir)
      }
      if(i > 0 && newGrosir[i+1]){
        if(newGrosir[i].price.value < newGrosir[i-1].price.value && 
           newGrosir[i].price.value > newGrosir[i+1].price.value && 
           newGrosir[i].price.value > initialPrice && 
           (newGrosir[i].price.value >= initialPrice && newGrosir[i].price.value < checkPrice)
        ){
          isGood = true;
          newGrosir[i]["price"].isValid = true
          newGrosir[i]["price"].message = null
        }
        if(newGrosir[i].price.value < newGrosir[i-1].price.value && 
           newGrosir[i].price.value <= newGrosir[i+1].price.value
        ){
          isGood = false;
          newGrosir[i + 1]["price"].isValid = false
          newGrosir[i + 1]["price"].message = priceSmallerBefore
        }
        if(newGrosir[i].price.value >= newGrosir[i-1].price.value && 
           newGrosir[i].price.value >= newGrosir[i+1].price.value
        ){
          isGood = false;
          newGrosir[i]["price"].isValid = false
          newGrosir[i]["price"].message = priceSmallerBefore
        }
      } else {
        if(i > 0 && 
          newGrosir[i].price.value < newGrosir[i-1].price.value && 
          (newGrosir[i].price.value >= initialPrice && newGrosir[i].price.value < checkPrice)
        ){
          isGood = true;
          newGrosir[i]["price"].isValid = true
          newGrosir[i]["price"].message = null
        }
        if(i == 0 && newGrosir[i].price.value >= initialPrice && 
           checkPrice > newGrosir[i].price.value
        ){
          isGood = true;
          newGrosir[i]["price"].isValid = true
          newGrosir[i]["price"].message = null
        }
        if(i == 0 && newGrosir[i].price.value >= checkPrice){
          isGood = false;
          newGrosir[i]["price"].isValid = false
          newGrosir[i]["price"].message = priceSmallerMessage
        }
      }
    }
  }

  if(!isGood) {
    setGrosir(newGrosir)
  }

  return isGood
}

export const validateFormGrosirQty = (grosir, setGrosir) => {
  let newGrosir = [... grosir]
  let isGood = true

  for(let i = 0; i < newGrosir.length; i++){
    if(i == 0 && newGrosir[i].min_qty.value < 2){
      isGood = false
      newGrosir[i]["min_qty"].isValid = false
      newGrosir[i]["min_qty"].message = "Min Qty untuk grosir harus lebih dari 1"
    }
    if(i > 0){
      if(newGrosir[i].min_qty.value <= newGrosir[i - 1].min_qty.value){
        isGood = false
        newGrosir[i]["min_qty"].isValid = false
        newGrosir[i]["min_qty"].message = "Min Qty harus lebih besar dari sebelumnya"
      }
    }
  }

  if(!isGood) {
    setGrosir(newGrosir)
  }

  return isGood
}
