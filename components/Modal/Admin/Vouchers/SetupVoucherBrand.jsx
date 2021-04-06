import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Modal, Empty, Space, Input } from 'antd'

import * as actions from "store/actions";

import { columnsVoucherBrand } from 'data/voucher'

import _ from 'lodash'
import isIn from 'validator/lib/isIn'
import Button from 'antd-button-color'
import ColB from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

const EmptyBrand = () => (
  <div className="w-100">
    <Empty className="my-5" description={<span className="text-secondary">Tidak ada brand</span>} />
  </div>
)

const SetupVoucherBrand = ({ typeVoucher, visible, onClose, selectedBrand, setSelectedBrand }) => {
  // if(!visible) return null
  const dispatch = useDispatch()

  /* GLOBAL STATE */
  const brands = useSelector(state => state.brand.brand)
  /* GLOBAL STATE */

  const [search, setSearch] = useState("")
  const [listSelected, setListSelected] = useState([])
  const [dataSourceBrand, setDataSourceBrand] = useState([])

  useEffect(() => {
    if(visible){
      setListSelected(selectedBrand)
    }
  }, [visible])

  useEffect(() => {
    if(typeVoucher.value === "specific_brand" && visible){
      dispatch(actions.getBrand())
    }
  }, [visible])

  useEffect(() => {
    if(brands && brands.length >= 0){
      let tmp = []
      for(let val of brands){
        if(isIn(val.id.toString(), _.map(selectedBrand, o => o.key))){
          tmp.push({ key: val.id, disabled: true, brand: { ...val }})
        } else {
          tmp.push({ key: val.id, brand: { ...val }})
        }
      }
      setDataSourceBrand(tmp)
    }
  }, [brands])

  useEffect(() => {
    let queryString = {}
    if(search) queryString["q"] = search
    else delete queryString["q"]

    dispatch(actions.getBrand(queryString))
  }, [search])

  const onSelectAllRow = (_, record) => {
    if(record.length) {
      if(listSelected.length){
        const newRecord = (arr) => {
          for(let val of arr){
            record.filter(obj => obj.key !== val.key)
          }
          return record
        }

        const mergeRecord = listSelected.concat(newRecord(listSelected))
        const newMerge = Array.from(new Set(mergeRecord.map(a => a.key))).map(id => mergeRecord.find(a => a.key === id)) // remove duplicate

        let found = []
        for(let i = 0; i < newMerge.length; i++){
          for(let j = 0; j < dataSourceBrand.length; j++){
            if(newMerge[i].key == dataSourceBrand[j].key){
              found.push(newMerge[i].key)
              break;
            }
          }
        }

        let del = []
        for(let j = 0; j < found.length; j++){
          if(!record.map(x => x.key).includes(found[j])){
            del.push(found[j])
          }
        }
        del = [...new Set(del)]

        let fix = []
        for(let i = 0; i < newMerge.length; i++){
          if(!del.includes(newMerge[i].key)){
            fix.push(newMerge[i])
          }
        }
        fix = [...new Set(fix)]

        if(fix.length){
          setListSelected(fix)
        }
        else{
          setListSelected(newMerge)
        }
      } else {
        setListSelected(state => [...state, ...record])
      }
    }
    else {
      let copyListSelected = [...listSelected]
      let newDataSource = [...dataSourceBrand]
      let newData = copyListSelected.filter(ar => !newDataSource.find(rm => (rm.key === ar.key && ar.key === rm.key) ))
      setListSelected(newData)
    }
  }

  const rowSelection = {
    columnWidth: 20,
    onChange: onSelectAllRow,
    selectedRowKeys: _.map(listSelected, obj => obj.key), 
    getCheckboxProps: (record) => ({
      disabled: record.disabled,
      key: record.key
    })
  };

  const onCloseModal = () => {
    setSelectedBrand(listSelected)
    onClose()
  }

  return(
    <>
      <Modal centered width={1000} 
        zIndex={3000} visible={visible}
        title={`Pilih ${typeVoucher.label}`} closable={false}
        maskClosable={false}
        footer={[
          <Space key="action-btn">
            {listSelected.length > 0 && <small key="info"><span className="text-tridatu">{listSelected.length} </span>Item terpilih</small>}
            <Button key="back" onClick={onCloseModal}>Batal</Button>
            <Button 
              key="submit" 
              type="submit" 
              className="btn-tridatu" 
              style={{ width: 80 }} 
              onClick={onCloseModal}
            >
              Simpan
            </Button>
          </Space>
        ]}
      >
        <Form>
          <Form.Row>
            <Form.Group as={ColB} sm={12}>
              <Input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari brand" 
                prefix={<i className="far fa-search" />}
                className="h-35"
              />
            </Form.Group>
          </Form.Row>
        </Form>

        <Table 
          pagination={false} 
          scroll={{ y: 400 }}
          rowSelection={rowSelection}
          columns={columnsVoucherBrand} 
          dataSource={dataSourceBrand}
          rowClassName={record => isIn(record.key.toString(), _.map(selectedBrand, o => o.key)) ? "disabled-row" : "modif-row"}
          locale={{ emptyText: <EmptyBrand /> }}
        />

      </Modal>

      <style jsx>{`
      :global(.disabled-row){
        opacity: .6;
        background-color: white;
        pointer-events: none;
        cursor: not-allowed;
      }
      :global(.ant-table-tbody > tr.disabled-row.ant-table-row-selected > td, 
              .ant-table-tbody > tr.modif-row.ant-table-row-selected > td){
        background-color: white;
        border-bottom: 1px solid #f0f0f0;
      }
      :global(.ant-table-tbody > tr.disabled-row:hover > td, .ant-table-tbody > tr.modif-row:hover > td){
        background-color: #fafafa;
      }
      :global(.idx-3010){
        z-index: 3010;
      }
      `}</style>
    </>
  )
}

export default SetupVoucherBrand
