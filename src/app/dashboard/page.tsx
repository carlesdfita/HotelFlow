// This page will be primarily client-rendered for interactivity with Firebase
import TicketManager from '@/components/tickets/TicketManager';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-2">
      <TicketManager />
    </div>
  );
}
