import VideoPlayer from "./VideoPlayer";

function VideoSection({ video }) {
    return (
        <div className="">
            <VideoPlayer src={video?.videoUrl} thumbnail={video?.thumbnail} videoId={video?._id} />
        </div>
    );
}

export default VideoSection;