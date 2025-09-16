
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Crown, Star, Users, Clock, Target, Medal } from "lucide-react";
import { useTasteAlleyData } from '@/hooks/useTasteAlleyData';
import { useAuth } from '@/hooks/useAuth';

const DatabaseLeaderboard = () => {
  const { user } = useAuth();
  const { leaderboard, progress, loading } = useTasteAlleyData();

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-muted rounded" />
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const currentUserEntry = leaderboard.find(entry => entry.user_id === user?.id);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Medal className="h-5 w-5 text-amber-600" />;
      default: return <Trophy className="h-5 w-5 text-gray-400" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-amber-400 to-amber-600';
      default: return 'from-gray-200 to-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Current User Rank */}
      {currentUserEntry && (
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-emerald-600" />
              Your Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-4xl">👤</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold">{currentUserEntry.display_name}</h3>
                  <Badge variant="outline" className="bg-emerald-100 text-emerald-800">
                    Level {currentUserEntry.user_level}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-emerald-600">#{currentUserEntry.current_rank}</div>
                    <div className="text-muted-foreground">Rank</div>
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-600">{currentUserEntry.total_score}</div>
                    <div className="text-muted-foreground">Score</div>
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-600">{currentUserEntry.completed_sectors}</div>
                    <div className="text-muted-foreground">Sectors</div>
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-600">
                      {currentUserEntry.fastest_time ? `${currentUserEntry.fastest_time}min` : 'N/A'}
                    </div>
                    <div className="text-muted-foreground">Best Time</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="overall" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overall">Overall</TabsTrigger>
          <TabsTrigger value="speed">Speed</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overall" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Top Adventurers</h3>
          </div>

          <div className="space-y-3">
            {leaderboard.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">No players yet</h4>
                  <p className="text-muted-foreground">
                    Be the first to complete a quest and join the leaderboard!
                  </p>
                </CardContent>
              </Card>
            ) : (
              leaderboard.slice(0, 10).map((entry) => (
                <Card 
                  key={entry.id}
                  className={`relative overflow-hidden ${
                    entry.user_id === user?.id ? 'ring-2 ring-emerald-500' : ''
                  }`}
                >
                  {entry.current_rank <= 3 && (
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getRankColor(entry.current_rank)}`} />
                  )}
                  
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(entry.current_rank)}
                        <span className="font-bold text-lg">#{entry.current_rank}</span>
                      </div>
                      
                      <div className="text-2xl">👤</div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{entry.display_name}</h4>
                          <Badge variant="outline">Level {entry.user_level}</Badge>
                          {entry.user_id === user?.id && (
                            <Badge variant="default" className="bg-emerald-600">You</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <span>{entry.total_score} pts</span>
                          <span>{entry.completed_sectors} sectors</span>
                          <span>{entry.fastest_time ? `${entry.fastest_time}min` : 'N/A'} best</span>
                          <span>{entry.achievements_count} achievements</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="speed">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Speed Rankings
            </h3>
            <div className="space-y-3">
              {leaderboard
                .filter(entry => entry.fastest_time !== null)
                .sort((a, b) => (a.fastest_time || 0) - (b.fastest_time || 0))
                .slice(0, 10)
                .map((entry, index) => (
                <Card key={entry.id} className={entry.user_id === user?.id ? 'ring-2 ring-emerald-500' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-lg">#{index + 1}</span>
                      <div className="text-2xl">👤</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{entry.display_name}</h4>
                          {entry.user_id === user?.id && (
                            <Badge variant="default" className="bg-emerald-600">You</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Best time: {entry.fastest_time} minutes
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Star className="h-5 w-5" />
              Achievement Rankings
            </h3>
            <div className="space-y-3">
              {leaderboard
                .sort((a, b) => b.achievements_count - a.achievements_count)
                .slice(0, 10)
                .map((entry, index) => (
                <Card key={entry.id} className={entry.user_id === user?.id ? 'ring-2 ring-emerald-500' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-lg">#{index + 1}</span>
                      <div className="text-2xl">👤</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{entry.display_name}</h4>
                          {entry.user_id === user?.id && (
                            <Badge variant="default" className="bg-emerald-600">You</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Achievements: {entry.achievements_count}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabaseLeaderboard;
