export interface PagoRequest {
    reciboId: number;
    montoPagado: number;
    metodoPago: string;
    nroOperacion?: string;
    observaciones?: string;
    empleadoRegistroId: number;
}
