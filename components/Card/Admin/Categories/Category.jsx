import { Skeleton, Card, Popconfirm } from 'antd'
import { motion } from 'framer-motion'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

const CardCategory = ({ data, showEditHandler, deleteHandler, loading }) => {
  return(
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: ".2" }}
      >
        <Card
          bodyStyle={{ padding: "1rem" }}
          className="card-category"
          actions={[
            <EditOutlined key="edit" onClick={showEditHandler} />,
            <Popconfirm
              title="Hapus kategori ini?"
              onConfirm={deleteHandler}
              okText="Ya"
              cancelText="Batal"
              placement="bottom"
              arrowPointAtCenter
            >
              <DeleteOutlined key="delete" />
            </Popconfirm>,
          ]}
        >
          <Skeleton 
            active
            title={false} 
            loading={loading} 
            paragraph={{ rows: 1, width: "100%" }} 
            className="skeleton-category"
          >
            <div className="mb-0 fs-14-s fs-16 card-title h5">{data.name_category}</div>
          </Skeleton>
        </Card>
      </motion.div>

      <style jsx>{`
        :global(.card-category .ant-card-actions > li){
          margin: 6px 0;
        }
        :global(.skeleton-category .ant-skeleton-paragraph){
          margin-bottom: 0;
        }
      `}</style>
    </>
  )
}

export default CardCategory
