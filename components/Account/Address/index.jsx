import { Button, Popconfirm, Divider, Radio, Tooltip } from 'antd'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
import Media from 'react-bootstrap/Media'

const AddressList = ({ t, data, showEditHandler, deleteHandler, changeMainAddress }) => {
  let phone = "";
  if(data.phone){
    phone = data.phone.split(" ").join("")
    phone = phone.split("-").join("")
  }

  return(
    <React.Fragment key={data.id}>
      <Row className="address-card">
        <Col lg={3}>
          <Media>
            <Tooltip title={<small>{t.default_address}</small>}>
              <Radio value={data.main_address} text={data.id} className="d-none d-lg-block" />
            </Tooltip>
            <Media.Body className="w-100">
              <div className="text-left">
                <h4 className="fs-16 text-secondary mb-sm-0">{t.receiver}</h4>
                <p className="fs-14 mb-0 fw-500">{data.receiver}</p>
                <p className="fs-14 mb-lg-0">{phone}</p>
              </div>
            </Media.Body>
          </Media>
        </Col>
        <Col lg={3}>
          <div className="text-left">
            <h4 className="fs-16 text-secondary mb-sm-0">{t.recipment_address}</h4>
            <p className="fs-14 mb-0 fw-500">
              {data.label} {data.main_address && <Badge variant="primary">{t.main_address}</Badge>}
            </p>
            <p className="fs-14 mb-lg-0">{data.recipient_address}</p>
          </div>
        </Col>
        <Col lg={4}>
          <div className="text-left">
            <h4 className="fs-16 text-secondary mb-sm-0">{t.receiving_area}</h4>
            <p className="fs-14 mb-lg-0">{data.region}, {data.postal_code}</p>
          </div>
        </Col>
        <Col lg={2}>
          <div className="text-center">
            <Popconfirm
              title={t.default_address}
              onConfirm={changeMainAddress}
              okText={t.yes}
              cancelText={t.cancel}
              placement="bottom"
              arrowPointAtCenter
              disabled={data.main_address}
            >
              <Button 
                disabled={data.main_address}
                className="d-lg-none"
                icon={<i className="fad fa-home" />} 
              />
            </Popconfirm>
            <Button 
              className="mx-2"
              onClick={showEditHandler}
              icon={<i className="far fa-pen" />} 
            />
            <Popconfirm
              title={`${t.delete_address}?`}
              onConfirm={deleteHandler}
              okText={t.yes}
              cancelText={t.cancel}
              placement="bottom"
              arrowPointAtCenter
            >
              <Button 
                icon={<i className="far fa-trash-alt" />} 
              />
            </Popconfirm>
          </div>
        </Col>
      </Row>
      <Divider className="d-last-none" />
    </React.Fragment>
  )
}

export default AddressList
