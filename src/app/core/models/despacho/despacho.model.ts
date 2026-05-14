export interface InstalacionPendienteDTO {
    id: number;
    contratoId: number;
    nombreCliente: string;
    direccionCompleta: string;
    fechaProgramada: string;
    franjaHoraria: string;
    estado: string;
    tecnicoNombre: string;
    celularCliente: string;
    documentoCliente: string;
    detallePedido?: string;
    nombrePromocion?: string;
}
