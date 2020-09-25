import ListGroup from 'react-bootstrap/ListGroup'
import { EmailShareButton, FacebookShareButton } from "react-share";
import { TelegramShareButton, TwitterShareButton, WhatsappShareButton, } from "react-share";
import { EmailIcon, FacebookIcon, TelegramIcon, TwitterIcon, WhatsappIcon, } from "react-share";

const ShareModal = ({ link }) => {
  return(
    <>
      <ListGroup variant="flush">
        <EmailShareButton url={link} className="w-100 text-left share-button">
          <ListGroup.Item className="share-button border-0">
            <EmailIcon size={32} /> <span className="ml-2 fs-14">Share on Email</span>
          </ListGroup.Item>
        </EmailShareButton>
        <FacebookShareButton url={link} className="w-100 text-left share-button">
          <ListGroup.Item className="share-button border-0">
            <FacebookIcon size={32} /> <span className="ml-2 fs-14">Share on Facebook</span>
          </ListGroup.Item>
        </FacebookShareButton>
        <TwitterShareButton url={link} className="w-100 text-left share-button">
          <ListGroup.Item className="share-button border-0">
            <TwitterIcon size={32} /> <span className="ml-2 fs-14">Share on Twitter</span>
          </ListGroup.Item>
        </TwitterShareButton>
        <WhatsappShareButton url={link} className="w-100 text-left share-button">
          <ListGroup.Item className="share-button border-0">
            <WhatsappIcon size={32} /> <span className="ml-2 fs-14">Share on Whatsapp</span>
          </ListGroup.Item>
        </WhatsappShareButton>
        <TelegramShareButton url={link} className="w-100 text-left share-button">
          <ListGroup.Item className="share-button border-0">
            <TelegramIcon size={32} /> <span className="ml-2 fs-14">Share on Telegram</span>
          </ListGroup.Item>
        </TelegramShareButton>
      </ListGroup>
      <style jsx>{`
        :global(.share-button:hover){
          background-color: #fafafa;
        }
        :global(.share-button:focus){
          background-color: #efefef;
        }
      `}</style>
    </>
  )
}

export default ShareModal
