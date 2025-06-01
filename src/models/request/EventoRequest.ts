export interface EventoRequest {
  pagina: number;
  nome: string | null;
  descricao: string | null;
  data: string | null;
  cidade: string | null;
  estado: string | null;
  faixaKm: number | null;
  tipoEvento: number | null;
  nivelHabilidade: number | null;
  gratuito: boolean | null;
  aprovado: boolean | null;
}
