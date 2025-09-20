import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Crown, Star, Users, Clock, Target, Medal } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  score: number;
  level: number;
  completedSectors: number;
  fastestTime: number;
  achievements: number;
  rank: number;
}

interface LeaderboardSystemProps {
  currentUser: {
    id: string;
    name: string;
    score: number;
    level: number;
    completedSectors: number;
    fastestTime: number;
    achievements: number;
  };
}

const LeaderboardSystem = ({ currentUser }: LeaderboardSystemProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<
    'week' | 'month' | 'all'
  >('week');

  // Mock data - in real app this would come from API
  const mockLeaderboard: LeaderboardEntry[] = [
    {
      id: '1',
      name: 'TasteExplorer',
      avatar: '🍜',
      score: 2450,
      level: 13,
      completedSectors: 24,
      fastestTime: 18,
      achievements: 15,
      rank: 1,
    },
    {
      id: '2',
      name: 'FlavorMaster',
      avatar: '🍛',
      score: 2200,
      level: 12,
      completedSectors: 20,
      fastestTime: 22,
      achievements: 12,
      rank: 2,
    },
    {
      id: '3',
      name: 'SpiceRunner',
      avatar: '🌶️',
      score: 1950,
      level: 10,
      completedSectors: 18,
      fastestTime: 15,
      achievements: 11,
      rank: 3,
    },
    {
      id: '4',
      name: 'UmamiSeeker',
      avatar: '🍣',
      score: 1800,
      level: 9,
      completedSectors: 16,
      fastestTime: 25,
      achievements: 10,
      rank: 4,
    },
    {
      id: '5',
      name: 'FermentFan',
      avatar: '🥢',
      score: 1650,
      level: 8,
      completedSectors: 14,
      fastestTime: 28,
      achievements: 8,
      rank: 5,
    },
    {
      id: currentUser.id,
      name: currentUser.name,
      avatar: '👤',
      score: currentUser.score,
      level: currentUser.level,
      completedSectors: currentUser.completedSectors,
      fastestTime: currentUser.fastestTime,
      achievements: currentUser.achievements,
      rank: 8,
    },
  ];

  useEffect(() => {
    // Sort by score and assign ranks
    const sortedData = [...mockLeaderboard].sort((a, b) => b.score - a.score);
    const rankedData = sortedData.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    setLeaderboard(rankedData);
  }, [selectedPeriod]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <Trophy className="h-5 w-5 text-gray-400" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-amber-400 to-amber-600';
      default:
        return 'from-gray-200 to-gray-300';
    }
  };

  const currentUserEntry = leaderboard.find(
    (entry) => entry.id === currentUser.id
  );

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
              <div className="text-4xl">{currentUserEntry.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold">
                    {currentUserEntry.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className="bg-emerald-100 text-emerald-800"
                  >
                    Level {currentUserEntry.level}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-emerald-600">
                      #{currentUserEntry.rank}
                    </div>
                    <div className="text-muted-foreground">Rank</div>
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-600">
                      {currentUserEntry.score}
                    </div>
                    <div className="text-muted-foreground">Score</div>
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-600">
                      {currentUserEntry.completedSectors}
                    </div>
                    <div className="text-muted-foreground">Sectors</div>
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-600">
                      {currentUserEntry.fastestTime}min
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overall">Overall</TabsTrigger>
          <TabsTrigger value="speed">Speed</TabsTrigger>
          <TabsTrigger value="completion">Completion</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overall" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Top Adventurers</h3>
            <div className="flex gap-2">
              <Button
                variant={selectedPeriod === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('week')}
              >
                Week
              </Button>
              <Button
                variant={selectedPeriod === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('month')}
              >
                Month
              </Button>
              <Button
                variant={selectedPeriod === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('all')}
              >
                All Time
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {leaderboard.slice(0, 10).map((entry) => (
              <Card
                key={entry.id}
                className={`relative overflow-hidden ${
                  entry.id === currentUser.id ? 'ring-2 ring-emerald-500' : ''
                }`}
              >
                {entry.rank <= 3 && (
                  <div
                    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getRankColor(entry.rank)}`}
                  />
                )}

                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(entry.rank)}
                      <span className="font-bold text-lg">#{entry.rank}</span>
                    </div>

                    <div className="text-2xl">{entry.avatar}</div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{entry.name}</h4>
                        <Badge variant="outline">Level {entry.level}</Badge>
                        {entry.id === currentUser.id && (
                          <Badge variant="default" className="bg-emerald-600">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                        <span>{entry.score} pts</span>
                        <span>{entry.completedSectors} sectors</span>
                        <span>{entry.fastestTime}min best</span>
                        <span>{entry.achievements} achievements</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="speed">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Speed Rankings
            </h3>
            <div className="space-y-3">
              {[...leaderboard]
                .sort((a, b) => a.fastestTime - b.fastestTime)
                .slice(0, 10)
                .map((entry, index) => (
                  <Card
                    key={entry.id}
                    className={
                      entry.id === currentUser.id
                        ? 'ring-2 ring-emerald-500'
                        : ''
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-lg">#{index + 1}</span>
                        <div className="text-2xl">{entry.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{entry.name}</h4>
                            {entry.id === currentUser.id && (
                              <Badge
                                variant="default"
                                className="bg-emerald-600"
                              >
                                You
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Best time: {entry.fastestTime} minutes
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="completion">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Target className="h-5 w-5" />
              Completion Rankings
            </h3>
            <div className="space-y-3">
              {[...leaderboard]
                .sort((a, b) => b.completedSectors - a.completedSectors)
                .slice(0, 10)
                .map((entry, index) => (
                  <Card
                    key={entry.id}
                    className={
                      entry.id === currentUser.id
                        ? 'ring-2 ring-emerald-500'
                        : ''
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-lg">#{index + 1}</span>
                        <div className="text-2xl">{entry.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{entry.name}</h4>
                            {entry.id === currentUser.id && (
                              <Badge
                                variant="default"
                                className="bg-emerald-600"
                              >
                                You
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Completed sectors: {entry.completedSectors}
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
              {[...leaderboard]
                .sort((a, b) => b.achievements - a.achievements)
                .slice(0, 10)
                .map((entry, index) => (
                  <Card
                    key={entry.id}
                    className={
                      entry.id === currentUser.id
                        ? 'ring-2 ring-emerald-500'
                        : ''
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-lg">#{index + 1}</span>
                        <div className="text-2xl">{entry.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{entry.name}</h4>
                            {entry.id === currentUser.id && (
                              <Badge
                                variant="default"
                                className="bg-emerald-600"
                              >
                                You
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Achievements: {entry.achievements}
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

export default LeaderboardSystem;
