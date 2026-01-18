export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    alert("Browser notifications qo‘llab-quvvatlanmaydi");
    return false;
  }

  if (Notification.permission === "granted") return true;

  if (Notification.permission === "denied") return false;

  const permission = await Notification.requestPermission();
  return permission === "granted";
};

export const showBrowserNotification = (
  title: string,
  options?: NotificationOptions,
) => {
  if (Notification.permission === "granted") {
    new Notification(title, options);
  }
};
