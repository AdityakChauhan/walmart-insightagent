'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, Filter, Clock, User, Bot, Calendar } from 'lucide-react';
import { fetchItemLog } from '@/lib/api';
import { 
  getActionEmoji, 
  getActionBadgeVariant, 
  formatTimestamp,
  formatCurrency 
} from '@/lib/utils';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Mock logs data for development
  useEffect(() => {
    const mockLogs = [
      {
        timestamp: '2024-01-15T10:30:00',
        item_id: 'SKU001',
        item_name: 'Organic Milk',
        action_type: 'DONATE',
        quantity: 45,
        reason: '🔥 Donate to NGO today to avoid ₹450 loss and 45.2kg CO₂ waste.',
        value: 450,
        co2_saved_kg: 45.2,
        water_saved_liters: 2250,
        meals_saved: 150,
        source: 'AI'
      },
      {
        timestamp: '2024-01-15T09:15:00',
        item_id: 'SKU002',
        item_name: 'Fresh Bread',
        action_type: 'MARKDOWN -30%',
        quantity: 28,
        reason: '📉 Apply -30% markdown. Waste risk is HIGH.',
        value: 320,
        co2_saved_kg: 38.7,
        water_saved_liters: 1161,
        meals_saved: 93,
        source: 'Human'
      },
      {
        timestamp: '2024-01-15T08:45:00',
        item_id: 'SKU003',
        item_name: 'Bananas',
        action_type: 'MARKDOWN -10%',
        quantity: 120,
        reason: '📉 Gentle markdown recommended. Stock high, days low.',
        value: 180,
        co2_saved_kg: 32.1,
        water_saved_liters: 3210,
        meals_saved: 400,
        source: 'AI'
      },
      {
        timestamp: '2024-01-14T16:20:00',
        item_id: 'SKU004',
        item_name: 'Chicken Breast',
        action_type: 'RETURN TO SUPPLIER',
        quantity: 15,
        reason: '↩️ Consider returning stock. ₹300 at risk.',
        value: 300,
        co2_saved_kg: 75.0,
        water_saved_liters: 37500,
        meals_saved: 75,
        source: 'AI'
      }
    ];

    setLogs(mockLogs);
    setFilteredLogs(mockLogs);
    setIsLoading(false);
  }, []);

  // Filter logs
  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.item_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (actionFilter && actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action_type === actionFilter);
    }

    if (dateFilter && dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate.toDateString() === today.toDateString();
          });
          break;
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate >= filterDate;
          });
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate >= filterDate;
          });
          break;
      }
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, actionFilter, dateFilter]);

  const getSourceIcon = (source) => {
    return source === 'AI' ? <Bot className="h-4 w-4 text-blue-600" /> : <User className="h-4 w-4 text-green-600" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading action logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Action Logbook</h1>
        <p className="text-gray-600">Complete history of all inventory actions and decisions</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
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
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600 flex items-center">
              {filteredLogs.length} of {logs.length} actions
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Action Timeline</CardTitle>
          <CardDescription>
            Chronological view of all inventory actions with AI and human decisions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log, index) => (
              <div key={index} className="border-l-2 border-green-200 pl-4 relative">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-green-500 rounded-full"></div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getSourceIcon(log.source)}
                        <span className="text-sm font-medium text-gray-600">
                          {log.source === 'AI' ? 'AI Decision' : 'Human Action'}
                        </span>
                      </div>
                      <Badge variant={getActionBadgeVariant(log.action_type)}>
                        {getActionEmoji(log.action_type)} {log.action_type}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatTimestamp(log.timestamp)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-lg">{log.item_name}</h4>
                      <p className="text-sm text-gray-600">SKU: {log.item_id}</p>
                      <p className="text-sm text-gray-600 mt-2">Quantity: {log.quantity} units</p>
                      <p className="text-sm text-gray-600">Value: {formatCurrency(log.value)}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-700 mb-2">{log.reason}</p>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center p-2 bg-green-100 rounded">
                          <div className="font-semibold text-green-700">{log.co2_saved_kg}</div>
                          <div className="text-green-600">kg CO₂</div>
                        </div>
                        <div className="text-center p-2 bg-blue-100 rounded">
                          <div className="font-semibold text-blue-700">{log.water_saved_liters}</div>
                          <div className="text-blue-600">L Water</div>
                        </div>
                        <div className="text-center p-2 bg-orange-100 rounded">
                          <div className="font-semibold text-orange-700">{log.meals_saved}</div>
                          <div className="text-orange-600">Meals</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No actions found for the selected filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredLogs.length}</div>
            <p className="text-xs text-gray-600 mt-1">
              In selected period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Decisions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {filteredLogs.filter(log => log.source === 'AI').length}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Automated recommendations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Human Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredLogs.filter(log => log.source === 'Human').length}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Manual decisions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(filteredLogs.reduce((sum, log) => sum + log.value, 0))}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Potential waste prevented
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 