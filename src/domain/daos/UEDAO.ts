import { UE } from '../entities/Ue';
import type { IDAO } from './IDAO';
import axios from 'axios';
import { Parcours } from '@/domain/entities/Parcours';
import { testData } from '@/assets/testData';

export class UEDAO implements IDAO<UE> {
  private static instance: UEDAO;

  private constructor() {}

  public static getInstance(): UEDAO {
    if (!UEDAO.instance) {
      UEDAO.instance = new UEDAO();
    }
    return UEDAO.instance;
  }

  public async create(data: UE): Promise<UE> {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/ue`, data.toJSON());
      return response.data;
    } catch (error) {
      testData.ues.push(data);
      return data;
      throw new Error('Impossible de créer la nouvelle ue');
    }
  }

  public async get(id: number): Promise<UE> {
    // Retrieve a Ue document from the database
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ue/`+id);
      return response.data;
    } catch (error) {
      //test
      const ue = testData.ues.find((ue) => ue.ID === id);
      if (!ue) throw new Error(`UE with ID ${id} not found`);
      const associatedParcours = testData.ues.find((ue) => ue.ID === id)?.Parcours || [];
      return new UE(ue.ID, ue.Intitule, ue.NumeroUe, associatedParcours);
      //FinTest
      throw new Error('Impossible de supprimer l\'Ue');
    }
  }

  public async update(id: number, data: UE): Promise<UE> {
    const ueIndex = testData.ues.findIndex((ue) => ue.ID === id);
    if (ueIndex === -1) throw new Error(`UE with ID ${id} not found`);

    testData.ues[ueIndex] = data;
    return data;
  }

  public async delete(id: number): Promise<void> {
    // Delete a Ue document from the database
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/ue/delete/`+id);
      return response.data;
    } catch (error) {
      //test
      const ueIndex = testData.ues.findIndex((ue) => ue.ID === id);
      if (ueIndex === -1) throw new Error(`UE with ID ${id} not found`);
      testData.ues.splice(ueIndex, 1);
      return;
      //FinTest
      throw new Error('Impossible de supprimer l\'ue');
    }
  }

  public async list(): Promise<UE[]> {
    // List all Parcours documents from the database
    return testData.ues.map((ue) => {
      const associatedParcours = ue.Parcours || [];
      return new UE(ue.ID, ue.Intitule, ue.NumeroUe, associatedParcours);
    });

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ue/list`);
      return response.data;
    } catch (error) {

      throw new Error('Impossible de récupérer la liste');
    }
  }
}