const API_URL = 'http://127.0.0.1:3000/api';

async function updateMovimientos() {
  const res = await fetch(`${API_URL}/movimientos`);
  if (!res.ok) return;
  const movimientos = await res.json();
  console.log(`Found ${movimientos.length} movimientos`);

  for (const m of movimientos) {
    const day = Math.floor(Math.random() * 18) + 1;
    const dayStr = String(day).padStart(2, '0');
    const newDate = `2026-07-${dayStr}T10:00:00Z`;

    await fetch(`${API_URL}/movimientos/${m.movimientoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fecha: newDate })
    });
    console.log(`Updated movimiento ${m.movimientoId} to ${newDate}`);
  }
}

async function updateAsignaciones() {
  const res = await fetch(`${API_URL}/asignaciones`);
  if (!res.ok) return;
  const asignaciones = await res.json();
  console.log(`Found ${asignaciones.length} asignaciones`);

  for (const a of asignaciones) {
    const day = Math.floor(Math.random() * 10) + 1;
    const dayStr = String(day).padStart(2, '0');
    const newInicio = `2026-07-${dayStr}T08:00:00Z`;

    await fetch(`${API_URL}/asignaciones/${a.asignacionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fechaInicio: newInicio })
    });
    console.log(`Updated asignacion ${a.asignacionId} to ${newInicio}`);
  }
}

async function main() {
  try {
    await updateMovimientos();
    await updateAsignaciones();
    console.log('Fechas actualizadas correctamente a Julio 2026.');
  } catch(e) {
    console.error(e);
  }
}

main();
