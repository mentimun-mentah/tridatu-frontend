import { motion } from 'framer-motion'
import { Button, Popconfirm } from 'antd'
import Card from 'react-bootstrap/Card'
import Image from "next/image";

const CardOutlet = ({ data, deleteHandler }) => {
  return(
    <>
      <motion.div 
        className="card shadow-sm border-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: ".2" }}
      >
        <Image 
          width={200}
          height={200}
          src={`${process.env.NEXT_PUBLIC_API_URL}/static/outlets/${data.image}`}
          alt="Tridatu Bali"
          className="img-fit card-img-top"
        />
        <Card.Body className="p-3 text-center">
          <Popconfirm 
            title="Hapus outlet ini?"
            onConfirm={deleteHandler}
            okText="Ya"
            cancelText="Batal"
            placement="bottom"
            arrowPointAtCenter
          >
            <Button danger type="primary" size="small">Hapus</Button>
          </Popconfirm>
        </Card.Body>
      </motion.div>
    </>
  )
}

export default CardOutlet
