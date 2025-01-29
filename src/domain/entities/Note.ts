import type { UE } from '@/domain/entities/Ue';
import type { Etudiant } from '@/domain/entities/Etudiant';

export interface INote {
  ID: number | null;
  Etudiant: Etudiant | null;
  UE: UE | null;
  Value: number | null;

  toJSON(): Object;
}

export class Note implements INote {
  constructor(
    public ID: number | null,
    public Etudiant: Etudiant | null,
    public UE: UE | null,
    public Value: number | null
  ) {}

  toJSON(): Object {
    return {
      ID: this.ID,
      Etudiant: this.Etudiant,
      UE: this.UE,
      Value: this.Value,
    }
  }
} 