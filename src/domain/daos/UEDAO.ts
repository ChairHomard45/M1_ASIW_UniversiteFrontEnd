import { UE } from '../entities/Ue';
import type { IDAO } from './IDAO';
import axios from 'axios';

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
      return data;
      throw new Error('Impossible de créer la nouvelle ue');
    }
  }

  public async get(id: number): Promise<UE> {
    // Retrieve a Ue document from the database
    return new UE(id, 'UE 1', '252', null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ue/`+id);
      return response.data;
    } catch (error) {

      throw new Error('Impossible de supprimer l\'Ue');
    }
  }

  public async update(id: number, data: UE): Promise<UE> {
    // Update a Ue document in the database
    return data;
  }

  public async delete(id: number): Promise<void> {
    // Delete a Ue document from the database

    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/ue/delete/`+id);
      return response.data;
    } catch (error) {
      return;
      throw new Error('Impossible de supprimer l\'ue');
    }
  }

  public async list(): Promise<UE[]> {
    // List all Parcours documents from the database
    return [
      new UE(1,'UE 1', "252",null),
      new UE(2,'UE 2',"555", null )
    ];

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ue/list`);
      return response.data;
    } catch (error) {

      throw new Error('Impossible de récupérer la liste');
    }
  }
}