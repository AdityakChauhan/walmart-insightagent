import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, TrendingUp, Users, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Hero Section */}
      <div className="text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-100 rounded-full">
              <Leaf className="h-12 w-12 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            WasteWise AI
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered sustainability platform for Walmart stores. 
            Reduce inventory waste, save resources, and make data-driven decisions 
            that benefit both your business and the planet.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Zap className="h-5 w-5 mr-2" />
                Launch Dashboard
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="ml-3">Smart Analytics</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI-powered insights help you identify waste patterns, 
                optimize inventory levels, and predict future demand with precision.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="ml-3">Sustainability Focus</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track CO₂ emissions saved, water conservation, and meals recovered. 
                Turn sustainability into a measurable competitive advantage.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="ml-3">Actionable Insights</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get clear recommendations for markdowns, donations, and returns. 
                Every decision is backed by data and explained by AI.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Impact at Scale</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">4,230</div>
              <div className="text-green-100">kg CO₂ Saved</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">12,450</div>
              <div className="text-green-100">Liters Water Saved</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">8,920</div>
              <div className="text-green-100">Meals Recovered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">₹2.3M</div>
              <div className="text-green-100">Value Saved</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Transform Your Inventory Management?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Join the revolution in sustainable retail. Start making data-driven decisions today.
        </p>
        <Link href="/dashboard">
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            Get Started Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
