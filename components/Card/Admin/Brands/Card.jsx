import { motion } from 'framer-motion'
import { Button, Space, Popconfirm } from 'antd'

import Link from "next/link";
import Image from "next/image";
import Card from 'react-bootstrap/Card'

const CardBrand = ({ data, deleteHandler }) => {
  return(
    <>
      <motion.div 
        className="card text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: ".2" }}
      >
        <Card.Body className="card-body-brand">
          <Image 
            width={270}
            height={270}
            src={`${process.env.NEXT_PUBLIC_API_URL}/static/brands/${data.image_brand}`}
            alt="Tridatu Bali Id"
            className="img-fit"
          />
          <Card.Title className="mt-4 mb-0 fs-14-s fs-16">{data.name_brand}</Card.Title>
        </Card.Body>
        <Card.Body className="pt-0">
          <Space>
            <Link href="brand/[id]" as={`brand/${data.id_brand}`}>
            {/* <Link href="brand/[id]" as={`brand/${888}`}> */}
              <Button size="small">Ubah</Button>
            </Link>
            <Popconfirm 
              title="Hapus brand ini?"
              onConfirm={deleteHandler}
              okText="Ya"
              cancelText="Batal"
              placement="bottom"
              arrowPointAtCenter
            >
              <Button size="small" type="primary" danger>Hapus</Button>
            </Popconfirm>
          </Space>
        </Card.Body>
      </motion.div>
    </>
  )
}

export default CardBrand
