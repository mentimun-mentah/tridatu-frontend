import { Input, Select, Row, Col } from 'antd'
import ColB from 'react-bootstrap/Col'
import RowB from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

import CardProduct from "components/Card/Product";
import Pagination from "components/Pagination";

import { withAuth } from 'lib/withAuth'

const CardProductMemo = React.memo(CardProduct);

const sortList = ['Terbaru', 'Terlama']

const Favorite = () => {

  const searchComponent = (
    <Form>
      <Form.Row>
        <Form.Group as={ColB} lg={8} md={6}>
          <Input 
            className="account-search h-100"
            placeholder="Cari produk favoritmu" 
            prefix={<i className="far fa-search" />}
          />
        </Form.Group>
        <Form.Group as={ColB} lg={4} md={6}>
          <Select 
            placeholder="Urutkan" 
            style={{ width: "100%"}}
            className="account-search"
          >
            {sortList.map(x => (
              <Select.Option key={x} value={x}>{x}</Select.Option>
            ))}
          </Select>
        </Form.Group>
      </Form.Row>
    </Form>
  )

  return(
    <>
      <Card className="card-container">
        <Card.Header className="bg-transparent border-bottom">
          <h1 className="fs-16 mt-1 mb-0">Favorit</h1>
          <small>
            Kelola item favorit Anda dari sini
          </small>
        </Card.Header>
        <Card.Body>
          {searchComponent}

          <Row gutter={[10, 10]}>
            {[...Array(10)].map((_, i) => (
              <Col key={i} lg={5} md={6} sm={8} xs={12} className="modif-col">
                <CardProductMemo />
              </Col>
            ))}
          </Row>

          <RowB className="mt-4">
            <ColB className="align-self-center text-center">
              <Pagination />
            </ColB>
          </RowB>
        </Card.Body>
      </Card>

      <style jsx>{`
        @media (min-width: 992px){
          :global(.ant-col-lg-5.modif-col){
            display: block;
            flex: 0 0 20%;
            max-width: 20%;
          }
        }
      `}</style>
    </>
  )
}

export default withAuth(Favorite)
