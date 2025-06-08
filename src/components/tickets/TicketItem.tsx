import type { Ticket, Importance } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Clock, MapPin, Wrench, AlertTriangle, MoreHorizontal } from 'lucide-react'; // Importa MoreHorizontal
import { cn } from '@/lib/utils';
import { formatDistanceToNow, format } from 'date-fns';
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
  const formattedDate = ticket.createdAt ? format(ticket.createdAt.toDate(), 'dd/MM/yy') : 'Data desconeguda';

  // Define colors for the status badge
  const statusColors = {
    pending: { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-800', iconColor: 'text-red-600' },
    'in-progress': { bg: 'bg-orange-100', border: 'border-orange-500', text: 'text-orange-800', iconColor: 'text-orange-600' },
    solved: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-800', iconColor: 'text-green-600' },
    // Add other statuses as needed
  };

  // Define text colors based on importance for the main content
  const importanceTextColors: Record<Importance, string> = {
    urgent: 'text-red-800', // Dark red
    important: 'text-yellow-800', // Dark yellow
    low: 'text-blue-800',    // Dark blue
  };

  return (
    // Card component amb flex col layout, separació inferior i padding vertical reduït, colors basats en importància
    <Card className={cn('flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-200 px-4 py-1 w-full mb-4', importanceStyles[ticket.importance].bg, importanceStyles[ticket.importance].border)}>
      {/* Contenedor principal flex para organizar el contenido en columnas */}
      {/* Contenidor superior per a la localització i els indicadors */}
      <div className="flex justify-between items-center w-full mb-2"> {/* Ajustado items-center y añadido mb-2 */}
        {/* Contenido principal (localización, descripción, tipo) - Afectado por el color de texto de importancia */}
        <div className={cn('flex-grow space-y-1', importanceTextColors[ticket.importance])}>
          {/* Localització en negreta i al principi */}
          <div className="flex items-center font-bold text-sm gap-2">
            {/* Icono de localización usa el color basado en la importancia */}
            <MapPin className={cn('h-3.5 w-3.5 flex-shrink-0', importanceTextColors[ticket.importance])} />
            <span>{ticket.location}</span>
          </div>
        </div>

        {/* Badge d'estat y importància y Dropdown - Mover aquí para estar arriba a la derecha */}
         <div className="flex items-center gap-2">
          {/* Badge de estado - Su color de texto se basa en el estado */}
          <Badge variant="outline" className={cn('text-xs', statusColors[ticket.status].bg, statusColors[ticket.status].text, statusColors[ticket.status].border)}>
            {statusLabels[ticket.status]}
          </Badge>
          {/* Badge de importancia - Su color de texto se basa en la importancia */}
          <Badge variant="outline" className={cn('text-xs', importanceStyles[ticket.importance].bg, importanceStyles[ticket.importance].text, importanceStyles[ticket.importance].border)}>
              <AlertTriangle className={cn('mr-1 h-3 w-3', importanceStyles[ticket.importance].iconColor)} /> {/* Corregido iconColor para usar el de importancia */}
              {importanceLabels[ticket.importance]}
          </Badge>
          {/* Menú desplegable al lado de los badges */}
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0"> {/* No aplicar color de texto del estado aquí */}
                <span className="sr-only">Obrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
      {/* Contenedor inferior para la fecha de creación - Mover aquí para estar abajo a la derecha */}
              {/* Opciones del menú desplegable */}
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
        </div>
      </div>
      {/* Contenedor para la fecha de creación - Posicionado al final del Card */}
      <div className="flex justify-end items-center w-full text-xs opacity-90 mt-2"> {/* justify-end para alinear a la derecha, mt-2 para separación */}
        <div className="flex items-center">
          <Clock className={cn('mr-1 h-3 w-3 flex-shrink-0', importanceTextColors[ticket.importance])} /> {/* Icono de reloj usa el color basado en la importancia */}
            <span>{formattedDate}</span> {/* Fecha de creación abajo a la derecha */}
        </div>
      </div>
    </Card>
  );
}
