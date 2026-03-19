import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';

const ClaimsTable = ({ title, data, loading, showShipAction = false, onShip = null }) => {
  const premioBody = (row) => row.premio?.nombre || '-';
  const personaBody = (row) => row.premiado?.nombre || '-';
  const contactoBody = (row) => row.premiado?.contacto || '-';
  const statusBody = (row) => (
    <Tag value={row.premio?.enviado ? 'Enviado' : 'Pendiente'} severity={row.premio?.enviado ? 'success' : 'warning'} />
  );

  const actionBody = (row) => {
    if (!showShipAction) {
      return null;
    }

    return (
      <Button
        label="Marcar enviado"
        icon="pi pi-send"
        disabled={row.premio?.enviado}
        onClick={() => onShip(row.premio?.id)}
        size="small"
      />
    );
  };

  return (
    <section>
      <h2>{title}</h2>
      <DataTable value={data} loading={loading} paginator rows={10} emptyMessage="Sin datos para mostrar.">
        <Column field="numero" header="Numero" sortable />
        <Column body={premioBody} header="Premio" />
        <Column body={personaBody} header="Ganador" />
        <Column body={contactoBody} header="Contacto" />
        <Column body={statusBody} header="Estado" />
        {showShipAction && <Column body={actionBody} header="Acciones" />}
      </DataTable>
    </section>
  );
};

export default ClaimsTable;

