import { Etudiant } from '@/domain/entities/Etudiant';
import { Note } from '@/domain/entities/Note';
import { Parcours } from '@/domain/entities/Parcours';
import { UE } from '@/domain/entities/Ue';

// Create new students with and without notes
const etudiants = [
  new Etudiant(1, "22158", "Martinez", "David", "Delp@gmail.com", null),
  new Etudiant(2, "55624", "Kushinada", "Lucy", "Delpgr@gmail.com", null),
  new Etudiant(3, "54624", "Chamber", "Rebecca", "Delpgr@gmail.com", null), // Rebecca has no note
  new Etudiant(4, "12345", "Doe", "John", "john.doe@gmail.com", null), // New student without notes
  new Etudiant(5, "98765", "Smith", "Anna", "anna.smith@gmail.com", null), // New student without notes
  new Etudiant(6, "34443", "tr", "Anna", "anna.g@gmail.com", null),
];

// Create Parcours
const parcours = [
  new Parcours(1, 'Parcours 1', 2024, null),
  new Parcours(2, 'Parcours 2', 2024, null),
];

// Create UE (units of education)
const ues = [
  new UE(1, 'UE 1', '252', null),
  new UE(2, 'UE 2', '555', null),
];

// Create notes (with some students having notes)
const notes = [
  new Note(1, null, null, 15), // David Martinez has a note
  new Note(2, null, null, 18), // Lucy Kushinada has a note
  // Removed Rebecca's note
  new Note(4, null, null, 14), // John Doe (new student) has a note
  new Note(5, null, null, 16), // Anna Smith (new student) has a note
];

// Establish relationships
ues[0].Parcours = [parcours[0], parcours[1]]; // UE 1 has Parcours 1 and Parcours 2
ues[1].Parcours = [parcours[1]]; // UE 2 has only Parcours 2

etudiants[0].Parcours = parcours[0]; // David Martinez is in Parcours 1
etudiants[1].Parcours = parcours[1]; // Lucy Kushinada is in Parcours 2
etudiants[2].Parcours = parcours[0]; // Rebecca Chamber is in Parcours 1 (no note assigned)
etudiants[3].Parcours = parcours[0]; // John Doe is in Parcours 1
etudiants[4].Parcours = parcours[1]; // Anna Smith is in Parcours 2
etudiants[5].Parcours = parcours[1];

// Update Parcours to include Inscrit
parcours[0].Inscrit = [etudiants[0], etudiants[2], etudiants[3]]; // David, Rebecca, and John are in Parcours 1
parcours[1].Inscrit = [etudiants[1], etudiants[4], etudiants[5]]; // Lucy and Anna are in Parcours 2

// Assign notes to students (Rebecca has no note now)
notes[0].Etudiant = etudiants[0]; // David Martinez's Note
notes[0].UE = ues[0]; // For UE 1
notes[1].Etudiant = etudiants[1]; // Lucy Kushinada's Note
notes[1].UE = ues[1]; // For UE 2
notes[2].Etudiant = etudiants[3]; // John Doe's Note (new student)
notes[2].UE = ues[0]; // For UE 1
notes[3].Etudiant = etudiants[4]; // Anna Smith's Note (new student)
notes[3].UE = ues[1]; // For UE 2

// Export the test data
export const testData = {
  etudiants,
  parcours,
  ues,
  notes,
};
