
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, Target, Clock, Share2, Users, Gift } from "lucide-react";
import { useDailyQuests } from '@/hooks/useDailyQuests';

const DailyQuests = () => {
  const { quests, userProgress, loading, getQuestProgress } = useDailyQuests();

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2 mb-2" />
              <div className="h-2 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getQuestIcon = (questType: string) => {
    switch (questType) {
      case 'visit_sector': return <Target className="h-4 w-4" />;
      case 'spend_time': return <Clock className="h-4 w-4" />;
      case 'complete_mini_game': return <Gift className="h-4 w-4" />;
      case 'share_achievement': return <Share2 className="h-4 w-4" />;
      case 'invite_friend': return <Users className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getQuestTypeColor = (questType: string) => {
    switch (questType) {
      case 'visit_sector': return 'bg-blue-100 text-blue-800';
      case 'spend_time': return 'bg-green-100 text-green-800';
      case 'complete_mini_game': return 'bg-purple-100 text-purple-800';
      case 'share_achievement': return 'bg-orange-100 text-orange-800';
      case 'invite_friend': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-6 w-6 text-emerald-600" />
        <h3 className="text-xl font-semibold">Daily Quests</h3>
        <Badge variant="secondary">
          {quests.filter(q => {
            const progress = getQuestProgress(q.id);
            return progress?.completed;
          }).length} of {quests.length}
        </Badge>
      </div>

      {quests.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-600 mb-2">
              No active quests
            </h4>
            <p className="text-muted-foreground">
              New quests will appear tomorrow!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {quests.map((quest) => {
            const progress = getQuestProgress(quest.id);
            const currentProgress = progress?.current_progress || 0;
            const isCompleted = progress?.completed || false;
            const progressPercent = Math.min((currentProgress / quest.target_value) * 100, 100);

            return (
              <Card key={quest.id} className={`transition-all duration-300 ${
                isCompleted ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200' : 'hover:shadow-md'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${getQuestTypeColor(quest.quest_type)}`}>
                      {getQuestIcon(quest.quest_type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{quest.title}</h4>
                        {isCompleted && (
                          <Badge variant="default" className="bg-emerald-600">
                            Completed
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {quest.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">
                            {currentProgress}/{quest.target_value}
                          </span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm font-medium text-emerald-600">
                            +{quest.reward_points} points
                          </span>
                        </div>
                        
                        {quest.reward_description && (
                          <span className="text-xs text-muted-foreground">
                            {quest.reward_description}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DailyQuests;
