export interface IParcours {
  ID: number | null;
  NomParcours: string | null;
  AnneeFormation: number | null;
}

export class Parcours implements IParcours {
  constructor(
    public ID: number | null,
    public NomParcours: string | null,
    public AnneeFormation: number | null
  ) {}
}