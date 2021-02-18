import Button from "antd-button-color"

import { not_active, have_ended } from './statusType'

const EditableCell = ({ record, index, children, action, onGetDiscount, onSetDiscountStatus, onNonActiveDiscount, ...restProps }) => {
  let childNode = children;

  if(action){
    let text = <><i className="far fa-plus mr-1" /> Atur Diskon</>
    let style = ""

    if(record.products.products_discount_status !== not_active) {
      text = <><i className="far fa-edit mr-1" /> Ubah Diskon</>
      style = "dashed"
    }
    if(record.products.products_discount_status === have_ended) {
      text = <><i className="far fa-redo mr-1" /> Reset Diskon</>
      style = "dashed"
    }

    const onClickHandler = () => {
      if(record.products.products_discount_status === have_ended) {
        onNonActiveDiscount(record.products.products_id)
      } else {
        onGetDiscount(record.products.products_id)
        onSetDiscountStatus(record.products.products_discount_status)
      }
    }

    childNode = (
      <>
        <Button 
          type="primary"
          with={style}
          onClick={onClickHandler}
        >
          {text}
        </Button>
      </>
    )
  }

  return <td {...restProps} className="p-2 td-input-variant">{childNode}</td>
}

export default EditableCell
