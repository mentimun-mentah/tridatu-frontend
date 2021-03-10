import _ from "lodash"

export const getSelectedKeys = (arr) => {
  let key = []
  for(let val of arr){
    for(let child of val.children){
      key.push(child.key)
    }
  }

  return [...new Set(key)]
}

export const convertRecord = (record, recentReduxState) => {
  let newRecord = [];
  let recordKeys = _.map(record, o => o.key)
  let newReduxState = JSON.parse(JSON.stringify(recentReduxState));
  for (let val of newReduxState) {
    const data = { ...val, children: []}
    for(let child of val.children){
      if(recordKeys.includes(child.key)){
        data.children.push(child)
      }
    }
    newRecord.push(data)
  }
  newRecord = [...new Set(newRecord)] // remove duplicate
  _.remove(newRecord, (o) => o.children.length < 1) // remove item that not have children

  return newRecord
};

export const newConcat = (record, selectedItem) => {
  let newSelected = JSON.parse(JSON.stringify(selectedItem))

  if(selectedItem.some(r => _.map(record, o => o.key).indexOf(r.key) >= 0)){
    for(let val of newSelected){
      for(let obj of record){
        if(val.key === obj.key){

          for(let cc of val.children){
            for(let cr of obj.children){
              if(cc.key === cr.key){
                val.children = obj.children // use when remove item
                val.children = [...new Set(val.children)]
              }
              else{
                val.children = val.children.concat(obj.children) // use when add new item
                val.children = [...new Set(val.children)]
              }
            }
          }

          val.children = [...new Set(val.children)]
          val.children = val.children
        } 
        else {
          newSelected = record
        }
      }
    }
  }
  else{
    newSelected = newSelected.concat(record)
  }
  newSelected = _.uniqBy(newSelected, 'key')

  return newSelected
}

export const setRecordOnSearch = (record, selectedItem) => {
  let newSelected = JSON.parse(JSON.stringify(selectedItem))

  for(let val of newSelected){
    for(let obj of record){
      if(val.key === obj.key){
        for(let child of val.children){
          if(child.disabled){
            val.children = val.children.concat(obj.children)
            val.children = [...new Set(val.children)]
          }
        }
      }
      else{
        newSelected = newSelected.concat(obj)
      }
    }
  }
  
  return newSelected
}
