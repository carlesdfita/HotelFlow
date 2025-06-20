'use client';

import type { ChangeEvent} from 'react';
import { useState, useEffect } from 'react';
import type { Importance, Status, LocationItem, TypologyItem } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, RotateCcw } from 'lucide-react';

interface TicketFiltersProps {
  locations: LocationItem[];
  typologies: TypologyItem[];
  onFilterChange: (filters: { status?: Status; importance?: Importance; location?: string; type?: string; searchTerm?: string }) => void;
  currentFilters: { status?: Status; importance?: Importance; location?: string; type?: string; searchTerm?: string };
}

const initialFilters = {
  status: undefined,
  importance: undefined,
  location: undefined,
  type: undefined,
  searchTerm: '',
};

export default function TicketFilters({ 
  locations, 
  typologies, 
  onFilterChange,
  currentFilters,
}: TicketFiltersProps) {
  const [internalFilters, setInternalFilters] = useState(currentFilters);

  useEffect(() => {
    setInternalFilters(currentFilters);
  }, [currentFilters]);

  const handleChange = (name: string, value: string | undefined) => {
    const newFilters = { ...internalFilters, [name]: value === 'all' || value === '' ? undefined : value };
    setInternalFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...internalFilters, searchTerm: e.target.value };
    setInternalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    setInternalFilters(initialFilters);
    onFilterChange(initialFilters);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
        <CardTitle className="text-lg font-headline flex items-center">
          <Filter className="mr-2 h-5 w-5 text-primary" />
          Filtres
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div>
            <Label htmlFor="searchTerm">Cercar Descripció/ID</Label>
            <Input
              id="searchTerm"
              placeholder="Escriu per cercar..."
              value={internalFilters.searchTerm || ''}
              onChange={handleSearchTermChange}
            />
          </div>
          <div>
            <Label htmlFor="statusFilter">Estat</Label>
            <Select value={internalFilters.status || 'all'} onValueChange={(value) => handleChange('status', value)}>
              <SelectTrigger id="statusFilter"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tots</SelectItem>
                <SelectItem value="pending">Pendent</SelectItem>
                <SelectItem value="in-progress">En Procés</SelectItem>
                <SelectItem value="solved">Solucionada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="importanceFilter">Importància</Label>
            <Select value={internalFilters.importance || 'all'} onValueChange={(value) => handleChange('importance', value)}>
              <SelectTrigger id="importanceFilter"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Totes</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="important">Important</SelectItem>
                <SelectItem value="low">Poc Important</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="locationFilter">Lloc</Label>
            <Select value={internalFilters.location || 'all'} onValueChange={(value) => handleChange('location', value)} disabled={locations.length === 0}>
              <SelectTrigger id="locationFilter"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tots</SelectItem>
                {locations.map(loc => <SelectItem key={loc.id} value={loc.name}>{loc.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="typeFilter">Tipologia</Label>
            <Select value={internalFilters.type || 'all'} onValueChange={(value) => handleChange('type', value)} disabled={typologies.length === 0}>
              <SelectTrigger id="typeFilter"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Totes</SelectItem>
                {typologies.map(typ => <SelectItem key={typ.id} value={typ.name}>{typ.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end items-center gap-3 pt-2">
          <Button onClick={resetFilters} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" /> Netejar Filtres
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
