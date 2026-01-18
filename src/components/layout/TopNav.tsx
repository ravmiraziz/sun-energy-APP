import React, { useState } from "react";
import { Bell, X } from "lucide-react";
import { MdNotifications, MdSearch } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

const TopNav: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  const handleNotificationClick = async () => {
    // Browser notification permission so'rash
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        // Ruxsat berilgan bo'lsa, notification ko'rsatish
        sendNotification();
      } else if (Notification.permission !== "denied") {
        // Permission so'rash
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          sendNotification();
        }
      }
    } else {
      alert("Browser notification qo'llab-quvvatlanmaydi");
    }

    setShowNotificationPanel(!showNotificationPanel);
  };

  const sendNotification = () => {
    const messages = [
      "Yangi order keldi! 🎯",
      "Data synchronized ✓",
      "System update available 📦",
      "New user joined 👤",
      "Report ready for download 📊",
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // Browser notification
    new Notification("Notification", {
      body: randomMessage,
      icon: "https://picsum.photos/100/100?random=1",
      tag: "notification-" + Date.now(),
    });

    // Panel ga ham qo'shish
    const newNotification = `${randomMessage} - ${new Date().toLocaleTimeString()}`;
    setNotifications((prev) => [newNotification, ...prev].slice(0, 10));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <header className="h-16 border-b border_color flex items-center justify-between px-8 sticky top-0 bg_card backdrop-blur-md z-30 transition-colors">
        <div className="flex items-center gap-4 w-1/3">
          <label className="relative flex-1 max-w-sm">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
            <input
              className="w-full card_btn border-none rounded-xl pl-10 pr-4 py-2 text-sm"
              placeholder="Search data, nodes, or orders..."
              type="text"
            />
          </label>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={handleNotificationClick}
              className="size-10 flex items-center justify-center rounded-xl card_btn text-slate-600 dark:text-slate-400 relative hover:text-primary transition-colors"
            >
              <MdNotifications className="text-[22px]" />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            {showNotificationPanel && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <h3 className="font-bold text-sm">Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-xs text-blue-500 hover:text-blue-600"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="mx-auto text-4xl text-slate-300 dark:text-slate-600 mb-2" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        No notifications yet
                      </p>
                    </div>
                  ) : (
                    notifications.map((notif, index) => (
                      <div
                        key={index}
                        className="p-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-start gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            {notif}
                          </p>
                        </div>
                        <button
                          onClick={() => removeNotification(index)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-border-teal"></div>

          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="hidden lg:block text-right">
              <p className="text-sm font-bold leading-none group-hover:text-primary transition-colors">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mt-1">
                {user?.phone}
              </p>
            </div>
            <div className="bg-center bg-no-repeat aspect-square bg-cover overflow-hidden rounded-full size-10 border-2 border-primary/20 group-hover:border-primary transition-all">
              <img src={user?.image_url} alt="avatar" />
            </div>
          </div>
        </div>
      </header>
      {showNotificationPanel && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotificationPanel(false)}
        />
      )}
    </>
  );
};

export default TopNav;
