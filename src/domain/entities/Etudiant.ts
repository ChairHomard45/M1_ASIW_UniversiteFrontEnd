import { Parcours } from '@/domain/entities/Parcours';

export interface IEtudiant {
  ID: number | null;
  NumEtud : string | null;
  Nom: string | null;
  Prenom: string | null;
  Email: string | null;
  Parcours: Parcours | null;

  toJSON(): Object;
}

export class Etudiant implements IEtudiant {

  constructor(
    public ID: number | null,
    public NumEtud : string | null,
    public Nom: string | null,
    public Prenom: string | null,
    public Email: string | null,
    public Parcours: Parcours | null
  ) {}



  toJSON(): Object {
    return {
      ID: this.ID,
      NumEtud: this.NumEtud,
      Nom: this.Nom,
      Prenom: this.Prenom,
      Email: this.Email,
      Parcours: this.Parcours
    };
  }
}