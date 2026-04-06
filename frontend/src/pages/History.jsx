import { useQuery } from "@tanstack/react-query";
import { getHistory, clearHistory } from "../apis/user.api";
import VideoCard from "../components/video/VideoCard";

function History() {
  const { data, refetch } = useQuery({
    queryKey: ["history"],
    queryFn: getHistory,
  });

  const videos = data?.data || [];

  const handleClear = async () => {
    await clearHistory();
    refetch();
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Watch History</h1>
        <button onClick={handleClear}>Clear All</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {videos.map((v) => (
          <VideoCard key={v._id} video={v.video} />
        ))}
      </div>
    </div>
  );
}

export default History;