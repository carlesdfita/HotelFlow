
'use client';

import type { FormEvent} from 'react';
import { useEffect, useState, useMemo } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp, where, getDocs, QueryConstraint } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import type { Ticket, Importance, Status, LocationItem, TypologyItem, Settings } from '@/lib/types';
import TicketList from './TicketList';
import TicketForm from './TicketForm';
import TicketFilters from './TicketFilters';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function TicketManager() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [typologies, setTypologies] = useState<TypologyItem[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [isFilterSectionVisible, setIsFilterSectionVisible] = useState(false);

  const [filters, setFilters] = useState<{ status?: Status; importance?: Importance; location?: string; type?: string; searchTerm?: string }>({});
  // sortBy state is still used for the initial Firebase query if needed, but UI for changing it is removed.
  // Default sort by Firebase is 'createdAt', 'desc'. Client-side sort will override display order.
  const [sortBy, setSortBy] = useState<{ field: keyof Ticket; direction: 'asc' | 'desc' }>({ field: 'createdAt', direction: 'desc' });

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);

    // Firebase query will use 'sortBy' for initial ordering.
    // For example, by 'createdAt'. The complex client-side sort takes precedence for display.
    const ticketsQueryConstraints: QueryConstraint[] = [orderBy(sortBy.field, sortBy.direction)];
    const ticketsQuery = query(collection(db, 'tickets'), ...ticketsQueryConstraints);
    
    const unsubscribeTickets = onSnapshot(ticketsQuery, (snapshot) => {
      const ticketsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
      setTickets(ticketsData);
      setIsLoading(false);
    }, (error: any) => {
      console.error("Error carregant incidències:", error);
      let description = "No s'han pogut carregar les incidències. Revisa la consola del navegador per a més detalls.";
      if (error.message && error.message.toLowerCase().includes('offline')) {
          description = "No s'han pogut carregar les incidències perquè l'aplicació està fora de línia. Comprova la teva connexió a Internet.";
      } else if (error.code && error.code === 'permission-denied') {
          description = "No s'han pogut carregar les incidències per falta de permisos.";
      }
      toast({ title: "Error", description, variant: "destructive" });
      setIsLoading(false);
    });

    const unsubscribeLocations = onSnapshot(doc(db, 'settings', 'locations'), (docSnap) => {
      if (docSnap.exists()) {
        setLocations((docSnap.data() as Settings<LocationItem>).items || []);
      } else {
        setLocations([]);
      }
    }, (error: any) => {
      console.error("Error carregant llocs (TicketManager):", error);
    });

    const unsubscribeTypologies = onSnapshot(doc(db, 'settings', 'typologies'), (docSnap) => {
      if (docSnap.exists()) {
        setTypologies((docSnap.data() as Settings<TypologyItem>).items || []);
      } else {
        setTypologies([]);
      }
    }, (error: any) => {
      console.error("Error carregant tipologies (TicketManager):", error);
    });

    return () => {
      unsubscribeTickets();
      unsubscribeLocations();
      unsubscribeTypologies();
    };
  }, [user, toast, sortBy]); // sortBy is kept here for the Firebase query

  const handleFormSubmit = async (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    if (!user) {
      toast({ title: "Error d'autenticació", description: "Has d'iniciar sessió per crear o editar incidències.", variant: "destructive"});
      return;
    }
    try {
      if (editingTicket) {
        const ticketRef = doc(db, 'tickets', editingTicket.id);
        await updateDoc(ticketRef, { ...ticketData, updatedAt: serverTimestamp() });
        toast({ title: 'Incidència actualitzada', description: 'Els canvis s\'han guardat correctament.' });
      } else {
        await addDoc(collection(db, 'tickets'), {
          ...ticketData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: user.uid,
        });
        toast({ title: 'Incidència creada', description: 'La nova incidència s\'ha registrat.' });
      }
      setEditingTicket(null);
      setIsFormOpen(false);
    } catch (error: any) {
      console.error("Error guardant la incidència:", error);
      let description = "No s'ha pogut guardar la incidència.";
      if (error.message && error.message.toLowerCase().includes('offline')) {
        description = "No s'ha pogut guardar la incidència perquè l'aplicació està fora de línia. Comprova la teva connexió a Internet.";
      } else if (error.code && error.code === 'permission-denied') {
        description = "No s'ha pogut guardar la incidència per falta de permisos.";
      }
      toast({ title: "Error", description, variant: "destructive" });
    }
  };

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsFormOpen(true);
  };

  const handleDelete = async (ticketId: string) => {
    if (!confirm('Estàs segur que vols eliminar aquesta incidència?')) return;
    try {
      await deleteDoc(doc(db, 'tickets', ticketId));
      toast({ title: 'Incidència eliminada', description: 'La incidència s\'ha eliminat correctament.' });
    } catch (error: any) {
      console.error("Error eliminant la incidència:", error);
      let description = "No s'ha pogut eliminar la incidència.";
      if (error.message && error.message.toLowerCase().includes('offline')) {
        description = "No s'ha pogut eliminar la incidència perquè l'aplicació està fora de línia. Comprova la teva connexió a Internet.";
      } else if (error.code && error.code === 'permission-denied') {
        description = "No s'ha pogut eliminar la incidència per falta de permisos.";
      }
      toast({ title: "Error", description, variant: "destructive" });
    }
  };
  
  const importanceOrder: Record<Importance, number> = {
    urgent: 1,
    important: 2,
    low: 3,
  };

  const filteredAndSortedTickets = useMemo(() => {
    let result = tickets;

    if (!filters.status) {
      result = result.filter(t => t.status !== 'solved');
    } else if (filters.status) {
      result = result.filter(t => t.status === filters.status);
    }
    if (filters.importance) result = result.filter(t => t.importance === filters.importance);

    if (filters.location && filters.location.length > 0) {
      result = result.filter(t => filters.location!.includes(t.location));
    }
    if (filters.type && filters.type.length > 0) {
      result = result.filter(t => filters.type!.includes(t.type));
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(t => t.description.toLowerCase().includes(term) || t.id.toLowerCase().includes(term));
    }

    result.sort((a, b) => {
      const importanceComparison = importanceOrder[a.importance] - importanceOrder[b.importance];
      if (importanceComparison !== 0) {
        return importanceComparison;
      }
      return a.location.localeCompare(b.location);
    });

    return result;
  }, [tickets, filters]);


  if (isLoading && tickets.length === 0) { 
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-bold font-headline text-primary">Gestió d'Incidències</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsFilterSectionVisible(!isFilterSectionVisible)}
          >
            <Filter className="mr-2 h-5 w-5" />
            {isFilterSectionVisible ? 'Amagar Filtres' : 'Mostrar Filtres'}
          </Button>
          <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if (!open) setEditingTicket(null); }}>
            <DialogTrigger asChild>
              <Button size="lg" onClick={() => { setEditingTicket(null); setIsFormOpen(true); }}>
                <PlusCircle className="mr-2 h-5 w-5" /> Nova Incidència
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-headline text-xl">{editingTicket ? 'Editar Incidència' : 'Crear Nova Incidència'}</DialogTitle>
              </DialogHeader>
              <TicketForm
                onSubmit={handleFormSubmit}
                initialData={editingTicket}
                locations={locations}
                typologies={typologies}
                onCancel={() => { setIsFormOpen(false); setEditingTicket(null); }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {isFilterSectionVisible && (
        <TicketFilters
          locations={locations}
          typologies={typologies}
          onFilterChange={setFilters}
          currentFilters={filters}
        />
      )}

      {isLoading && tickets.length > 0 && <div className="text-center py-4"><LoadingSpinner /> Carregant...</div>}
      {!isLoading && filteredAndSortedTickets.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          <h3 className="text-xl font-semibold">No hi ha incidències</h3>
          <p className="mt-2">No s'han trobat incidències que coincideixin amb els filtres actuals o encara no n'hi ha cap de creada.</p>
        </div>
      )}
      {filteredAndSortedTickets.length > 0 && (
        <TicketList tickets={filteredAndSortedTickets} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
