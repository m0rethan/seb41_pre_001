import Editor from './Editors';
import styled from 'styled-components';
import { RowDiv } from '../styles/StyledStore';
import { useState } from 'react';
import axios from 'axios';
import { pushDefaultWithToken } from '../util/axiosHelper';
import CommonButton, {
  BUTTON_TYPE_USER_DELETE,
  BUTTON_TYPE_USER_EDIT,
} from './CommonButton';
import ModalCommentDelete from './ModalCommentDelete';
import ModalCommentEdit from './ModalCommentEdit';

/* 
  "comments": [
    {
      "id": 1,
      "createdAt": "2022-12-28T17:35:22.259912",
      "likes": [],
      "content": " 댓글 내용입니다 ",
      "likeCount": 0
    },
*/

/**
 * Created by @ldk199662
 * Modified by @KimTank
 * @returns <Comment>
 */
function CommentEditModule({
  postId,
  comment,
  setPost,
  commentEditModalIsOpen,
  setCommentEditModalOpen,
}) {
  const [comment, setComment] = useState('');

  const handleComment = (comment) => {
    setComment(comment);
  };

  const onClickSubmit = async () => {
    if (comment.length < 10) {
      alert('내용을 최소 10글자 이상 적어주세요');
      return false;
    }

    axios
      .post(
        `${process.env.REACT_APP_EP_COMMENT_CREATE}/${postId}${process.env.REACT_APP_EP_COMMENT}`,
        {
          content: comment,
        },
        pushDefaultWithToken()
      )
      .then(() => {
        axios
          .get(`${process.env.REACT_APP_EP_POSTS_DETAIL}/${postId}`, {
            withCredentials: true,
          })
          .then((response) => {
            const { data } = response;
            setPost(data);
            setComment('');
          })
          .catch((error) => alert(error));
      })
      .catch((error) => {
        console.log(error);
        let errorText;
        const { message } = error;
        const code = Number(message.slice(-3));
        switch (code) {
          case 401:
          case 404:
          case 500:
          default:
            errorText = message;
        }
        return alert(errorText);
      });
  };

  return (
    <CommentBody>
      <div>
        <Editor value={comment} setValue={handleComment} />
      </div>
      <Buttons>
        <PostButton
          className="submit-button"
          type="button"
          onClick={onClickSubmit}
        >
          Edit Your Answer
        </PostButton>
      </Buttons>
    </CommentBody>
  );
}

export default CommentEditModule;

const CommentBody = styled.div`
  background-color: #ffffff;
  margin-left: 20px;
`;
const CommentArea = styled.ul`
  padding: 30px;
  margin: 30px;
`;

const CommentItem = styled.li`
  border: 1px solid grey;
  margin: 4px;
`;

const CommentTiTle = styled.div`
  margin: 10px;
  padding: 10px;
  margin-left: -10px;
  > h2 {
    font-size: 21px;
    font-weight: 400;
  }
`;
const CommentHelp = styled.div`
  padding: 0px;
  margin: 0px;
  margin-top: 10px;
  border: 1px solid hsl(47deg 69% 69%);
  border-radius: 3px 3px 3px 3px;
  background-color: hsl(47deg 83% 91%);
  > p {
    padding: 10px;
    margin: 10px;
    font-weight: 400;
  }
  > ul > p {
    padding: 10px;
    margin: 10px;
  }
  > ul > li {
    list-style-type: disc;
    font-size: 15px;
    font-weight: 400;
    margin-left: 55px;
    font-weight: 400;
  }
`;
const Buttons = styled.div`
  display: flex;
`;

const PostButton = styled.button`
  background-color: hsl(206deg 100% 52%);
  border-radius: 3px;
  border: none;
  color: #ffffff;
  padding: 13px;
  margin-top: 30px;
  margin-bottom: 15px;
`;
const CommentLast = styled.div`
  padding: 0;
  margin: 0;
  > p {
    padding: 10px;
    margin: 10px;
    margin-left: -10px;
    font-size: 19px;
  }
`;
const CommentLastBox = styled.a`
  margin: 2px 2px 2px 0;
  padding: 4.8px 6px;
  background-color: #e1ecf4;
  border-radius: 3px;
`;
