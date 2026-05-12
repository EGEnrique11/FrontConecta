import { DireccionDto } from "./direccion.model";
import { TipoDocumento } from "./tipo-enums.model";

export interface ClienteDto {
    clienteId?: number;
    direccionId?: number;
    tipoDocumento: TipoDocumento;
    documento: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    correo: string;
    celular: string;
    fechaNacimiento: string;
    direccion: DireccionDto;
}
