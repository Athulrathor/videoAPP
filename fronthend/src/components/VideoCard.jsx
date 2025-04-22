import React from 'react';
import { useSelector } from 'react-redux';

const VideoCard = (props) => {
  const { title, views, createdAt, thumbnail, videoFile } = props.video;

  const { user } = useSelector((state) => state.user); 

    function timeAgo(createdAt) {
      const now = new Date();
      const created = new Date(createdAt);
      const difference = Math.floor((now - created) / 1000);

      if (difference < 60) {
        return `${difference} seconds ago`;
      } else if (difference < 3600) {
        const minutes = Math.floor(difference / 60);
        return `${minutes} minutes ago`;
      } else if (difference < 86400) {
        const hours = Math.floor(difference / 3600);
        return `${hours} hours ago`;
      } else if (difference < 2419200) {
        const days = Math.floor(difference / 86400);
        return `${days} days ago`;
      } else if (difference / 31536000) {
        const month = Math.floor(difference / 2419200);
        return `${month} month ago`;
      } else {
        const year = Math.floor(difference / 31536000);
        return `${year} year ago`;
      }
    }

  return (
    <div>
      <div className="">
        <div className="">
          {/* <CardComp
            title={props.title}
            name={props.username}
            views={props.views}
            watchTime={props.createdAt}
            avatar={props.avatar}
            thumbnail={props.thumbnail}
            videos={props.videoFile}
            videoDuration={props.duration}
          /> */}

          <div className="h-fit">
            <video
              src={videoFile}
              poster={thumbnail}
              controls
              className='w-fit bg-black aspect-video rounded-2xl'
            ></video>

            <div className="flex items-center mt-2">
              <img
                src={user?.data?.user?.avatar}
                alt="Thumbnail"
                className="h-auto rounded-full w-[56px] aspect-square mr-2.5"
              />
              <div>
                <h1 className="text-lg font-bold">{title}</h1>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500">
                    {views} views | {timeAgo(createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
