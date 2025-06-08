import type { Ticket, Importance } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Clock, MapPin, Wrench, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';


interface TicketItemProps {
  ticket: Ticket;
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticketId: string) => void;
}

const importanceStyles: Record<Importance, { bg: string; text: string; border: string; iconColor: string }> = {
  urgent: { bg: 'bg-urgent-background', text: 'text-urgent-foreground', border: 'border-urgent-foreground/50', iconColor: 'text-urgent-foreground' },
  important: { bg: 'bg-important-background', text: 'text-important-foreground', border: 'border-important-foreground/50', iconColor: 'text-important-foreground' },
  low: { bg: 'bg-low-importance-background', text: 'text-low-importance-foreground', border: 'border-low-importance-foreground/50', iconColor: 'text-low-importance-foreground' },
};

const statusLabels: Record<Ticket['status'], string> = {
  pending: 'Pendent',
  'in-progress': 'En Procés',
  solved: 'Solucionada',
};

const importanceLabels: Record<Ticket['importance'], string> = {
  urgent: 'Urgent',
  important: 'Important',
  low: 'Poc Important',
};

export default function TicketItem({ ticket, onEdit, onDelete }: TicketItemProps) {
  const { bg, text, border, iconColor } = importanceStyles[ticket.importance];
  const timeAgo = ticket.createdAt ? formatDistanceToNow(ticket.createdAt.toDate(), { addSuffix: true, locale: es }) : 'Data desconeguda';

  return (
    <Card className={cn('flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-200', bg, border)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={cn('text-lg font-semibold font-headline leading-tight break-words', text)}>ID: {ticket.id.substring(0,6)}... </CardTitle>
          <Badge variant="outline" className={cn('text-xs', bg, text, border)}>
            {statusLabels[ticket.status]}
          </Badge>
        </div>
        <CardDescription className={cn('text-xs pt-1', text, 'opacity-80')}>
           <div className="flex items-center">
             <AlertTriangle className={cn('mr-1 h-4 w-4', iconColor)} />
             {importanceLabels[ticket.importance]}
           </div>
        </CardDescription>
      </CardHeader>
      <CardContent className={cn('flex-grow pb-4 space-y-2', text)}>
        <p className="text-sm leading-relaxed line-clamp-3">{ticket.description}</p>
        <div className="space-y-1 text-xs opacity-90">
          <div className="flex items-center">
            <MapPin className={cn('mr-2 h-3.5 w-3.5 flex-shrink-0', iconColor)} />
            <span>{ticket.location}</span>
          </div>
          <div className="flex items-center">
            <Wrench className={cn('mr-2 h-3.5 w-3.5 flex-shrink-0', iconColor)} />
            <span>{ticket.type}</span>
          </div>
          <div className="flex items-center">
            <Clock className={cn('mr-2 h-3.5 w-3.5 flex-shrink-0', iconColor)} />
            <span>{timeAgo}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4 pb-3 px-4">
        <Button variant="outline" size="sm" onClick={() => onEdit(ticket)} className={cn('hover:bg-opacity-20', text, border, `hover:${bg}/80`)}>
          <Edit className="mr-1 h-4 w-4" /> Editar
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(ticket.id)} className="bg-destructive/80 hover:bg-destructive">
          <Trash2 className="mr-1 h-4 w-4" /> Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
}
