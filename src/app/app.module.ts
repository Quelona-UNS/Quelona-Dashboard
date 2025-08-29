import { NgModule, importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { environment } from 'src/environments/environment'
import { initializeApp, provideFirebaseApp } from '@angular/fire/app'
import { provideFirestore, getFirestore } from '@angular/fire/firestore'
import { GpsPositionsService } from './services/positions/gps-positions.service'
import { LayoutComponent } from './layout/layout.component'
import { FooterComponent } from './layout/footer/footer.component'
import { HeaderComponent } from './layout/header/header.component'
import { TablesComponent } from './tables/tables.component'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'
import { provideAnimations } from '@angular/platform-browser/animations'
import { MatSortModule } from '@angular/material/sort'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatTooltipModule } from '@angular/material/tooltip'
import { ExcelService } from './services/csv/csv.service'
import { MatDialogModule } from '@angular/material/dialog'
import { ConfirmationModalComponent } from './modal/modal.component'
import { FilterComponent } from './filter/filter.component'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core'
import { QRCodeModule } from 'angularx-qrcode'
import { DownloadComponent } from './download/download.component'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    FooterComponent,
    HeaderComponent,
    TablesComponent,
    ConfirmationModalComponent,
    FilterComponent,
    DownloadComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    MatToolbarModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    MatNativeDateModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    QRCodeModule,
    MatIconModule,
  ],
  providers: [
    GpsPositionsService,
    ExcelService,
    importProvidersFrom(provideFirebaseApp(() => initializeApp(environment.firebase))),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    provideAnimations(),
    [{provide: MAT_DATE_LOCALE, useValue: 'es-AR'}],
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
