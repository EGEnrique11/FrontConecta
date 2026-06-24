export interface ResumenDashboard {
    totalClientesActivos: number;
    instalacionesPendientesHoy: number;
    tasaMoraPorcentual: number;
    ingresosMesActual: number;
}

export interface FinanzasDeudaIngreso {
    deudasYMora: number;
    ingresosRealizados: number;
}

export interface EfectividadMora {
    tasaMoraGlobal: number;
    tasaEfectividad: number;
}

export interface TasaInstalacion {
    totalMes: number;
    tasaExitoPorcentaje: number;
    completadasMes: number;
}

export interface CrecimientoMensual {
    cantidad: number;
    anio: number;
    mes: number;
}

export interface ProductividadTecnica {
    tecnico: string;
    completadas: number;
    canceladas: number;
    reprogramadas: number;
    enRuta: number;
    enProceso: number;
    total: number;
}

export interface RendimientoVendedor {
    vendedor: string;
    pendientes: number;
    activos: number;
    suspendidos: number;
    cancelados: number;
    instaladas: number;
    total: number;
}

export type InstalacionesEstados = Record<string, number>;
