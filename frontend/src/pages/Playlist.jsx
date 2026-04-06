import { useParams } from "react-router-dom";
import VideoCard from "../components/video/VideoCard";
import { usePlaylist } from "../features/playlist/usePlaylist";

function Playlist() {
  const { id } = useParams();

  const { data, isLoading } = usePlaylist(id);
  
    if (isLoading) return <div>Loading...</div>;
  
    const playlist = data?.data?.playlist || [];

  return (
    <div>
      <h1 className="text-xl font-bold">
        {playlist?.name}
      </h1>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {playlist?.videos?.map((v) => (
          <VideoCard key={v._id} video={v} />
        ))}
      </div>
    </div>
  );
}

export default Playlist;