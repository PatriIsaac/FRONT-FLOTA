const fs = require('fs');
const path = require('path');

const applyFilter = (filePath) => {
  let c = fs.readFileSync(filePath, 'utf8');
  if (c.includes('<DataTable') && !c.includes('enableColumnFilters={true}')) {
    c = c.replace(/<DataTable(\s+)/g, '<DataTable\n            enableColumnFilters={true}$1');
    fs.writeFileSync(filePath, c);
    console.log(`Added filters to ${filePath}`);
  }
};

const updateMantenimiento = () => {
  // 1. AutorizacionServicio.tsx
  const autPath = 'src/pages/mantenimiento/ServicioExterno/AutorizacionServicio.tsx';
  let autCont = fs.readFileSync(autPath, 'utf8');
  autCont = autCont.replace(' (MA 122 02 02).', '.');
  fs.writeFileSync(autPath, autCont);

  // 2. RegistroManoObraRepuestos.tsx
  const manoPath = 'src/pages/mantenimiento/RegistroTrabajos/RegistroManoObraRepuestos.tsx';
  let manoCont = fs.readFileSync(manoPath, 'utf8');
  manoCont = manoCont.replace(' (MA 122 02 04).', '.');
  manoCont = manoCont.replace(
    'parseFloat(d.manoObra) + parseFloat(d.repuestos) + parseFloat(d.otros)',
    'Number(d.manoObra || 0) + Number(d.repuestos || 0) + Number(d.otros || 0)'
  );
  fs.writeFileSync(manoPath, manoCont);
  applyFilter(manoPath);

  // 3. RegistroCostoMensual.tsx
  const costoPath = 'src/pages/mantenimiento/Costos/RegistroCostoMensual.tsx';
  let costoCont = fs.readFileSync(costoPath, 'utf8');
  costoCont = costoCont.replace(' (MA 122 02 03).', '.');
  costoCont = costoCont.replace(
    'parseFloat(d.propio) + parseFloat(d.terceros)',
    'Number(d.propio || 0) + Number(d.terceros || 0)'
  );
  fs.writeFileSync(costoPath, costoCont);
  applyFilter(costoPath);

  // 4. ProgramacionPreventivo.tsx
  applyFilter('src/pages/mantenimiento/Programacion/ProgramacionPreventivo.tsx');

  // 5. OrdenesList.tsx
  applyFilter('src/pages/mantenimiento/OrdenesList.tsx');

  // 6. HistorialTecnico.tsx
  applyFilter('src/pages/mantenimiento/Historial/HistorialTecnico.tsx');

  // 7. OrdenForm.tsx
  const formPath = 'src/pages/mantenimiento/OrdenForm.tsx';
  let formCont = fs.readFileSync(formPath, 'utf8');
  
  // Replace the Taller Select with a hidden/disabled logic
  // We'll just disable the select and force options to show "TALLER PROPIO (INTERNO)"
  const originalSelect = `<Select
            label="Taller"
            {...register('tallerId')}
            error={errors.tallerId?.message}
            options={[
              { value: 0, label: 'Seleccione un taller...' },
              ...talleres.map(t => ({ value: t.tallerId, label: t.nombre })),
            ]}
          />`;
  
  const newSelect = `<Select
            label="Taller"
            disabled
            {...register('tallerId')}
            error={errors.tallerId?.message}
            options={[
              { value: 0, label: 'TALLER PROPIO (INTERNO)' },
              ...talleres.map(t => ({ value: t.tallerId, label: t.nombre })),
            ]}
          />`;
          
  if (formCont.includes(originalSelect)) {
    formCont = formCont.replace(originalSelect, newSelect);
  }

  // Update onSubmit
  const origOnSubmit = `  const onSubmit = (data: OrdenFormData) => {\n    mutation.mutate(data);\n  };`;
  const newOnSubmit = `  const onSubmit = (data: OrdenFormData) => {\n    const tallerPropioId = talleres.length > 0 ? talleres[0].tallerId : 1;\n    const finalData = { ...data, tallerId: tallerPropioId };\n    mutation.mutate(finalData as any);\n  };`;
  
  if (formCont.includes(origOnSubmit)) {
    formCont = formCont.replace(origOnSubmit, newOnSubmit);
  }

  // Also in useEffect reset, we should maybe set it to 1 initially, but finalData handles it.
  // We need to change the schema so it doesn't fail validation if tallerId is 0 initially.
  const origSchema = `tallerId: z.coerce.number().min(1, 'Seleccione un taller'),`;
  const newSchema = `tallerId: z.coerce.number().optional(),`;
  if (formCont.includes(origSchema)) {
    formCont = formCont.replace(origSchema, newSchema);
  }

  fs.writeFileSync(formPath, formCont);
  console.log('Update finished');
};

updateMantenimiento();
