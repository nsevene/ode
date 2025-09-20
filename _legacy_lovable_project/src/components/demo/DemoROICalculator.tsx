import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Calendar,
  BarChart,
} from 'lucide-react';
import { track } from '@/lib/analytics';

const DemoROICalculator = () => {
  const [scenario, setScenario] = useState<
    'conservative' | 'ambitious' | 'custom'
  >('conservative');
  const [customValues, setCustomValues] = useState({
    spaceSize: 15, // m²
    capex: 8000000, // IDR
    avgTicket: 150000, // IDR
    dailyCustomers: 25,
    revenueShare: 15, // %
    operatingCosts: 2000000, // IDR monthly
  });

  const scenarios = {
    conservative: {
      spaceSize: 12,
      capex: 6000000,
      avgTicket: 120000,
      dailyCustomers: 20,
      revenueShare: 18,
      operatingCosts: 1500000,
    },
    ambitious: {
      spaceSize: 25,
      capex: 15000000,
      avgTicket: 200000,
      dailyCustomers: 45,
      revenueShare: 12,
      operatingCosts: 3500000,
    },
  };

  const getValues = () => {
    if (scenario === 'custom') return customValues;
    return scenarios[scenario];
  };

  const calculateROI = () => {
    const values = getValues();
    const monthlyRevenue = values.avgTicket * values.dailyCustomers * 30;
    const monthlyRevenueShare = monthlyRevenue * (values.revenueShare / 100);
    const monthlyProfit = monthlyRevenueShare - values.operatingCosts;
    const paybackMonths = values.capex / monthlyProfit;
    const annualROI = ((monthlyProfit * 12) / values.capex) * 100;

    return {
      monthlyRevenue,
      monthlyRevenueShare,
      monthlyProfit,
      paybackMonths,
      annualROI,
    };
  };

  const formatIDR = (amount: number) => {
    return `Rp ${(amount / 1000000).toFixed(1)}M`;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('id-ID');
  };

  const handleScenarioChange = (
    newScenario: 'conservative' | 'ambitious' | 'custom'
  ) => {
    setScenario(newScenario);
    track('roi_calc_scenario_change', { scenario: newScenario });
  };

  const handleCustomValueChange = (key: string, value: number[]) => {
    setCustomValues({ ...customValues, [key]: value[0] });
  };

  const handleCalculate = () => {
    const results = calculateROI();
    track('roi_calc_submit', {
      scenario,
      payback_months: results.paybackMonths,
      annual_roi: results.annualROI,
    });
  };

  const results = calculateROI();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-charcoal-dark mb-3">
          ROI Calculator Demo
        </h2>
        <p className="text-charcoal-medium max-w-2xl mx-auto">
          Model your investment returns with real market scenarios. Adjust
          parameters to see how different variables affect your payback period
          and ROI.
        </p>
      </div>

      {/* Scenario Selector */}
      <div className="flex justify-center gap-2">
        {(['conservative', 'ambitious', 'custom'] as const).map(
          (scenarioOption) => (
            <Button
              key={scenarioOption}
              variant={scenario === scenarioOption ? 'default' : 'outline'}
              onClick={() => handleScenarioChange(scenarioOption)}
              className="capitalize"
            >
              {scenarioOption === 'conservative' && (
                <TrendingUp className="w-4 h-4 mr-2" />
              )}
              {scenarioOption === 'ambitious' && (
                <BarChart className="w-4 h-4 mr-2" />
              )}
              {scenarioOption === 'custom' && (
                <Calculator className="w-4 h-4 mr-2" />
              )}
              {scenarioOption}
            </Button>
          )
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Parameters */}
        <Card className="bg-pure-white/80 backdrop-blur">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-charcoal-dark mb-4">
              Investment Parameters
            </h3>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-charcoal-dark mb-2 block">
                  Space Size: {getValues().spaceSize} m²
                </label>
                {scenario === 'custom' && (
                  <Slider
                    value={[customValues.spaceSize]}
                    onValueChange={(value) =>
                      handleCustomValueChange('spaceSize', value)
                    }
                    max={50}
                    min={8}
                    step={1}
                    className="w-full"
                  />
                )}
                {scenario !== 'custom' && (
                  <div className="w-full bg-cream-light h-2 rounded-full">
                    <div
                      className="bg-burgundy-primary h-2 rounded-full"
                      style={{
                        width: `${(getValues().spaceSize / 50) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-charcoal-dark mb-2 block">
                  Initial Investment (CAPEX): {formatIDR(getValues().capex)}
                </label>
                {scenario === 'custom' && (
                  <Slider
                    value={[customValues.capex]}
                    onValueChange={(value) =>
                      handleCustomValueChange('capex', value)
                    }
                    max={25000000}
                    min={3000000}
                    step={500000}
                    className="w-full"
                  />
                )}
                {scenario !== 'custom' && (
                  <div className="w-full bg-cream-light h-2 rounded-full">
                    <div
                      className="bg-burgundy-primary h-2 rounded-full"
                      style={{
                        width: `${(getValues().capex / 25000000) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-charcoal-dark mb-2 block">
                  Average Ticket: Rp {formatNumber(getValues().avgTicket)}
                </label>
                {scenario === 'custom' && (
                  <Slider
                    value={[customValues.avgTicket]}
                    onValueChange={(value) =>
                      handleCustomValueChange('avgTicket', value)
                    }
                    max={300000}
                    min={80000}
                    step={10000}
                    className="w-full"
                  />
                )}
                {scenario !== 'custom' && (
                  <div className="w-full bg-cream-light h-2 rounded-full">
                    <div
                      className="bg-burgundy-primary h-2 rounded-full"
                      style={{
                        width: `${((getValues().avgTicket - 80000) / 220000) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-charcoal-dark mb-2 block">
                  Daily Customers: {getValues().dailyCustomers}
                </label>
                {scenario === 'custom' && (
                  <Slider
                    value={[customValues.dailyCustomers]}
                    onValueChange={(value) =>
                      handleCustomValueChange('dailyCustomers', value)
                    }
                    max={80}
                    min={10}
                    step={1}
                    className="w-full"
                  />
                )}
                {scenario !== 'custom' && (
                  <div className="w-full bg-cream-light h-2 rounded-full">
                    <div
                      className="bg-burgundy-primary h-2 rounded-full"
                      style={{
                        width: `${(getValues().dailyCustomers / 80) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-charcoal-dark mb-2 block">
                  Revenue Share: {getValues().revenueShare}%
                </label>
                {scenario === 'custom' && (
                  <Slider
                    value={[customValues.revenueShare]}
                    onValueChange={(value) =>
                      handleCustomValueChange('revenueShare', value)
                    }
                    max={25}
                    min={10}
                    step={1}
                    className="w-full"
                  />
                )}
                {scenario !== 'custom' && (
                  <div className="w-full bg-cream-light h-2 rounded-full">
                    <div
                      className="bg-burgundy-primary h-2 rounded-full"
                      style={{
                        width: `${((getValues().revenueShare - 10) / 15) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-gradient-to-br from-burgundy-primary to-burgundy-dark text-pure-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Financial Projections
            </h3>

            <div className="space-y-4">
              <div className="bg-pure-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm text-burgundy-light">
                    Monthly Revenue
                  </span>
                </div>
                <div className="text-2xl font-bold">
                  {formatIDR(results.monthlyRevenue)}
                </div>
              </div>

              <div className="bg-pure-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm text-burgundy-light">
                    Your Share ({getValues().revenueShare}%)
                  </span>
                </div>
                <div className="text-2xl font-bold">
                  {formatIDR(results.monthlyRevenueShare)}
                </div>
              </div>

              <div className="bg-pure-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm text-burgundy-light">
                    Payback Period
                  </span>
                </div>
                <div className="text-2xl font-bold">
                  {Math.ceil(results.paybackMonths)} months
                </div>
              </div>

              <div className="bg-mustard-accent/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart className="w-4 h-4 text-mustard-accent" />
                  <span className="text-sm text-mustard-accent">
                    Annual ROI
                  </span>
                </div>
                <div className="text-3xl font-bold text-mustard-accent">
                  {results.annualROI.toFixed(1)}%
                </div>
              </div>

              <div className="pt-4 border-t border-pure-white/20">
                <div className="text-xs text-burgundy-light mb-2">
                  ROI Status:
                </div>
                <Badge
                  className={`${
                    results.annualROI >= 25
                      ? 'bg-green-500'
                      : results.annualROI >= 15
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  } text-pure-white`}
                >
                  {results.annualROI >= 25
                    ? 'Excellent'
                    : results.annualROI >= 15
                      ? 'Good'
                      : 'Below Target'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Button */}
      <div className="text-center">
        <Button
          onClick={handleCalculate}
          size="lg"
          className="bg-burgundy-primary hover:bg-burgundy-dark text-pure-white px-8"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Calculate Full Business Plan
        </Button>
        <p className="text-xs text-charcoal-medium mt-2">
          *All projections are illustrative and based on market research
        </p>
      </div>
    </div>
  );
};

export default DemoROICalculator;
