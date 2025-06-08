
'use client';

import type { FormEvent} from 'react';
import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { LocationItem, TypologyItem, Settings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, PlusCircle, ListChecks, MapPinned } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import LoadingSpinner from '../ui/loading-spinner';

type ConfigEntityType = 'locations' | 'typologies';
type ConfigItem = LocationItem | TypologyItem;

export default function ConfigManager() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [typologies, setTypologies] = useState<TypologyItem[]>([]);
  const [newLocationName, setNewLocationName] = useState('');
  const [newTypologyName, setNewTypologyName] = useState('');
  
  const [locationsLoaded, setLocationsLoaded] = useState(false);
  const [typologiesLoaded, setTypologiesLoaded] = useState(false);
  const { toast } = useToast();

  const isLoading = !locationsLoaded || !typologiesLoaded;

  useEffect(() => {
    const unsubLocations = onSnapshot(doc(db, 'settings', 'locations'), (docSnap) => {
      if (docSnap.exists()) {
        setLocations((docSnap.data() as Settings<LocationItem>).items || []);
      } else {
        setLocations([]); 
      }
      setLocationsLoaded(true);
    }, (error) => {
        console.error("Error fetching locations:", error);
        toast({ title: "Error", description: "No s'han pogut carregar els llocs.", variant: "destructive"});
        setLocationsLoaded(true); // Mark as loaded even on error to prevent indefinite loading
    });

    const unsubTypologies = onSnapshot(doc(db, 'settings', 'typologies'), (docSnap) => {
      if (docSnap.exists()) {
        setTypologies((docSnap.data() as Settings<TypologyItem>).items || []);
      } else {
        setTypologies([]);
      }
      setTypologiesLoaded(true);
    }, (error) => {
        console.error("Error fetching typologies:", error);
        toast({ title: "Error", description: "No s'han pogut carregar les tipologies.", variant: "destructive"});
        setTypologiesLoaded(true); // Mark as loaded even on error
    });

    return () => {
      unsubLocations();
      unsubTypologies();
    };
  }, [toast]);

  const handleAddItem = async (type: ConfigEntityType, name: string) => {
    if (!name.trim()) {
      toast({ title: 'Nom buit', description: 'El nom no pot estar buit.', variant: 'destructive' });
      return;
    }

    const newItem: ConfigItem = { id: uuidv4(), name: name.trim() };
    const docRef = doc(db, 'settings', type);

    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const currentItems = (docSnap.data() as Settings<ConfigItem>).items || [];
        if (currentItems.some(item => item.name.toLowerCase() === newItem.name.toLowerCase())) {
           toast({ title: 'Duplicat', description: `"${newItem.name}" ja existeix.`, variant: 'destructive' });
           return;
        }
        await updateDoc(docRef, { items: arrayUnion(newItem) });
      } else {
        await setDoc(docRef, { items: [newItem] });
      }
      toast({ title: 'Element afegit', description: `"${name}" s'ha afegit correctament.` });
      if (type === 'locations') setNewLocationName('');
      if (type === 'typologies') setNewTypologyName('');
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
      toast({ title: 'Error', description: `No s'ha pogut afegir l'element.`, variant: 'destructive' });
    }
  };

  const handleDeleteItem = async (type: ConfigEntityType, itemToDelete: ConfigItem) => {
    if (!confirm(`Estàs segur que vols eliminar "${itemToDelete.name}"?`)) return;
    
    const docRef = doc(db, 'settings', type);
    try {
      await updateDoc(docRef, { items: arrayRemove(itemToDelete) });
      toast({ title: 'Element eliminat', description: `"${itemToDelete.name}" s'ha eliminat.` });
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast({ title: 'Error', description: `No s'ha pogut eliminar l'element.`, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-15rem)] items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Locations Management */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-headline"><MapPinned className="mr-2 h-6 w-6 text-primary" />Llocs (Ubicacions)</CardTitle>
          <CardDescription>Gestiona la llista de llocs disponibles per a les incidències.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e: FormEvent) => { e.preventDefault(); handleAddItem('locations', newLocationName); }} className="mb-4 flex gap-2">
            <Input
              type="text"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              placeholder="Nom del nou lloc"
              className="flex-grow"
            />
            <Button type="submit" size="icon"><PlusCircle className="h-5 w-5" /></Button>
          </form>
          {locations.length === 0 && <p className="text-sm text-muted-foreground">No hi ha llocs definits.</p>}
          <ul className="max-h-60 space-y-2 overflow-y-auto rounded-md border p-3">
            {locations.map((loc) => (
              <li key={loc.id} className="flex items-center justify-between rounded-md bg-secondary/30 p-2 text-sm">
                <span>{loc.name}</span>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteItem('locations', loc)} className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Typologies Management */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-headline"><ListChecks className="mr-2 h-6 w-6 text-primary" />Tipologies</CardTitle>
          <CardDescription>Gestiona la llista de tipologies d'incidències.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e: FormEvent) => { e.preventDefault(); handleAddItem('typologies', newTypologyName); }} className="mb-4 flex gap-2">
            <Input
              type="text"
              value={newTypologyName}
              onChange={(e) => setNewTypologyName(e.target.value)}
              placeholder="Nom de la nova tipologia"
              className="flex-grow"
            />
            <Button type="submit" size="icon"><PlusCircle className="h-5 w-5" /></Button>
          </form>
          {typologies.length === 0 && <p className="text-sm text-muted-foreground">No hi ha tipologies definides.</p>}
          <ul className="max-h-60 space-y-2 overflow-y-auto rounded-md border p-3">
            {typologies.map((typ) => (
              <li key={typ.id} className="flex items-center justify-between rounded-md bg-secondary/30 p-2 text-sm">
                <span>{typ.name}</span>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteItem('typologies', typ)} className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
