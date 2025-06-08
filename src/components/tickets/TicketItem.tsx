import type { Ticket, Importance } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Clock, MapPin, Wrench, AlertTriangle, MoreHorizontal } from 'lucide-react'; // Importa MoreHorizontal
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Importa els components del Dropdown Menu
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  const timeAgo = ticket.createdAt ? formatDistanceToNow(ticket.createdAt.toDate(), { addSuffix: true, locale: es }) : 'Data desconeguda';

  const statusColors = {
    pending: { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-800', iconColor: 'text-blue-600' },
    'in-progress': { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-800', iconColor: 'text-yellow-600' },
    solved: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-800', iconColor: 'text-green-600' },
    // Add other statuses as needed
  };

  const { bg, border, text, iconColor } = statusColors[ticket.status] || statusColors.pending; // Default to pending if status is not found
  return (
    // Card component amb flex row layout
    <Card className={cn('flex flex-row justify-between items-center shadow-lg hover:shadow-xl transition-shadow duration-200 p-4 w-full', bg, border)}>
      {/* Contingut principal de la incidència */}
      <div className={cn('flex-grow space-y-2 pr-4', text)}> {/* Afegeix padding a la dreta per separar del menú */}
         {/* Localització en negreta i al principi */}
        <div className="flex items-center font-bold text-sm gap-2">
            <MapPin className={cn('h-3.5 w-3.5 flex-shrink-0', iconColor)} /> {/* Eliminat mr-2 */}
            <span>{ticket.location}</span>
        </div>

        {/* Descripció, tipus i temps */}
        {/* Aplica line-clamp-2 a la descripció */}
        <p className="text-sm leading-relaxed line-clamp-2">{ticket.description}</p>
        <div className="space-y-1 text-xs opacity-90">
          <div className="flex items-center">
            <Wrench className={cn('mr-2 h-3.5 w-3.5 flex-shrink-0', iconColor)} />
            <span>{ticket.type}</span>
          </div>
          <div className="flex items-center">
            <Clock className={cn('mr-2 h-3.5 w-3.5 flex-shrink-0', iconColor)} />
            <span>{timeAgo}</span>
          </div>
        </div>
         {/* Badge d'estat i importància */}
         {/* Moure badges a la part inferior del contingut principal */}
         <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className={cn('text-xs', bg, text, border)}>
            {statusLabels[ticket.status]}
          </Badge>
           <Badge variant="outline" className={cn('text-xs', bg, text, border)}>
              <AlertTriangle className={cn('mr-1 h-3 w-3', iconColor)} />
              {importanceLabels[ticket.importance]}
           </Badge>
         </div>
      </div>

      {/* Menú desplegable amb opcions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={cn("h-8 w-8 p-0", text)}>
            <span className="sr-only">Obrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(ticket)}> {/* Opció Editar */}
            <Edit className="mr-2 h-4 w-4" /> Editar
          </DropdownMenuItem>
          {/* Opció Eliminar amb text vermell */}
          <DropdownMenuItem onClick={() => onDelete(ticket.id)} className="text-red-600 focus:text-red-600"> {/* Posa el text en vermell */}
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
