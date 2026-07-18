const fs = require('fs');

const path = 'src/pages/mantenimiento/RegistroTrabajos/RegistroManoObraRepuestos.tsx';
let c = fs.readFileSync(path, 'utf8');

c = c.replace(
`    queryFn: async () => {
      // Assuming api is exported from api.ts
      const { api } = await import('../../../services/api');
      const { data } = await api.get('/mantenimientos/ordenes');
      return data;
    }`,
`    queryFn: mantenimientoService.getAll`
);

fs.writeFileSync(path, c);
console.log('Fixed API fetch');
