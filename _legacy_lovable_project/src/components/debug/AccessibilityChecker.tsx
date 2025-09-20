import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Keyboard,
  Users,
} from 'lucide-react';

const AccessibilityChecker = () => {
  const checkStatus = (passed: boolean) =>
    passed ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );

  const accessibilityChecks = [
    {
      category: 'Visual',
      icon: <Eye className="h-5 w-5" />,
      checks: [
        {
          name: 'Color contrast ratio',
          passed: true,
          detail: '4.5:1 minimum achieved',
        },
        {
          name: 'Focus indicators',
          passed: false,
          detail: 'Missing on some interactive elements',
        },
        {
          name: 'Alt text for images',
          passed: true,
          detail: 'All images have descriptive alt text',
        },
        {
          name: 'Text scaling',
          passed: true,
          detail: 'Text readable at 200% zoom',
        },
      ],
    },
    {
      category: 'Keyboard Navigation',
      icon: <Keyboard className="h-5 w-5" />,
      checks: [
        {
          name: 'Tab order',
          passed: false,
          detail: 'Logical tab sequence needed',
        },
        {
          name: 'Skip links',
          passed: false,
          detail: 'Skip to main content missing',
        },
        {
          name: 'Keyboard shortcuts',
          passed: true,
          detail: 'Standard shortcuts work',
        },
        {
          name: 'Focus management',
          passed: false,
          detail: 'Modal focus trapping needed',
        },
      ],
    },
    {
      category: 'Screen Reader',
      icon: <Users className="h-5 w-5" />,
      checks: [
        {
          name: 'ARIA labels',
          passed: false,
          detail: 'Missing on forms and navigation',
        },
        {
          name: 'Semantic HTML',
          passed: true,
          detail: 'Proper heading structure used',
        },
        {
          name: 'ARIA roles',
          passed: false,
          detail: 'Interactive elements need roles',
        },
        {
          name: 'Live regions',
          passed: false,
          detail: 'Status updates not announced',
        },
      ],
    },
  ];

  const totalChecks = accessibilityChecks.reduce(
    (acc, cat) => acc + cat.checks.length,
    0
  );
  const passedChecks = accessibilityChecks.reduce(
    (acc, cat) => acc + cat.checks.filter((check) => check.passed).length,
    0
  );
  const score = Math.round((passedChecks / totalChecks) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Accessibility Audit
        </CardTitle>
        <div className="text-center">
          <div
            className={`text-3xl font-bold ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}
          >
            {score}%
          </div>
          <p className="text-sm text-muted-foreground">
            {passedChecks} of {totalChecks} checks passed
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {accessibilityChecks.map((category) => (
          <div key={category.category}>
            <div className="flex items-center gap-2 mb-3">
              {category.icon}
              <h3 className="font-semibold">{category.category}</h3>
            </div>
            <div className="space-y-2 ml-7">
              {category.checks.map((check) => (
                <div
                  key={check.name}
                  className="flex items-start justify-between"
                >
                  <div className="flex items-center gap-2">
                    {checkStatus(check.passed)}
                    <span className="text-sm">{check.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground max-w-xs text-right">
                    {check.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Priority Fixes:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Add ARIA labels to navigation and forms</li>
            <li>• Implement skip links for main content</li>
            <li>• Add focus indicators to all interactive elements</li>
            <li>• Set up ARIA live regions for dynamic content</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilityChecker;
