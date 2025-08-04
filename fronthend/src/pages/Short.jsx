import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ShortCard from "../components/ShortCard";
import { axiosInstance } from "../libs/axios";
import ShortSkeletonLoading from "../components/LoadingScreen/ShortSkeletonLoading";
import {
  ChevronDown,
  SendHorizontal,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";

const Short = (props) => {
  const [inputShortComment, setInputShortComment] = useState("");
  const [inputCommentReplies, setInputCommentReplies] = useState("");

  const [shortComment, setShortComment] = useState([]);
  const [commentReplies, setCommentReplies] = useState([]);

  const { shortLoading, fetchLikeToggle } = props;

  const [getShortId, setGetShortId] = useState(null);
  const [showComment, setShowComment] = useState(true);
  const [getCommentId, setGetCommentId] = useState(null);

  const [commentStatus, setCommentStatus] = useState({
    replyStatus: true,
    replyToggle: false,
    shortCommentToggle: true,
    likeComment: false,
    disLikeComment: false,
  });

  const [repliesStatus, setRepliesStatus] = useState({
    likeReplies: false,
    disLikeReplies:false,
  });

  const [functionCalled, setFunctionCalled] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

  const { short } = useSelector((state) => state.shorts);
  const { loggedIn, user } = useSelector((state) => state.user);

  // function shuffleArray(array) {
  //   const shuffled = [...array]; // Don't modify original
  //   for (let i = shuffled.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  //   }
  //   return shuffled;
  // }

  const handleDislikeComment = (commentId) => {

    setCommentStatus((prev) => ({
          ...prev,
          [commentId]: {
            ...prev[commentId],
            disLikeComment: !commentStatus[commentId]?.disLikeComment,
          },
    }));

    if (!commentStatus[commentId]?.disLikeComment) {
      setCommentStatus((prev) => ({
        ...prev,
        [commentId]: {
          ...prev[commentId],
          likeComment: false,
        },
      }));
    }
  }

    const handleDislikeReplies = (commentId) => {

    setRepliesStatus((prev) => ({
          ...prev,
          [commentId]: {
            ...prev[commentId],
            disLikeReplies: !repliesStatus[commentId]?.disLikeReplies,
          },
    }));

    if (!repliesStatus[commentId]?.disLikeReplies) {
      setRepliesStatus((prev) => ({
        ...prev,
        [commentId]: {
          ...prev[commentId],
          likeReplies: false,
        },
      }));
    }
  }

  const handlelikeComment = (commentId) => {
      
        setCommentStatus((prev) => ({
          ...prev,
          [commentId]: {
            ...prev[commentId],
            likeComment: !commentStatus[commentId]?.likeComment,
          },
        }));
    
        if (!commentStatus[commentId]?.likeComment) {
          setCommentStatus((prev) => ({
            ...prev,
            [commentId]: {
              ...prev[commentId],
              disLikeComment: false,
            },
          }));
    }
    
    fetchLikeToggleComments(commentId);
  };

    const handlelikeReplies = (commentId) => {
      
        setRepliesStatus((prev) => ({
          ...prev,
          [commentId]: {
            ...prev[commentId],
            likeReplies: !repliesStatus[commentId]?.likeReplies,
          },
        }));
    
        if (!repliesStatus[commentId]?.likeReplies) {
          setRepliesStatus((prev) => ({
            ...prev,
            [commentId]: {
              ...prev[commentId],
              disLikeComment: false,
            },
          }));
    }
    
    fetchLikeToggleComments(commentId);
  };
  
  useEffect(() => {
    setFunctionCalled(false);
  }, [getShortId]);

  useEffect(() => {     
    // setFunctionCalled(false);
    if (currentTime >= 3 && !functionCalled) {
        props.fetchViewCounter(getShortId);
        setFunctionCalled(true); 
    }
    },[getShortId,props.fetchViewCounter,functionCalled])
  
        const fetchIsLikedOrNotComment = async (commentId) => {
            if (!commentId) return "id not found";
            try {
              const likesChecking = await axiosInstance.get(
                `like/is-liked-or-not-comment/${commentId}`
              );
              console.log("clicked")
              setCommentStatus((prev) => ({
                ...prev,
                [commentId]: {
                  ...prev[commentId],
                  likeComment:
                    likesChecking?.data?.data,
                },
              }));
            } catch (error) {
              console.error(error);
            }
    }
  
          const fetchIsLikedOrNotReplies =
          async (commentId) => {
            if (!commentId) return "id not found";
            try {
              const likesChecking = await axiosInstance.get(
                `like/is-liked-or-not-comment/${commentId}`
              );
              setRepliesStatus((prev) => ({
                ...prev,
                [commentId]: {
                  ...prev[commentId],
                  likeReplies:
                    likesChecking?.data?.data,
                },
              }));
            } catch (error) {
              console.error(error);
            }
          }

  const fetchLikeToggleComments = async (commentId) => {
    try {
       await axiosInstance.get(
        `like/toggle-like-to-comment/${commentId}`
      );

      fetchShortComment(getShortId);
      fetchCommentReplies(getCommentId)
    } catch (error) {
      console.error(error);
    }
  };

  const fetchShortComment = useCallback(async (shortId) => {
    if (!shortId) return "id not found";
    try {
      const response = await axiosInstance.get(
        `comment/get-short-comment/${shortId}`
      );
      response?.data?.data?.data.map((comment) => {
        fetchIsLikedOrNotComment(comment._id);
      });
      setShortComment(response?.data?.data?.data);
    } catch (error) {
      console.log("Error :", error.message);
    }
  }, []);

  const fetchCommentReplies = useCallback(
    async (id) => {
      if (!id) return "id not found";

      try {
        const replies = await axiosInstance.get(
          `comment//get-comment-to-comment/${id}`
        );
        setGetCommentId(id)
        replies?.data?.data?.data.map((comment) => {
          fetchIsLikedOrNotReplies(comment._id);
        });
        setCommentReplies(replies?.data?.data?.data);
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

         const fetchAddShortComment = useCallback(
           async (commentOfShort) => {
             if (!commentOfShort) return "short comment invalid";

             try {
               await axiosInstance.post(
                 `comment/add-comment-to-short/${getShortId}`,
                 {
                   comment: commentOfShort,
                 }
               );
               setInputShortComment("");
               fetchShortComment(getShortId)
             } catch (error) {
               console.error(error);
             }
           },
           [getShortId,fetchShortComment]
         );

  const fetchAddCommentReplies = async (id, newComment) => {
    if (!id || !newComment) return "replies id or comment not found";

    try {
      await axiosInstance.post(`comment/add-comment-to-comment/${id}`, {
        comment: newComment,
      });
      fetchShortComment(getShortId)
      fetchCommentReplies(getCommentId);
      setInputCommentReplies("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="">
      {loggedIn === false ? (
        <div className="w-full h-full">
          <div className="ml-8 mt-6 ">
            <h1>To view please login </h1>
            <button>login</button>
          </div>
        </div>
      ) : (
        <div>
          {shortLoading === true ? (
            <div>
              {" "}
              <ShortSkeletonLoading />{" "}
            </div>
          ) : (
            <div className="">
              <div
                style={{ height: "calc(100vh - 65px)" }}
                className=" justify-center items-center w-full snap-y max-md:w-screen snap-mandatory scroll-smooth overflow-y-scroll flex-col"
              >
                {short?.map((shortVideo) => (
                  <div
                    key={shortVideo._id}
                    className="py-1"
                  >
                    <ShortCard
                      short={shortVideo}
                      id={shortVideo._id}
                      activeShort={setGetShortId}
                      fetchLikeToggle={fetchLikeToggle}
                      fetchShortComment={fetchShortComment}
                      showComment={showComment}
                      setShowComment={setShowComment}
                      fetchViewCounter={props.fetchViewCounter}
                      currentTime={currentTime}
                      setCurrentTime={setCurrentTime}
                    />
                  </div>
                ))}
              </div>
              {/* comments start hear */}
              <div
                className={`${
                  showComment ? "hidden" : ""
                } absolute top-[240px]  min-w-80  border-1 border-gray-300 rounded-[9px]  right-0 w-[320px]  ml-8 `}
              >
                {/* comment heading and close button */}
                <div className="p-3 flex items-center justify-between border-b-1 border-gray-300">
                  <h1 className="text-2xl font-medium">
                    Comments{" "}
                    <span className="text-xl opacity-60">
                      {" "}
                      {shortComment.length}
                    </span>
                  </h1>
                  <div>
                    {/* close button */}
                    <button
                      onClick={() => setShowComment(true)}
                      className="p-3 rounded-full hover:bg-gray-100 active:bg-gray-200"
                    >
                      <X />
                    </button>
                  </div>
                </div>

                {/* comment contents */}
                <div className="scrollBar h-96 px-3 py-2 overflow-y-scroll scroll-smooth">
                  {shortComment.map((comment) => (
                    <div key={comment._id}>
                      {/* username, time ago and image */}
                      <div className="">
                        <div className="flex items-center">
                          <img
                            src={comment?.user_info?.avatar}
                            className="rounded-full w-6 mr-2 aspect-square "
                          />

                          <div className="space-x-1">
                            <span className="text-sm font-medium">
                              {comment?.user_info?.username}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {comment?.createdAt || "1 Minute ago"}
                            </span>
                          </div>
                        </div>
                        {/* content */}
                        <div className="scrollBar ml-8 text-sm overflow-y-auto">
                          {comment?.content}
                        </div>
                        <div className="ml-8  flex items-center p-1">
                          {/* liked button */}
                          <div className="flex items-center mr-2">
                            <button
                              onClick={() => handlelikeComment(comment._id)}
                              className="mr-1 "
                            >
                              {commentStatus[comment._id]?.likeComment ? (
                                <ThumbsUp
                                  fill="black"
                                  size={20}
                                />
                              ) : (
                                <ThumbsUp size={20} />
                              )}
                            </button>
                            <span className="mr-2">{comment?.totalLikes}</span>
                          </div>
                          {/* disliked button */}
                          <div className="flex items-center  mr-2">
                            <button
                              onClick={() => handleDislikeComment(comment._id)}
                              className="mr-1"
                            >
                              {commentStatus[comment._id]?.disLikeComment ? (
                                <ThumbsDown
                                  fill="black"
                                  size={20}
                                />
                              ) : (
                                <ThumbsDown size={20} />
                              )}
                            </button>
                            <span></span>
                          </div>
                          {/* reply button */}
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                setCommentStatus((prev) => ({
                                  ...prev,
                                  [comment._id]: {
                                    ...prev[comment._id],
                                    shortCommentToggle:
                                      !commentStatus[comment._id]
                                        ?.shortCommentToggle,
                                  },
                                }))
                              }
                              className="pt-1 pb-1 pl-3 pr-3 rounded-[11px]  hover:bg-gray-100 active:bg-gray-200"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                        {/* input replies toggle */}
                        <div
                          className={`${
                            commentStatus[comment._id]?.shortCommentToggle
                              ? ""
                              : "hidden"
                          } py-1 flex border-t-1 border-gray-200 items-center`}
                        >
                          <img
                            src={user.data?.user?.avatar}
                            alt=""
                            className="rounded-full w-6 mr-2 aspect-square"
                          />
                          <input
                            type="text"
                            name="CommentToShort"
                            value={inputCommentReplies}
                            onChange={(e) =>
                              setInputCommentReplies(e.target.value)
                            }
                            placeholder="Add a comment..."
                            className="w-full  border-b border-gray-300 focus:outline-none focus:ring-0"
                          />
                          <button
                            onClick={() => {
                              fetchAddCommentReplies(
                                comment._id,
                                inputCommentReplies
                              );
                              setCommentStatus((prev) => ({
                                ...prev,
                                [comment._id]: {
                                  ...prev[comment._id],
                                  shortCommentToggle: false,
                                },
                              }));
                            }}
                            className="p-2 ml-2 hover:bg-gray-100 active:bg-gray-200"
                          >
                            <SendHorizontal />
                          </button>
                        </div>

                        {/* input replies toggle */}
                        <div>
                          {/* replied list */}
                          <div className="ml-8 mt-2 flex items-center">
                            <button
                              onClick={() => {
                                setCommentStatus((prev) => ({
                                  ...prev,
                                  [comment._id]: {
                                    ...prev[comment._id],
                                    replyToggle:
                                      !commentStatus[comment._id]?.replyToggle,
                                  },
                                }));
                                fetchCommentReplies(comment._id);
                              }}
                              className=" pt-1 pb-1 pl-3 pr-3 rounded-[11px] bg-blue-100 hover:bg-blue-200 active:bg-blue-300 text-blue-500 flex justify-center items-center"
                            >
                              Replies
                              <span className="ml-1">
                                {comment?.totalComment}
                              </span>
                              <span>
                                <ChevronDown size={20} />
                              </span>
                            </button>
                          </div>
                        </div>
                        {/* sub comment means replies */}
                        <div
                          className={`${
                            commentStatus[comment._id]?.replyToggle
                              ? "pt-2 pb-2"
                              : "hidden"
                          } ml-8  overfolw-y-scroll scroll-smooth scrollBar `}
                        >
                          {commentReplies.map((replies) => (
                            <div
                              key={replies._id}
                              className=""
                            >
                              {/* image,username and time ago */}
                              <div className="flex items-center mt-1">
                                <img
                                  src={replies?.user_info?.avatar}
                                  className="rounded-full w-6 mr-2 aspect-square "
                                />
                                <div className="space-x-1">
                                  <span className="text-sm font-medium">
                                    {replies?.user_info?.username}
                                  </span>
                                  <span className="text-gray-500 text-xs">
                                    {replies?.createdAt || "1 Minute ago"}
                                  </span>
                                </div>
                              </div>
                              {/* sub content */}
                              <div className="scrollBar ml-8 text-sm overflow-y-auto">
                                {replies?.content}
                              </div>
                              <div className="ml-8  flex items-center p-1">
                                {/* liked button sub comment */}
                                <div className="flex items-center mr-2">
                                  <button
                                    onClick={() =>
                                      handlelikeReplies(replies._id)
                                    }
                                    className="mr-1"
                                  >
                                    {repliesStatus[replies._id]?.likeReplies ? (
                                      <ThumbsUp
                                        fill="black"
                                        size={20}
                                      />
                                    ) : (
                                      <ThumbsUp size={20} />
                                    )}
                                  </button>
                                  <span>{replies?.totalLikes}</span>
                                </div>
                                {/* disliked button sub comment */}
                                <div className="flex items-center  mr-2">
                                  <button
                                    onClick={() =>
                                      handleDislikeReplies(replies._id)
                                    }
                                    className="mr-1"
                                  >
                                    {repliesStatus[replies._id]
                                      ?.disLikeReplies ? (
                                      <ThumbsDown
                                        fill="black"
                                        size={20}
                                      />
                                    ) : (
                                      <ThumbsDown size={20} />
                                    )}
                                  </button>
                                  <span></span>
                                </div>
                                {/* reply button sub comment */}
                                <div className="flex items-center">
                                  <button
                                    onClick={() =>
                                      setCommentStatus((prev) => ({
                                        ...prev,
                                        [replies._id]: {
                                          ...prev[replies._id],
                                          replyStatus:
                                            !commentStatus[replies._id]
                                              ?.replyStatus,
                                        },
                                      }))
                                    }
                                    className="pt-1 pb-1 pl-3 pr-3 rounded-[11px]  hover:bg-gray-100 active:bg-gray-200"
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                              {/* comment on comment means reply input button */}
                              <div
                                className={`${
                                  commentStatus[replies._id]?.replyStatus
                                    ? ""
                                    : "hidden"
                                } py-1 flex border-t-1 border-gray-200 items-center`}
                              >
                                <img
                                  src={user.data?.user?.avatar}
                                  alt=""
                                  className="rounded-full w-6 mr-2 aspect-square"
                                />
                                <div className="flex items-center">
                                  <span className="text-sm mr-1">{`@${replies?.user_info?.username}`}</span>
                                  <input
                                    type="text"
                                    name="CommentToShort"
                                    id={commentReplies._id}
                                    value={inputCommentReplies}
                                    onChange={(e) =>
                                      setInputCommentReplies(e.target.value)
                                    }
                                    placeholder="Add a comment..."
                                    className="w-full  border-b border-gray-300 focus:outline-none focus:ring-0"
                                  />
                                </div>
                                <button
                                  onClick={() => {
                                    fetchAddCommentReplies(
                                      comment._id,
                                      inputCommentReplies
                                    );
                                    setCommentStatus((prev) => ({
                                      ...prev,
                                      [replies._id]: {
                                        ...prev[replies._id],
                                        replyStatus: false,
                                      },
                                    }));
                                  }}
                                  className="p-2 ml-2 hover:bg-gray-100 active:bg-gray-200"
                                >
                                  <SendHorizontal />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* comment on short input button */}
                <div className=" border-t-1 border-gray-200 flex items-center p-3">
                  <img
                    src={user.data?.user?.avatar}
                    alt=""
                    className="rounded-full w-6 mr-2 aspect-square"
                  />
                  <input
                    type="text"
                    name="CommentToShort"
                    id="short-comment"
                    value={inputShortComment}
                    onChange={(e) => setInputShortComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-2 border-b border-gray-300 focus:outline-none focus:ring-0"
                  />
                  <button
                    onClick={() => fetchAddShortComment(inputShortComment)}
                    className="p-2 ml-2 hover:bg-gray-100 active:bg-gray-200"
                  >
                    <SendHorizontal />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Short;
