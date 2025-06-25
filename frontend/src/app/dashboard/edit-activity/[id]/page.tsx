"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Save,
  Calendar,
  Clock,
  Users,
  LinkIcon,
  Tag,
  FileText,
  Hourglass,
  PackageOpen,
} from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

export default function EditActivityPage() {
  const router = useRouter()
  const params = useParams()
  const activityId = params.id

  const [topics, setTopics] = useState<string[]>([])
  const [ageGroups, setAgeGroups] = useState<string[]>([])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topic: "",
    ageGroup: "",
    date: "",
    time: "",
    durationHours: "",
    durationMinutes: "",
    joinLink: "",
    materials: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [topicsRes, ageGroupsRes] = await Promise.all([
          fetch("http://localhost:5000/activities/topics"),
          fetch("http://localhost:5000/activities/age_groups"),
        ])
        const topicsData = await topicsRes.json()
        const ageGroupsData = await ageGroupsRes.json()
        setTopics(topicsData || [])
        setAgeGroups(ageGroupsData || [])
      } catch (err) {
        console.error("Failed to fetch topics or age groups", err)
      }
    }

    fetchOptions()
  }, [])

  useEffect(() => {
    if (!activityId) return

    async function fetchActivity() {
      try {
        const res = await fetch(`http://localhost:5000/activities/${activityId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        if (!res.ok) throw new Error("Failed to fetch activity")
        const data = await res.json()

        const [hours = "", minutes = ""] = (data.duration || "").split(":")
        setFormData({
          title: data.title || "",
          description: data.description || "",
          topic: data.topic || "",
          ageGroup: data.ageGroup || data.age_group || "",
          date: data.date || "",
          time: data.time || "",
          durationHours: hours,
          durationMinutes: minutes,
          joinLink: data.joinLink || data.join_link || "",
          materials: data.materials || "",
        })
      } catch (err: any) {
        setError(err.message)
      }
    }

    fetchActivity()
  }, [activityId])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const duration = `${formData.durationHours.padStart(2, "0")}:${formData.durationMinutes.padStart(2, "0")}`

    try {
      const res = await fetch(`http://localhost:5000/activities/${activityId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          topic: formData.topic,
          age_group: formData.ageGroup,
          date: formData.date,
          time: formData.time,
          duration,
          join_link: formData.joinLink,
          materials: formData.materials,
        }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "Failed to update activity")
      }

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

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
            <Link href="/dashboard">
              <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Edit Activity</h2>
          <p className="text-gray-600">Update your activity details</p>
          {error && <p className="text-red-600 mt-2">{error}</p>}
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
                <Label htmlFor="title" className="flex items-center font-semibold text-gray-700 text-base">
                  <FileText className="w-4 h-4 mr-2 text-purple-500" />
                  Activity Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Creative Art Workshop"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="h-12 text-base border-2 border-purple-200 rounded-xl"
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
                  className="min-h-[100px] text-base border-2 border-purple-200 rounded-xl"
                  required
                />
              </div>

              {/* Materials */}
              <div className="space-y-2">
                <Label htmlFor="materials" className="flex items-center text-base font-semibold text-gray-700">
                  <PackageOpen className="w-4 h-4 mr-2 text-purple-500" />
                  Materials Required (Optional)
                </Label>
                <Textarea
                  id="materials"
                  placeholder="List any materials children need to bring (e.g., crayons, paper)"
                  value={formData.materials}
                  onChange={(e) => handleInputChange("materials", e.target.value)}
                  className="min-h-[100px] text-base border-2 border-purple-200 rounded-xl"
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

              {/* Date, Time, Duration */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center text-base font-semibold text-gray-700">
                    <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="h-12 text-base border-2 border-purple-200 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center text-base font-semibold text-gray-700">
                    <Clock className="w-4 h-4 mr-2 text-purple-500" />
                    Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    className="h-12 text-base border-2 border-purple-200 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label className="flex items-center text-base font-semibold text-gray-700">
                    <Hourglass className="w-4 h-4 mr-2 text-purple-500" />
                    Duration
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      min="0"
                      max="23"
                      placeholder="Hours"
                      value={formData.durationHours}
                      onChange={(e) => handleInputChange("durationHours", e.target.value)}
                      className="h-12 border-2 border-purple-200 rounded-xl"
                    />
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      placeholder="Minutes"
                      value={formData.durationMinutes}
                      onChange={(e) => handleInputChange("durationMinutes", e.target.value)}
                      className="h-12 border-2 border-purple-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Join Link */}
              <div className="space-y-2">
                <Label htmlFor="joinLink" className="flex items-center text-base font-semibold text-gray-700">
                  <LinkIcon className="w-4 h-4 mr-2 text-purple-500" />
                  Join Link
                </Label>
                <Input
                  type="url"
                  id="joinLink"
                  placeholder="https://zoom.us/j/123456789"
                  value={formData.joinLink}
                  onChange={(e) => handleInputChange("joinLink", e.target.value)}
                  className="h-12 text-base border-2 border-purple-200 rounded-xl"
                  required
                />
              </div>

              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-xl text-base h-12 min-w-[150px]"
                >
                  {isLoading ? "Saving..." : <><Save className="w-5 h-5 mr-2" /> Save Changes</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
