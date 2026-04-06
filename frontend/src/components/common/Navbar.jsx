import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Input, Button, Avatar, DropDown } from "../../components/ui/index";
import { ArrowLeft, Bell, LogOut, Menu, Monitor, Moon, Search, Settings, Sun, Upload, User, X } from "lucide-react";
import { logout } from "../../features/auth/authSlice";
import { logoutAllUser, logoutUser } from "../../apis/auth.api";
import { useAppearance } from "./useAppearacePanel";
import FileUpload from "../fileUpload/FileUpload";

function Navbar({ setCollapsed, setSidebarOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});
  const { settings, setSettings } = useAppearance();

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const theme = [
    { id: "light", label: "Light", icon: <Sun size={14} /> },
    { id: "dark", label: "Dark", icon: <Moon size={14} /> },
    { id: "system", label: "System", icon: <Monitor size={14} /> }
  ]

  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/?query=${search}`);
    setShowSearch(false);
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await logoutUser();

      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setLoggingOut(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      setLoggingOut(true);

      await logoutAllUser();

      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <>
      <header className="relative h-14 flex items-center px-3 sm:px-3 bg-(--surface) border-b border-(--border) backdrop-blur-md top-0 z-100">

        {/* 🔍 MOBILE SEARCH MODE */}
        {showSearch ? (
          <div className="flex items-center w-full gap-2">

            {/* Back / Close */}
            <Button
              variant="ghost"
              onClick={() => setShowSearch(false)}
              aria-label="Close search"
              className="
  hover:bg-(--surface2)
  transition
"
            >
              <ArrowLeft size={16} />
            </Button>

            {/* Input */}
            <div className="flex items-center flex-1 gap-2">
              <Input
                type="text"
                name="search_query_unique"
                autoComplete="off"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search"
                autoFocus
                className="bg-(--surface2)
                            border border-(--border)
                            focus:border-(--primary)"
              />
              <Button className="
  hover:bg-(--surface2)
  transition
" onClick={handleSearch}><Search size={16} /></Button>
            </div>
          </div>
        ) : (
          <>
            {/* 🔹 LEFT */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setSidebarOpen?.((prev) => !prev);
                    } else {
                      if (setCollapsed) {
                        setCollapsed((prev) => !prev);
                      } else {
                        setSidebarOpen?.((prev) => !prev);
                      }
                    }
                  }}
                  aria-label="Toggle sidebar"
                  className="
  hover:bg-(--surface2)
  transition
"
              >
                <Menu size={16} />
              </Button>

              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <div className="w-6 h-6 bg-(--primary) rounded" />
                <span className="hidden sm:block font-semibold">
                  MyTube
                </span>
              </div>
            </div>

            {/* 🔍 DESKTOP SEARCH (unchanged) */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-full max-w-150 max-lg:max-w-105">
              <div className="flex items-center gap-2 w-full">
                <Input
                  autoFocus
                  type="text"
                  name="mobile_search_unique"
                  autoComplete="off"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search..."
                    className="bg-(--surface2)
    border border-(--border)
    focus:border-(--primary)"
                />
                  <Button className="
  hover:bg-(--surface2)
  transition
" onClick={handleSearch}><Search size={16} /></Button>
              </div>
            </div>

            {/* 🔹 RIGHT */}
            <div className="flex items-center gap-1 sm:gap-2 ml-auto">

              {/* 🔍 MOBILE BUTTON */}
              <Button
                variant="ghost"
                className="md:hidden
  hover:bg-(--surface2)
  transition
"
                onClick={() => setShowSearch(true)}
                  aria-label="Open search"
                  
              >
                <Search size={16} />
              </Button>

              {/* ⬆️ */}
              <Button variant="ghost"
                onClick={() => setShowUpload(true)}
                  aria-label="Upload" className="
  hover:bg-(--surface2)
  transition
">
                <Upload size={16} />
              </Button>

              {/* 🔔 */}
                <Button className="
  hover:bg-(--surface2)
  transition
" variant="ghost"><Bell size={16} /></Button>

              {/* 👤 */}
              {user ? (
                <DropDown
                  trigger={<Avatar src={user.avatar} name={user.username} />}
                  align="right"
                >
                  {/* 👤 USER INFO */}
                  <DropDown.Label>
                    <div className="flex items-center gap-2">
                      <Avatar src={user.avatar} name={user.username} />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {user.fullname}
                        </span>
                        <span className="text-xs text-(--muted)">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </DropDown.Label>

                  <DropDown.Divider />

                  {/* 🚀 QUICK ACCESS */}
                  <DropDown.Item
                    icon={<User size={14} />}
                    onClick={() => navigate(`/channel/${user.username}`)}
                  >
                    Your Channel
                  </DropDown.Item>

                  <DropDown.Item
                    icon={<Upload size={14} />}
                    onClick={() => navigate("/uploads")}
                  >
                    Upload Video
                  </DropDown.Item>

                  <DropDown.Item
                    icon={<Settings size={14} />}
                    onClick={() => navigate("/settings")}
                  >
                    Settings
                  </DropDown.Item>

                  <DropDown.Divider />

                  {/* 🎨 APPEARANCE */}
                    <DropDown.Item>
                      <div className="flex flex-col gap-1 w-full">

                        <span className="text-(--muted) text-sm">Theme</span>

                        {theme.map((item) => (
                          <div
                            key={item.id}
                            onClick={() =>
                              setSettings((prev) => ({
                                ...prev,
                                theme: item.id,
                              }))
                            }
                            className={`
          flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer transition

          ${settings.theme === item.id
                                ? "bg-(--primary) text-white"
                                : "text-(--muted) hover:bg-(--surface2)"
                              }
        `}
                          >
                            {item.icon} {item.label}
                          </div>
                        ))}

                      </div>
                    </DropDown.Item>

                  <DropDown.Divider />

                  {/* 🔐 SESSION */}
                  <DropDown.Item
                    icon={<LogOut size={14} />}
                    variant="danger"
                    onClick={handleLogoutAll}
                    disabled={loggingOut}
                  >
                    {loggingOut ? "Logging out..." : "Logout all devices"}
                  </DropDown.Item>

                  <DropDown.Item
                    icon={<LogOut size={14} />}
                    variant="danger"
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    {loggingOut ? "Logging out..." : "Logout"}
                  </DropDown.Item>
                </DropDown>
              ) : (
                <Button onClick={() => navigate("/login")}>
                  Login
                </Button>
              )}
            </div>
          </>
        )}
      </header>

      {/* 🔍 MOBILE SEARCH OVERLAY */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-(--bg) p-4 flex items-start gap-2">
          <Input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search..."
          />

          <Button onClick={handleSearch}><Search size={16} /></Button>

          <Button
            variant="ghost"
            onClick={() => setShowSearch(false)}
            aria-label="Close search"
            className="
  hover:bg-(--surface2)
  transition
"
          >
            <X size={16} />
          </Button>
        </div>
      )}
      {showUpload && (
        <FileUpload onClose={() => setShowUpload(false)} />
      )}
    </>
  );
}

export default Navbar;