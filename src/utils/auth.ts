// utils/auth.ts
export type Role = "admin" | "user";

export const requireAdmin = () => {
  const userId = localStorage.getItem("user");

  if (!userId) {
    throw new Response("Unauthorized", {
      status: 302,
      headers: { Location: "/login" },
    });
  }

  return null;
};
