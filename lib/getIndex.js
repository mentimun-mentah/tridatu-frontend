/*
 * Function to get index of value inside array
 * @param {string} value - The value that want to find the index
 * @param {array} arr - The list of data that want to find the index
 * @param {string} prop - The property object of array
 */

const getIndex = (value, arr, prop) => {
  for(var i = 0; i < arr.length; i++) {
    if(arr[i][prop] === value) {
      return i;
    }
  }
  return -1; //to handle the case where the value doesn't exist
}

export default getIndex
