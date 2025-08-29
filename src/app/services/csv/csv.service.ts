import { Injectable } from '@angular/core'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { COLUMNS_SCHEMA, DisplayPosition } from '../../tables/tables.component'

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  exportToExcel(filename: string, rows: DisplayPosition[]) {
    if (!rows || !rows.length) {
      return
    }

    // Preparamos un "molde" para saber qué columnas exportar
    const objectIndicator = Object.apply({}, [rows[0]])
    delete objectIndicator.id
    delete objectIndicator.timestamp
    const keys = Object.keys(objectIndicator)

    // Obtenemos los labels (encabezados) desde tu COLUMNS_SCHEMA
    const keyLabels = COLUMNS_SCHEMA
      .filter((column) => column.key !== "id" && column.key !== "timestamp")
      .map((column) => column.label)

    // Armamos un array de objetos con labels como claves (Excel muestra las columnas con estos nombres)
    const data = rows.map((row: DisplayPosition) => {
      const obj: any = {}
      keys.forEach((key, index) => {
        obj[keyLabels[index]] = row[key as keyof DisplayPosition] ?? ''
      })
      return obj
    })

    // Generamos la hoja de Excel desde los objetos
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data)

    // Creamos el "workbook" (archivo Excel con sus hojas)
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Datos': worksheet },
      SheetNames: ['Datos']
    }

    // Convertimos el workbook en un array buffer
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

    // Lo convertimos a Blob y forzamos la descarga
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, filename.endsWith('.xlsx') ? filename : filename + '.xlsx')
  }
}
