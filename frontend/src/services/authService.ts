export const verifyToken = async (token: string) => {
  const response = await fetch("/api/auth/verify", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Invalid token");
  return await response.json();
};

export const refreshToken = async () => {
  const response = await fetch("/api/auth/refresh", { method: "POST" });
  if (!response.ok) throw new Error("Refresh token failed");

  const data = await response.json();
  return data.token;
};
