export interface Endereco {
  cep: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: number | string;
  complemento: string;
  latitude?: number;
  longitude?: number;
}
