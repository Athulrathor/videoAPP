// import { createSlice } from "@reduxjs/toolkit";
// import { axiosInstance } from "../../libs/axios";

// const fetchShortComment = async (
//   dispatch,
//   commentId,
// ) => {
//   dispatch(commentLoading(true));
//   try {
//     const response = await axiosInstance.get(
//       `comment/get-short-comment/${commentId}`
//     );
//     dispatch(comments(response.data.data));
//     dispatch(commentLoading(false));
//   } catch (error) {
//     dispatch(noComment());
//     dispatch(commentError(true));
//     dispatch(commentLoading(false));
//     console.log("Error :", error.message);
//   } finally {
//     dispatch(commentLoading(false));
//   }
// };

// const fetchCommentToComments = async (dispatch, idOfcomment) => {
//     dispatch(commentToCommentLoading(true));
//   try {
//     const commentsComments = await axiosInstance.get(
//       `comment//get-comment-to-comment/${idOfcomment}`
//       );
    
//     dispatch(commentToCommentLoading(false));
//       // setCommentToComment(commentsComments.data.data.data);
//       dispatch(commentToComments(commentsComments.data.data.data));
//   } catch (error) {
//     // dispatch(noCToComments());
//     dispatch(commentToCommentError(true));
//     console.error(error);
//   }finally {
//     dispatch(commentToCommentLoading(false));
//   }
// };

// const addCommentToComment = async (dispatch, id, setOpenInput, newComment) => {
//     dispatch(commentToCommentLoading(true))
//     try {
//         await axiosInstance.post(`comment/add-comment-to-comment/${id}`, {
//             comment: newComment,
//         });
//         dispatch(commentToCommentLoading(false));
//         setOpenInput((prev) => !prev);
//     } catch (error) {
//         // dispatch(noCToComments());
//         dispatch(commentToCommentError(true));
//         console.error(error);
//     } finally {
//         dispatch(commentToCommentLoading(false));
//     }
// };

// // const editComment = async (commentId, newComment, setInputComment, setOpenInput) => {
    
// //     try {
// //           await axiosInstance.post(`comment/update-comment-to-short/${commentId}`, {
// //             newComment: newComment
// //           });
// //           setInputComment("")
// //           setOpenInput((prev) => !prev);
          
// //         } catch (error) {
// //           console.error(error);
// //         }
// // }

// export const commentSlice = createSlice({
//   name: "comment",
//   initialState: {
//     comment: [],
//     commentToComment: [],
//     commentLoading: false,
//     commentError: false,
//     isComment: false,
//     isCommentToComment: false,
//     commentToCommentIsLoading: false,
//     commentToCommentError: false,
//   },
//   reducers: {
//     comments: (state, action) => {
//       state.comment = action.payload;
//       state.commentLoading = false;
//       state.isComment = true;
//     },
//     noComment: (state) => {
//       state.comment = [];
//       state.commentLoading = false;
//       state.commentError = true;
//       state.isComment = false;
//     },
//     commentLoading: (state, action) => {
//       state.commentLoading = action.payload;
//     },
//     commentError: (state, action) => {
//       state.commentError = action.payload;
//     },
//   },
// });

// export const { comments, noComment, commentLoading, commentError } = commentSlice.actions;
// export { fetchShortComment, fetchCommentToComments, addCommentToComment };
// export default commentSlice.reducer;
