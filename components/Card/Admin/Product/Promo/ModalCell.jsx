import { Switch, InputNumber, Form } from 'antd'
import ErrorMessage from "components/ErrorMessage";

const EditableCell = ({ record, index, children, type, editable, onChange, onBlur, ...restProps }) => {
  let childNode = children;

  if(editable){
    childNode = (
      <Form>
        {type === "price" && (
          <Form.Item 
            name="price" 
            className={`h-30 input-form-variant ${record.product[type].isValid && " mb-0"}`}
          >
            <div>
              <div className="ant-input-group-wrapper">
                <div className="ant-input-wrapper ant-input-group input-group-variant" style={{ zIndex: 1 }}>
                  <span className={`ant-input-group-addon noselect fs-12 bg-transparent`}>Rp</span>
                  <InputNumber
                    min={record.product["normal_price"] - (record.product["normal_price"] * (95/100))}
                    max={record.product["normal_price"]}
                    placeholder="Harga Diskon"
                    className="w-100 bor-left-rad-0 h-33-custom-input fs-12 input-number-variant"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={value => value.replace(/\Rp\s?|(\.*)/g, '')}
                    onBlur={onBlur}
                    onChange={onChange}
                    value={record.product[type].value || 0}
                  />
                </div>
              </div>
              <ErrorMessage item={record.product[type]} />
            </div>
          </Form.Item>
        )}
        {type === "discount" && (
          <Form.Item 
            name="discount" 
            className={`h-30 input-form-variant ${record.product[type].isValid && " mb-0"}`}
          >
            <div>
              <div className="ant-input-group-wrapper">
                <div className="ant-input-wrapper ant-input-group input-group-variant" style={{ zIndex: 1 }}>
                  <InputNumber
                    min={record.product["discount_active"].value ? 1 : 0}
                    max={95}
                    placeholder="Diskon"
                    className="w-100 h-33-custom-input fs-12 input-number-variant bor-right-rad-0"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={value => value.replace(/\Rp\s?|(\.*)/g, '')}
                    onBlur={onBlur}
                    onChange={onChange}
                    value={record.product[type].value || 0}
                  />
                  <span className={`ant-input-group-addon noselect fs-12 bg-transparent`}>%</span>
                </div>
              </div>
              <ErrorMessage item={record.product[type]} />
            </div>
          </Form.Item>
        )}
        {type === "discount_active" && (
          <Form.Item 
            name="discount" 
            className={`h-30 input-form-variant ${record.product[type].isValid && " mb-0"}`}
          >
            <div>
              <Switch 
                onBlur={onBlur}
                onChange={onChange}
                checked={record.product[type].value}
              />
              <ErrorMessage item={record.product[type]} />
            </div>
          </Form.Item>
        )}
      </Form>
    )
  }

  return <td {...restProps} className="td-input-variant">{childNode}</td>
}

export default EditableCell
