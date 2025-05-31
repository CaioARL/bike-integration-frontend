export interface Endereco {
    cep: string;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: number;
}

export interface Evento {
    id: number;
    nome: string;
    descricao: string;
    data: string; // ISO 8601 format
    endereco: Endereco;
    gratuito: boolean;
    faixaKm: number;
    urlSite?: string; // Optional property
    idTipoEvento: number;
    idUsuario: number;
}