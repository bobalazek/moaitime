import { API_URL, ResponseInterface, StatisticsGeneral } from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Statistics **********/
export const getGeneralStatistics = async () => {
  const response = await fetchJson<ResponseInterface<StatisticsGeneral>>(
    `${API_URL}/api/v1/statistics`,
    {
      method: 'GET',
    }
  );

  return response.data as StatisticsGeneral;
};
