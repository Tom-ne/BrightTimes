"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, ExternalLink, Filter } from "lucide-react";
import Link from "next/link";

// Mock data for activities
const activities = [
  {
    id: 1,
    title: "Creative Art Workshop",
    topic: "Arts & Crafts",
    ageGroup: "5-8 years",
    date: "2024-01-15",
    time: "10:00 AM",
    joinLink: "https://zoom.us/j/123456789",
    organizer: "Ms. Sarah",
  },
  {
    id: 2,
    title: "Science Experiments Fun",
    topic: "Science",
    ageGroup: "8-12 years",
    date: "2024-01-16",
    time: "2:00 PM",
    joinLink: "https://zoom.us/j/987654321",
    organizer: "Dr. Mike",
  },
  {
    id: 3,
    title: "Story Time Adventure",
    topic: "Reading",
    ageGroup: "3-6 years",
    date: "2024-01-17",
    time: "11:00 AM",
    joinLink: "https://zoom.us/j/456789123",
    organizer: "Ms. Emma",
  },
  {
    id: 4,
    title: "Math Games & Puzzles",
    topic: "Math",
    ageGroup: "6-10 years",
    date: "2024-01-18",
    time: "3:00 PM",
    joinLink: "https://zoom.us/j/789123456",
    organizer: "Mr. John",
  },
  {
    id: 5,
    title: "Music & Movement",
    topic: "Music",
    ageGroup: "4-8 years",
    date: "2024-01-19",
    time: "1:00 PM",
    joinLink: "https://zoom.us/j/321654987",
    organizer: "Ms. Lisa",
  },
  {
    id: 6,
    title: "Coding for Kids",
    topic: "Technology",
    ageGroup: "8-14 years",
    date: "2024-01-20",
    time: "4:00 PM",
    joinLink: "https://zoom.us/j/654987321",
    organizer: "Mr. Alex",
  },
];

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
const times = ["All Times", "Morning", "Afternoon", "Evening"];

export default function HomePage() {
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("All Ages");
  const [selectedTime, setSelectedTime] = useState("All Times");

  const filteredActivities = activities.filter((activity) => {
    const topicMatch =
      selectedTopic === "All Topics" || activity.topic === selectedTopic;
    const ageMatch =
      selectedAgeGroup === "All Ages" || activity.ageGroup === selectedAgeGroup;

    let timeMatch = true;
    if (selectedTime !== "All Times") {
      const hour = Number.parseInt(activity.time.split(":")[0]);
      const isPM = activity.time.includes("PM");
      const hour24 =
        isPM && hour !== 12 ? hour + 12 : !isPM && hour === 12 ? 0 : hour;

      if (selectedTime === "Morning") timeMatch = hour24 < 12;
      else if (selectedTime === "Afternoon")
        timeMatch = hour24 >= 12 && hour24 < 17;
      else if (selectedTime === "Evening") timeMatch = hour24 >= 17;
    }

    return topicMatch && ageMatch && timeMatch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-purple-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger className="w-full h-12 text-base border-2 border-purple-200 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg rounded-xl border border-purple-200">
                  {times.map((time) => (
                    <SelectItem
                      key={time}
                      value={time}
                      className="hover:bg-purple-100 focus:bg-purple-200 text-gray-900"
                    >
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
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
                    {activity.ageGroup}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-gray-800 leading-tight">
                  {activity.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3 text-purple-500" />
                    <span className="text-sm font-medium">
                      {formatDate(activity.date)}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-3 text-purple-500" />
                    <span className="text-sm font-medium">{activity.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-3 text-purple-500" />
                    <span className="text-sm font-medium">
                      Led by {activity.organizer}
                    </span>
                  </div>
                </div>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl text-base h-12"
                >
                  <a
                    href={activity.joinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Join Activity
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No activities found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters to see more activities.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      {/* <footer className="bg-white border-t-4 border-purple-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">© 2024 BrightTimes. Making learning fun for children everywhere! 🌟</p>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
