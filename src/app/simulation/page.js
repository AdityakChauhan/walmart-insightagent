'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FlaskConical, 
  Play, 
  RotateCcw, 
  TrendingUp, 
  Leaf, 
  Droplets, 
  Utensils,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  Award
} from 'lucide-react';
import { runSimulation, resetSimulation, fetchSustainabilityImpact } from '@/lib/api';
import { formatNumber, formatCurrency } from '@/lib/utils';

export default function SimulationPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [simulationResults, setSimulationResults] = useState(null);
  const [previousImpact, setPreviousImpact] = useState(null);
  const [currentImpact, setCurrentImpact] = useState(null);
  const [simulationHistory, setSimulationHistory] = useState([]);

  // Fetch current impact on mount
  useEffect(() => {
    const fetchImpact = async () => {
      try {
        const impact = await fetchSustainabilityImpact();
        setCurrentImpact(impact);
        setPreviousImpact(impact);
      } catch (error) {
        console.error('Error fetching impact:', error);
        // Mock data
        const mockImpact = {
          co2_kg: 4230,
          meals: 8920,
          water_liters: 12450
        };
        setCurrentImpact(mockImpact);
        setPreviousImpact(mockImpact);
      }
    };

    fetchImpact();
  }, []);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const results = await runSimulation();
      setSimulationResults(results);
      
      // Update current impact
      const newImpact = await fetchSustainabilityImpact();
      setPreviousImpact(currentImpact);
      setCurrentImpact(newImpact);
      
      // Add to history
      const historyEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        impact: newImpact,
        summary: results.summary
      };
      setSimulationHistory(prev => [historyEntry, ...prev.slice(0, 4)]);
      
    } catch (error) {
      console.error('Simulation error:', error);
      // Mock results for development
      const mockResults = {
        status: 'success',
        message: '1 day simulated',
        summary: {
          items_affected: 23,
          actions_taken: 15,
          total_co2_saved: 125.5,
          total_water_saved: 6250,
          total_meals_saved: 450,
          value_saved: 12500
        }
      };
      setSimulationResults(mockResults);
      
      // Mock impact update
      const mockNewImpact = {
        co2_kg: 4355.5,
        meals: 9370,
        water_liters: 18700
      };
      setPreviousImpact(currentImpact);
      setCurrentImpact(mockNewImpact);
      
      const historyEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        impact: mockNewImpact,
        summary: mockResults.summary
      };
      setSimulationHistory(prev => [historyEntry, ...prev.slice(0, 4)]);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await resetSimulation();
      setSimulationResults(null);
      setSimulationHistory([]);
      // Reset impact to initial state
      setCurrentImpact(previousImpact);
    } catch (error) {
      console.error('Reset error:', error);
    } finally {
      setIsResetting(false);
    }
  };

  const getImpactChange = (current, previous) => {
    if (!previous) return { value: 0, percentage: 0 };
    const change = current - previous;
    const percentage = previous > 0 ? (change / previous) * 100 : 0;
    return { value: change, percentage };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Simulation Lab</h1>
          <p className="text-gray-600">Test AI recommendations and see their impact in real-time</p>
        </div>
        <div className="flex space-x-4">
          <Button 
            onClick={handleReset} 
            disabled={isResetting}
            variant="outline"
          >
            {isResetting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                Resetting...
              </>
            ) : (
              <>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </>
            )}
          </Button>
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
                <Play className="h-4 w-4 mr-2" />
                Simulate One Day
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Simulation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FlaskConical className="h-5 w-5 mr-2 text-purple-600" />
            Simulation Controls
          </CardTitle>
          <CardDescription>
            Run AI-powered simulations to see how different scenarios affect your sustainability metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800">AI Analysis</h3>
              <p className="text-sm text-green-600">Analyzes current inventory and predicts waste</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-800">Action Simulation</h3>
              <p className="text-sm text-blue-600">Simulates recommended actions and their impact</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-800">Results Analysis</h3>
              <p className="text-sm text-purple-600">Shows sustainability improvements and savings</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact Comparison */}
      {currentImpact && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  {formatNumber(currentImpact.co2_kg)} kg
                </div>
                {previousImpact && (
                  <div className="text-xs text-gray-600 mt-1">
                    {getImpactChange(currentImpact.co2_kg, previousImpact.co2_kg).value > 0 ? '+' : ''}
                    {formatNumber(getImpactChange(currentImpact.co2_kg, previousImpact.co2_kg).value)} kg today
                  </div>
                )}
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
                  {formatNumber(currentImpact.water_liters)} L
                </div>
                {previousImpact && (
                  <div className="text-xs text-gray-600 mt-1">
                    {getImpactChange(currentImpact.water_liters, previousImpact.water_liters).value > 0 ? '+' : ''}
                    {formatNumber(getImpactChange(currentImpact.water_liters, previousImpact.water_liters).value)} L today
                  </div>
                )}
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
                  {formatNumber(currentImpact.meals)}
                </div>
                {previousImpact && (
                  <div className="text-xs text-gray-600 mt-1">
                    {getImpactChange(currentImpact.meals, previousImpact.meals).value > 0 ? '+' : ''}
                    {formatNumber(getImpactChange(currentImpact.meals, previousImpact.meals).value)} today
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Simulation Results */}
      <AnimatePresence>
        {simulationResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Simulation Complete!
                </CardTitle>
                <CardDescription className="text-green-700">
                  Here's what happened during today's simulation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {simulationResults.summary?.items_affected || 0}
                    </div>
                    <div className="text-sm text-gray-600">Items Affected</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {simulationResults.summary?.actions_taken || 0}
                    </div>
                    <div className="text-sm text-gray-600">Actions Taken</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(simulationResults.summary?.value_saved || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Value Saved</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {simulationResults.summary?.total_co2_saved || 0} kg
                    </div>
                    <div className="text-sm text-gray-600">CO₂ Saved Today</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulation History */}
      {simulationHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Simulation History</CardTitle>
            <CardDescription>
              Recent simulation runs and their impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {simulationHistory.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-green-600">
                        +{entry.summary?.total_co2_saved || 0} kg CO₂
                      </span>
                      <span className="text-blue-600">
                        +{entry.summary?.total_water_saved || 0} L Water
                      </span>
                      <span className="text-orange-600">
                        +{entry.summary?.total_meals_saved || 0} Meals
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    {entry.summary?.actions_taken || 0} Actions
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips and Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Run simulations daily</p>
                  <p className="text-xs text-gray-600">Check AI recommendations every morning</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Review high-impact items</p>
                  <p className="text-xs text-gray-600">Focus on items with highest waste potential</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Track progress over time</p>
                  <p className="text-xs text-gray-600">Monitor sustainability improvements</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-blue-600" />
              Simulation Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Start with one day</p>
                  <p className="text-xs text-gray-600">Simulate single days to see immediate impact</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Compare scenarios</p>
                  <p className="text-xs text-gray-600">Reset and try different approaches</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Share results</p>
                  <p className="text-xs text-gray-600">Use insights to improve team decisions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 