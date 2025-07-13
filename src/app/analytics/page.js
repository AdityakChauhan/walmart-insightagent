'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Leaf, 
  Droplets, 
  Utensils,
  Calendar,
  Target,
  Award
} from 'lucide-react';
import { fetchSustainabilityImpact, fetchDecisions } from '@/lib/api';
import { formatNumber, formatCurrency } from '@/lib/utils';

export default function AnalyticsPage() {
  const [sustainabilityData, setSustainabilityData] = useState(null);
  const [decisionsData, setDecisionsData] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sustainability, decisions] = await Promise.all([
          fetchSustainabilityImpact(),
          fetchDecisions()
        ]);
        setSustainabilityData(sustainability);
        setDecisionsData(decisions);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        // Mock data
        setSustainabilityData({
          co2_kg: 4230,
          meals: 8920,
          water_liters: 12450
        });
        setDecisionsData({
          data: [],
          summary: {
            total_items: 150,
            high_risk_items: 23,
            total_spoilage_forecast_Rs: 125000
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mock chart data
  const co2TrendData = [
    { date: 'Mon', co2: 120, target: 100 },
    { date: 'Tue', co2: 180, target: 100 },
    { date: 'Wed', co2: 150, target: 100 },
    { date: 'Thu', co2: 220, target: 100 },
    { date: 'Fri', co2: 190, target: 100 },
    { date: 'Sat', co2: 250, target: 100 },
    { date: 'Sun', co2: 210, target: 100 }
  ];

  const categoryImpactData = [
    { category: 'Dairy', co2: 1250, water: 62500, meals: 2500 },
    { category: 'Produce', co2: 980, water: 98000, meals: 3200 },
    { category: 'Baked Goods', co2: 750, water: 22500, meals: 1500 },
    { category: 'Meat', co2: 650, water: 32500, meals: 650 },
    { category: 'Beverages', co2: 400, water: 48000, meals: 800 }
  ];

  const actionBreakdownData = [
    { name: 'Donate', value: 45, color: '#22c55e' },
    { name: 'Markdown -30%', value: 25, color: '#f59e0b' },
    { name: 'Markdown -10%', value: 20, color: '#3b82f6' },
    { name: 'Return', value: 10, color: '#ef4444' }
  ];

  const weeklyProgressData = [
    { week: 'Week 1', co2: 850, water: 42500, meals: 1700 },
    { week: 'Week 2', co2: 920, water: 46000, meals: 1840 },
    { week: 'Week 3', co2: 1050, water: 52500, meals: 2100 },
    { week: 'Week 4', co2: 1200, water: 60000, meals: 2400 }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sustainability Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into your environmental impact and performance</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total CO₂ Saved</CardTitle>
              <Leaf className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatNumber(sustainabilityData?.co2_kg || 0)} kg
              </div>
              <p className="text-xs text-gray-600 mt-1">
                +15% vs last period
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Water Saved</CardTitle>
              <Droplets className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatNumber(sustainabilityData?.water_liters || 0)} L
              </div>
              <p className="text-xs text-gray-600 mt-1">
                +12% vs last period
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meals Saved</CardTitle>
              <Utensils className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatNumber(sustainabilityData?.meals || 0)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                +18% vs last period
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                87%
              </div>
              <p className="text-xs text-gray-600 mt-1">
                +5% vs last period
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CO₂ Trend */}
        <Card>
          <CardHeader>
            <CardTitle>CO₂ Savings Trend</CardTitle>
            <CardDescription>Daily CO₂ emissions prevented vs target</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={co2TrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="co2" 
                  stackId="1"
                  stroke="#22c55e" 
                  fill="#22c55e" 
                  fillOpacity={0.6}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#ef4444" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Action Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Action Distribution</CardTitle>
            <CardDescription>Breakdown of AI recommendations by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={actionBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {actionBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Impact by Category</CardTitle>
          <CardDescription>Environmental impact breakdown by product category</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={categoryImpactData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="co2" fill="#22c55e" name="CO₂ (kg)" />
              <Bar dataKey="water" fill="#3b82f6" name="Water (L)" />
              <Bar dataKey="meals" fill="#f59e0b" name="Meals" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
          <CardDescription>Trend of sustainability metrics over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="co2" 
                stroke="#22c55e" 
                strokeWidth={2}
                name="CO₂ (kg)"
              />
              <Line 
                type="monotone" 
                dataKey="water" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Water (L)"
              />
              <Line 
                type="monotone" 
                dataKey="meals" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Meals"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Dairy products lead in CO₂ savings</p>
                  <p className="text-xs text-gray-600">45% of total CO₂ savings come from dairy category</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Produce has highest water impact</p>
                  <p className="text-xs text-gray-600">78% of water savings from fresh produce</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Donation actions most effective</p>
                  <p className="text-xs text-gray-600">45% of actions are donations, highest impact</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Focus on dairy optimization</p>
                  <p className="text-xs text-gray-600">Implement stricter expiry monitoring for dairy</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Increase produce donations</p>
                  <p className="text-xs text-gray-600">Partner with more local food banks</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Optimize markdown timing</p>
                  <p className="text-xs text-gray-600">Apply markdowns 2-3 days before expiry</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 