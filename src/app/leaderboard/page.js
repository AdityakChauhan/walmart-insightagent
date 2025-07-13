'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Medal, TrendingUp, Award, Star } from 'lucide-react';
import { formatNumber, formatCurrency } from '@/lib/utils';

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('efficiency');

  // Mock leaderboard data
  useEffect(() => {
    const mockData = [
      {
        rank: 1,
        item_name: 'Organic Milk',
        category: 'Dairy',
        co2_saved_kg: 45.2,
        water_saved_liters: 2250,
        meals_saved: 150,
        efficiency_score: 95.8,
        sustainability_score: 92,
        value_saved: 450,
        trend: 'up'
      },
      {
        rank: 2,
        item_name: 'Fresh Bread',
        category: 'Baked Goods',
        co2_saved_kg: 38.7,
        water_saved_liters: 1161,
        meals_saved: 93,
        efficiency_score: 92.3,
        sustainability_score: 88,
        value_saved: 320,
        trend: 'up'
      },
      {
        rank: 3,
        item_name: 'Bananas',
        category: 'Produce',
        co2_saved_kg: 32.1,
        water_saved_liters: 3210,
        meals_saved: 400,
        efficiency_score: 89.7,
        sustainability_score: 85,
        value_saved: 180,
        trend: 'stable'
      },
      {
        rank: 4,
        item_name: 'Chicken Breast',
        category: 'Meat',
        co2_saved_kg: 75.0,
        water_saved_liters: 37500,
        meals_saved: 75,
        efficiency_score: 87.2,
        sustainability_score: 82,
        value_saved: 300,
        trend: 'down'
      },
      {
        rank: 5,
        item_name: 'Yogurt',
        category: 'Dairy',
        co2_saved_kg: 25.4,
        water_saved_liters: 1270,
        meals_saved: 85,
        efficiency_score: 84.5,
        sustainability_score: 79,
        value_saved: 200,
        trend: 'up'
      }
    ];

    setLeaderboardData(mockData);
  }, []);

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Medal className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-600 transform rotate-180" />;
      default:
        return <span className="text-gray-400">—</span>;
    }
  };

  const getEfficiencyColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredData = leaderboardData.filter(item => 
    !categoryFilter || categoryFilter === 'all' || item.category === categoryFilter
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Leaderboard</h1>
          <p className="text-gray-600">Top performing items ranked by efficiency and sustainability impact</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Dairy">Dairy</SelectItem>
              <SelectItem value="Produce">Produce</SelectItem>
              <SelectItem value="Baked Goods">Baked Goods</SelectItem>
              <SelectItem value="Meat">Meat</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="efficiency">Efficiency Score</SelectItem>
              <SelectItem value="co2">CO₂ Saved</SelectItem>
              <SelectItem value="value">Value Saved</SelectItem>
              <SelectItem value="sustainability">Sustainability Score</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredData.slice(0, 3).map((item, index) => (
          <Card key={item.rank} className={`${index === 0 ? 'border-yellow-300 bg-yellow-50' : index === 1 ? 'border-gray-300 bg-gray-50' : 'border-amber-300 bg-amber-50'}`}>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                {getMedalIcon(item.rank)}
              </div>
              <CardTitle className="text-lg">{item.item_name}</CardTitle>
              <CardDescription>{item.category}</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <div className="text-2xl font-bold text-green-600">
                {item.efficiency_score}%
              </div>
              <p className="text-sm text-gray-600">Efficiency Score</p>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-semibold text-green-700">{item.co2_saved_kg}</div>
                  <div className="text-green-600">kg CO₂</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-blue-700">{item.water_saved_liters}</div>
                  <div className="text-blue-600">L Water</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-orange-700">{item.meals_saved}</div>
                  <div className="text-orange-600">Meals</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-1">
                {getTrendIcon(item.trend)}
                <span className="text-sm text-gray-600">{item.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
            Complete Rankings
          </CardTitle>
          <CardDescription>
            Detailed performance metrics for all items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Efficiency Score</TableHead>
                <TableHead>CO₂ Saved</TableHead>
                <TableHead>Water Saved</TableHead>
                <TableHead>Meals Saved</TableHead>
                <TableHead>Value Saved</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.rank} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getMedalIcon(item.rank)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.item_name}</div>
                      <div className="text-sm text-gray-500">SKU: {item.rank.toString().padStart(3, '0')}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className={`font-bold ${getEfficiencyColor(item.efficiency_score)}`}>
                        {item.efficiency_score}%
                      </div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getEfficiencyColor(item.efficiency_score).replace('text-', 'bg-')}`}
                          style={{ width: `${item.efficiency_score}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-green-600 font-semibold">
                      {item.co2_saved_kg} kg
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-blue-600 font-semibold">
                      {formatNumber(item.water_saved_liters)} L
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-orange-600 font-semibold">
                      {item.meals_saved}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">
                      {formatCurrency(item.value_saved)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(item.trend)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-green-600" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Dairy Category</span>
                <span className="text-sm font-semibold text-green-600">2 items in top 5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Average Efficiency</span>
                <span className="text-sm font-semibold text-green-600">89.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total CO₂ Saved</span>
                <span className="text-sm font-semibold text-green-600">216.4 kg</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-blue-600" />
              Improvement Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Meat Category</span>
                <span className="text-sm font-semibold text-orange-600">Needs attention</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Lowest Efficiency</span>
                <span className="text-sm font-semibold text-red-600">84.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Opportunity</span>
                <span className="text-sm font-semibold text-blue-600">+15% potential</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 