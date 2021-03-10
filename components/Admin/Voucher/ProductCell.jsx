const ProductCellEditable = ({ index, record, editable, onRemove, type, children, ...restProps }) => {
  let childNode = children

  if(editable){
    childNode = (
      type === "action" && <a onClick={onRemove}><i className="fal fa-trash-alt text-center" /></a>
    )
  }
  
  return <td {...restProps} className="p-2">{childNode}</td>
}

export default ProductCellEditable
