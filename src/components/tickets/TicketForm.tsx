'use client';

import type { SubmitHandler} from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Ticket, Importance, Status, LocationItem, TypologyItem } from '@/lib/types';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const ticketSchema = z.object({
  location: z.string().min(1, 'El lloc és obligatori.'),
  type: z.string().min(1, 'La tipologia és obligatòria.'),
  description: z.string().min(5, 'La descripció ha de tenir almenys 5 caràcters.'),
  importance: z.enum(['urgent', 'important', 'low'], { required_error: 'La importància és obligatòria.' }),
  status: z.enum(['pending', 'in-progress', 'solved'], { required_error: 'L\'estat és obligatori.' }),
});

type TicketFormData = z.infer<typeof ticketSchema>;

interface TicketFormProps {
  onSubmit: (data: TicketFormData) => Promise<void>;
  initialData?: Ticket | null;
  locations: LocationItem[];
  typologies: TypologyItem[];
  onCancel: () => void;
}

export default function TicketForm({ onSubmit, initialData, locations, typologies, onCancel }: TicketFormProps) {
  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      location: initialData?.location || '',
      type: initialData?.type || '',
      description: initialData?.description || '',
      importance: initialData?.importance || 'low',
      status: initialData?.status || 'pending',
    },
  });
  
  const {formState: {isSubmitting}} = form;

  const handleFormSubmit: SubmitHandler<TicketFormData> = async (data) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 p-1">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lloc de la Incidència</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un lloc" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.name}>{loc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipologia</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una tipologia" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {typologies.map((typ) => (
                    <SelectItem key={typ.id} value={typ.name}>{typ.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripció</FormLabel>
              <FormControl>
                <Textarea placeholder="Descriu detalladament la incidència..." {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="importance"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Importància</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                >
                  {(['low', 'important', 'urgent'] as Importance[]).map((level) => (
                    <FormItem key={level} className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={level} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {level === 'low' ? 'Poc Important' : level === 'important' ? 'Important' : 'Urgent'}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Estat</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                >
                  {(['pending', 'in-progress', 'solved'] as Status[]).map((currentStatus) => (
                    <FormItem key={currentStatus} className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={currentStatus} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {currentStatus === 'pending' ? 'Pendent' : currentStatus === 'in-progress' ? 'En Procés' : 'Solucionada'}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel·lar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (initialData ? 'Guardant...' : 'Creant...') : (initialData ? 'Guardar Canvis' : 'Crear Incidència')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
