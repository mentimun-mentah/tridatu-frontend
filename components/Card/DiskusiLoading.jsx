import { Comment, Skeleton } from 'antd';
import { formComment, onChangeMessage } from 'formdata/formComment'
import axios, { jsonHeaderHandler, signature_exp } from 'lib/axios'

const CommentContainerLoading = ({ children }) => {

  return(
    <>
      <Comment className="comment-modif" author={<Skeleton active avatar paragraph={{ rows: 1 }} />}>
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

export default CommentContainerLoading
