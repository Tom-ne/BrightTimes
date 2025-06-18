"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Lock, Mail } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("http://localhost:5000/auth/login?username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password))

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Login failed")
        setIsLoading(false)
        return
      }

      const data = await res.json()
      localStorage.setItem("token", data.token)
      localStorage.setItem("username", data.username)
      router.push("/dashboard")
    } catch (err) {
      console.error(err)
      setError("Could not connect to server")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Activities
        </Link>

        <Card className="bg-white shadow-xl border-2 border-purple-100 rounded-2xl">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Organizer Login</CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Sign in to manage your activities and connect with families
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-12 text-base border-2 border-purple-200 rounded-xl focus:border-purple-400"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 text-base border-2 border-purple-200 rounded-xl focus:border-purple-400"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl text-base h-12"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                New organizer?{" "}
                <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                  Contact us to get started
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
