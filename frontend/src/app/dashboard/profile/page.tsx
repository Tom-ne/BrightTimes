"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Upload, User, MapPin, Star, Calendar, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock organizer data
const organizerData = {
  id: 1,
  name: "Ms. Sarah",
  email: "sarah@example.com",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  bio: "Professional art teacher with 10+ years of experience working with children. I'm passionate about helping kids discover their creativity through fun, engaging activities.",
  avatar: "/placeholder.svg?height=120&width=120",
  rating: 4.9,
  totalActivities: 45,
  totalParticipants: 1250,
  joinedDate: "2022-03-15",
  specialties: ["Arts & Crafts", "Creative Writing", "Music"],
  achievements: ["Top Rated Organizer 2023", "Most Popular Art Activities", "Excellence in Child Education"],
}

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: organizerData.name,
    email: organizerData.email,
    phone: organizerData.phone,
    location: organizerData.location,
    bio: organizerData.bio,
    avatar: organizerData.avatar,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState(organizerData.avatar)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate saving process
    setTimeout(() => {
      setIsLoading(false)
      alert("Profile updated successfully!")
    }, 1500)
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
              <h1 className="text-2xl font-bold text-gray-800">KidsConnect</h1>
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Profile Settings</h2>
          <p className="text-gray-600">Manage your profile information and how parents see you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
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
                  {/* Profile Picture */}
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

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base font-semibold text-gray-700">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="h-12 text-base border-2 border-purple-200 rounded-xl focus:border-purple-400"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base font-semibold text-gray-700">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="h-12 text-base border-2 border-purple-200 rounded-xl focus:border-purple-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-base font-semibold text-gray-700">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="h-12 text-base border-2 border-purple-200 rounded-xl focus:border-purple-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-base font-semibold text-gray-700">
                        Location
                      </Label>
                      <Input
                        id="location"
                        placeholder="City, State"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="h-12 text-base border-2 border-purple-200 rounded-xl focus:border-purple-400"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-base font-semibold text-gray-700">
                      About You
                    </Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell parents about your experience, qualifications, and what makes your activities special..."
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="min-h-[120px] text-base border-2 border-purple-200 rounded-xl focus:border-purple-400"
                      maxLength={500}
                    />
                    <div className="text-right text-sm text-gray-500">{formData.bio.length}/500 characters</div>
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
          </div>

          {/* Profile Preview & Stats */}
          <div className="space-y-6">
            {/* Profile Preview */}
            <Card className="bg-white rounded-2xl shadow-lg border-2 border-purple-100 sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800">Profile Preview</CardTitle>
                <p className="text-sm text-gray-600">How parents will see your profile</p>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <img
                    src={previewImage || "/placeholder.svg"}
                    alt="Profile Preview"
                    className="w-20 h-20 rounded-full border-2 border-purple-200 mx-auto mb-3 object-cover"
                  />
                  <h3 className="font-bold text-gray-800 text-lg">{formData.name}</h3>
                  <div className="flex items-center justify-center mb-2">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium">{organizerData.rating}</span>
                    <span className="text-sm text-gray-500 ml-2">({organizerData.totalActivities} activities)</span>
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {formData.location}
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  {formData.bio || "No bio added yet..."}
                </p>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Your Impact</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-3" />
                      <span>Activities Created</span>
                    </div>
                    <span className="font-bold text-xl">{organizerData.totalActivities}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-3" />
                      <span>Kids Reached</span>
                    </div>
                    <span className="font-bold text-xl">{organizerData.totalParticipants}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 mr-3" />
                      <span>Average Rating</span>
                    </div>
                    <span className="font-bold text-xl">{organizerData.rating}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-purple-300">
                  <p className="text-sm text-purple-100">Member since {formatDate(organizerData.joinedDate)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card className="bg-white rounded-2xl shadow-lg border-2 border-purple-100">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800">Your Specialties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {organizerData.specialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-white rounded-2xl shadow-lg border-2 border-purple-100">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {organizerData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center p-3 bg-yellow-50 rounded-xl">
                      <Star className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
