import { callApi } from '../helpers/apiHelper';

class FighterService {
  #endpoint = 'fighters.json';

  async getFighters() {
    try {
      const apiResult = await callApi(this.#endpoint);
      return apiResult;
    } catch (error) {
      throw error;
    }
  }

  async getFighterDetails(id) {
    try {
      const fighterDetails = await callApi(`details/fighter/${id}.json`);
      return fighterDetails;
    } catch (error) {
      throw error;
    }
    // todo: implement this method
    // endpoint - `details/fighter/${id}.json`;
  }


}

export const fighterService = new FighterService();
