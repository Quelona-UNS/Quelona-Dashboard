import { Component, OnInit, ViewChild } from '@angular/core'
import { Position } from '../types'
import { GpsPositionsService } from '../services/gps-positions.service'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { formatDate } from '@angular/common'
import { Sort } from '@angular/material/sort'

type Column = {
  key: string
  type: string
  label: string
  editable: boolean
}

const COLUMNS_SCHEMA: Column[] = [
  {
    key: 'code',
    type: 'text',
    label: 'Código',
    editable: true,
  },
  {
    key: 'date',
    type: 'text',
    label: 'Fecha',
    editable: false,
  },
  {
    key: 'time',
    type: 'time',
    label: 'Hora',
    editable: false,
  },
  {
    key: 'longitude',
    type: 'text',
    label: 'Longitud',
    editable: false,
  },
  {
    key: 'latitude',
    type: 'text',
    label: 'Latitud',
    editable: false,
  },
]

type DisplayPosition = {
  id: string
  code: string
  date: string
  time: string
  longitude: string
  latitude: string
  timestamp: number
}

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.sass'],
})
export class TablesComponent implements OnInit {
  loading = false
  positions: Position[] = []
  displayPositions: DisplayPosition[] = []
  sortedPositions: DisplayPosition[]
  columnsSchema: Column[] = COLUMNS_SCHEMA
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key)
  dataSource: MatTableDataSource<DisplayPosition>

  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  constructor(private positionsService: GpsPositionsService) {}

  ngOnInit(): void {
    this.fetchPositions()
  }

  fetchPositions(): void {
    this.loading = true
    this.positionsService.getPositions().then((snapshot) => {
      this.positions = []
      snapshot.forEach((position) => this.positions.push(position.data()))
      this.refreshDataSource()
    })
  }

  refreshDataSource(): void {
    this.displayPositions = this.positions.map(this.toDisplayPosition)
    this.dataSource = new MatTableDataSource<DisplayPosition>(this.displayPositions)
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.loading = false
  }

  updatePositions(): void {
    this.positionsService.updatePositions(this.displayPositions.map(this.toDatabasePosition))
  }

  toDisplayPosition(position: Position): DisplayPosition {
    return {
      id: position.id,
      code: position.code,
      date: formatDate(new Date(position.timestamp), "dd/MM/yyyy", "en"),
      time: formatDate(new Date(position.timestamp), "HH:mm", "en"),
      longitude: position.longitude.toString(),
      latitude: position.latitude.toString(),
      timestamp: position.timestamp,
    }
  }

  toDatabasePosition(position: DisplayPosition): Position {
    return {
      id: position.id,
      code: position.code || "",
      longitude: parseFloat(position.longitude),
      latitude: parseFloat(position.latitude),
      timestamp: position.timestamp,
    }
  }

  sortData(sort: Sort) {
    const data = this.displayPositions.slice()
    if (!sort.active || sort.direction === '') {
      this.sortedPositions = data
      return
    }

    console.log(sort)

    this.sortedPositions = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc'
      switch (sort.active) {
        case 'code':
          return this.compare(a.code, b.code, isAsc)
        case 'date':
          return this.compare(a.date, b.date, isAsc)
        case 'time':
          return this.compare(a.time, b.time, isAsc)
        case 'longitude':
          return this.compare(a.longitude, b.longitude, isAsc)
        case 'latitude':
          return this.compare(a.latitude, b.latitude, isAsc)
        default:
          return 0
      }
    })
    this.dataSource.data = this.sortedPositions

  }

  compare(a: string, b: string, isAsc: boolean) {
    return (a.toLocaleLowerCase() > b.toLocaleLowerCase() ? -1 : 1) * (isAsc ? 1 : -1)
  }
}
