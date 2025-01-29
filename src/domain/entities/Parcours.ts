import type { Etudiant } from '@/domain/entities/Etudiant';

export interface IParcours {
  ID: number | null;
  NomParcours: string | null;
  AnneeFormation: number | null;
  Inscrit: Etudiant[] | null;
  toJSON(): Object;
}

export class Parcours implements IParcours {
  constructor(
    public ID: number | null,
    public NomParcours: string | null,
    public AnneeFormation: number | null,
    public Inscrit: Etudiant[] | null,

  ) {}

  toJSON(): Object {
    return {
      ID: this.ID,
      NomParcours: this.NomParcours,
      AnneeFormation: this.AnneeFormation,
      Inscrit: this.Inscrit?.map((incrt) => incrt.ID)
    };
  }
}