import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Input, Modal, Empty, Space } from 'antd'

import * as actions from "store/actions";

import { columnsVoucherSubCategory } from 'data/voucher'

import _ from 'lodash'
import isIn from 'validator/lib/isIn'
import ColB from 'react-bootstrap/Col'
import Button from 'antd-button-color'
import Form from 'react-bootstrap/Form'

const EmptyCategory = ({t}) => (
  <div className="w-100">
    <Empty className="my-5" description={<span className="text-secondary">{t.basic_details.no_sub_category}</span>} />
  </div>
)

const SetupVoucherSubCategory = ({ t, typeVoucher, visible, onClose, selectedSubCategory, setSelectedSubCategory }) => {
  // if(!visible) return null
  const dispatch = useDispatch()

  /* GLOBAL STATE */
  const categories = useSelector(state => state.categories.categories)
  /* GLOBAL STATE */

  const [search, setSearch] = useState("")
  const [listSelected, setListSelected] = useState([])
  const [dataSourceSubCategory, setDataSourceSubCategory] = useState([])

  useEffect(() => {
    if(visible){
      setListSelected(selectedSubCategory)
    }
  }, [visible])

  useEffect(() => {
    if(typeVoucher.value === "sub_category" && visible){
      dispatch(actions.getCategories(true))
    }
    return () => dispatch(actions.getCategoriesSuccess([]))
  }, [visible])

  useEffect(() => {
    if(categories && categories.length >= 0 && visible){
      let tmp = []
      for(let val of categories){
        if(val.sub_categories_id && isIn(val.sub_categories_id.toString(), _.map(selectedSubCategory, o => o.key))){
          tmp.push({ key: val.sub_categories_id, disabled: true, category: { ...val }})
        } else {
          tmp.push({ key: val.sub_categories_id, category: { ...val }})
        }
      }
      setDataSourceSubCategory(tmp)
    }
  }, [categories])

  useEffect(() => {
    dispatch(actions.getCategories(true, search))
  },[search])

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
          for(let j = 0; j < dataSourceSubCategory.length; j++){
            if(newMerge[i].key == dataSourceSubCategory[j].key){
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
      let newDataSource = [...dataSourceSubCategory]
      let newData = copyListSelected.filter(ar => !newDataSource.find(rm => (rm.key === ar.key && ar.key === rm.key) ))
      setListSelected(newData)
    }
  }

  const rowSelection = {
    onChange: onSelectAllRow,
    selectedRowKeys: _.map(listSelected, obj => obj.key), 
    getCheckboxProps: (record) => ({
      disabled: record.disabled,
      key: record.key
    })
  };

  const onCloseModal = () => {
    setSelectedSubCategory(listSelected)
    setSearch("")
    onClose()
  }

  return(
    <>
      <Modal centered width={1000} 
        zIndex={3000} visible={visible}
        title={`${t.basic_details.select} ${typeVoucher.label}`} closable={false}
        maskClosable={false}
        footer={[
          <Space key="action-btn">
            {listSelected.length > 0 && 
              <small key="info"><span className="text-tridatu">{listSelected.length} </span>{t.basic_details.item_selected}</small>
            }
            <Button key="back" onClick={onCloseModal}>{t.cancel}</Button>
            <Button 
              key="submit" 
              type="submit" 
              className="btn-tridatu" 
              style={{ width: 80 }} 
              onClick={onCloseModal}
            >
              {t.save}
            </Button>
          </Space>
        ]}
      >
        <Form>
          <Form.Row>
            <Form.Group as={ColB} lg={12}>
              <Input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="account-search h-100"
                placeholder={t.basic_details.search_sub_category}
                prefix={<i className="far fa-search" />}
              />
            </Form.Group>
          </Form.Row>
        </Form>

        <Table 
          pagination={false} 
          scroll={{ y: 400 }}
          rowSelection={rowSelection}
          columns={columnsVoucherSubCategory(t)} 
          dataSource={dataSourceSubCategory}
          rowClassName={record => isIn(record.key.toString(), _.map(selectedSubCategory, o => o.key)) ? "disabled-row" : "modif-row"}
          locale={{ emptyText: <EmptyCategory t={t} /> }}
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

export default SetupVoucherSubCategory
