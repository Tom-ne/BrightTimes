import { redirect } from 'next/navigation';

const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    return null;
  }

  try {
    const res = await fetch("http://localhost:5000/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${refreshToken}`,
      },
    });

    if (!res.ok) {
      // If refresh fails, redirect to login
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("username");
      redirect("/login");
      return null;
    }

    const data = await res.json();
    localStorage.setItem("access_token", data.access_token);
    return data.access_token;
  } catch (error) {
    console.error("Refresh token error:", error);
    return null;
  }
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  let accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    redirect("/login");
    return;
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  if (res.status === 401) {
    const newAccessToken = await refreshToken();
    if (newAccessToken) {
      // Retry the request with the new token
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          "Authorization": `Bearer ${newAccessToken}`,
        },
      });
    }
  }

  return res;
};