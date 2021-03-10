import * as actionType from "store/actions/actionTypes";
import { updateObject } from "lib/utility";

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

const getAllCommentsStart = (state, _) => {
  return updateObject(state, {
    error: null,
    loading: true,
  });
}

const getAllCommentsSuccess = (state, action) => {
  return updateObject(state, {
    comments: action.payload,
    loading: false,
  });
}

const getAllCommentsFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
}

const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionType.GET_ALLCOMMENTS_START:
      return getAllCommentsStart(state, action)
    case actionType.GET_ALLCOMMENTS_SUCCESS:
      return getAllCommentsSuccess(state, action)
    case actionType.GET_ALLCOMMENTS_FAIL:
      return getAllCommentsFail(state, action)

    default:
      return state
  }
}

export default reducer
