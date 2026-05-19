import { TipoUrbanizacion, TipoVia } from "./tipo-enums.model";

export interface DireccionDto {
    idDistrito: number;
    tipoVia?: TipoVia;
    numero?: string;
    nombreVia?: string;
    tipoUrbanizacion?: TipoUrbanizacion;
    nombreUrbanizacion?: string;
    manzana?: string;
    lote?: string;
    piso?: string | null;
    interior?: string | null;
    direccionCompleta: string;
    latitud: string;
    longitud: string;
}

