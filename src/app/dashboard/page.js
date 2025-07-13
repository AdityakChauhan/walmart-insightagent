'use client';

import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { 
  Leaf, 
  Droplets, 
  Utensils, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { fetchSustainabilityImpact, fetchDecisions, runSimulation } from '@/lib/api';
import { formatNumber, getActionEmoji, getActionBadgeVariant } from '@/lib/utils';

// Lazy load heavy chart components
const ChartsSection = lazy(() => import('./ChartsSection'));

export default function DashboardPage() {
  const [sustainabilityData, setSustainabilityData] = useState(null);
  const [decisionsData, setDecisionsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);

  // Memoized chart data to prevent recalculation
  const co2ChartData = useMemo(() => [
    { day: 'Mon', co2: 120 },
    { day: 'Tue', co2: 180 },
    { day: 'Wed', co2: 150 },
    { day: 'Thu', co2: 220 },
    { day: 'Fri', co2: 190 },
    { day: 'Sat', co2: 250 },
    { day: 'Sun', co2: 210 }
  ], []);

  const actionChartData = useMemo(() => [
    { action: 'Donate', count: 15, color: '#22c55e' },
    { action: 'Markdown -30%', count: 8, color: '#f59e0b' },
    { action: 'Markdown -10%', count: 12, color: '#3b82f6' },
    { action: 'Return', count: 3, color: '#ef4444' }
  ], []);

  // Memoized top items to prevent recalculation
  const topItems = useMemo(() => {
    return decisionsData?.data?.slice(0, 10) || [
      { item_name: 'Organic Milk', category: 'Dairy', co2_saved_kg: 45.2, sustainability_score: 92 },
      { item_name: 'Fresh Bread', category: 'Baked Goods', co2_saved_kg: 38.7, sustainability_score: 88 },
      { item_name: 'Bananas', category: 'Produce', co2_saved_kg: 32.1, sustainability_score: 85 },
      { item_name: 'Chicken Breast', category: 'Meat', co2_saved_kg: 28.9, sustainability_score: 82 },
      { item_name: 'Yogurt', category: 'Dairy', co2_saved_kg: 25.4, sustainability_score: 79 }
    ];
  }, [decisionsData?.data]);

  // Fetch data on component mount
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
        console.error('Error fetching dashboard data:', error);
        // Set mock data for development
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
            total_spoilage_forecast_Rs: 125000,
            total_meals_saved: 8920,
            co2_saved_kg: 4230,
            water_liters_saved: 12450,
            actions_today: {
              "DONATE": 15,
              "MARKDOWN -30%": 8,
              "MARKDOWN -10%": 12,
              "RETURN TO SUPPLIER": 3
            }
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoized simulation handler
  const handleSimulate = useCallback(async () => {
    setIsSimulating(true);
    try {
      await runSimulation();
      // Refresh data after simulation
      const [sustainability, decisions] = await Promise.all([
        fetchSustainabilityImpact(),
        fetchDecisions()
      ]);
      setSustainabilityData(sustainability);
      setDecisionsData(decisions);
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setIsSimulating(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Real-time sustainability insights and AI recommendations</p>
        </div>
        <Button 
          onClick={handleSimulate} 
          disabled={isSimulating}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSimulating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Simulating...
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4 mr-2" />
              Simulate Day
            </>
          )}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CO₂ Saved</CardTitle>
              <Leaf className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                <CountUp end={sustainabilityData?.co2_kg || 0} duration={2} />
                <span className="text-sm font-normal text-gray-600 ml-1">kg</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                +12% from last week
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
                <CountUp end={sustainabilityData?.water_liters || 0} duration={2} />
                <span className="text-sm font-normal text-gray-600 ml-1">L</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                +8% from last week
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
                <CountUp end={sustainabilityData?.meals || 0} duration={2} />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                +15% from last week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {decisionsData?.summary?.high_risk_items || 0}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Need immediate attention
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section - Lazy Loaded */}
      <Suspense fallback={
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Loading Charts...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      }>
        <ChartsSection 
          co2ChartData={co2ChartData}
          actionChartData={actionChartData}
        />
      </Suspense>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Sustainability Performers</CardTitle>
          <CardDescription>Items with highest environmental impact</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>CO₂ Saved (kg)</TableHead>
                <TableHead>Sustainability Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.item_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="text-green-600 font-semibold">
                    {item.co2_saved_kg}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={item.sustainability_score} className="w-20" />
                      <span className="text-sm">{item.sustainability_score}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Optimal
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 