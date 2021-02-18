import { motion } from 'framer-motion'
import Link from "next/link";
import Image from "next/image";
import Card from "react-bootstrap/Card";

const CardBanner = ({ image }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: ".2" }}
      >
        <Card className="border-0">
          <Link href="/promo" as="/promo">
            <a className="text-decoration-none text-dark">
              <Image
                width={620}
                height={350}
                className="mx-auto d-block img-fit w-100 rounded"
                src={image}
                alt="Tridatu Bali ID"
              />
            </a>
          </Link>
        </Card>
      </motion.div>
    </>
  );
};

export default CardBanner;
