import { useState } from 'react'
import { useRouter } from "next/router";
import { useDispatch } from 'react-redux'
import { Comment, Avatar, Popconfirm, Form, Input, Button, Tag } from 'antd';
import { formComment, formCommentIsValid, onChangeMessage } from 'formdata/formComment'
import { LoadingOutlined } from "@ant-design/icons";

import moment from 'moment';
import * as actions from "store/actions";
import ErrorMessage from "components/ErrorMessage";
import axios, { jsonHeaderHandler, signature_exp } from 'lib/axios'

const CommentContainer = ({ 
  children, head, body, content, avatar_url, username, created_at, reply_id, comment_id, commentable_id, commentable_type, role, 
  can_delete, onSubmitReplies
}) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { locale } = router

  const [sendRepliesLoading, setSendRepliesLoading] = useState(false)
  const [commentMessage, setCommentMessage] = useState(formComment)

  moment.locale(locale)

  const deleteCommentOrReply = (head) => {
    let id = reply_id
    let url = `/replies/delete/${id}`
    if(head){
      id = comment_id
      url = `/comments/delete/${id}`
    }
    axios.delete(url, jsonHeaderHandler())
      .then(res => {
        console.log(res.data)
        dispatch(actions.getAllComments({ commentable_id: commentable_id, commentable_type: commentable_type }))
      })
      .catch(err => console.log(err.response.data.detail))
  }

  const submitReplyHandler = (e) => {
    onSubmitReplies(e, commentMessage, setCommentMessage, comment_id, setSendRepliesLoading)
  }

  const author = ( 
    <>
      <b>{username}</b> 
      <span className="diskusi-date">
        <Tag 
          className="grosir-tag mr-0 mb-0 m-l-5" visible={role === "admin"}
        >Penjual</Tag> &bull; {moment(created_at).startOf('minute').fromNow()}
        {can_delete && (
          <span className="hover-pointer action-btn">
            <Popconfirm
              title={`${head ? "Hapus diskusi?" : "Hapus komentar?"}`}
              okText="Ya"
              cancelText="Batal"
              placement="bottomRight"
              arrowPointAtCenter
              onConfirm={() => deleteCommentOrReply(head)}
            >
              <i className="fal fa-ellipsis-h-alt" />
            </Popconfirm>
          </span>
        )}
      </span>
    </>
  )

  return(
    <>
      <Comment
        className="comment-modif"
        avatar={<Avatar src={avatar_url} alt={username + " Tridatu Bali ID"} />}
        author={body === "message" ? author : body === "reply" && <></>}
        content={body === "message" ? <p>{content}</p> : body === "reply" && (
          <Form>
            <Form.Item className="mb-2"
              validateStatus={!commentMessage.message.isValid && commentMessage.message.message && "error"}
            >
              <Input.TextArea 
                name="message"
                value={commentMessage.message.value}
                autoSize={{ minRows: 1, maxRows: 2 }}
                onChange={e => onChangeMessage(e, commentMessage, setCommentMessage)}
                placeholder="Isi komentar disini..."
              />
              <ErrorMessage item={commentMessage.message} />
            </Form.Item>
            <Form.Item className="mb-1">
              <Button className="btn-tridatu" onClick={submitReplyHandler}>
                {sendRepliesLoading ? <LoadingOutlined /> : "Kirim"}
              </Button>
            </Form.Item>
          </Form>
        )}
      >
        {children}
      </Comment>

      <style jsx>{`
        :global(.comment-modif .ant-comment-inner){
          padding: 10px 0 10px 0;
        }
        :global(.ant-comment-content-author-name > *){
          color: rgba(0, 0, 0, 0.7);
        }
        :global(.ant-comment-content-author-name > .diskusi-date){
          color: rgba(0, 0, 0, 0.38);
        }
        :global(.ant-comment-content-detail p){
          color: rgba(0, 0, 0, 0.54);
        }
        :global(.ant-comment-content-author-name){
          width: 100%;
        }
        :global(.ant-comment-content-author > .ant-comment-content-author-name .action-btn){
          float: right;
        }
        :global(.action-btn){
          color: #999999!important;
        }
        :global(.action-btn:hover){
          color: #343a40!important;
        }
      `}</style>
    </>
  )
}

export default CommentContainer
