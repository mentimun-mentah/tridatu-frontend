export const initQtyGrosir = (t) => t.sales_information.validation.init_qty_grosir
export const nextQtyGrosir = (t) => t.sales_information.validation.next_qty_grosir
export const priceMessage = (t) => t.sales_information.validation.price
export const priceSmallerMessage = (t) => t.sales_information.validation.price_smaller_message
export const price50SmallerMessage = (t) => t.sales_information.validation.price_50_smaller_message
export const priceSmallerBefore = (t) => t.sales_information.validation.price_smaller_before


export const validateFormGrosirPrice = (grosir, setGrosir, price, va1_price, active, t) => {
  let newGrosir = [... grosir]
  const checkPrice = active ? price.value : va1_price.value
  const initialPrice = Math.round(checkPrice/2)
  let isGood = true

  for(let i = 0; i < newGrosir.length; i++){
    if(newGrosir[i].price.value !== "" || typeof newGrosir[i].price.value !== "string"){
      if(newGrosir[i].price.value >= checkPrice){
        isGood = false;
        newGrosir[i]["price"].isValid = false
        newGrosir[i]["price"].message = priceSmallerMessage(t)
      }
      if(newGrosir[i].price.value < initialPrice){
        isGood = false;
        newGrosir[i]["price"].isValid = false
        newGrosir[i]["price"].message = price50SmallerMessage(t)
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
          newGrosir[i + 1]["price"].message = priceSmallerBefore(t)
        }
        if(newGrosir[i].price.value >= newGrosir[i-1].price.value && 
           newGrosir[i].price.value >= newGrosir[i+1].price.value
        ){
          isGood = false;
          newGrosir[i]["price"].isValid = false
          newGrosir[i]["price"].message = priceSmallerBefore(t)
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
          newGrosir[i]["price"].message = priceSmallerMessage(t)
        }
      }
    }
  }

  if(!isGood) {
    setGrosir(newGrosir)
  }

  return isGood
}

export const validateFormGrosirQty = (grosir, setGrosir, t) => {
  let newGrosir = [... grosir]
  let isGood = true

  for(let i = 0; i < newGrosir.length; i++){
    if(i == 0 && newGrosir[i].min_qty.value < 2){
      isGood = false
      newGrosir[i]["min_qty"].isValid = false
      newGrosir[i]["min_qty"].message = initQtyGrosir(t)
    }
    if(i > 0){
      if(newGrosir[i].min_qty.value <= newGrosir[i - 1].min_qty.value){
        isGood = false
        newGrosir[i]["min_qty"].isValid = false
        newGrosir[i]["min_qty"].message = nextQtyGrosir(t)
      }
    }
  }

  if(!isGood) {
    setGrosir(newGrosir)
  }

  return isGood
}
