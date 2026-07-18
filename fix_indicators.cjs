const fs = require('fs');

function fixTotalizar() {
  const path = 'src/pages/abastecimiento/Indicadores/TotalizarConsumo.tsx';
  let content = fs.readFileSync(path, 'utf8');

  // Fix additions
  content = content.replace(
    'const gal = a.galones || 0;\n      const costo = a.costo || 0;',
    'const gal = Number(a.galones || 0);\n      const costo = Number(a.costo || 0);'
  );

  // Fix renders
  content = content.replace(
    'render: (d: any) => <span className="font-medium text-blue-600">{d.totalGalones.toFixed(2)} gal.</span>',
    'render: (d: any) => <span className="font-medium text-blue-600">{Number(d.totalGalones).toFixed(2)} gal.</span>'
  );
  content = content.replace(
    'render: (d: any) => <span className="font-bold text-gray-900">S/. {d.totalCosto.toFixed(2)}</span>',
    'render: (d: any) => <span className="font-bold text-gray-900">S/. {Number(d.totalCosto).toFixed(2)}</span>'
  );

  // Re-add enableColumnFilters if missing
  if (!content.includes('enableColumnFilters={true}')) {
    content = content.replace('<DataTable \n                  columns={columns}', '<DataTable \n                  enableColumnFilters={true}\n                  columns={columns}');
  }

  fs.writeFileSync(path, content);
  console.log('Fixed TotalizarConsumo');
}

function fixCalcular() {
  const path = 'src/pages/abastecimiento/Indicadores/CalcularRendimiento.tsx';
  let content = fs.readFileSync(path, 'utf8');

  // Fix additions
  content = content.replace(
    'agrupado[a.vehiculoId].totalGalones += (a.galones || 0);',
    'agrupado[a.vehiculoId].totalGalones += Number(a.galones || 0);'
  );

  content = content.replace(
    'const kmRecorridos = (m.kmLlegada || 0) - (m.kmSalida || 0);',
    'const kmRecorridos = Number(m.kmLlegada || 0) - Number(m.kmSalida || 0);'
  );

  // Fix renders
  content = content.replace(
    'render: (d: any) => <span className="font-medium text-blue-600">{d.totalGalones.toFixed(2)} gal.</span>',
    'render: (d: any) => <span className="font-medium text-blue-600">{Number(d.totalGalones).toFixed(2)} gal.</span>'
  );

  // Re-add enableColumnFilters if missing
  if (!content.includes('enableColumnFilters={true}')) {
    content = content.replace('<DataTable \n              columns={columns}', '<DataTable \n              enableColumnFilters={true}\n              columns={columns}');
  }

  fs.writeFileSync(path, content);
  console.log('Fixed CalcularRendimiento');
}

fixTotalizar();
fixCalcular();
