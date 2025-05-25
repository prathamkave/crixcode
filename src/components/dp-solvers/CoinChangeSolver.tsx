
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Coins, Play, RotateCcw } from 'lucide-react';

const CoinChangeSolver = () => {
  const [targetAmount, setTargetAmount] = useState(23);
  const [coins] = useState([1, 5, 10, 25]); // penny, nickel, dime, quarter
  const [solution, setSolution] = useState<{
    minCoins: number;
    coinCount: {[key: number]: number};
    dp: number[];
    coinsUsed: number[];
  } | null>(null);

  const solveCoinChange = () => {
    const dp = Array(targetAmount + 1).fill(Infinity);
    const coinsUsed = Array(targetAmount + 1).fill(-1);
    dp[0] = 0;

    for (let amount = 1; amount <= targetAmount; amount++) {
      for (const coin of coins) {
        if (coin <= amount && dp[amount - coin] + 1 < dp[amount]) {
          dp[amount] = dp[amount - coin] + 1;
          coinsUsed[amount] = coin;
        }
      }
    }

    // Count coins used
    const coinCount: {[key: number]: number} = {};
    coins.forEach(coin => coinCount[coin] = 0);
    
    let currentAmount = targetAmount;
    while (currentAmount > 0) {
      const coinUsed = coinsUsed[currentAmount];
      coinCount[coinUsed]++;
      currentAmount -= coinUsed;
    }

    setSolution({
      minCoins: dp[targetAmount],
      coinCount,
      dp,
      coinsUsed
    });
  };

  const reset = () => {
    setSolution(null);
  };

  const getCoinName = (value: number) => {
    switch (value) {
      case 1: return 'Penny';
      case 5: return 'Nickel';
      case 10: return 'Dime';
      case 25: return 'Quarter';
      default: return `${value}¢`;
    }
  };

  const pieData = solution ? coins.map(coin => ({
    name: getCoinName(coin),
    value: solution.coinCount[coin],
    amount: coin
  })).filter(item => item.value > 0) : [];

  const dpData = solution ? solution.dp.map((value, index) => ({
    amount: index,
    minCoins: value === Infinity ? 0 : value
  })).slice(1) : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Coins className="h-5 w-5 text-white" />
          </div>
          <span>Coin Change Problem</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <Label htmlFor="amountInput">Target Amount ($)</Label>
            <Input
              id="amountInput"
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max="100"
              className="mt-1"
            />
          </div>
          <div className="flex items-end space-x-2">
            <Button 
              onClick={solveCoinChange}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
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
              <div className="text-2xl font-bold text-orange-600">
                {solution.minCoins} coins
              </div>
            </div>
          )}
        </div>

        {/* Available Coins */}
        <Card>
          <CardHeader>
            <CardTitle>Available Coins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {coins.map((coin) => (
                <div key={coin} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-700">{coin}$</div>
                  <div className="text-sm text-gray-600">{getCoinName(coin)}</div>
                  {solution && (
                    <div className="mt-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        × {solution.coinCount[coin]}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Solution Visualization */}
        {solution && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Coin Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Solution Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span>Target Amount:</span>
                    <span className="font-bold text-orange-600">{targetAmount}$</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span>Minimum Coins:</span>
                    <span className="font-bold text-green-600">{solution.minCoins}</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Coins Used:</h4>
                    {coins.map(coin => solution.coinCount[coin] > 0 && (
                      <div key={coin} className="flex justify-between items-center">
                        <span>{getCoinName(coin)} ({coin}¢)</span>
                        <span className="font-bold">{solution.coinCount[coin]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* DP Table Visualization */}
        {solution && (
          <Card>
            <CardHeader>
              <CardTitle>Minimum Coins for Each Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dpData.slice(0, 30)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="amount" label={{ value: 'Amount ($)', position: 'insideBottom', offset: -10 }} />
                  <YAxis label={{ value: 'Min Coins', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [value, 'Min Coins']} />
                  <Bar dataKey="minCoins" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Algorithm Info */}
        <Card>
          <CardHeader>
            <CardTitle>Algorithm Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Time Complexity</h4>
                <p className="text-sm text-gray-600">O(amount × coins) where amount is target and coins is number of coin types</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Space Complexity</h4>
                <p className="text-sm text-gray-600">O(amount) for DP array</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-semibold mb-2">Recurrence Relation</h4>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm block">
                  dp[amount] = min(dp[amount - coin] + 1) for all coins ≤ amount
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </div>
  );
};

export default CoinChangeSolver;
