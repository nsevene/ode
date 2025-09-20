import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Nfc, CheckCircle, Loader2 } from 'lucide-react';
import { useNFC } from '@/hooks/useNFC';
import { Alert, AlertDescription } from '@/components/ui/alert';

const NFCPassportDemo = () => {
  const {
    nfcSupported,
    passportData,
    isReading,
    error,
    startReading,
    stopReading,
    writeNFC,
  } = useNFC();

  const [userPoints, setUserPoints] = useState(0);

  const handleNFCRead = () => {
    if (isReading) {
      stopReading();
    } else {
      startReading();
    }
  };

  const handleWritePassport = async () => {
    const passportId = `passport_${Date.now()}`;
    const success = await writeNFC(
      JSON.stringify({
        type: 'taste_passport',
        id: passportId,
        points: 0,
        sectors_visited: [],
        created_at: new Date().toISOString(),
      })
    );

    if (success) {
      alert('NFC Passport создан успешно!');
    }
  };

  // Handle NFC tag data
  if (passportData) {
    try {
      const data = JSON.parse(passportData);
      if (data.type === 'taste_passport') {
        setUserPoints(data.points);
      }
    } catch (err) {
      console.error('Error parsing NFC data:', err);
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Nfc className="w-6 h-6" />
          NFC Taste Passport
        </CardTitle>
        <div className="flex justify-center">
          <Badge variant={nfcSupported ? 'default' : 'destructive'}>
            {nfcSupported ? 'NFC Supported' : 'NFC Unavailable'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {passportData && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Passport обнаружен! Баллы: {userPoints}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={handleNFCRead}
            disabled={!nfcSupported}
            variant={isReading ? 'destructive' : 'default'}
            className="w-full"
          >
            {isReading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Остановить сканирование
              </>
            ) : (
              <>
                <Nfc className="w-4 h-4 mr-2" />
                Сканировать NFC Passport
              </>
            )}
          </Button>

          <Button
            onClick={handleWritePassport}
            disabled={!nfcSupported}
            variant="outline"
            className="w-full"
          >
            <Nfc className="w-4 h-4 mr-2" />
            Создать NFC Passport
          </Button>
        </div>

        <div className="text-sm text-muted-foreground text-center">
          {nfcSupported
            ? 'Поднесите NFC метку к устройству для сканирования'
            : 'NFC unavailable. Use a device with NFC support'}
        </div>
      </CardContent>
    </Card>
  );
};

export default NFCPassportDemo;
