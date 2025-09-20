import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { track } from '@/lib/analytics';

export default function AgeGate21() {
  const [ok, setOk] = React.useState<boolean>(false);

  React.useEffect(() => {
    const v = localStorage.getItem('ode_age21');
    setOk(v === 'yes');
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('ode_age21', 'yes');
    setOk(true);
    track('age21_confirmed', { page: window.location.pathname });
  };

  if (ok) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-sm p-6 text-center space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">21+ Confirmation</h3>
          <p className="text-sm text-muted-foreground">
            By continuing you confirm you are 21+ and eligible for alcoholic
            experiences on 2F.
          </p>
        </div>
        <Button onClick={handleConfirm} className="w-full">
          I am 21+
        </Button>
      </Card>
    </div>
  );
}
