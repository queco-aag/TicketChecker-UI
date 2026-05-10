import { useEffect, useRef, useState, useCallback } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { InputNumber } from 'primereact/inputnumber';
import { clavesAPI } from '../../shared/api/client';

const NumbersVerificationListPage = () => {
  const toast = useRef(null);
  const [numeros, setNumeros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [rangoDesde, setRangoDesde] = useState(1);
  const [rangoHasta, setRangoHasta] = useState(5000);
  const [availableYears, setAvailableYears] = useState([]);

  const loadAvailableYears = useCallback(async () => {
    try {
      console.log('🔍 Cargando años disponibles...');
      console.log('🌐 Llamando a: GET /api/v1/claves');
      
      const response = await clavesAPI.listar();
      console.log('📥 Respuesta completa:', response);
      console.log('📥 response.data:', response.data);
      
      // El backend retorna: { claves: [...], success: true }
      let clavesArray = [];

      if (response.data?.claves && Array.isArray(response.data.claves)) {
        clavesArray = response.data.claves;
        console.log('📦 Claves extraídas de response.data.claves:', clavesArray);
      } else if (Array.isArray(response.data)) {
        clavesArray = response.data;
        console.log('📦 Claves extraídas directamente de response.data:', clavesArray);
      } else {
        console.error('❌ Formato de respuesta no reconocido:', response.data);
        throw new Error('La respuesta del servidor no tiene el formato esperado');
      }
      
      console.log(`📋 ${clavesArray.length} claves recibidas`);
      
      if (clavesArray.length === 0) {
        console.warn('⚠️ No hay claves registradas');
        setAvailableYears([]);
        toast.current.show({
          severity: 'info',
          summary: 'Sin claves registradas',
          detail: 'No hay años con claves registradas. Por favor, registre una clave primero.',
          life: 5000
        });
        return;
      }
      
      // Extraer años del array de claves
      const years = clavesArray.map(clave => {
        console.log('  - Procesando clave:', clave);
        // Buscar campo anio, año o year
        const year = clave.anio || clave.año || clave.year;
        console.log(`    → Año extraído: ${year}`);
        return year;
      }).filter(year => year !== null && year !== undefined && !isNaN(year));
      
      console.log('📅 Años extraídos:', years);
      
      if (years.length === 0) {
        console.warn('⚠️ No se encontraron años válidos en las claves');
        setAvailableYears([]);
        return;
      }
      
      const sortedYears = years.sort((a, b) => b - a); // Ordenar descendente
      setAvailableYears(sortedYears);
      
      console.log('✅ Años disponibles configurados:', sortedYears);
      
      // Seleccionar el primer año disponible
      if (sortedYears.length > 0) {
        if (!sortedYears.includes(yearFilter)) {
          console.log(`⚠️ Año ${yearFilter} no disponible, seleccionando ${sortedYears[0]}`);
          setYearFilter(sortedYears[0]);
        } else {
          console.log(`✓ Año ${yearFilter} está disponible`);
        }
      }
    } catch (error) {
      console.error('❌ Error al cargar años disponibles:', error);
      console.error('❌ Stack trace:', error.stack);
      toast.current.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: `No se pudieron cargar los años disponibles: ${error.message}`,
        life: 4000
      });
      // Si falla, usar el año actual por defecto
      setAvailableYears([new Date().getFullYear()]);
    }
  }, []); // Sin dependencias para evitar re-renders innecesarios

  // Cargar años disponibles al montar el componente
  useEffect(() => {
    loadAvailableYears();
  }, [loadAvailableYears]);

  const loadNumeros = useCallback(async () => {
    // No cargar si no hay años disponibles o si el año no está en la lista
    if (availableYears.length === 0) {
      console.log('⏸️ No se cargan números: no hay años disponibles');
      setNumeros([]);
      return;
    }
    
    if (!availableYears.includes(yearFilter)) {
      console.log(`⏸️ No se cargan números: año ${yearFilter} no está en disponibles`);
      setNumeros([]);
      return;
    }
    
    setLoading(true);
    try {
      console.log(`📊 Cargando números para año ${yearFilter}, rango ${rangoDesde}-${rangoHasta}`);
      const { data } = await clavesAPI.listarNumerosConCodigos(yearFilter, rangoDesde, rangoHasta);
      const numerosArray = data?.numeros || [];
      setNumeros(Array.isArray(numerosArray) ? numerosArray : []);
      console.log(`✅ ${numerosArray.length} números cargados`);
    } catch (error) {
      console.error('❌ Error al cargar números:', error);
      setNumeros([]);
      toast.current.show({
        severity: 'error',
        summary: 'Error al cargar números',
        detail: error.message,
        life: 4000
      });
    } finally {
      setLoading(false);
    }
  }, [yearFilter, rangoDesde, rangoHasta, availableYears]);

  useEffect(() => {
    loadNumeros();
  }, [loadNumeros]);

  const exportCSV = async () => {
    try {
      const response = await clavesAPI.exportarCSV(yearFilter, rangoDesde, rangoHasta);
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `numeros_verificacion_${yearFilter}.csv`;
      link.click();

      toast.current.show({
        severity: 'success',
        summary: 'Exportado',
        detail: 'Archivo CSV descargado correctamente.',
        life: 3000
      });
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error al exportar',
        detail: error.message,
        life: 4000
      });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.current.show({
      severity: 'success',
      summary: 'Copiado',
      detail: 'Código copiado al portapapeles.',
      life: 2000
    });
  };

  const codigoTemplate = (rowData) => {
    return (
      <div className="codigo-cell">
        <code>{rowData.codigoValidacion}</code>
        <Button
          icon="pi pi-copy"
          rounded
          text
          size="small"
          onClick={() => copyToClipboard(rowData.codigoValidacion)}
          tooltip="Copiar código"
        />
      </div>
    );
  };


  const header = (
    <div className="table-header">
      <div className="table-header-left">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar número o código..."
          />
        </span>
        <Dropdown
          value={yearFilter}
          options={availableYears.map(y => ({ label: `Año ${y}`, value: y }))}
          onChange={(e) => setYearFilter(e.value)}
          placeholder="Seleccionar año"
          disabled={availableYears.length === 0}
          emptyMessage="No hay años disponibles"
        />
        <InputNumber
          value={rangoDesde}
          onValueChange={(e) => setRangoDesde(e.value || 1)}
          placeholder="Desde"
          min={1}
          butqtonLayout="horizontal"
          style={{ width: '120px' }}
        />
        <InputNumber
          value={rangoHasta}
          onValueChange={(e) => setRangoHasta(e.value || 5000)}
          placeholder="Hasta"
          min={1}
          showButtons
          buttonLayout="horizontal"
          style={{ width: '120px' }}
        />
      </div>
      <div className="table-header-right">
        <Button
          label="Exportar CSV"
          icon="pi pi-download"
          onClick={exportCSV}
          outlined
        />
        <Button
          label="Actualizar"
          icon="pi pi-refresh"
          onClick={loadNumeros}
          text
        />
      </div>
    </div>
  );

  return (
    <div className="table-page">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="page-header">
        <div>
          <h2>Listado de Números y Códigos de Verificación</h2>
          <p>Consulta y exporta números premiados con sus códigos de verificación</p>
        </div>
      </div>

      <Card>
        <DataTable
          value={numeros}
          loading={loading}
          paginator
          rows={20}
          rowsPerPageOptions={[10, 20, 50, 100]}
          globalFilter={globalFilter}
          header={header}
          emptyMessage="No hay números registrados para este año"
          sortField="numero"
          sortOrder={1}
          filterDisplay="row"
          size="small"
        >
          <Column field="numero" header="Número" sortable filter filterPlaceholder="Buscar" style={{ width: '150px' }} />
          <Column field="codigoValidacion" header="Código Verificación" body={codigoTemplate} sortable filter filterPlaceholder="Buscar código" style={{ width: '250px' }} />
        </DataTable>
      </Card>
    </div>
  );
};

export default NumbersVerificationListPage;

