"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Calendar, Clock, Users, LinkIcon, Tag, FileText, X, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export default function AddActivityPage() {
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

  const [topics, setTopics] = useState([
    "Arts & Crafts",
    "Science",
    "Reading",
    "Math",
    "Music",
    "Technology",
    "Sports",
    "Cooking",
  ])
  const [ageGroups, setAgeGroups] = useState([
    "3-6 years",
    "4-8 years",
    "5-8 years",
    "6-10 years",
    "8-12 years",
    "8-14 years",
    "10+ years",
  ])
  const [newTopic, setNewTopic] = useState("")
  const [newAgeGroup, setNewAgeGroup] = useState("")
  const [showNewTopicInput, setShowNewTopicInput] = useState(false)
  const [showNewAgeGroupInput, setShowNewAgeGroupInput] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addNewTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      const updatedTopics = [...topics, newTopic.trim()]
      setTopics(updatedTopics)
      setFormData((prev) => ({ ...prev, topic: newTopic.trim() }))
      setNewTopic("")
      setShowNewTopicInput(false)
    }
  }

  const addNewAgeGroup = () => {
    if (newAgeGroup.trim() && !ageGroups.includes(newAgeGroup.trim())) {
      const updatedAgeGroups = [...ageGroups, newAgeGroup.trim()]
      setAgeGroups(updatedAgeGroups)
      setFormData((prev) => ({ ...prev, ageGroup: newAgeGroup.trim() }))
      setNewAgeGroup("")
      setShowNewAgeGroupInput(false)
    }
  }

  const removeTopic = (topicToRemove: string) => {
    const updatedTopics = topics.filter((topic) => topic !== topicToRemove)
    setTopics(updatedTopics)
    if (formData.topic === topicToRemove) {
      setFormData((prev) => ({ ...prev, topic: "" }))
    }
  }

  const removeAgeGroup = (ageGroupToRemove: string) => {
    const updatedAgeGroups = ageGroups.filter((age) => age !== ageGroupToRemove)
    setAgeGroups(updatedAgeGroups)
    if (formData.ageGroup === ageGroupToRemove) {
      setFormData((prev) => ({ ...prev, ageGroup: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const payload = {
        title: formData.title,
        topic: formData.topic,
        age_group: formData.ageGroup,
        date: formData.date,
        time: formData.time,
        join_link: formData.joinLink,
        description: formData.description,
      }

      const response = await fetch("http://localhost:5000/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
        body: JSON.stringify(payload),
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/dashboard")
      } else {
        alert(data.error || "Failed to create activity")
      }
    } catch (error) {
      alert("Error connecting to server")
    } finally {
      setIsLoading(false)
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Add New Activity</h2>
          <p className="text-gray-600">Create an engaging online activity for children</p>
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
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what children will do in this activity..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="min-h-[100px] text-base border-2 border-purple-200 rounded-xl focus:border-purple-400"
                  required
                />
              </div>

              {/* Topic and Age Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-700 flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-purple-500" />
                    Topic
                  </Label>
                  <div className="space-y-3">
                    <Select
                      value={formData.topic}
                      onValueChange={(value) => handleInputChange("topic", value)}
                    >
                      <SelectTrigger className="h-12 text-base border-2 border-purple-200 rounded-xl">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent className="bg-white shadow-lg border border-gray-200 rounded-md">
                        {topics.map((topic) => (
                          <SelectItem key={topic} value={topic}>
                            {topic}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {!showNewTopicInput ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowNewTopicInput(true)}
                        className="w-full border-2 border-dashed border-purple-300 text-purple-600 hover:bg-purple-50 h-10"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Topic
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter new topic"
                          value={newTopic}
                          onChange={(e) => setNewTopic(e.target.value)}
                          className="flex-1 h-10 border-2 border-purple-200 rounded-xl focus:border-purple-400"
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addNewTopic())}
                        />
                        <Button
                          type="button"
                          onClick={addNewTopic}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 h-10 rounded-xl"
                        >
                          Add
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowNewTopicInput(false)
                            setNewTopic("")
                          }}
                          className="border-gray-300 text-gray-600 hover:bg-gray-50 px-4 h-10 rounded-xl"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}

                    {topics.length > 8 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-sm text-gray-600 w-full mb-1">Custom topics:</span>
                        {topics.slice(8).map((topic) => (
                          <Badge
                            key={topic}
                            variant="outline"
                            className="border-purple-300 text-purple-700 px-3 py-1 rounded-full flex items-center gap-1"
                          >
                            {topic}
                            <button
                              type="button"
                              onClick={() => removeTopic(topic)}
                              className="ml-1 hover:bg-purple-100 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-700 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-purple-500" />
                    Age Group
                  </Label>
                  <div className="space-y-3">
                    <Select
                      value={formData.ageGroup}
                      onValueChange={(value) => handleInputChange("ageGroup", value)}
                    >
                      <SelectTrigger className="h-12 text-base border-2 border-purple-200 rounded-xl">
                        <SelectValue placeholder="Select age group" />
                      </SelectTrigger>
                      <SelectContent className="bg-white shadow-lg border border-gray-200 rounded-md">
                        {ageGroups.map((age) => (
                          <SelectItem key={age} value={age}>
                            {age}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {!showNewAgeGroupInput ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowNewAgeGroupInput(true)}
                        className="w-full border-2 border-dashed border-purple-300 text-purple-600 hover:bg-purple-50 h-10"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Age Group
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., 12-16 years"
                          value={newAgeGroup}
                          onChange={(e) => setNewAgeGroup(e.target.value)}
                          className="flex-1 h-10 border-2 border-purple-200 rounded-xl focus:border-purple-400"
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addNewAgeGroup())}
                        />
                        <Button
                          type="button"
                          onClick={addNewAgeGroup}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 h-10 rounded-xl"
                        >
                          Add
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowNewAgeGroupInput(false)
                            setNewAgeGroup("")
                          }}
                          className="border-gray-300 text-gray-600 hover:bg-gray-50 px-4 h-10 rounded-xl"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}

                    {ageGroups.length > 7 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-sm text-gray-600 w-full mb-1">Custom age groups:</span>
                        {ageGroups.slice(7).map((ageGroup) => (
                          <Badge
                            key={ageGroup}
                            variant="outline"
                            className="border-purple-300 text-purple-700 px-3 py-1 rounded-full flex items-center gap-1"
                          >
                            {ageGroup}
                            <button
                              type="button"
                              onClick={() => removeAgeGroup(ageGroup)}
                              className="ml-1 hover:bg-purple-100 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
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
                    "Creating..."
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Create Activity
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
