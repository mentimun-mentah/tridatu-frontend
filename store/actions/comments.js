import axios, { signature_exp } from "lib/axios";
import * as actionType from "./actionTypes";

const getAllCommentsStart = () => {
  return { type: actionType.GET_ALLCOMMENTS_START }
}

export const getAllCommentsSuccess = (payload) => {
  return {
    type: actionType.GET_ALLCOMMENTS_SUCCESS,
    payload: payload
  }
}

const getAllCommentsFail = (error) => {
  return {
    type: actionType.GET_ALLCOMMENTS_FAIL,
    error: error
  }
}

export const getAllComments = ({ page = 1, per_page = 10, commentable_id, commentable_type }) => {
  let queryString = {}
  if(page) queryString["page"] = page
  if(per_page) queryString["per_page"] = per_page
  queryString["commentable_id"] = commentable_id
  queryString["commentable_type"] = commentable_type

  return dispatch => {
    dispatch(getAllCommentsStart())
    axios.get(`/comments/all-comments`, { params: queryString })
      .then(res => {
        dispatch(getAllCommentsSuccess(res.data))
      })
      .catch(err => {
        if(err.response.data.detail === signature_exp){
          axios.get(`/comments/all-comments`, { params: queryString })
            .then(res => {
              dispatch(getAllCommentsSuccess(res.data))
            })
            .catch(() => {})
        }
        else {
          dispatch(getAllCommentsFail(err.response))
        }
      })
  }
}
