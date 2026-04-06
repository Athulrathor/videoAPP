import VideoPlayer from "./VideoPlayer";

function VideoSection({ video }) {
    return (
        <div className="">
            <VideoPlayer src={video?.videoUrl} thumbnail={video?.thumbnail} />
        </div>
    );
}

export default VideoSection;