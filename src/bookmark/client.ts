import {jwtclient} from "./JWTClient"
import {SheetValues, Spreadsheets} from "./types";

const API_BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets`;
export const fetchAllSheetsInfo = (spreadsheetId: string) => jwtclient.request<Spreadsheets>({url: `${API_BASE_URL}/${spreadsheetId}`});

export const fetchSheetValues = (spreadsheetId: string, sheetName: string, begin_row: number, end_row: number, end_column: number) =>
    jwtclient.request<SheetValues>({url: `${API_BASE_URL}/${spreadsheetId}/values/${sheetName}!R${begin_row}C1:R${end_row}C${end_column}`});

