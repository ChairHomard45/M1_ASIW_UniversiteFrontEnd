import { Etudiant } from '../entities/Etudiant';
import { Parcours } from '../entities/Parcours';
import type { IDAO } from './IDAO';
import axios from 'axios';

export class EtudiantDAO implements IDAO<Etudiant> {
  private static instance: EtudiantDAO;

  private constructor() {}

  public static getInstance(): EtudiantDAO {
    if (!EtudiantDAO.instance) {
      EtudiantDAO.instance = new EtudiantDAO();
    }
    return EtudiantDAO.instance;
  }

  public async create(data: Etudiant): Promise<Etudiant> {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/Etudiants`, data);
      return response.data;
    } catch (error) {
      return data;
      throw new Error('Impossible de créer le nouveau Etudiant');
    }
  }

  public async get(id: number): Promise<Etudiant> {
    // Retrieve a Etudiant document from the database
    return new Etudiant( id,"22158", "Martinez", "David", "Delp@gmail.com", null );
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/Etudiants/`+id);
      return response.data;
    } catch (error) {
      throw new Error("Impossible de supprimer l'Etudiant");
    }
  }

  public async update(id: number, data: Etudiant): Promise<Etudiant> {
    // Update an Etudiant document in the database
    return data;
  }

  public async delete(id: number): Promise<void> {
    // Delete an Etudiant document from the database
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/Etudiants/delete/`+id);
      return response.data;
    } catch (error) {
      return;
      throw new Error('Impossible de supprimer l`Etudiant');
    }
  }

  public async list(): Promise<Etudiant[]> {
    // List all Etudiants documents from the database
    return [
      new Etudiant( 1,"22158", "Martinez", "David", "Delp@gmail.com", null ),
      new Etudiant( 2,"55624", "Kushinada", "Lucy", "Delpgr@gmail.com", null ),
      new Etudiant( 3,"54624", "Chamber", "Rebecca", "Delpgr@gmail.com", new Parcours(1, 'Parcours 1', 2024) )
    ];

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/Etudiants/list`);
      return response.data;
    } catch (error) {
      throw new Error('Impossible de récupérer la liste');
    }
  }
}