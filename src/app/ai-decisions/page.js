'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Lightbulb,
  Target,
  BarChart3
} from 'lucide-react';
import { fetchDecisions, applyAIAction } from '@/lib/api';
import { 
  getActionEmoji, 
  getActionBadgeVariant, 
  getRiskColor,
  formatCurrency 
} from '@/lib/utils';

export default function AIDecisionsPage() {
  const [decisionsData, setDecisionsData] = useState(null);
  const [filteredDecisions, setFilteredDecisions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [confidenceFilter, setConfidenceFilter] = useState('');
  const [isRunningAI, setIsRunningAI] = useState(false);

  // Fetch AI decisions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDecisions();
        setDecisionsData(data);
        setFilteredDecisions(data.data || []);
      } catch (error) {
        console.error('Error fetching AI decisions:', error);
        // Mock data for development
        const mockData = {
          data: [
            {
              item_id: 'SKU001',
              item_name: 'Organic Milk',
              category: 'Dairy',
              recommended_action: 'DONATE',
              confidence: 95,
              tactical_note: '🔥 Donate to NGO today to avoid ₹450 loss and 45.2kg CO₂ waste.',
              risk_score: 85,
              co2_saved_kg: 45.2,
              water_saved_liters: 2250,
              meals_saved: 150,
              forecasted_waste_value: 450,
              sustainability_score: 92
            },
            {
              item_id: 'SKU002',
              item_name: 'Fresh Bread',
              category: 'Baked Goods',
              recommended_action: 'MARKDOWN -30%',
              confidence: 88,
              tactical_note: '📉 Apply -30% markdown. Waste risk is HIGH.',
              risk_score: 92,
              co2_saved_kg: 38.7,
              water_saved_liters: 1161,
              meals_saved: 93,
              forecasted_waste_value: 320,
              sustainability_score: 88
            },
            {
              item_id: 'SKU003',
              item_name: 'Bananas',
              category: 'Produce',
              recommended_action: 'MARKDOWN -10%',
              confidence: 72,
              tactical_note: '📉 Gentle markdown recommended. Stock high, days low.',
              risk_score: 78,
              co2_saved_kg: 32.1,
              water_saved_liters: 3210,
              meals_saved: 400,
              forecasted_waste_value: 180,
              sustainability_score: 85
            }
          ],
          summary: {
            total_items: 150,
            high_risk_items: 23,
            total_spoilage_forecast_Rs: 125000,
            actions_today: {
              "DONATE": 15,
              "MARKDOWN -30%": 8,
              "MARKDOWN -10%": 12,
              "RETURN TO SUPPLIER": 3
            }
          }
        };
        setDecisionsData(mockData);
        setFilteredDecisions(mockData.data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter decisions
  useEffect(() => {
    let filtered = decisionsData?.data || [];

    if (actionFilter && actionFilter !== 'all') {
      filtered = filtered.filter(item => item.recommended_action === actionFilter);
    }

    if (confidenceFilter && confidenceFilter !== 'all') {
      switch (confidenceFilter) {
        case 'high':
          filtered = filtered.filter(item => item.confidence >= 80);
          break;
        case 'medium':
          filtered = filtered.filter(item => item.confidence >= 60 && item.confidence < 80);
          break;
        case 'low':
          filtered = filtered.filter(item => item.confidence < 60);
          break;
      }
    }

    setFilteredDecisions(filtered);
  }, [decisionsData, actionFilter, confidenceFilter]);

  const handleRunAI = async () => {
    setIsRunningAI(true);
    try {
      const data = await fetchDecisions();
      setDecisionsData(data);
      setFilteredDecisions(data.data || []);
    } catch (error) {
      console.error('Error running AI:', error);
    } finally {
      setIsRunningAI(false);
    }
  };

  const handleApplyAction = async (itemId) => {
    try {
      await applyAIAction(itemId);
      // Refresh data after applying action
      const data = await fetchDecisions();
      setDecisionsData(data);
      setFilteredDecisions(data.data || []);
    } catch (error) {
      console.error('Error applying action:', error);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 80) return <CheckCircle className="h-4 w-4" />;
    if (confidence >= 60) return <Clock className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Decision Center</h1>
          <p className="text-gray-600">AI-powered recommendations for optimal inventory management</p>
        </div>
        <Button 
          onClick={handleRunAI} 
          disabled={isRunningAI}
          className="bg-green-600 hover:bg-green-700"
        >
          {isRunningAI ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Running AI...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Run AI for Today
            </>
          )}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {decisionsData?.summary?.total_items || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Analyzed by AI
            </p>
          </CardContent>
        </Card>

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

        <Card className="border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Loss</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(decisionsData?.summary?.total_spoilage_forecast_Rs || 0)}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              If no action taken
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actions Today</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Object.values(decisionsData?.summary?.actions_today || {}).reduce((a, b) => a + b, 0)}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Recommended actions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="DONATE">Donate</SelectItem>
                <SelectItem value="MARKDOWN -30%">Markdown -30%</SelectItem>
                <SelectItem value="MARKDOWN -10%">Markdown -10%</SelectItem>
                <SelectItem value="RETURN TO SUPPLIER">Return to Supplier</SelectItem>
                <SelectItem value="NO_ACTION">No Action</SelectItem>
              </SelectContent>
            </Select>

            <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Confidence Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Confidence Levels</SelectItem>
                <SelectItem value="high">High (&gt;=80%)</SelectItem>
                <SelectItem value="medium">Medium (60-79%)</SelectItem>
                <SelectItem value="low">Low (&lt;60%)</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600 flex items-center">
              {filteredDecisions.length} of {decisionsData?.data?.length || 0} recommendations
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDecisions.map((item, index) => (
          <motion.div
            key={item.item_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.item_name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Badge variant="outline" className="mr-2">
                        {item.category}
                      </Badge>
                      <span className="text-sm text-gray-500">SKU: {item.item_id}</span>
                    </CardDescription>
                  </div>
                  <Badge variant={getActionBadgeVariant(item.recommended_action)}>
                    {getActionEmoji(item.recommended_action)} {item.recommended_action}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Confidence Level */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">AI Confidence</span>
                  <div className="flex items-center space-x-2">
                    <div className={`${getConfidenceColor(item.confidence)}`}>
                      {getConfidenceIcon(item.confidence)}
                    </div>
                    <span className={`text-sm font-semibold ${getConfidenceColor(item.confidence)}`}>
                      {item.confidence}%
                    </span>
                  </div>
                </div>
                <Progress value={item.confidence} className="w-full" />

                {/* Risk Score */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Risk Score</span>
                  <div className="flex items-center space-x-2">
                    <Progress 
                      value={item.risk_score} 
                      className="w-16"
                    />
                    <span className="text-sm font-medium">{item.risk_score}%</span>
                  </div>
                </div>

                {/* Tactical Note */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="tactical-note">
                    <AccordionTrigger className="text-sm">
                      <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
                      AI Reasoning
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                        {item.tactical_note}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Sustainability Impact */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">{item.co2_saved_kg}</div>
                    <div className="text-xs text-gray-600">kg CO₂</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">{item.water_saved_liters}</div>
                    <div className="text-xs text-gray-600">L Water</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">{item.meals_saved}</div>
                    <div className="text-xs text-gray-600">Meals</div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-sm text-gray-600">
                    Potential loss: <span className="font-semibold text-red-600">
                      {formatCurrency(item.forecasted_waste_value)}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleApplyAction(item.item_id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Zap className="h-4 w-4 mr-1" />
                    Apply Action
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Action Distribution Chart */}
      {decisionsData?.summary?.actions_today && (
        <Card>
          <CardHeader>
            <CardTitle>Action Distribution</CardTitle>
            <CardDescription>Breakdown of today's AI recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(decisionsData.summary.actions_today).map(([action, count]) => (
                <div key={action} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{count}</div>
                  <div className="text-sm text-gray-600">{action}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 