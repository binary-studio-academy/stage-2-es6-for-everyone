import { callApi } from '../helpers/apiHelper';

class FighterService {
  async getFighters() {
    try {
      const endpoint = 'fighters.json';
      return await callApi(endpoint, 'GET');
    } catch (error) {
      throw error;
    }
  }

  async getFighterDetails(id) {
    // todo: implement this method
    // endpoint - `details/fighter/${id}.json`;
    try {
      const endpoint = `details/fighter/${id}.json`;
      return await callApi(endpoint, 'GET');
    } catch (error) {
      throw error;
    }
  }
}

export const fighterService = new FighterService();
