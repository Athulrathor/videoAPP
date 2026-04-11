import { useCreatePlaylist, useDeletePlaylist, useUpdatePlaylist, useUserPlaylists } from "../features/playlist/usePlaylist";
import { useState } from "react";
import { useSelector } from "react-redux";
import PlaylistCard from "../components/playlist/PlaylistCard";
import { Globe, Link2, Lock, X, Plus } from "lucide-react";
import { Button } from "../components/ui/index";

function PrivacyOption({ value, label }) {
  return (
    <option value={value}>
      {label}
    </option>
  );
}

function CreatePlaylistModal({ open, onClose }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    privacy: "public",
  });

  const { mutate, isPending } = useCreatePlaylist();

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate(form, {
      onSuccess: () => {
        setForm({ title: "", description: "", privacy: "public" });
        onClose?.();
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-playlist-title"
    >
      <div className="flex min-h-dvh items-end justify-center p-0 sm:items-center sm:p-4">
        <div className="w-full max-w-lg overflow-hidden rounded-t-3xl border border-(--border) bg-(--surface) shadow-2xl sm:rounded-3xl">
          <div className="flex items-center justify-between border-b border-(--border) px-4 py-4 sm:px-6">
            <div>
              <h2 id="create-playlist-title" className="text-base font-semibold sm:text-lg">
                Create playlist
              </h2>
              <p className="mt-1 text-xs text-(--muted) sm:text-sm">
                Save videos and organize them your way
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="h-10 w-10 rounded-full text-(--muted)"
              aria-label="Close create playlist modal"
            >
              <X size={18} absoluteStrokeWidth />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="max-h-[85dvh] overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="playlist-title" className="mb-2 block text-sm font-medium">
                  Title
                </label>
                <input
                  id="playlist-title"
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="My watch later"
                  required
                  maxLength={100}
                  className="w-full rounded-2xl border border-(--border) bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-(--muted) focus:border-(--primary)"
                />
              </div>

              <div>
                <label htmlFor="playlist-description" className="mb-2 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="playlist-description"
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Add a short note about this playlist"
                  rows={5}
                  maxLength={300}
                  className="w-full resize-none rounded-2xl border border-(--border) bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-(--muted) focus:border-(--primary)"
                />
                <p className="mt-1 text-right text-xs text-(--muted)">
                  {form.description.length}/300
                </p>
              </div>

              <div>
                <label htmlFor="playlist-privacy" className="mb-2 block text-sm font-medium">
                  Privacy
                </label>
                <select
                  id="playlist-privacy"
                  value={form.privacy}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, privacy: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-(--border) bg-transparent px-4 py-3 text-sm outline-none transition focus:border-(--primary)"
                >
                  <PrivacyOption value="public" label="Public" icon={Globe} />
                  <PrivacyOption value="private" label="Private" icon={Lock} />
                  <PrivacyOption value="unlisted" label="Unlisted" icon={Link2} />
                </select>

                <p className="mt-2 text-xs text-(--muted)">
                  Public playlists are visible to everyone. Private playlists are only visible to you.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-(--border) pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="h-11 rounded-2xl px-4"
              >
                Cancel
              </Button>

              <button
                type="submit"
                disabled={isPending || !form.title.trim()}
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-(--primary) px-5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Creating..." : "Create playlist"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function UpdatePlaylistModal({ open, onClose, playlist }) {
  const [form, setForm] = useState(() => ({
    title: playlist?.title || "",
    description: playlist?.description || "",
    privacy: playlist?.privacy || "public",
  }));

  const { mutate, isPending } = useUpdatePlaylist();

  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!playlist?._id || !form.title.trim()) return;

    mutate(
      {
        playlistId: playlist._id,
        data: {
          title: form.title.trim(),
          description: form.description.trim(),
          privacy: form.privacy,
        },
      },
      {
        onSuccess: () => onClose?.(),
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-playlist-title"
    >
      <div className="flex min-h-dvh items-end justify-center p-0 sm:items-center sm:p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg overflow-hidden rounded-t-3xl border border-(--border) bg-(--surface) shadow-2xl sm:rounded-3xl"
        >
          <div className="flex items-center justify-between border-b border-(--border) px-4 py-4 sm:px-6">
            <div>
              <h2 id="update-playlist-title" className="text-base font-semibold sm:text-lg">
                Update playlist
              </h2>
              <p className="mt-1 text-xs text-(--muted) sm:text-sm">
                Keep this playlist current
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="h-10 w-10 rounded-full text-(--muted)"
              aria-label="Close update playlist modal"
            >
              <X size={18} absoluteStrokeWidth />
            </Button>
          </div>

          <div className="max-h-[85dvh] space-y-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
            <div>
              <label htmlFor="update-playlist-title-input" className="mb-2 block text-sm font-medium">
                Title
              </label>
              <input
                id="update-playlist-title-input"
                type="text"
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="My watch later"
                required
                maxLength={100}
                className="w-full rounded-2xl border border-(--border) bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-(--muted) focus:border-(--primary)"
              />
            </div>

            <div>
              <label htmlFor="update-playlist-description" className="mb-2 block text-sm font-medium">
                Description
              </label>
              <textarea
                id="update-playlist-description"
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, description: event.target.value }))
                }
                placeholder="Add a short note about this playlist"
                rows={5}
                maxLength={300}
                className="w-full resize-none rounded-2xl border border-(--border) bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-(--muted) focus:border-(--primary)"
              />
              <p className="mt-1 text-right text-xs text-(--muted)">
                {form.description.length}/300
              </p>
            </div>

            <div>
              <label htmlFor="update-playlist-privacy" className="mb-2 block text-sm font-medium">
                Privacy
              </label>
              <select
                id="update-playlist-privacy"
                value={form.privacy}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, privacy: event.target.value }))
                }
                className="w-full rounded-2xl border border-(--border) bg-transparent px-4 py-3 text-sm outline-none transition focus:border-(--primary)"
              >
                <PrivacyOption value="public" label="Public" icon={Globe} />
                <PrivacyOption value="private" label="Private" icon={Lock} />
                <PrivacyOption value="unlisted" label="Unlisted" icon={Link2} />
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-(--border) px-4 py-4 sm:px-6">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !form.title.trim()}>
              {isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UserPlaylists() {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const { data: playlists = [], isLoading } = useUserPlaylists(user?._id);
  const { mutate: deletePlaylist, isPending: isDeleting } = useDeletePlaylist();

  const openUpdateModal = (playlist) => {
    setSelectedPlaylist(playlist);
  };

  const closeUpdateModal = () => {
    setSelectedPlaylist(null);
  };

  const handleDeletePlaylist = (playlistId) => {
    deletePlaylist(playlistId);
  };

  if (isLoading) {
    return (
      <div className="container py-6 sm:py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-40 rounded-lg bg-(--surface2)" />
            <div className="h-4 w-64 rounded-lg bg-(--surface2)" />
          </div>
          <div className="h-11 w-32 rounded-2xl bg-(--surface2)" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl border border-(--border) bg-(--surface)"
            >
              <div className="aspect-video bg-(--surface2)" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-3/4 rounded bg-(--surface2)" />
                <div className="h-4 w-full rounded bg-(--surface2)" />
                <div className="h-4 w-2/3 rounded bg-(--surface2)" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container py-6 sm:py-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Your playlists
            </h1>
            <p className="mt-2 text-sm text-(--muted) sm:text-base">
              Organize videos into collections you can revisit anytime.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-(--primary) px-4 text-sm font-medium text-white transition hover:opacity-95 active:scale-[0.99] sm:h-12 sm:px-5"
            aria-label="Create new playlist"
          >
            <Plus size={18} />
            <span>New playlist</span>
          </button>
        </div>

        {!playlists.length ? (
          <div className="rounded-3xl border border-dashed border-(--border) bg-(--surface) px-6 py-12 text-center sm:px-10 sm:py-16">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-(--surface2) sm:h-16 sm:w-16">
              <Plus size={22} className="text-(--muted)" />
            </div>

            <h2 className="mt-4 text-lg font-semibold sm:text-xl">
              No playlists yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-(--muted) sm:text-base">
              Create your first playlist to save favorite videos, organize learning
              content, or build a watch-later queue.
            </p>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-(--primary) px-5 text-sm font-medium text-white"
            >
              Create playlist
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist._id}
                playlist={playlist}
                onDelete={handleDeletePlaylist}
                onUpdate={openUpdateModal}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        )}
      </div>

      <CreatePlaylistModal open={open} onClose={() => setOpen(false)} />
      <UpdatePlaylistModal
        key={selectedPlaylist?._id || "update-playlist"}
        open={!!selectedPlaylist}
        onClose={closeUpdateModal}
        playlist={selectedPlaylist}
      />
    </>
  );
}

export default UserPlaylists;
