const fs = require('fs');

const path = 'src/pages/abastecimiento/AbastecimientoList.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Initial states for dates
content = content.replace(
  "  const [desde, setDesde] = useState('');\n  const [hasta, setHasta] = useState('');",
  "  const today = new Date();\n  const todayStr = today.toISOString().split('T')[0];\n  const firstDayStr = `${todayStr.slice(0, 7)}-01`;\n\n  const [desde, setDesde] = useState(firstDayStr);\n  const [hasta, setHasta] = useState(todayStr);"
);

// 2. Add isUpdating state and handleUpdateDates function
const queryFnStr = "queryFn: abastecimientoService.getAll\n  });";
const updaterFunc = `\n\n  const [isUpdating, setIsUpdating] = useState(false);\n  const handleUpdateDates = async () => {\n    if (!confirm('¿Deseas actualizar todas las fechas a Julio de 2026?')) return;\n    setIsUpdating(true);\n    try {\n      let count = 0;\n      for (const a of abastecimientos) {\n        const day = Math.floor(Math.random() * 18) + 1;\n        const dayStr = String(day).padStart(2, '0');\n        await abastecimientoService.update(a.abastecimientoId, { fecha: \`2026-07-\${dayStr}T10:00:00Z\` } as any);\n        count++;\n      }\n      alerts.success(\`Se actualizaron \${count} fechas a Julio de 2026.\`);\n      queryClient.invalidateQueries({ queryKey: ['abastecimientos'] });\n    } catch (e) {\n      alerts.error('Error al actualizar fechas');\n    } finally {\n      setIsUpdating(false);\n    }\n  };`;
content = content.replace(queryFnStr, queryFnStr + updaterFunc);

// 3. Add button in the header
const headerStr = "        <Button onClick={() => { setEditingAbastecimiento(null); setIsFormOpen(true); }}>\n          <Plus className=\"h-4 w-4 mr-2\" /> Nuevo Abastecimiento\n        </Button>";
const newHeaderStr = "        <div className=\"flex gap-3\">\n          <Button variant=\"outline\" onClick={handleUpdateDates} isLoading={isUpdating}>\n            Fijar Fechas a Julio 2026\n          </Button>\n          <Button onClick={() => { setEditingAbastecimiento(null); setIsFormOpen(true); }}>\n            <Plus className=\"h-4 w-4 mr-2\" /> Nuevo Abastecimiento\n          </Button>\n        </div>";
content = content.replace(headerStr, newHeaderStr);

// 4. Add enableColumnFilters={true}
content = content.replace("<DataTable\n            columns", "<DataTable\n            enableColumnFilters={true}\n            columns");

fs.writeFileSync(path, content);
console.log('AbastecimientoList updated successfully');
