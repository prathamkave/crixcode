
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Play, RotateCcw, Clock } from 'lucide-react';

const FibonacciSolver = () => {
  const [n, setN] = useState(10);
  const [result, setResult] = useState<number | null>(null);
  const [steps, setSteps] = useState<Array<{step: number, value: number, memo: string}>>([]);
  const [chartData, setChartData] = useState<Array<{x: number, y: number}>>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const fibonacciWithMemo = (num: number) => {
    const memo: {[key: number]: number} = {};
    const steps: Array<{step: number, value: number, memo: string}> = [];
    let stepCount = 0;

    const fib = (n: number): number => {
      if (n <= 1) {
        steps.push({
          step: stepCount++,
          value: n,
          memo: JSON.stringify(memo)
        });
        return n;
      }
      
      if (memo[n]) {
        steps.push({
          step: stepCount++,
          value: memo[n],
          memo: `Retrieved fib(${n}) = ${memo[n]} from memo`
        });
        return memo[n];
      }
      
      memo[n] = fib(n - 1) + fib(n - 2);
      steps.push({
        step: stepCount++,
        value: memo[n],
        memo: `Computed fib(${n}) = ${memo[n]}`
      });
      
      return memo[n];
    };

    const result = fib(num);
    return { result, steps };
  };

  const solveFibonacci = () => {
    setIsAnimating(true);
    setCurrentStep(0);
    
    const { result: fibResult, steps: fibSteps } = fibonacciWithMemo(n);
    setResult(fibResult);
    setSteps(fibSteps);
    
    // Generate chart data
    const data = [];
    for (let i = 0; i <= n; i++) {
      const { result } = fibonacciWithMemo(i);
      data.push({ x: i, y: result });
    }
    setChartData(data);
    
    // Animate steps
    let stepIndex = 0;
    const animate = () => {
      if (stepIndex < fibSteps.length) {
        setCurrentStep(stepIndex);
        stepIndex++;
        setTimeout(animate, 500);
      } else {
        setIsAnimating(false);
      }
    };
    animate();
  };

  const reset = () => {
    setResult(null);
    setSteps([]);
    setChartData([]);
    setCurrentStep(0);
    setIsAnimating(false);
  };

  return (
    <div className="p-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">F</span>
          </div>
          <span>Fibonacci Sequence Solver</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <Label htmlFor="fibInput">Enter n (0-30)</Label>
            <Input
              id="fibInput"
              type="number"
              value={n}
              onChange={(e) => setN(Math.min(30, Math.max(0, parseInt(e.target.value) || 0)))}
              min="0"
              max="30"
              className="mt-1"
            />
          </div>
          <div className="flex items-end space-x-2">
            <Button 
              onClick={solveFibonacci} 
              disabled={isAnimating}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Play className="h-4 w-4 mr-2" />
              Solve
            </Button>
            <Button onClick={reset} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          {result !== null && (
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-green-600">
                F({n}) = {result.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Visualization */}
        {chartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Fibonacci Growth Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" label={{ value: 'n', position: 'insideBottom', offset: -10 }} />
                  <YAxis label={{ value: 'F(n)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [value.toLocaleString(), 'F(n)']} />
                  <Line 
                    type="monotone" 
                    dataKey="y" 
                    stroke="#8884d8" 
                    strokeWidth={3}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Steps Visualization */}
        {steps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Execution Steps {isAnimating && `(${currentStep + 1}/${steps.length})`}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {steps.slice(0, isAnimating ? currentStep + 1 : steps.length).map((step, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border transition-all duration-300 ${
                      index === currentStep && isAnimating 
                        ? 'bg-blue-100 border-blue-300' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm">Step {step.step + 1}</span>
                      <span className="font-bold text-blue-600">Value: {step.value}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{step.memo}</div>
                  </div>
                ))}
              </div>
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
                <p className="text-sm text-gray-600">O(n) with memoization</p>
                <p className="text-sm text-gray-600">O(2^n) without memoization</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Space Complexity</h4>
                <p className="text-sm text-gray-600">O(n) for memoization table</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-semibold mb-2">Formula</h4>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  F(n) = F(n-1) + F(n-2), where F(0) = 0, F(1) = 1
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </div>
  );
};

export default FibonacciSolver;
