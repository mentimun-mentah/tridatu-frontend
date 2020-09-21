import { useState } from 'react';
import { Rate, Comment, Tooltip, Avatar } from 'antd';
import moment from 'moment';

const UlasanContainer = () => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [action, setAction] = useState(null);

  const like = () => {
    setLikes(1);
    setDislikes(0);
    setAction('liked');
  };

  const dislike = () => {
    setLikes(0);
    setDislikes(1);
    setAction('disliked');
  };

  const actions = [
    <Tooltip key="comment-basic-like" title="Like">
      <span onClick={like}>
        <i className={`${action === 'liked' ? 'fas ' : 'fal '} fa-thumbs-up`} />
        <span className="comment-action"> {likes}</span>
      </span>
    </Tooltip>,
    <Tooltip key="comment-basic-dislike" title="Dislike">
      <span onClick={dislike}>
        <i className={`${action === 'disliked' ? 'fas ' : 'fal '} fa-thumbs-down`} />
        <span className="comment-action"> {dislikes}</span>
      </span>
    </Tooltip>,
  ];

  const avatar = (
    <Avatar
      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
      alt="Han Solo"
    />
  )

  const content = (
    <>
      <Rate disabled allowHalf value={5}
        className="header-product-rating-rate"
      />
      <p>
        We supply a series of design principles, practical patterns and high quality design
        resources (Sketch and Axure), to help people create their product prototypes beautifully
        and efficiently.
      </p>
    </>
  ) 

  const datetime = (
    <Tooltip title={moment().format('DD-MM-YYYY HH:mm:ss')}>
      <span>{moment().fromNow()}</span>
    </Tooltip>
  )

  return (
    <>
      {[...Array(3)].map((_, i) => (
        <Comment
          key={i}
          actions={actions}
          author={<b>Han Solo</b>}
          avatar={avatar}
          content={content}
          datetime={datetime}
        />
      ))}
    </>
  )
}

export default UlasanContainer
