"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Users,
  Edit,
  Trash2,
  Plus,
  LogOut,
  User,
} from "lucide-react";
import { fetchWithAuth } from "@/lib/api";
import { useRouter } from "next/navigation";

// ... (imports)

export default function DashboardPage() {
  // ... (state variables)
  const router = useRouter();

  useEffect(() => {
    // ...

    async function fetchActivities() {
      try {
        const res = await fetchWithAuth("http://localhost:5000/activities/mine");

        if (!res.ok) {
          throw new Error(`Failed to fetch activities: ${res.statusText}`);
        }

        const data = await res.json();
        setActivities(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;

    try {
      const res = await fetchWithAuth(`http://localhost:5000/activities/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Failed to delete activity: ${res.statusText}`);
      }

      setActivities(activities.filter((activity) => activity.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete activity");
    }
  };

  const handleSignOut = async () => {
    try {
      await fetchWithAuth("http://localhost:5000/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("username");
      router.push("/");
    }
  };

  // ... (JSX)

              <Button
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>

  // ... (rest of JSX)
