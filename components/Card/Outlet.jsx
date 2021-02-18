import { motion } from 'framer-motion'
import Image from 'next/image'

const OutletImage = ({ image, size }) => {
  return(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: ".2" }}
      >
        <Image 
          width={size} 
          height={size} 
          src={image} 
          className="info-store-img" 
          alt="Tridatu Bali ID" 
        />
      </motion.div>
    </>
  )
}

export default OutletImage
