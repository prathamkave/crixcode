
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Code, Play, RotateCcw } from 'lucide-react';

const LCSSolver = () => {
  const [string1, setString1] = useState('AGGTAB');
  const [string2, setString2] = useState('GXTXAYB');
  const [solution, setSolution] = useState<{
    lcs: string;
    length: number;
    dp: number[][];
    path: Array<{i: number, j: number}>;
  } | null>(null);

  const solveLCS = () => {
    const m = string1.length;
    const n = string2.length;
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    // Fill DP table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (string1[i - 1] === string2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    
    // Backtrack to find LCS
    let lcs = '';
    const path: Array<{i: number, j: number}> = [];
    let i = m, j = n;
    
    while (i > 0 && j > 0) {
      if (string1[i - 1] === string2[j - 1]) {
        lcs = string1[i - 1] + lcs;
        path.unshift({i: i - 1, j: j - 1});
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
    
    setSolution({
      lcs,
      length: dp[m][n],
      dp,
      path
    });
  };

  const reset = () => {
    setSolution(null);
  };

  const renderDPTable = () => {
    if (!solution) return null;

    return (
      <div className="overflow-x-auto">
        <table className="border-collapse border border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-100"></th>
              <th className="border border-gray-300 p-2 bg-gray-100">ε</th>
              {string2.split('').map((char, j) => (
                <th key={j} className="border border-gray-300 p-2 bg-gray-100">{char}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-100">ε</th>
              {solution.dp[0].map((val, j) => (
                <td key={j} className="border border-gray-300 p-2 text-center">{val}</td>
              ))}
            </tr>
            {string1.split('').map((char, i) => (
              <tr key={i}>
                <th className="border border-gray-300 p-2 bg-gray-100">{char}</th>
                {solution.dp[i + 1].map((val, j) => (
                  <td 
                    key={j} 
                    className={`border border-gray-300 p-2 text-center ${
                      string1[i] === string2[j - 1] && j > 0 ? 'bg-green-100' : ''
                    }`}
                  >
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderStringComparison = () => {
    if (!solution) return null;

    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">String 1: {string1}</h4>
          <div className="flex space-x-1">
            {string1.split('').map((char, i) => (
              <div
                key={i}
                className={`w-8 h-8 border rounded flex items-center justify-center font-mono ${
                  solution.path.some(p => p.i === i) 
                    ? 'bg-green-500 text-white border-green-500' 
                    : 'bg-gray-100 border-gray-300'
                }`}
              >
                {char}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">String 2: {string2}</h4>
          <div className="flex space-x-1">
            {string2.split('').map((char, j) => (
              <div
                key={j}
                className={`w-8 h-8 border rounded flex items-center justify-center font-mono ${
                  solution.path.some(p => p.j === j) 
                    ? 'bg-green-500 text-white border-green-500' 
                    : 'bg-gray-100 border-gray-300'
                }`}
              >
                {char}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">LCS: {solution.lcs}</h4>
          <div className="flex space-x-1">
            {solution.lcs.split('').map((char, i) => (
              <div
                key={i}
                className="w-8 h-8 border rounded flex items-center justify-center font-mono bg-blue-500 text-white border-blue-500"
              >
                {char}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Code className="h-5 w-5 text-white" />
          </div>
          <span>Longest Common Subsequence</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <Label htmlFor="string1Input">String 1</Label>
            <Input
              id="string1Input"
              value={string1}
              onChange={(e) => setString1(e.target.value.toUpperCase())}
              placeholder="Enter first string"
              className="mt-1 font-mono"
            />
          </div>
          <div>
            <Label htmlFor="string2Input">String 2</Label>
            <Input
              id="string2Input"
              value={string2}
              onChange={(e) => setString2(e.target.value.toUpperCase())}
              placeholder="Enter second string"
              className="mt-1 font-mono"
            />
          </div>
          <div className="flex items-end space-x-2">
            <Button 
              onClick={solveLCS}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Play className="h-4 w-4 mr-2" />
              Find LCS
            </Button>
            <Button onClick={reset} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Solution Summary */}
        {solution && (
          <Card>
            <CardHeader>
              <CardTitle>Solution Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{solution.length}</div>
                  <div className="text-sm text-gray-600">LCS Length</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 font-mono">{solution.lcs}</div>
                  <div className="text-sm text-gray-600">LCS String</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {((solution.length / Math.max(string1.length, string2.length)) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Similarity</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* String Visualization */}
        {solution && (
          <Card>
            <CardHeader>
              <CardTitle>String Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              {renderStringComparison()}
            </CardContent>
          </Card>
        )}

        {/* DP Table */}
        {solution && (
          <Card>
            <CardHeader>
              <CardTitle>Dynamic Programming Table</CardTitle>
            </CardHeader>
            <CardContent>
              {renderDPTable()}
              <div className="mt-4 text-sm text-gray-600">
                <p><span className="inline-block w-4 h-4 bg-green-100 mr-2"></span>Character match</p>
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
                <p className="text-sm text-gray-600">O(m × n) where m, n are string lengths</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Space Complexity</h4>
                <p className="text-sm text-gray-600">O(m × n) for DP table</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-semibold mb-2">Recurrence Relation</h4>
                <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                  <div>if (s1[i] == s2[j]):</div>
                  <div className="ml-4">dp[i][j] = dp[i-1][j-1] + 1</div>
                  <div>else:</div>
                  <div className="ml-4">dp[i][j] = max(dp[i-1][j], dp[i][j-1])</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </div>
  );
};

export default LCSSolver;
