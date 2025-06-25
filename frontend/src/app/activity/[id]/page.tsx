"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Users,
  ExternalLink,
  ArrowLeft,
  Share2,
  Gift,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ActivityDetailPage() {
  const params = useParams();
  const activityId = Number(params.id);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`http://localhost:5000/activities/${activityId}`);
        if (!res.ok) throw new Error(`Activity not found (status ${res.status})`);

        const data = await res.json();
        const organizerId = data.organizer?.id;

        if (organizerId) {
          const [organizerActivities] = await Promise.all([
            fetch(`http://localhost:5000/activities/organizer/${organizerId}`).then((r) => r.json())
          ]);

          data.organizer.totalActivities = organizerActivities.length;
        }

        setActivity(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch activity");
      } finally {
        setLoading(false);
      }
    }

    if (!isNaN(activityId)) {
      fetchData();
    } else {
      setError("Invalid activity ID");
      setLoading(false);
    }
  }, [activityId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-xl">
        Loading activity...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Error</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Activities
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: activity.title,
          text: `Check out this amazing activity: ${activity.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleJoinClick = (activityId: number) => async () => {
    try {
      const res = await fetch(`http://localhost:5000/activities/join/${activityId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to join activity (status ${res.status})`);
      }
    } catch (err) {
      console.error("Error joining activity:", err);
      alert("Failed to join activity. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="bg-white shadow-sm border-b-4 border-purple-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">BT</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">BrightTimes</h1>
            </div>
            <Link href="/">
              <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Activities
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white rounded-2xl shadow-lg border-2 border-purple-100 overflow-hidden">
              <div className="relative">
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full">
                    {activity.topic}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-white/90 border-purple-300 text-purple-700 px-3 py-1 rounded-full"
                  >
                    {activity.age_group}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/90 border-gray-200 hover:bg-white"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 text-gray-600" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{activity.title}</h1>
                    <div className="flex flex-wrap gap-2">
                      {activity.tags?.map((tag) => (
                        <Badge key={tag} variant="outline" className="border-purple-200 text-purple-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed">{activity.description}</p>
              </CardContent>
            </Card>

            {/* Materials Needed */}
            <Card className="bg-white rounded-2xl shadow-lg border-2 border-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold text-gray-800">
                  <Gift className="w-6 h-6 mr-3 text-purple-600" />
                  Materials Needed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activity.materials?.split(",").map((material, index) => (
                    <div key={index} className="flex items-center p-3 bg-purple-50 rounded-xl">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{material.trim()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="bg-white rounded-2xl shadow-lg border-2 border-purple-100 sticky top-4">
              <CardContent className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-3 text-purple-500" />
                    <div>
                      <div className="font-medium">{formatDate(activity.date)}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-5 h-5 mr-3 text-purple-500" />
                    <div>
                      <div className="font-medium">Start time: {activity.time}</div>
                      <div className="text-sm text-gray-500">Duration: {activity.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Users className="w-5 h-5 mr-3 text-purple-500" />
                    <div>
                      <div className="font-medium">{activity.age_group}</div>
                    </div>
                  </div>
                </div>

                <Button
                  asChild
                  onClick={handleJoinClick(activity.id)}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl text-base h-12 mb-3"
                >
                  <a 
                    href={activity.joinLink}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Join Activity Now
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card className="bg-white rounded-2xl shadow-lg border-2 border-purple-100">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800">Meet Your Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <img
                    src={
                      activity.organizer?.avatar_base64
                        ? activity.organizer.avatar_base64
                        : "/default-avatar.png"
                    }
                    alt={activity.organizer?.name || "Organizer"}
                    className="w-16 h-16 rounded-full border-2 border-purple-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{activity.organizer?.name}</h3>
                    <div className="flex items-center mb-2">
                      <span className="text-sm text-gray-500 ml-2">
                        {activity.organizer?.totalActivities} activities
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{activity.organizer?.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
