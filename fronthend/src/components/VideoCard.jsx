import React from "react";
// import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

const VideoCard = (props) => {
  const { title, views, createdAt, thumbnail, videoFile } = props.video;

  const Navigate = useNavigate();

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
          <div className="aspect-video">
            <video
              src={videoFile}
              poster={thumbnail}
              onClick={() => Navigate(`/video/${props.video._id}`)}
              className="w-full bg-black aspect-video rounded"
            ></video>

            <div className="flex items-center mt-4 max-md:pl-0 max-md:pr-2 pl-2 pr-2">
              <img
                src={props?.video?.userInfo?.avatar}
                alt="Thumbnail"
                className="h-auto rounded-full w-[36px] aspect-square mr-2.5"
              />
              <div>
                <h1 className="text-[16px] font-bold">{title}</h1>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-[12px] opacity-60 text-gray-500">
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
};

export default VideoCard;
