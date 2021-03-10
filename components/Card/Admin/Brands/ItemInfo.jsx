import Image from 'next/image'
import Media from 'react-bootstrap/Media'

const ItemInfoPromo = ({ image, name }) => {
  return(
    <>
      <Media className="align-self-center product-list-admin noselect">
        <div className="mr-2 mb-n1">
          <Image 
            width={50} 
            height={50} 
            src={`${process.env.NEXT_PUBLIC_API_URL}/static/brands/${image}`}
            className="align-self-center bor-rad-2rem" 
          />
        </div>
        <Media.Body className="align-self-center text-truncate">
          <p className="mb-0 align-self-center text-truncate">{name}</p>
        </Media.Body>
      </Media>
    </>
  )
}

export default ItemInfoPromo
