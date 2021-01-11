import { AnimatePresence, motion } from "framer-motion";

/**
 * Component for error message when user has invalid value or result
 * @param {object} item - The key of object item of specific error message
 */
const ErrorTooltip = ({ item }) => {
  return(
    <>
      <AnimatePresence>
        {!item.isValid && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .05 }}
            className="product-edit-form-item-error"
          >
            {item.message}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        :global(.product-edit-form-item-error) {
          position: absolute;
          left: 0;
          top: -27px;
          z-index: 10;
          padding: 2px 10px;
          line-height: 1.5em;
          font-size: 10px;
          color: #fff;
          border-radius: 2px;
          background: #f5222d;
          -webkit-box-shadow: 0 2px 4px 0 #e8e8e8;
          box-shadow: 0 2px 4px 0 #e8e8e8;
          -webkit-transition: opacity .5s ease;
          transition: opacity .5s ease;
          white-space: nowrap;
        }
        :global(.product-edit-form-item-error:after) {
          border-color: #f5222d transparent transparent;
          border-width: 6px 5px;
          content: "";
          width: 0;
          height: 0;
          border-style: solid;
          position: absolute;
          top: 100%;
          left: 10px;
          bottom: 1px;
        }
      `}</style>
    </>
  )
}

export default ErrorTooltip
