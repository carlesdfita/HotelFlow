import type { Ticket } from '@/lib/types';
import TicketItem from './TicketItem';

interface TicketListProps {
  tickets: Ticket[];
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticketId: string) => void;
}

export default function TicketList({ tickets, onEdit, onDelete }: TicketListProps) {
  if (tickets.length === 0) {
    return null; // Manager component handles empty state message
  }

  return (
    <div>
      {tickets.map((ticket) => (
        <TicketItem key={ticket.id} ticket={ticket} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
