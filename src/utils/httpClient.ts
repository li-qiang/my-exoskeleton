import { getPreferenceValues } from '@raycast/api';
import axios from 'axios'
const { baseUrl, token } = getPreferenceValues();

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    'Authorization': `Bearer ${token}`,
  }
});

export const http = instance
