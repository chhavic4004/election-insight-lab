import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const StatCard = ({ label, value, icon: Icon, description, trend }: StatCardProps) => {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="gov-label">{label}</p>
            <p className="gov-stat">{value}</p>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div className={`rounded-lg p-3 ${
            trend === 'up' ? 'bg-success/10 text-success' :
            trend === 'down' ? 'bg-destructive/10 text-destructive' :
            'bg-primary/10 text-primary'
          }`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
