"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Upload, User, MapPin, Star, Calendar, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

export default function ProfilePage() {
  const [organizerData, setOrganizerData] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    avatar: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchOrganizer = async () => {
      try {
        const res = await fetch("http://localhost:5000/organizer/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
          credentials: "include",
        })

        if (!res.ok) throw new Error("Failed to fetch organizer data")

        const data = await res.json()
        setOrganizerData(data)
        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          avatar: data.avatarBase64 || "",
        })
        setPreviewImage(data.avatarBase64 || "/placeholder.svg")
      } catch (error) {
        console.error("Error loading profile:", error)
      }
    }

    fetchOrganizer()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("http://localhost:5000/organizer/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
        body: JSON.stringify({
          name: formData.name,
          bio: formData.bio,
          avatarBase64: formData.avatar,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to update profile")
      }

      toast.success("Profile saved successfully!")
    } catch (err) {
      console.error(err)
      toast.error("Failed to save profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewImage(result)
        setFormData((prev) => ({ ...prev, avatar: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  if (!organizerData) {
    return <div className="p-8 text-center text-gray-500">Loading profile...</div>
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
              <Badge className="bg-purple-100 text-purple-700 ml-2">Organizer</Badge>
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Profile Settings</h2>
          <p className="text-gray-600">Manage your profile information and how parents see you</p>
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Edit Profile */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-xl border-2 border-purple-100 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-t-2xl">
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                  <User className="w-6 h-6 mr-3 text-purple-600" />
                  Edit Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Avatar Upload */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold text-gray-700">Profile Picture</Label>
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <img
                          src={previewImage || "/placeholder.svg"}
                          alt="Profile"
                          className="w-24 h-24 rounded-full border-4 border-purple-200 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <input
                          type="file"
                          id="avatar"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Label
                          htmlFor="avatar"
                          className="cursor-pointer inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload New Photo
                        </Label>
                        <p className="text-sm text-gray-500 mt-2">
                          JPG, PNG or GIF. Max size 5MB. Recommended: 400x400px
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Info Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">About You</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      maxLength={500}
                    />
                    <div className="text-right text-sm text-gray-500">{formData.bio.length}/500 characters</div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-xl"
                    >
                      {isLoading ? "Saving..." : <>
                        <Save className="w-5 h-5 mr-2" />
                        Save Changes
                      </>}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Impact + Specialties (side by side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Your Impact */}
              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg border-0">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold text-lg mb-2">Your Impact</h3>
                  <div className="flex justify-between">
                    <div className="flex items-center"><Calendar className="w-5 h-5 mr-2" /> Activities</div>
                    <span className="font-bold">{organizerData.totalActivities}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center"><Users className="w-5 h-5 mr-2" />Join button pressed</div>
                    <span className="font-bold">{organizerData.totalTimesJoinPressed}</span>
                  </div>
                  <div className="border-t border-pink-300 pt-2 text-sm text-purple-100">
                    Member since {formatDate(organizerData.joinedDate)}
                  </div>
                </CardContent>
              </Card>

              {/* Your Specialties */}
              <Card className="bg-white rounded-2xl shadow-lg border-2 border-purple-100">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-800">Your Specialties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {organizerData.specialties.map((spec) => (
                      <Badge
                        key={spec}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full"
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Preview & Achievements */}
          <div className="space-y-6">
            {/* Profile Preview */}
            <Card className="bg-white rounded-2xl shadow-lg border-2 border-purple-100 sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800">Profile Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <img
                    src={previewImage || "/placeholder.svg"}
                    alt="Profile Preview"
                    className="w-20 h-20 rounded-full border-2 border-purple-200 mx-auto mb-3 object-cover"
                  />
                  <h3 className="font-bold text-gray-800 text-lg">{formData.name}</h3>
                  <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
                    {organizerData.totalActivities} activities
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  {formData.bio || "No bio added yet..."}
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
      <Toaster />
    </div>
  )
}
