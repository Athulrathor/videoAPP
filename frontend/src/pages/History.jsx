import { useQuery } from "@tanstack/react-query";
import { getWatchHistory, clearWatchHistory } from "../apis/user.api";
import VideoCard from "../components/video/VideoCard";
import ShortCard from "../components/short/ShortCard";

function History() {
  const { data, refetch } = useQuery({
    queryKey: ["history"],
    queryFn: getWatchHistory,
  });

  const videos = data?.videos || [];
  const shorts = data?.shorts || [];

  const handleClear = async () => {
    await clearWatchHistory();
    await refetch();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Watch History</h1>
        <button onClick={handleClear}>Clear All</button>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Videos</h2>
        {videos.length === 0 ? (
          <p className="text-sm text-(--muted)">No watched videos yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Shorts</h2>
        {shorts.length === 0 ? (
          <p className="text-sm text-(--muted)">No watched shorts yet.</p>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {shorts.map((short) => (
              <ShortCard key={short._id} short={short} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default History;
