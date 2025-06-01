import type { Endereco } from './Endereco';
import type { NivelHabilidade } from './NivelHabilidade';
import type { Sessao } from './Sessao';

export interface Usuario {
  id: string;
  nome: string;
  nomeUsuario: string;
  endereco: Endereco;
  email: string;
  role: string;
  cpf: string;
  cnpj: string;
  dtCriacao: string;
  nivelHabilidade: NivelHabilidade;
  sessao: Sessao;
  s3Url: string;
}
