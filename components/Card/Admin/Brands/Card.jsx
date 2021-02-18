import { motion } from 'framer-motion'
import { Button, Space, Popconfirm, Card as CardAnt } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import Link from "next/link";
import Image from "next/image";
import Card from 'react-bootstrap/Card'

const CardBrand = ({ data, deleteHandler }) => {
  return(
    <>
      <motion.div 
        className="card text-center border-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: ".2" }}
      >
        <CardAnt
          actions={[
            <Link href="brand/[id]" as={`brand/${data.id}`}>
              <a className="text-decoration-none">
                <EditOutlined key="edit" />
              </a>
            </Link>,
            <Popconfirm 
              title="Hapus brand ini?"
              onConfirm={deleteHandler}
              okText="Ya"
              cancelText="Batal"
              placement="bottom"
              arrowPointAtCenter
            >
              <DeleteOutlined key="delete" />
            </Popconfirm>
          ]}
        >
          <Image 
            width={270}
            height={270}
            src={`${process.env.NEXT_PUBLIC_API_URL}/static/brands/${data.image}`}
            alt="Tridatu Bali Id"
            className="img-fit"
          />
          <Card.Title className="mt-4 mb-0 fs-14-s fs-16">{data.name}</Card.Title>
        </CardAnt>
      </motion.div>
    </>
  )
}

export default CardBrand
