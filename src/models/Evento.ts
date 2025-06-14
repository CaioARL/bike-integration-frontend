import type { Endereco } from './Endereco';
import type { TipoEvento } from './TipoEvento';
import type { Usuario } from './Usuario';

export interface Evento {
  id: number;
  nome: string;
  descricao: string;
  data: string; // dd/MM/yyyy HH:mm:ss
  dtAtualizacao: string;
  endereco: Endereco;
  gratuito: boolean;
  valor: number | null;
  faixaKm: number;
  urlSite?: string;
  tipoEvento: TipoEvento;
  usuario: Usuario;
  aprovado: boolean | null;
  s3Url: string | null;
}
