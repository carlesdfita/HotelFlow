import ConfigManager from '@/components/config/ConfigManager';

export default function ConfigPage() {
  return (
    <div className="container mx-auto py-2">
      <h2 className="text-3xl font-bold font-headline mb-6 text-primary">Configuració</h2>
      <ConfigManager />
    </div>
  );
}
