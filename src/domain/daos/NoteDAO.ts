import type { IDAO } from '@/domain/daos/IDAO';
import  { Note } from '@/domain/entities/Note';
import axios from 'axios';
import { testData } from '@/assets/TestData';
import { UE } from '@/domain/entities/Ue';


export class NoteDAO implements IDAO<Note> {
  private static instance: NoteDAO;

  private constructor() {}

  public static getInstance(): NoteDAO {
    if (!NoteDAO.instance) {
      NoteDAO.instance = new NoteDAO();
    }
    return NoteDAO.instance;
  }

  public async create(data: Note): Promise<Note> {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/Note`, data);
      return response.data;
    } catch (error) {
      testData.notes.push(data);
      return data;
      throw new Error('Impossible de créer la nouvelle note');
    }
  }

  public async delete(id: number): Promise<void> {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/Note/delete/`+id);
      return response.data;
    } catch (error) {
      //test
      const NoteIndex = testData.notes.findIndex((note) => note.ID === id);
      if (NoteIndex === -1) throw new Error(`Note with ID ${id} not found`);
      testData.notes.splice(NoteIndex, 1);
      return;
      //FinTest
      throw new Error('Impossible de supprimer l`Note');
    }
  }

  public async getByIds(idUE: number, idEtudiant: number): Promise<Note[]> {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/Note/`+idUE+`-`+idEtudiant);
      return response.data;
    } catch (error) {
      //test
      return testData.notes.filter((note) => note.UE?.ID === idUE && note.Etudiant?.ID === idEtudiant);
      //FinTest
      throw new Error("Impossible de supprimer de la note");
    }
  }

  public async get(id: number): Promise<Note> {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/Note/`+id);
      return response.data;
    } catch (error) {
      //test
      const note = testData.notes.find((ue) => ue.ID === id);
      if (!note) throw new Error(`Note with ID ${id} not found`);
      const associatedEtudiant = note?.Etudiant || null;
      const associatedUE = note?.UE || null;
      return new Note(note.ID, associatedEtudiant,associatedUE, note.Value);
      //FinTest
      throw new Error("Impossible de supprimer de la note");
    }
  }

  public async list(): Promise<Note[]> {
    return testData.notes.map((note) => {
      const associatedEtudiant = note?.Etudiant || null;
      const associatedUE = note?.UE || null;
      return new Note(note.ID, associatedEtudiant,associatedUE, note.Value);
    });

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/Note`);
      return response.data;
    } catch (error) {
      throw new Error('Impossible de récupérer la liste');
    }
  }

  public async update(id: number, data: Note): Promise<Note> {
    const noteIndex = testData.notes.findIndex((note) => note.ID === id);
    if (noteIndex === -1) throw new Error(`Note with ID ${id} not found`);

    testData.notes[noteIndex] = data;
    return data;
  }



}