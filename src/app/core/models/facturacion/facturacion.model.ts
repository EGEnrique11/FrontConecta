export interface ReciboListDTO {
    id: number;
    numeroRecibo: string;
    fechaEmision: string;      // Formato: YYYY-MM-DD
    fechaVencimiento: string;  // Formato: YYYY-MM-DD
    montoTotal: number;
    estadoPago: string;
    //solo si exite registro dle ultimo pago
    fechaPago?: string;
    metodoPago?: string;
    contratoId: number;
}