
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, Play, RotateCcw } from 'lucide-react';

interface Item {
  id: number;
  name: string;
  weight: number;
  value: number;
  selected?: boolean;
}

const KnapsackSolver = () => {
  const [capacity, setCapacity] = useState(50);
  const [items] = useState<Item[]>([
    { id: 1, name: 'Diamond Ring', weight: 1, value: 100 },
    { id: 2, name: 'Gold Watch', weight: 4, value: 40 },
    { id: 3, name: 'Silver Necklace', weight: 6, value: 30 },
    { id: 4, name: 'Laptop', weight: 8, value: 50 },
    { id: 5, name: 'Camera', weight: 2, value: 20 },
    { id: 6, name: 'Painting', weight: 10, value: 60 },
    { id: 7, name: 'Antique Vase', weight: 5, value: 35 },
    { id: 8, name: 'Book Collection', weight: 15, value: 25 }
  ]);
  const [solution, setSolution] = useState<{
    maxValue: number;
    selectedItems: Item[];
    dp: number[][];
  } | null>(null);

  const solveKnapsack = () => {
    const n = items.length;
    const dp: number[][] = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
    
    // Fill the DP table
    for (let i = 1; i <= n; i++) {
      for (let w = 1; w <= capacity; w++) {
        const currentItem = items[i - 1];
        if (currentItem.weight <= w) {
          dp[i][w] = Math.max(
            dp[i - 1][w], // Don't take the item
            dp[i - 1][w - currentItem.weight] + currentItem.value // Take the item
          );
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }
    
    // Backtrack to find selected items
    const selectedItems: Item[] = [];
    let w = capacity;
    for (let i = n; i > 0 && w > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        selectedItems.push(items[i - 1]);
        w -= items[i - 1].weight;
      }
    }
    
    setSolution({
      maxValue: dp[n][capacity],
      selectedItems: selectedItems.reverse(),
      dp
    });
  };

  const reset = () => {
    setSolution(null);
  };

  const chartData = items.map(item => ({
    name: item.name,
    weight: item.weight,
    value: item.value,
    ratio: item.value / item.weight,
    selected: solution?.selectedItems.some(selected => selected.id === item.id) || false
  }));

  return (
    <div className="p-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Package className="h-5 w-5 text-white" />
          </div>
          <span>0/1 Knapsack Problem</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <Label htmlFor="capacityInput">Knapsack Capacity</Label>
            <Input
              id="capacityInput"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value) || 50)}
              min="1"
              max="100"
              className="mt-1"
            />
          </div>
          <div className="flex items-end space-x-2">
            <Button 
              onClick={solveKnapsack}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              <Play className="h-4 w-4 mr-2" />
              Solve
            </Button>
            <Button onClick={reset} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          {solution && (
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-green-600">
                Max Value: {solution.maxValue}
              </div>
            </div>
          )}
        </div>

        {/* Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Available Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Item</th>
                    <th className="border border-gray-300 p-2 text-center">Weight</th>
                    <th className="border border-gray-300 p-2 text-center">Value</th>
                    <th className="border border-gray-300 p-2 text-center">Value/Weight</th>
                    <th className="border border-gray-300 p-2 text-center">Selected</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const isSelected = solution?.selectedItems.some(selected => selected.id === item.id) || false;
                    return (
                      <tr key={item.id} className={isSelected ? 'bg-green-100' : ''}>
                        <td className="border border-gray-300 p-2">{item.name}</td>
                        <td className="border border-gray-300 p-2 text-center">{item.weight}</td>
                        <td className="border border-gray-300 p-2 text-center">{item.value}</td>
                        <td className="border border-gray-300 p-2 text-center">
                          {(item.value / item.weight).toFixed(2)}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {isSelected ? (
                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                              ✓ Selected
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Solution Visualization */}
        {solution && (
          <Card>
            <CardHeader>
              <CardTitle>Solution Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Selected Items Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Weight:</span>
                      <span className="font-bold">
                        {solution.selectedItems.reduce((sum, item) => sum + item.weight, 0)} / {capacity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Value:</span>
                      <span className="font-bold text-green-600">{solution.maxValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Items Count:</span>
                      <span className="font-bold">{solution.selectedItems.length}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Capacity Utilization</h4>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full"
                      style={{ 
                        width: `${(solution.selectedItems.reduce((sum, item) => sum + item.weight, 0) / capacity) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {((solution.selectedItems.reduce((sum, item) => sum + item.weight, 0) / capacity) * 100).toFixed(1)}% utilized
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chart Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Items Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="value" 
                  fill="#8884d8" 
                  name="Value"
                />
                <Bar 
                  dataKey="weight" 
                  fill="#82ca9d" 
                  name="Weight"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Algorithm Info */}
        <Card>
          <CardHeader>
            <CardTitle>Algorithm Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Time Complexity</h4>
                <p className="text-sm text-gray-600">O(n × W) where n = items, W = capacity</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Space Complexity</h4>
                <p className="text-sm text-gray-600">O(n × W) for DP table</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-semibold mb-2">Recurrence Relation</h4>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm block">
                  dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </div>
  );
};

export default KnapsackSolver;
