import type { NivelHabilidade } from './NivelHabilidade';

export interface TipoEvento {
  id: number;
  nome: string;
  nivelHabilidade: NivelHabilidade;
}
