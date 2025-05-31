export interface AuthResponse {
  id: string;
  nome: string;
  nomeUsuario: string;
  endereco: string | null;
  email: string;
  role: string;
  cpf: string | null;
  cnpj: string | null;
  dtCriacao: string;
  nivelHabilidade: string | null;
  sessao: {
    id: number;
    token: string;
  };
  s3Url: string | null;
}
