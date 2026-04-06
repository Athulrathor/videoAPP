// import { useEffect, useRef } from "react";
import { useShorts } from "../features/short/useShorts";

function Shorts() {
  const { data, isLoading } = useShorts();

  if (isLoading) return <div>Loading...</div>;

  const shorts = data?.data?.shorts || [];

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {shorts.map((short) => (
        <div
          key={short._id}
          className="h-screen flex justify-center items-center snap-start"
        >
          <video
            src={short.shortUrl}
            className="h-full"
            autoPlay
            loop
            controls
          />
        </div>
      ))}
    </div>
  );
}

export default Shorts;