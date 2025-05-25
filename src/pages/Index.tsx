
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, TrendingUp, Layers, Zap } from 'lucide-react';
import FibonacciSolver from '@/components/dp-solvers/FibonacciSolver';
import KnapsackSolver from '@/components/dp-solvers/KnapsackSolver';
import LCSSolver from '@/components/dp-solvers/LCSSolver';
import CoinChangeSolver from '@/components/dp-solvers/CoinChangeSolver';

const Index = () => {
  const [activeTab, setActiveTab] = useState('fibonacci');

  const problems = [
    {
      id: 'fibonacci',
      name: 'Fibonacci Sequence',
      description: 'Classic DP problem with memoization',
      icon: TrendingUp,
      difficulty: 'Easy'
    },
    {
      id: 'knapsack',
      name: '0/1 Knapsack',
      description: 'Optimization problem with weight constraints',
      icon: Layers,
      difficulty: 'Medium'
    },
    {
      id: 'lcs',
      name: 'Longest Common Subsequence',
      description: 'String matching with dynamic programming',
      icon: Code,
      difficulty: 'Medium'
    },
    {
      id: 'coinchange',
      name: 'Coin Change',
      description: 'Minimum coins needed for target amount',
      icon: Zap,
      difficulty: 'Easy'
    }
  ];

  const renderSolver = () => {
    switch (activeTab) {
      case 'fibonacci':
        return <FibonacciSolver />;
      case 'knapsack':
        return <KnapsackSolver />;
      case 'lcs':
        return <LCSSolver />;
      case 'coinchange':
        return <CoinChangeSolver />;
      default:
        return <FibonacciSolver />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CrixDP
                </h1>
                <p className="text-sm text-gray-600">Dynamic Programming Solver</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Premium Edition
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Master Dynamic Programming
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Interactive visualizations and step-by-step solutions for classic DP problems. 
            Learn, practice, and understand the beauty of dynamic programming.
          </p>
        </div>

        {/* Problem Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {problems.map((problem) => {
            const IconComponent = problem.icon;
            return (
              <Card 
                key={problem.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                  activeTab === problem.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(problem.id)}
              >
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-3">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{problem.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600 mb-3">{problem.description}</p>
                  <Badge 
                    variant={problem.difficulty === 'Easy' ? 'secondary' : 'default'}
                    className={
                      problem.difficulty === 'Easy' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {problem.difficulty}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Active Solver */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {renderSolver()}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600">
          <p className="text-sm">
            Built with React, TypeScript, and Tailwind CSS • CrixDP Professional Edition
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
