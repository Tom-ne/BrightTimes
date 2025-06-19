"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  Users,
  ExternalLink,
  ArrowLeft,
  MapPin,
  Star,
  Heart,
  Share2,
  Target,
  Gift,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Extended mock data with more details
const activitiesData = {
  1: {
    id: 1,
    title: "Creative Art Workshop",
    topic: "Arts & Crafts",
    ageGroup: "5-8 years",
    date: "2024-01-15",
    time: "10:00 AM",
    duration: "60 minutes",
    joinLink: "https://zoom.us/j/123456789",
    organizer: {
      name: "Ms. Sarah",
      bio: "Professional art teacher with 10+ years of experience working with children",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4.9,
      totalActivities: 45,
    },
    description:
      "Join us for an exciting art adventure! In this hands-on workshop, children will explore their creativity through watercolor painting, learning basic techniques while creating their own masterpiece. We'll cover color mixing, brush techniques, and composition in a fun, supportive environment.",
    whatYoullLearn: [
      "Basic watercolor painting techniques",
      "Color theory and mixing",
      "Creative composition skills",
      "Self-expression through art",
    ],
    materialsNeeded: [
      "Watercolor paints (basic set)",
      "Watercolor paper or thick white paper",
      "Paint brushes (various sizes)",
      "Water containers",
      "Paper towels or cloth",
    ],
    maxParticipants: 15,
    currentParticipants: 12,
    difficulty: "Beginner",
    tags: ["Creative", "Painting", "Art", "Interactive"],
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
  },
  2: {
    id: 2,
    title: "Science Experiments Fun",
    topic: "Science",
    ageGroup: "8-12 years",
    date: "2024-01-16",
    time: "2:00 PM",
    duration: "75 minutes",
    joinLink: "https://zoom.us/j/987654321",
    organizer: {
      name: "Dr. Mike",
      bio: "PhD in Chemistry, passionate about making science fun and accessible for kids",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4.8,
      totalActivities: 32,
    },
    description:
      "Get ready for amazing science experiments you can do at home! We'll explore fascinating chemical reactions, learn about states of matter, and discover the magic of science through safe, exciting experiments that will amaze and educate.",
    whatYoullLearn: [
      "Basic chemistry principles",
      "Scientific method and observation",
      "States of matter",
      "Chemical reactions and their effects",
    ],
    materialsNeeded: [
      "Baking soda",
      "White vinegar",
      "Food coloring",
      "Clear containers",
      "Measuring spoons",
      "Safety goggles (recommended)",
    ],
    maxParticipants: 20,
    currentParticipants: 8,
    difficulty: "Intermediate",
    tags: ["STEM", "Experiments", "Chemistry", "Educational"],
    images: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
  },
}

export default function ActivityDetailPage() {
  const params = useParams()
  const activityId = Number(params.id)
  const [activity, setActivity] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    // In a real app, you'd fetch the activity data from an API
    const activityData = activitiesData[activityId]
    if (activityData) {
      setActivity(activityData)
    }
  }, [activityId])

  if (!activity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Activity not found</h2>
          <p className="text-gray-500 mb-6">The activity you're looking for doesn't exist.</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Activities
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: activity.title,
          text: `Check out this amazing activity: ${activity.title}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <Card className="bg-white rounded-2xl shadow-lg border-2 border-purple-100 overflow-hidden">
              <div className="relative">
                <img
                  src={activity.images[selectedImage] || "/placeholder.svg"}
                  alt={activity.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full">
                    {activity.topic}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-white/90 border-purple-300 text-purple-700 px-3 py-1 rounded-full"
                  >
                    {activity.difficulty}
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
                      {activity.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="border-purple-200 text-purple-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-500">{activity.duration}</div>
                  </div>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed">{activity.description}</p>
              </CardContent>
            </Card>

            {/* What You'll Learn */}
            <Card className="bg-white rounded-2xl shadow-lg border-2 border-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold text-gray-800">
                  <Target className="w-6 h-6 mr-3 text-purple-600" />
                  What You'll Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {activity.whatYoullLearn.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Star className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activity.materialsNeeded.map((material, index) => (
                    <div key={index} className="flex items-center p-3 bg-purple-50 rounded-xl">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{material}</span>
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
                      <div className="font-medium">{activity.time}</div>
                      <div className="text-sm text-gray-500">{activity.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Users className="w-5 h-5 mr-3 text-purple-500" />
                    <div>
                      <div className="font-medium">Ages {activity.ageGroup}</div>
                    </div>
                  </div>
                </div>

                {/* Join Button */}
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl text-base h-12 mb-3"
                >
                  <a href={activity.joinLink} target="_blank" rel="noopener noreferrer">
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
                    src={activity.organizer.avatar || "/placeholder.svg"}
                    alt={activity.organizer.name}
                    className="w-16 h-16 rounded-full border-2 border-purple-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{activity.organizer.name}</h3>
                    <div className="flex items-center mb-2">
                      <span className="text-sm text-gray-500 ml-2">
                        {activity.organizer.totalActivities} activities
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{activity.organizer.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
