import { useEffect, useRef, useState, useCallback } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
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
  const [rangoHasta, setRangoHasta] = useState(100000);

  const loadNumeros = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await clavesAPI.listarNumerosConCodigos(yearFilter, rangoDesde, rangoHasta);
      const numerosArray = data?.numeros || [];
      setNumeros(Array.isArray(numerosArray) ? numerosArray : []);
    } catch (error) {
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
  }, [yearFilter, rangoDesde, rangoHasta]);

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
          options={[2024, 2025, 2026].map(y => ({ label: `Año ${y}`, value: y }))}
          onChange={(e) => setYearFilter(e.value)}
          placeholder="Seleccionar año"
        />
        <InputNumber
          value={rangoDesde}
          onValueChange={(e) => setRangoDesde(e.value || 1)}
          placeholder="Desde"
          min={1}
          showButtons
          buttonLayout="horizontal"
          style={{ width: '120px' }}
        />
        <InputNumber
          value={rangoHasta}
          onValueChange={(e) => setRangoHasta(e.value || 100000)}
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
          responsiveLayout="scroll"
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

