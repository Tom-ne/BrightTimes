"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Calendar, Clock, Users, LinkIcon, Tag, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

const topics = ["Arts & Crafts", "Science", "Reading", "Math", "Music", "Technology", "Sports", "Cooking"]
const ageGroups = ["3-6 years", "4-8 years", "5-8 years", "6-10 years", "8-12 years", "8-14 years", "10+ years"]

// Mock data for existing activity
const existingActivity = {
  id: 1,
  title: "Creative Art Workshop",
  description: "A fun and engaging art workshop where kids will learn to create beautiful paintings using watercolors.",
  topic: "Arts & Crafts",
  ageGroup: "5-8 years",
  date: "2024-01-15",
  time: "10:00",
  joinLink: "https://zoom.us/j/123456789",
}

export default function EditActivityPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topic: "",
    ageGroup: "",
    date: "",
    time: "",
    joinLink: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    // In a real app, you'd fetch the activity data based on the ID
    setFormData({
      title: existingActivity.title,
      description: existingActivity.description,
      topic: existingActivity.topic,
      ageGroup: existingActivity.ageGroup,
      date: existingActivity.date,
      time: existingActivity.time,
      joinLink: existingActivity.joinLink,
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate saving process
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1500)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

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
            <Link href="/dashboard">
              <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Edit Activity</h2>
          <p className="text-gray-600">Update your activity details</p>
        </div>

        <Card className="bg-white shadow-xl border-2 border-purple-100 rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-t-2xl">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-purple-600" />
              Activity Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold text-gray-700 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-purple-500" />
                  Activity Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Creative Art Workshop"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="h-12 text-base border-2 border-purple-200 rounded-xl focus:border-purple-400"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-semibold text-gray-700">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what children will do in this activity..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="min-h-[100px] text-base border-2 border-purple-200 rounded-xl focus:border-purple-400"
                />
              </div>

              {/* Topic and Age Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-700 flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-purple-500" />
                    Topic
                  </Label>
                  <Select value={formData.topic} onValueChange={(value) => handleInputChange("topic", value)}>
                    <SelectTrigger className="h-12 text-base border-2 border-purple-200 rounded-xl">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-700 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-purple-500" />
                    Age Group
                  </Label>
                  <Select value={formData.ageGroup} onValueChange={(value) => handleInputChange("ageGroup", value)}>
                    <SelectTrigger className="h-12 text-base border-2 border-purple-200 rounded-xl">
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent>
                      {ageGroups.map((age) => (
                        <SelectItem key={age} value={age}>
                          {age}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-base font-semibold text-gray-700 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="h-12 text-base border-2 border-purple-200 rounded-xl focus:border-purple-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-base font-semibold text-gray-700 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-purple-500" />
                    Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    className="h-12 text-base border-2 border-purple-200 rounded-xl focus:border-purple-400"
                    required
                  />
                </div>
              </div>

              {/* Join Link */}
              <div className="space-y-2">
                <Label htmlFor="joinLink" className="text-base font-semibold text-gray-700 flex items-center">
                  <LinkIcon className="w-4 h-4 mr-2 text-purple-500" />
                  Join Link (Zoom, Google Meet, etc.)
                </Label>
                <Input
                  id="joinLink"
                  type="url"
                  placeholder="https://zoom.us/j/123456789"
                  value={formData.joinLink}
                  onChange={(e) => handleInputChange("joinLink", e.target.value)}
                  className="h-12 text-base border-2 border-purple-200 rounded-xl focus:border-purple-400"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-xl text-base h-12 min-w-[150px]"
                >
                  {isLoading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
