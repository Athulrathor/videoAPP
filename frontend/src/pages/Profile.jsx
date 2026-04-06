import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  Camera,
  ImagePlus,
  MoreVertical,
  Bell,
  UserRoundPen,
  ShieldAlert,
  LogOut,
  Check,
} from "lucide-react";

import { getChannelProfile, updateAvatar, updateCoverImage } from "../apis/user.api";
import { getUserVideos } from "../apis/video.api";
import { getUserShorts } from "../apis/short.api";
import { useSubscribe } from "../features/subscribe/useSubscribe";
import { updateAvatarRedux, updateCoverImageRedux } from "../features/auth/authSlice";
import VideoCard from "../components/video/VideoCard";
import ShortCard from "../components/short/ShortCard";
import { Avatar, Button, Card, DropDown } from "../components/ui";
import IconButton from "../components/ui/IconButton";
import { useUpload } from "../hooks/useUpload";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth?.user);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [isSubscribedLocal, setIsSubscribedLocal] = useState(null);

  const { mutate: toggleSubscribe, isPending: subscribePending } = useSubscribe();

  const {
    uploadFile,
    progress,
    isUploading,
    error,
  } = useUpload();

  const {
    data: channelQuery,
    isLoading: channelLoading,
    refetch,
  } = useQuery({
    queryKey: ["channelProfile", username],
    queryFn: () => getChannelProfile(username),
    enabled: !!username,
  });

  const channel = channelQuery?.data || channelQuery;

  const isOwnProfile = useMemo(() => {
    if (!authUser?._id || !channel?._id) return false;
    return authUser._id === channel._id;
  }, [authUser, channel]);

  const isSubscribed =
    isSubscribedLocal !== null ? isSubscribedLocal : !!channel?.isSubscribed;

  const { data: videosRes, isLoading: videosLoading } = useQuery({
    queryKey: ["userVideos", channel?._id],
    queryFn: () => getUserVideos(channel._id),
    enabled: !!channel?._id,
  });

  const { data: shortsRes, isLoading: shortsLoading } = useQuery({
    queryKey: ["userShorts", channel?._id],
    queryFn: () => getUserShorts(channel._id),
    enabled: !!channel?._id,
  });

  const videos = videosRes?.data?.videos || videosRes?.data?.data || videosRes?.videos || [];
  const shorts = shortsRes?.data?.shorts || shortsRes?.data?.data || shortsRes?.shorts || [];

  const watchHistoryVideos = channel?.watchHistory?.videos || [];
  const watchHistoryShorts = channel?.watchHistory?.shorts || [];

  const handleToggleSubscribe = () => {
    if (!channel?._id) return;

    setIsSubscribedLocal((prev) =>
      prev === null ? !channel.isSubscribed : !prev
    );

    toggleSubscribe(channel._id);
  };

  const handleAvatarPicker = () => avatarInputRef.current?.click();
  const handleCoverPicker = () => coverInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploaded = await uploadFile(file, "avatar");
      const url = uploaded?.url || uploaded?.secure_url;
      const public_id = uploaded?.publicId || uploaded?.public_id;

      if (!url || !public_id) {
        throw new Error("Upload response missing url or public_id");
      }

      await dispatch(updateAvatarRedux(url));
      await updateAvatar({ url, public_id });
      await refetch();
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      e.target.value = "";
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploaded = await uploadFile(file, "cover");
      const url = uploaded?.url || uploaded?.secure_url;
      const public_id = uploaded?.publicId || uploaded?.public_id;

      if (!url || !public_id) {
        throw new Error("Upload response missing url or public_id");
      }

      await dispatch(updateCoverImageRedux(url));
      await updateCoverImage({ url, public_id });
      await refetch();
    } catch (err) {
      console.error("Cover upload failed:", err.message);
    } finally {
      e.target.value = "";
    }
  };

  const handleEditProfile = () => {
    console.log("Edit profile");
  };

  if (channelLoading) {
    return <div className="p-6 text-(--muted)">Loading profile...</div>;
  }

  if (!channel) {
    return <div className="p-6 text-(--muted)">Profile not found.</div>;
  }

  return (
    <div className="min-h-screen bg-(--bg) text-(--text)">
      <div className="w-full h-56 md:h-72 lg:h-80 bg-(--surface2) relative overflow-hidden">
        {channel.coverImage ? (
          <img
            src={channel.coverImage}
            alt={channel.username}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-(--surface2)" />
        )}

        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverChange}
        />

        {isOwnProfile && (
          <div className="absolute right-4 top-4">
            <IconButton
              label="Update cover image"
              icon={<ImagePlus size={18} />}
              variant="soft"
              className="backdrop-blur-sm"
              onClick={handleCoverPicker}
            >
              <span className="hidden sm:inline">
                {isUploading ? "Uploading..." : "Update cover"}
              </span>
            </IconButton>
          </div>
        )}
      </div>

      <div className="container -mt-12 md:-mt-16 relative z-10">
        <Card className="p-4 md:p-6 rounded-(--radius-xl) shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-5">
            <div className="relative w-fit">
              <Avatar
                src={channel.avatar}
                name={channel.fullname || channel.username}
                size={120}
              />

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />

              {isOwnProfile && (
                <div className="absolute bottom-1 right-1">
                  <IconButton
                    label="Update avatar"
                    icon={<Camera size={16} />}
                    variant="primary"
                    className="h-9 min-w-9 rounded-full px-0"
                    onClick={handleAvatarPicker}
                  />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1>{channel.fullname}</h1>
              <p className="text-(--muted)">@{channel.username}</p>
              <p className="text-(--muted) text-sm mt-1">{channel.email}</p>

              <div className="flex flex-wrap gap-3 mt-3 text-sm text-(--muted)">
                <span>{channel.subscriberCount || 0} subscribers</span>
                {/* <span>{channel.channelsSubscribedToCount || 0} following</span> */}
                <span>{channel.videosCount || 0} videos</span>
                <span>{channel.shortsCount || 0} shorts</span>
              </div>

              {(isUploading || progress > 0) && (
                <p className="text-sm text-(--primary) mt-2">
                  Uploading... {progress || 0}%
                </p>
              )}

              {error && (
                <p className="text-sm text-(--danger) mt-2">
                  {String(error)}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 self-start lg:self-center">
              {isOwnProfile ? (
                <>
                  <Button
                    variant="secondary"
                    className="inline-flex items-center gap-2"
                    onClick={handleEditProfile}
                  >
                    Subscribe
                  </Button>

                  <DropDown
                    align="right"
                    trigger={
                      <IconButton
                        label="More options"
                        icon={<MoreVertical size={18} />}
                        variant="soft"
                      />
                    }
                  >
                    <DropDown.Label>Profile</DropDown.Label>
                    <DropDown.Item
                      icon={<UserRoundPen size={16} />}
                      onClick={handleEditProfile}
                    >
                      Edit profile
                    </DropDown.Item>
                    <DropDown.Item
                      icon={<Camera size={16} />}
                      onClick={handleAvatarPicker}
                    >
                      Change avatar
                    </DropDown.Item>
                    <DropDown.Item
                      icon={<ImagePlus size={16} />}
                      onClick={handleCoverPicker}
                    >
                      Change cover image
                    </DropDown.Item>
                    <DropDown.Divider />
                    <DropDown.Item
                      variant="danger"
                      icon={<ShieldAlert size={16} />}
                      onClick={() => console.log("Privacy settings")}
                    >
                      Privacy settings
                    </DropDown.Item>
                  </DropDown>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleToggleSubscribe}
                    disabled={subscribePending}
                    variant={isSubscribed ? "secondary" : "primary"}
                    className="inline-flex items-center gap-2"
                  >
                    {isSubscribed && <Check size={16} />}
                    {isSubscribed ? "Subscribed" : "Subscribe"}
                  </Button>

                  <IconButton
                    label="Notifications"
                    icon={<Bell size={18} />}
                    variant="soft"
                    onClick={() => console.log("Notification options")}
                  />

                  <DropDown
                    align="right"
                    trigger={
                      <IconButton
                        label="More options"
                        icon={<MoreVertical size={18} />}
                        variant="soft"
                      />
                    }
                  >
                    <DropDown.Label>Channel</DropDown.Label>
                    <DropDown.Item
                      icon={<Bell size={16} />}
                      onClick={() => console.log("Manage notifications")}
                    >
                      Notification settings
                    </DropDown.Item>
                    <DropDown.Item
                      icon={<LogOut size={16} />}
                      onClick={() => console.log("Report channel")}
                    >
                      Report channel
                    </DropDown.Item>
                  </DropDown>
                </>
              )}
            </div>
          </div>
        </Card>

        <div className="mt-10">
          <h2 className="mb-4">Videos</h2>
          {videosLoading ? (
            <p className="text-(--muted)">Loading videos...</p>
          ) : videos.length === 0 ? (
            <p className="text-(--muted)">No videos found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {videos.map((video) => (
                <div key={video._id} className="animate-fade-up">
                  <VideoCard video={video} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12">
          <h2 className="mb-4">Shorts</h2>
          {shortsLoading ? (
            <p className="text-(--muted)">Loading shorts...</p>
          ) : shorts.length === 0 ? (
            <p className="text-(--muted)">No shorts found.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[].map((short) => (
                <div key={short._id} className="animate-fade-up">
                  <ShortCard short={short} />
                </div>
              ))}
            </div>
          )}
        </div>

        {isOwnProfile && (
          <div className="mt-12 pb-12">
            <h2 className="mb-4">Watch History</h2>

            <div className="mb-8">
              <h3 className="mb-3">Watched Videos</h3>
              {watchHistoryVideos.length === 0 ? (
                <p className="text-(--muted)">No watched videos.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {watchHistoryVideos.map((video) => (
                    <VideoCard key={video._id} video={video} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="mb-3">Watched Shorts</h3>
              {watchHistoryShorts.length === 0 ? (
                <p className="text-(--muted)">No watched shorts.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {watchHistoryShorts.map((short) => (
                    <ShortCard key={short._id} short={short} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;