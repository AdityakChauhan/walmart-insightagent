'use client';

import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Search, Filter, Eye, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { fetchInventory, fetchFullItemView } from '@/lib/api';
import { 
  formatNumber, 
  formatCurrency, 
  getActionEmoji, 
  getActionBadgeVariant, 
  getRiskColor,
  getCategoryColor 
} from '@/lib/utils';

// Lazy load heavy dialog component
const ItemDetailDialog = lazy(() => import('./ItemDetailDialog'));

// Debounce hook for search
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Debounce search term to reduce filtering frequency
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoized categories to prevent recalculation
  const categories = useMemo(() => {
    return [...new Set(inventory.map(item => item.category))];
  }, [inventory]);

  // Fetch inventory data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchInventory();
        setInventory(data);
        setFilteredInventory(data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
        // Mock data for development
        const mockData = [
          {
            item_id: 'SKU001',
            item_name: 'Organic Milk',
            category: 'Dairy',
            current_stock: 45,
            days_remaining: 3,
            risk_score: 85,
            recommended_action: 'DONATE',
            co2_saved_kg: 45.2,
            water_saved_liters: 2250,
            meals_saved: 150,
            sustainability_score: 92,
            tactical_note: '🔥 Donate to NGO today to avoid ₹450 loss and 45.2kg CO₂ waste.',
            confidence: '✅ Confident action'
          },
          {
            item_id: 'SKU002',
            item_name: 'Fresh Bread',
            category: 'Baked Goods',
            current_stock: 28,
            days_remaining: 1,
            risk_score: 92,
            recommended_action: 'MARKDOWN -30%',
            co2_saved_kg: 38.7,
            water_saved_liters: 1161,
            meals_saved: 93,
            sustainability_score: 88,
            tactical_note: '📉 Apply -30% markdown. Waste risk is HIGH.',
            confidence: '✅ Confident action'
          },
          {
            item_id: 'SKU003',
            item_name: 'Bananas',
            category: 'Produce',
            current_stock: 120,
            days_remaining: 2,
            risk_score: 78,
            recommended_action: 'MARKDOWN -10%',
            co2_saved_kg: 32.1,
            water_saved_liters: 3210,
            meals_saved: 400,
            sustainability_score: 85,
            tactical_note: '📉 Gentle markdown recommended. Stock high, days low.',
            confidence: '⚠️ Moderate confidence'
          }
        ];
        setInventory(mockData);
        setFilteredInventory(mockData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoized filtering logic to prevent recalculation
  const filteredData = useMemo(() => {
    let filtered = inventory;

    if (debouncedSearchTerm) {
      filtered = filtered.filter(item =>
        item.item_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        item.item_id.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    if (riskFilter && riskFilter !== 'all') {
      switch (riskFilter) {
        case 'high':
          filtered = filtered.filter(item => item.risk_score >= 75);
          break;
        case 'medium':
          filtered = filtered.filter(item => item.risk_score >= 50 && item.risk_score < 75);
          break;
        case 'low':
          filtered = filtered.filter(item => item.risk_score < 50);
          break;
      }
    }

    return filtered;
  }, [inventory, debouncedSearchTerm, categoryFilter, riskFilter]);

  // Update filtered inventory when filtered data changes
  useEffect(() => {
    setFilteredInventory(filteredData);
  }, [filteredData]);

  // Memoized item click handler
  const handleItemClick = useCallback(async (itemId) => {
    try {
      const itemDetail = await fetchFullItemView(itemId);
      setSelectedItem(itemDetail);
      setIsDetailOpen(true);
    } catch (error) {
      console.error('Error fetching item detail:', error);
      // Use basic item data if API fails
      const basicItem = inventory.find(item => item.item_id === itemId);
      setSelectedItem({ item: basicItem });
      setIsDetailOpen(true);
    }
  }, [inventory]);

  // Memoized table row component to prevent unnecessary re-renders
  const TableRowComponent = useCallback(({ item }) => (
    <TableRow key={item.item_id} className="hover:bg-gray-50 cursor-pointer">
      <TableCell>
        <div>
          <div className="font-medium">{item.item_name}</div>
          <div className="text-sm text-gray-500">{item.item_id}</div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={getCategoryColor(item.category)}>
          {item.category}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="font-medium">{item.current_stock}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1 text-gray-400" />
          {item.days_remaining}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Progress 
            value={item.risk_score} 
            className="w-16"
          />
          <span className="text-sm font-medium">{item.risk_score}%</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={getActionBadgeVariant(item.recommended_action)}>
          {getActionEmoji(item.recommended_action)} {item.recommended_action}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="text-green-600 font-semibold">
          {item.co2_saved_kg} kg
        </div>
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleItemClick(item.item_id)}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </TableCell>
    </TableRow>
  ), [handleItemClick]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inventory Explorer</h1>
        <p className="text-gray-600">Manage and analyze your inventory with AI-powered insights</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
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
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Risk Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="high">High Risk (&gt;=75%)</SelectItem>
                <SelectItem value="medium">Medium Risk (50-74%)</SelectItem>
                <SelectItem value="low">Low Risk (&lt;50%)</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600 flex items-center">
              {filteredInventory.length} of {inventory.length} items
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>
            Click on any item to view detailed information and AI recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Recommended Action</TableHead>
                <TableHead>CO₂ Saved</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRowComponent key={item.item_id} item={item} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Item Detail Dialog - Lazy Loaded */}
      <Suspense fallback={<div>Loading...</div>}>
        <ItemDetailDialog
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          selectedItem={selectedItem}
        />
      </Suspense>
    </div>
  );
} 