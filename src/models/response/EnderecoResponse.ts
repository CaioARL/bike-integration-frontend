export interface EnderecoResponse {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  location: {
    type: 'Point';
    coordinates: {
      longitude: number;
      latitude: number;
    };
  };
}
