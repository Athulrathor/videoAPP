import { useParams } from "react-router-dom";
import { useVideo } from "../features/video/useVideo";
import { useToggleVideoLike } from "../features/like/useLike";
// import { useComments } from "../features/comment/useComment";

import VideoSection from "../components/watch/VideoSection";
import VideoInfo from "../components/watch/VideoInfo";
import CommentsSection from "../components/watch/CommentSection";
import RecommendedList from "../components/watch/RecommendedList";

function Watch() {
  const { id } = useParams();

  const { data, isLoading } = useVideo(id);
  const { mutate } = useToggleVideoLike();
  // const { commentData } = useComments(id);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        Loading...
      </div>
    );
  }

  const video = data?.data?.data;
  // const comments = commentData?.data?.data || [];

  return (
    <div className="h-[calc(100vh-60px)] py-4">
      <div className="grid w-full grid-cols-12 gap-6">
        <div className="col-span-12 space-y-4 lg:col-span-8">
          <div className="aspect-video w-full overflow-hidden rounded-none sm:rounded-xl">
            <VideoSection video={video} onLike={mutate} />
          </div>

          <VideoInfo video={video} />

          <CommentsSection contentId={video?._id} contentCommentCount={video?.commentsCount} />
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="h-full overflow-y-auto pr-2">
            <RecommendedList currentVideoId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Watch;