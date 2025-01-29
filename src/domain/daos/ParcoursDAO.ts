import { Parcours } from '../entities/Parcours';
import type { IDAO } from './IDAO';
import axios from 'axios';
import { testData } from '@/assets/TestData';
import { UE } from '@/domain/entities/Ue';

export class ParcoursDAO implements IDAO<Parcours> {
  private static instance: ParcoursDAO;

  private constructor() {}

  public static getInstance(): ParcoursDAO {
    if (!ParcoursDAO.instance) {
      ParcoursDAO.instance = new ParcoursDAO();
    }
    return ParcoursDAO.instance;
  }

  public async create(data: Parcours): Promise<Parcours> {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/Parcours`, data);
      return response.data;
    } catch (error) {
      testData.parcours.push(data);
      return data;
      throw new Error('Impossible de créer le nouveau parcours');
    }
  }

  public async get(id: number): Promise<Parcours> {
    // Retrieve a Parcours document from the database
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/Parcours/`+id);
      return response.data;
    } catch (error) {
      //test
      const parcour = testData.parcours.find((parcour) => parcour.ID === id);
      if (!parcour) throw new Error(`Parcour with ID ${id} not found`);
      const associatedEtudiants = testData.parcours.find((parcour) => parcour.ID === id)?.Inscrit || [];
      return new Parcours(parcour.ID, parcour.NomParcours, parcour.AnneeFormation, associatedEtudiants);
      //FinTest
      throw new Error('Impossible de supprimer le parcours');
    }
  }

  public async update(id: number, data: Parcours): Promise<Parcours> {
    const parcoursIndex = testData.parcours.findIndex((parcour) => parcour.ID === id);
    if (parcoursIndex === -1) throw new Error(`Parcour with ID ${id} not found`);
    testData.parcours[parcoursIndex] = data;
    // Update a Parcours document in the database
    return data;
  }

  public async delete(id: number): Promise<void> {
    // Delete a Parcours document from the database
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/Parcours/delete/`+id);
      return response.data;
    } catch (error) {
      //test
      const ParcourIndex = testData.parcours.findIndex((parcour) => parcour.ID === id);
      if (ParcourIndex === -1) throw new Error(`Parcour with ID ${id} not found`);
      testData.parcours.splice(ParcourIndex, 1);
      console.log('Parcours deleted successfully');
      return;
      //Fintest
      throw new Error('Impossible de supprimer le parcours');
    }
  }

  public async list(): Promise<Parcours[]> {
    // List all Parcours documents from the database
    return testData.parcours.map((parcour) => {
      const associatedEtudiant = parcour.Inscrit || [];
      return new Parcours(parcour.ID, parcour.NomParcours, parcour.AnneeFormation, associatedEtudiant);
    });

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/Parcours/list`);
      return response.data;
    } catch (error) {
      throw new Error('Impossible de récupérer la liste');
    }
  }
}