import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Smartphone, 
  QrCode, 
  Trophy, 
  Star, 
  CheckCircle, 
  Circle,
  Zap,
  Target,
  Award
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface NFCPassportTrackerProps {
  passportId?: string;
}

const TASTE_SECTORS = [
  { id: 'ferment', name: 'FERMENT', emoji: '🧪', color: 'from-purple-500 to-pink-500' },
  { id: 'smoke', name: 'SMOKE', emoji: '🔥', color: 'from-orange-500 to-red-500' },
  { id: 'spice', name: 'SPICE', emoji: '🌶️', color: 'from-red-500 to-yellow-500' },
  { id: 'umami', name: 'UMAMI', emoji: '🐟', color: 'from-blue-500 to-teal-500' },
  { id: 'sweet-salt', name: 'SWEET-SALT', emoji: '🍭', color: 'from-pink-500 to-purple-500' },
  { id: 'zero-waste', name: 'ZERO-WASTE', emoji: '♻️', color: 'from-green-500 to-emerald-500' },
  { id: 'local', name: 'LOCAL', emoji: '🏡', color: 'from-amber-500 to-orange-500' },
  { id: 'sour-herb', name: 'SOUR-HERB', emoji: '🌿', color: 'from-green-400 to-lime-500' }
];

const NFCPassportTracker = ({ passportId }: NFCPassportTrackerProps) => {
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loyaltyData, setLoyaltyData] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && isOpen) {
      fetchUserData();
    }
  }, [user, isOpen]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch progress
      const { data: progressData, error: progressError } = await supabase
        .from('taste_compass_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressError) throw progressError;

      // Fetch achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('taste_passport_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlock_date', { ascending: false });

      if (achievementsError) throw achievementsError;

      // Fetch loyalty data
      const { data: loyaltyData, error: loyaltyError } = await supabase
        .from('loyalty_programs')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (loyaltyError && loyaltyError.code !== 'PGRST116') throw loyaltyError;

      setUserProgress(progressData || []);
      setAchievements(achievementsData || []);
      setLoyaltyData(loyaltyData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const simulateNFCScan = async (sectorId: string) => {
    if (!user || isScanning) return;

    setIsScanning(true);
    try {
      // Call the database function to track NFC interaction
      const { error } = await supabase.rpc('track_nfc_interaction', {
        p_user_id: user.id,
        p_sector_name: sectorId
      });

      if (error) throw error;

      toast({
        title: "NFC Scan Successful!",
        description: `Recorded visit to ${TASTE_SECTORS.find(s => s.id === sectorId)?.name || 'Unknown'} sector`,
      });

      // Refresh data
      await fetchUserData();
    } catch (error: any) {
      console.error('Error tracking NFC interaction:', error);
      toast({
        title: "NFC Scan Failed",
        description: error.message || "Failed to record sector visit",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const getSectorProgress = (sectorId: string) => {
    return userProgress.find(p => p.sector_name === sectorId);
  };

  const getOverallStats = () => {
    const completedSectors = userProgress.filter(p => p.completed).length;
    const totalVisits = userProgress.reduce((sum, p) => sum + p.visit_count, 0);
    const totalNFCTaps = userProgress.reduce((sum, p) => sum + p.nfc_taps, 0);
    const completionPercentage = (completedSectors / 8) * 100;
    
    return {
      completedSectors,
      totalVisits,
      totalNFCTaps,
      completionPercentage,
      totalSectors: 8
    };
  };

  const stats = getOverallStats();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Smartphone className="h-5 w-5 mr-2" />
          NFC Passport
          {passportId && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {passportId}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            NFC Passport Tracker
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Passport Header */}
          <Card className="bg-gradient-to-r from-burgundy-primary/10 to-gold-accent/10 border-gold-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary rounded-full">
                    <QrCode className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Your Taste Passport</h3>
                    {passportId && (
                      <p className="text-sm text-muted-foreground">ID: {passportId}</p>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {stats.completedSectors}/8 Completed
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{Math.round(stats.completionPercentage)}%</span>
                </div>
                <Progress value={stats.completionPercentage} className="h-3" />
                
                <div className="grid grid-cols-3 gap-4 text-center pt-3">
                  <div>
                    <div className="text-2xl font-bold text-primary">{stats.totalVisits}</div>
                    <div className="text-xs text-muted-foreground">Total Visits</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">{stats.totalNFCTaps}</div>
                    <div className="text-xs text-muted-foreground">NFC Taps</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">{loyaltyData?.points || 0}</div>
                    <div className="text-xs text-muted-foreground">Loyalty Points</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sector Progress Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Taste Compass Sectors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {TASTE_SECTORS.map((sector) => {
                  const progress = getSectorProgress(sector.id);
                  const isCompleted = progress?.completed;
                  const visitCount = progress?.visit_count || 0;
                  const nfcTaps = progress?.nfc_taps || 0;
                  
                  return (
                    <Card 
                      key={sector.id}
                      className={`cursor-pointer transition-all hover:scale-105 ${
                        isCompleted ? 'ring-2 ring-green-500 bg-green-50' : ''
                      }`}
                      onClick={() => simulateNFCScan(sector.id)}
                    >
                      <CardContent className="p-4 text-center relative">
                        {/* Completion Status */}
                        <div className="absolute top-2 right-2">
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>

                        {/* Sector Icon */}
                        <div className={`text-3xl mb-2 p-3 rounded-full bg-gradient-to-br ${sector.color} text-white inline-block`}>
                          {sector.emoji}
                        </div>
                        
                        <h3 className="font-semibold text-sm mb-2">{sector.name}</h3>
                        
                        {/* Progress Info */}
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">
                            {visitCount}/3 visits
                          </div>
                          <Progress value={(visitCount / 3) * 100} className="h-1" />
                          
                          {nfcTaps > 0 && (
                            <Badge variant="outline" className="text-xs mt-1">
                              <Smartphone className="h-3 w-3 mr-1" />
                              {nfcTaps} taps
                            </Badge>
                          )}
                        </div>

                        {/* Scan Button */}
                        <Button 
                          size="sm" 
                          variant={isCompleted ? "default" : "outline"}
                          className="w-full mt-2"
                          disabled={isScanning}
                        >
                          {isScanning ? (
                            <div className="flex items-center gap-1">
                              <div className="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent" />
                              Scanning...
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              {isCompleted ? 'Visit Again' : 'Tap to Visit'}
                            </div>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          {achievements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.slice(0, 5).map((achievement) => (
                    <div key={achievement.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gold-accent rounded-full">
                          <Trophy className="h-4 w-4 text-gold-accent-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{achievement.achievement_name}</h4>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(achievement.unlock_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        +{achievement.reward_points}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Master Achievement Progress */}
          {stats.completedSectors > 0 && stats.completedSectors < 8 && (
            <Card className="bg-gradient-to-r from-gold-accent/10 to-burgundy-primary/10 border-gold-accent/30">
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 text-gold-accent mx-auto mb-2" />
                <h3 className="font-bold mb-1">Taste Compass Master</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Complete all 8 sectors to earn the ultimate achievement!
                </p>
                <Progress value={stats.completionPercentage} className="mb-2" />
                <p className="text-xs text-muted-foreground">
                  {8 - stats.completedSectors} sectors remaining
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NFCPassportTracker;