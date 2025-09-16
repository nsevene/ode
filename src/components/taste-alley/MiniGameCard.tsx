
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Trophy, Clock, Gamepad2 } from "lucide-react";
import { MiniGame } from '@/hooks/useMiniGames';

interface MiniGameCardProps {
  game: MiniGame;
  bestScore: number;
  onPlay: (gameId: string) => void;
}

const MiniGameCard = ({ game, bestScore, onPlay }: MiniGameCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGameTypeIcon = (gameType: string) => {
    switch (gameType) {
      case 'memory': return '🧠';
      case 'quiz': return '❓';
      case 'timing': return '⏱️';
      case 'puzzle': return '🧩';
      default: return '🎮';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getGameTypeIcon(game.game_type)}</span>
            <CardTitle className="text-lg">{game.name}</CardTitle>
          </div>
          <Badge variant="outline" className={getDifficultyColor(game.difficulty)}>
            {game.difficulty}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {game.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-600" />
            <span>Очки: {game.base_points}</span>
          </div>
          
          {game.time_limit && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>Время: {game.time_limit}с</span>
            </div>
          )}
          
          {bestScore > 0 && (
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-emerald-600" />
              <span>Лучший: {bestScore}</span>
            </div>
          )}
        </div>
        
        <Button 
          onClick={() => onPlay(game.id)}
          className="w-full group-hover:bg-primary/90 transition-colors"
        >
          <Play className="h-4 w-4 mr-2" />
          Играть
        </Button>
      </CardContent>
    </Card>
  );
};

export default MiniGameCard;
