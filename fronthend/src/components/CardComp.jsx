import React from 'react';
import { SlOptionsVertical } from "react-icons/sl";
import { FaClock } from "react-icons/fa";
import VideoPlayer from "./video";
// import {videos} from "../feature/getAllVideo"

// import ytImg from "../test/testImg_01.jpg";

// const getvideo = await videos();

// console.log(getvideo)

const CardComp = (props) => {

    const videoJsOptions = {
    controls: true,
    autoplay: false,
    preload: "auto",
    poster:props.thumbnail,
    sources: [
      {
        src: props.videos,
        type: "video/mp4",
      },
    ],
  };

  console.log(props)

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
    } else if(difference < 2419200){
      const days = Math.floor(difference / 86400);
      return `${days} days ago`;
    } else if ((difference / 31536000)) {
      const month = Math.floor(difference / 2419200);
      return `${month} month ago`;
    } else {
      const year = Math.floor(difference / 31536000);
      return `${year} year ago`;
    }
  }

  // const hoverPlay = () => {
  //   videoRef.current.play()
  //   videoRef.current.control="true"
  // }

  // const hoverPause = () => {
  //   videoRef.current.pause();
  // };

  // const videoJsOptions = {
  //   controls: true,
  //   autoplay: false,
  //   preload: "auto",
  // };

  return (
    <div className="m-2">
      <a href="#">
        <div className="">
          <div className="">
            {/* <video
              id="my-player"
              className="video-js"
              autoPlay="false"
              preload="auto"
              poster={props.thumbnail}
              // data-setup="{}"
              ref={videoRef}
              onmouseover={hoverPlay}
              onmouseout={hoverPause}
            >
              <source
                src={props.videoFile}
                type="video/mp4"
              ></source>
              {/* <source
                src="//vjs.zencdn.net/v/oceans.webm"
                type="video/webm"
              ></source>
              <source
                src="//vjs.zencdn.net/v/oceans.ogv"
                type="video/ogg"
              ></source>
              <p class="vjs-no-js">
                To view this video please enable JavaScript, and consider
                upgrading to a web browser that
                <a
                  href="http://videojs.com/html5-video-support/"
                  target="_blank"
                >
                  supports HTML5 video
                </a>
              </p>
            </video> */}
            <VideoPlayer duration={props.videoDuration} options={videoJsOptions} />
          </div>

          <div className="flex gap-2 pt-3">
            <div className="w-1/6bg-yellow-300 flex">
              <img
                src={props.avatar}
                className="rounded-full w-10 h-10"
                alt={props.avatar}
              />
            </div>
            <div className="flex flex-wrap w-5/6 mx-1">
              <div className="flex w-full justify-between">
                <h1 className="text-xl font-semibold">{props.title}</h1>
                <SlOptionsVertical />
              </div>
              <h1 className="w-full text-base text-gray-600">{props.name}</h1>
              <h1 className="w-full text-base text-gray-600">
                {props.views} views {timeAgo(props.watchTime)}
              </h1>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

export default CardComp;
