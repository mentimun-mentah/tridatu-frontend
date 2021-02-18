import { motion } from 'framer-motion'
import Link from "next/link";
import Image from "next/image";
import Card from "react-bootstrap/Card";

const CardBrand = ({ name, image }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: ".2" }}
      >
        <Card className="border-0 shadow text-center p-t-20">
          <Link href="/products" as="/products">
            <a className="text-decoration-none text-dark text-center mx-auto brand-image">
              <Image
                className="mx-auto d-block"
                src={image}
                width={64}
                height={64}
                alt="Tridatu Bali ID"
              />
              <Card.Body>
                <span className="font-weight-bold">{name}</span>
              </Card.Body>
            </a>
          </Link>
        </Card>
      </motion.div>

      <style jsx>{`
      :global(.brand-image > div){
        margin-left: auto!important;
        margin-right: auto!important;
        margin-bottom: 4px;
      }
      `}</style>
    </>
  );
};

export default CardBrand;
