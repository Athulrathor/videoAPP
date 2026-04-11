import { Link } from "react-router-dom";

function ShortCard({ short }) {
  if (!short) return null;

  return (
    <Link to="/shorts" className="block">
      <div className="w-full cursor-pointer">
        <div className="aspect-9/16 w-full overflow-hidden rounded-lg bg-(--surface2)">
          {short.thumbnail ? (
            <img
              src={short.thumbnail}
              alt={short.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <video
              src={short.shortUrl}
              className="h-full w-full object-cover"
              muted
              playsInline
            />
          )}
        </div>

        <div className="mt-2">
          <h3 className="line-clamp-1 text-sm font-semibold">
            {short.title}
          </h3>
          <p className="text-xs text-(--muted)">
            @{short.owner?.username || "unknown"}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ShortCard;
