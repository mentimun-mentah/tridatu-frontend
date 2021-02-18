import { motion } from "framer-motion"
import { Input } from "antd";

const Fade = {
  initial: { opacity: 0, },
  in: { opacity: 1, },
  out: { opacity: 0, },
};

const Notes = ({ show, onShow, onClose }) => {
  return show ? (
    <motion.div initial="initial" animate="in" exit="out" variants={Fade}>
      <div className="d-flex align-items-center mt-3">
        <Input /> <h6 className="ml-2 mb-0 fs-14 text-tridatu hover-pointer" onClick={onClose}>Batal</h6>
      </div>
      <small className="text-secondary fs-12 mb-0">Contoh: Warna Putih, Size M</small>
    </motion.div>
  ) : (
    <motion.h6 initial="initial" animate="in" exit="out" variants={Fade}
      className="fs-14 mb-0 text-tridatu hover-pointer" onClick={onShow}
    >
      Tulis catatan untuk penjual
    </motion.h6>
  )
}

export default Notes
