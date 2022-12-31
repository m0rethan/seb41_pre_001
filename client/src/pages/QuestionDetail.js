import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CommonButton, {
  BUTTON_TYPE_USER_DELETE,
  BUTTON_TYPE_USER_EDIT,
} from '../components/CommonButton';
import Sidebar from '../components/Sidebar';
import { MainContainer, RowDiv } from '../styles/StyledStore';
import Comment from '../components/Comment';
import styled from 'styled-components';
import { IS_ALIVE } from '../util/tokenHelper';
import ModalPostDelete from '../components/ModalPostDelete';

const Comments = ({ comments = [] }) => {
  return (
    <div id="comments">
      {/* <TODO md editor />  */}
      <div>
        {comments.length === 0 ? (
          <span>No comments</span>
        ) : (
          <ul>
            {comments.map((comment, index) => {
              <li key={index}>
                <div>COMMENT: {comment}</div>
              </li>;
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
const Tags = ({ tags = [] }) => {
  return (
    <div id="tags">
      <div>TAGS</div>
      <div>
        {tags.length === 0 ? (
          <span>No tags</span>
        ) : (
          <RowDiv>
            {tags.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </RowDiv>
        )}
      </div>
    </div>
  );
};

/**
 * made by @ldk199662
 * since 22-12-30
 * @returns
 */
function QuestionDetail() {
  const [post, setPost] = useState({});
  const [deleteModalIsOpen, setIsDeleteModalOpen] = useState(false);
  const { state } = useLocation();

  useEffect(() => {
    axios
      .get('/board/posts/' + state.post.id, {
        withCredentials: true,
      })
      .then((response) => {
        const { data } = response;
        setPost(data);
      })
      .catch((error) => alert(error));
  }, []);

  const handleDelete = () => {
    setIsDeleteModalOpen(!deleteModalIsOpen);
  };

  return (
    <QuestionDetailBody>
      <QuestionDetails>
        <div>
          {/* TODO user정보접속 -> 게시물정보접속 -> userid동일할때 뷰가 보여야됨*/}
          {IS_ALIVE() ? (
            <div id="buttons">
              <CommonButton
                buttonType={BUTTON_TYPE_USER_EDIT}
                cont="Edit post"
              />
              <CommonButton
                buttonType={BUTTON_TYPE_USER_DELETE}
                cont="Delete post"
                onClick={handleDelete}
              />
              <ModalPostDelete
                deleteModalIsOpen={deleteModalIsOpen}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                post={post}
              />
            </div>
          ) : (
            ''
          )}
          <div id="etcs">
            <div>{post.createdAt}</div>
            <div>LIKES: {post.likeCount}</div>
            <div>VIEWS: {post.views}</div>
          </div>
          <Tags tags={post.tags} />
          <div id="title">
            <strong>TITLE</strong>
          </div>
          <div>{post.title}</div>
          <div id="cont">
            <div>
              <strong>CONTENT</strong>
            </div>
            <div>{post.content}</div>
          </div>
          <Comments comments={post.comments} />
          <Comment />
        </div>
      </QuestionDetails>

      <Sidebar />
    </QuestionDetailBody>
  );
}

export default QuestionDetail;

const QuestionDetailBody = styled(MainContainer)`
  background: #ffffff;
`;
const QuestionDetails = styled.div`
  border-left: 1px solid hsl(210deg 8% 90%);
`;
