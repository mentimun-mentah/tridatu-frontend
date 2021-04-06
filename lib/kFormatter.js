const kFormatter = (num, f = 'k') => {
  return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + f : Math.sign(num)*Math.abs(num)
}

export default kFormatter
