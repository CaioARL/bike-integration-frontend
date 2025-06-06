export interface EventoFormData {
  nome: string;
  descricao: string;
  data: string;
  faixaKm: number;
  urlSite?: string;
  gratuito: boolean;
  idTipoEvento: number | null;
  idUsuario?: string;
  endereco: {
    cidade: string;
    estado: string;
    latitude: number;
    longitude: number;
    cep?: string;
    bairro?: string;
    rua?: string;
    numero?: string | number;
    complemento?: string;
  };
}
