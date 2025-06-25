"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  ExternalLink,
  Filter,
  Clock,
  Info,
  Rocket,
} from "lucide-react";
import Link from "next/link";

const topics = [
  "All Topics",
  "Arts & Crafts",
  "Science",
  "Reading",
  "Math",
  "Music",
  "Technology",
];

const ageGroups = [
  "All Ages",
  "3-6 years",
  "4-8 years",
  "5-8 years",
  "6-10 years",
  "8-12 years",
  "8-14 years",
];

export default function HomePage() {
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("All Ages");

  const [activities, setActivities] = useState([]);
  const [topics, setTopics] = useState<string[]>(["All Topics"]);
  const [ageGroups, setAgeGroups] = useState<string[]>(["All Ages"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedTopic !== "All Topics") params.append("topic", selectedTopic);
        if (selectedAgeGroup !== "All Ages") params.append("age_group", selectedAgeGroup);

        const res = await fetch(`http://localhost:5000/activities?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch activities");

        const data = await res.json();
        setActivities(data);
      } catch (error) {
        console.error(error);
        setActivities([]);
      }
    };

    const fetchTopics = async () => {
      try {
        const res = await fetch("http://localhost:5000/activities/topics");

        if (!res.ok) throw new Error("Failed to fetch topics");

        const data = await res.json();
        data.unshift("All Topics"); 
        setTopics(data);

      } catch (error) {
        console.error("Error fetching topics:", error);
        setTopics([]);
      }
    }

    const fetchAgeGroups = async () => {
      try {
        const res = await fetch("http://localhost:5000/activities/age_groups");
        
        if (!res.ok) throw new Error("Failed to fetch age groups");

        const data = await res.json();
        data.unshift("All Ages");
        setAgeGroups(data);
      } catch (error) {
        console.error("Error fetching age groups:", error);
        setAgeGroups([]);
      }
    }

    fetchActivities();
    fetchTopics();
    fetchAgeGroups();
  }, [selectedTopic, selectedAgeGroup]);

  const parseIsraelDateTime = (dateStr: string, timeStr: string) => {
    return new Date(`${dateStr}T${timeStr}:00`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Jerusalem",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jerusalem",
    });
  };

  const handleJoinClick = (activityId: number) => async () => {
    try {
      const res = await fetch(`http://localhost:5000/activities/${activityId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to join activity");
      }
    } catch (error) {
      console.error("Error joining activity:", error);
    }
  };

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
            </div>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-2 rounded-full">
                For Organizers
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Fun Online Activities for Kids! 🎉
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover exciting virtual activities designed to engage, educate,
            and entertain children of all ages.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-purple-100">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-800">
              Find the Perfect Activity
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="w-full h-12 text-base border-2 border-purple-200 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg rounded-xl border border-purple-200">
                  {topics.map((topic) => (
                    <SelectItem
                      key={topic}
                      value={topic}
                      className="hover:bg-purple-100 focus:bg-purple-200 text-gray-900"
                    >
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age Group
              </label>
              <Select
                value={selectedAgeGroup}
                onValueChange={setSelectedAgeGroup}
              >
                <SelectTrigger className="w-full h-12 text-base border-2 border-purple-200 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg rounded-xl border border-purple-200">
                  {ageGroups.map((age) => (
                    <SelectItem
                      key={age}
                      value={age}
                      className="hover:bg-purple-100 focus:bg-purple-200 text-gray-900"
                    >
                      {age}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.length > 0 ? (
            activities.map((activity) => {
              const fullDate = parseIsraelDateTime(activity.date, activity.time);
              return (
                <Card
                  key={activity.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300 overflow-hidden p-0"
                >
                  <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-t-2xl pb-4 px-6 pt-4 m-0">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {activity.topic}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-purple-300 text-purple-700 px-3 py-1 rounded-full text-sm"
                      >
                        {activity.age_group}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800 leading-tight">
                      {activity.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="flex items-center text-gray-600 space-x-4 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-purple-500" />
                        <span className="text-sm font-medium">
                          {formatDate(activity.date)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-purple-500" />
                        <span className="text-sm font-medium">
                          {formatTime(fullDate)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600 mb-6">
                      <Users className="w-5 h-5 mr-3 text-purple-500" />
                      <span className="text-sm font-medium">
                        Led by <b>{activity.organizer?.username || "Unknown"}</b>
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        asChild
                        className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl text-base h-12"
                      >
                        <a
                          href={activity.joinLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center"
                          onClick={handleJoinClick(activity.id)}
                        >
                          <Rocket className="w-5 h-5 mr-2" />
                          Quick Join
                        </a>
                      </Button>
                      <Link href={`/activity/${activity.id}`}>
                        <Button
                          variant="outline"
                          className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold py-3 rounded-xl text-base h-12"
                        >
                          <Info className="w-5 h-5 mr-2" />
                          Show More Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-12 col-span-full">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                No activities found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters to see more activities.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
