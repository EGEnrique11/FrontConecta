export interface ContratoResumenDTO {
    id: number;
    codigoContrato: string;
    planNombre: string;
    direccionCompleta: string;
    cicloFacturacion: string;
    fechaActivacion: string;
    estadoContrato: string;
    promocionNombre?: string;
    fechaInicioPromocion?: string;
    fechaFinPromocion?: string;
}

