import { DireccionDto } from "./direccion.model";
import { TipoDocumento } from "./tipo-enums.model";

export interface ClienteRegistrationDTO {
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
    empleadoId?: number;
    direccion: DireccionDto;
}
//Para las consultas
export interface ClienteDto {
    id: number;
    tipoPersona?: string;
    tipoDocumento: string;
    documento: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    correo: string;
    celular: string;
    fechaNacimiento?: string;
    estado: string;
    createdAt: string;
    updatedAt?: string;
}

export interface DeudaResponse {
    tieneDeuda: boolean;
    mensaje: string;
}