import { Etudiant } from '../entities/Etudiant';
import type { IDAO } from './IDAO';
import axios from 'axios';
import { testData } from '@/assets/TestData';

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
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/Etudiant`, data);
      return response.data;
    } catch (error) {
      testData.etudiants.push(data);
      return data;
      throw new Error('Impossible de créer le nouveau Etudiant');
    }
  }

  public async get(id: number): Promise<Etudiant> {
    // Retrieve a Etudiant document from the database
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/Etudiant/`+id);
      return response.data;
    } catch (error) {
      //test
      const etudiant = testData.etudiants.find((etudiant) => etudiant.ID === id);
      if (!etudiant) throw new Error(`Etudiant with ID ${id} not found`);
      const associatedParcours = testData.etudiants.find((etudiant) => etudiant.ID === id)?.Parcours || null;
      return new Etudiant(etudiant.ID, etudiant.NumEtud, etudiant.Nom, etudiant.Prenom,etudiant.Email, associatedParcours);
      //FinTest
      throw new Error("Impossible de supprimer l'Etudiant");
    }
  }

  public async update(id: number, data: Etudiant): Promise<Etudiant> {
    const etudiantIndex = testData.etudiants.findIndex((etudiant) => etudiant.ID === id);
    if (etudiantIndex === -1) throw new Error(`Etudiant with ID ${id} not found`);

    testData.etudiants[etudiantIndex] = data;
    // Update an Etudiant document in the database
    return data;
  }

  public async delete(id: number): Promise<void> {
    // Delete an Etudiant document from the database
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/Etudiant/delete/`+id);
      return response.data;
    } catch (error) {
      //test
      const etudiantIndex = testData.etudiants.findIndex((etudiant) => etudiant.ID === id);
      if (etudiantIndex === -1) throw new Error(`Etudiant with ID ${id} not found`);
      testData.etudiants.splice(etudiantIndex, 1);
      return;
      //FinTest
      throw new Error('Impossible de supprimer l`Etudiant');
    }
  }

  public async list(): Promise<Etudiant[]> {
    // List all Etudiants documents from the database
    return testData.etudiants.map((etudiant) => {
      const associatedParcours = etudiant.Parcours || null;
      return new Etudiant(etudiant.ID, etudiant.NumEtud, etudiant.Nom, etudiant.Prenom,etudiant.Email, associatedParcours);
    });

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/Etudiant`);
      return response.data;
    } catch (error) {
      throw new Error('Impossible de récupérer la liste');
    }
  }
}