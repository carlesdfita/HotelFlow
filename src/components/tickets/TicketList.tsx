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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tickets.map((ticket) => (
        <TicketItem key={ticket.id} ticket={ticket} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
