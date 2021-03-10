import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Input, Modal, Empty, Space } from 'antd'

import * as actions from "store/actions";

import { columnsVoucherItemSubCategory } from 'data/voucher'

import _ from 'lodash'
import isIn from 'validator/lib/isIn'
import ColB from 'react-bootstrap/Col'
import Button from 'antd-button-color'
import Form from 'react-bootstrap/Form'

import { getSelectedKeys, convertRecord, newConcat, setRecordOnSearch } from 'lib/voucher'

const EmptyCategory = () => (
  <div className="w-100">
    <Empty className="my-5" description={<span className="text-secondary">Tidak ada item sub kategori</span>} />
  </div>
)

const SetupVoucherItemSubCategory = ({ typeVoucher, visible, onClose, selectedItemSubCategory, setSelectedItemSubCategory }) => {
  const dispatch = useDispatch()

  /* GLOBAL STATE */
  const allCategories = useSelector(state => state.categories.allCategories)
  /* GLOBAL STATE */

  const [search, setSearch] = useState("")
  const [listSelected, setListSelected] = useState([])
  const [selectedBeforeSearch, setSelectedBeforeSearch] = useState([])
  const [dataSourceItemSubCategory, setDataSourceItemSubCategory] = useState([])

  useEffect(() => {
    if(visible){
      setListSelected(selectedItemSubCategory)
    }
  }, [visible])

  useEffect(() => {
    if(typeVoucher.value === "item_sub_category" && visible){
      dispatch(actions.getAllCategories())
    }
    return () => dispatch(actions.getAllCategories([]))
  }, [visible])

  useEffect(() => {
    if(allCategories && allCategories.length >= 0){
      let tmp = []
      for(let cat of allCategories){
        for(let sub of cat.sub_categories){
          const child = sub.item_sub_categories.map(x => {
            x["name"] = x.item_sub_categories_name + " " + x.item_sub_categories_id;
            delete x.item_sub_categories_name;
            return { 
              key: x.item_sub_categories_id, 
              category: x, 
              disabled: search.length ? isIn(x.item_sub_categories_id.toString(), getSelectedKeys(selectedBeforeSearch)) : isIn(x.item_sub_categories_id.toString(), getSelectedKeys(selectedItemSubCategory))
            }
          })
          const data = {
            key: cat.categories_id.toString()+"~"+sub.sub_categories_id.toString(),
            category: { 
              name: cat.categories_name+ " / " +sub.sub_categories_name,
            },
          }
          if(child.length){
            data["children"] = child
            tmp.push(data)
          }
        }
      }
      setDataSourceItemSubCategory(tmp)
    }
  }, [allCategories])

  useEffect(() => {
    dispatch(actions.getAllCategories(search))
    if(search.length > 0){
      const copyListSelected = JSON.parse(JSON.stringify(listSelected))
      for(let val of copyListSelected){
        for(let child of val.children){
          child["disabled"] = true
        }
      }
      setSelectedBeforeSearch(copyListSelected)
    }
    else{
      setSelectedBeforeSearch([])
    }
  },[search])

  const onSelectAllRow = async (_, record) => {
    const copyListSelected = JSON.parse(JSON.stringify(listSelected))
    const newDataSource = JSON.parse(JSON.stringify(dataSourceItemSubCategory))

    if(record.length){
      if(listSelected.length){
        const newRecord = await convertRecord(record, newDataSource)
        const newListSelected = [...new Set(copyListSelected)]

        if(search.length > 0){
          setListSelected(setRecordOnSearch(newRecord, selectedBeforeSearch))
        }
        else{
          setListSelected(newConcat(newRecord, newListSelected))
        }
      }
      else{
        const newRecord = await convertRecord(record, newDataSource)
        setListSelected(newRecord)
      }
    }
    else{
      const newData = (arr, item_arr) => {
        let new_arr = JSON.parse(JSON.stringify(arr))
        let new_item_arr = JSON.parse(JSON.stringify(item_arr))
        for(let cat of new_arr){
          cat.children = cat.children.filter((x) => !getSelectedKeys(new_item_arr).includes(x.key))
        }
        return new_arr.filter(x => x.children.length > 0)
      }

      setListSelected(newData(copyListSelected, newDataSource))
    }
  }

  const rowSelection = {
    checkStrictly: false,
    onChange: onSelectAllRow,
    selectedRowKeys: getSelectedKeys(listSelected),
    getCheckboxProps: (record) => ({
      disabled: record.disabled,
      key: record.key
    }),
  };

  const onCloseModal = () => {
    const copyListSelected = JSON.parse(JSON.stringify(listSelected))
    let uniqListSelected = _.uniqBy(copyListSelected, 'key')
    for(let val of uniqListSelected){
      val.children = _.uniqBy(val.children, 'key')
    }
    setSelectedItemSubCategory(uniqListSelected)
    setSearch("")
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
            {getSelectedKeys(listSelected).length > 0 && (
              <small key="info"><span className="text-tridatu">{getSelectedKeys(listSelected).length} </span>Item terpilih</small>
            )}
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
            <Form.Group as={ColB} lg={12}>
              <Input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="account-search h-100"
                placeholder="Cari kategori"
                prefix={<i className="far fa-search" />}
              />
            </Form.Group>
          </Form.Row>
        </Form>

        <Table 
          pagination={false} 
          scroll={{ y: 400 }}
          rowSelection={rowSelection}
          expandable={{ defaultExpandAllRows: true }}
          columns={columnsVoucherItemSubCategory} 
          dataSource={dataSourceItemSubCategory}
          rowClassName={record => isIn(record.key.toString(), _.map(getSelectedKeys(selectedItemSubCategory), o => o)) ? "disabled-row" : "modif-row"}
          locale={{ emptyText: <EmptyCategory /> }}
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

export default SetupVoucherItemSubCategory
