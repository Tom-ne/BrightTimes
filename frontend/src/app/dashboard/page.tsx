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
import Link from "next/link";

export default function DashboardPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);

    async function fetchActivities() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/activities/mine", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include",
        });

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

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this activity?")) {
      setActivities(activities.filter((activity) => activity.id !== id));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-600">
        Loading activities...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-purple-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">BT</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">BrightTimes</h1>
              <Badge className="bg-purple-100 text-purple-700 ml-2">
                Organizer
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                {username ? `Welcome, ${username}!` : "Welcome!"}
              </span>
              <Link href="/dashboard/profile">
                <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Your Activities
            </h2>
            <p className="text-gray-600">
              Manage and organize your online activities for kids
            </p>
          </div>
          <Link href="/dashboard/add-activity">
            <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-xl text-base mt-4 sm:mt-0">
              <Plus className="w-5 h-5 mr-2" />
              Add Activity
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Total Activities
                  </p>
                  <p className="text-3xl font-bold">{activities.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Join button clicked
                  </p>
                  <p className="text-3xl font-bold">
                    {activities.reduce(
                      (sum, activity) => sum + (activity.total_times_join_pressed || 0),
                      0
                    )}
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">
                    This Week
                  </p>
                  <p className="text-3xl font-bold">{activities.length}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activities List */}
        <div className="space-y-6">
          {activities.map((activity) => (
            <Card
              key={activity.id}
              className="bg-white rounded-2xl shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {activity.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full">
                            {activity.topic}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-purple-300 text-purple-700 px-3 py-1 rounded-full"
                          >
                            {activity.age_group}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                        <span>{formatDate(activity.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-purple-500" />
                        <span>{activity.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2 text-purple-500" />
                        <span>{activity.total_times_join_pressed || 0} Times join clicked</span>
                      </div>
                    </div>
                  </div>
                  {!activity.isPast && (
                    <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                      <Link href={`/dashboard/edit-activity/${activity.id}`}>
                        <Button
                          variant="outline"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl"
                        onClick={() => handleDelete(activity.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No activities yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first activity to get started!
            </p>
            <Link href="/dashboard/add-activity">
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-xl">
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Activity
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
