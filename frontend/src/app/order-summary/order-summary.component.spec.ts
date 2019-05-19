import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { MatInputModule } from '@angular/material/input'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { ConfigurationService } from '../Services/configuration.service'
import { WindowRefService } from '../Services/window-ref.service'
import { UserService } from '../Services/user.service'
import { BasketService } from '../Services/basket.service'
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing'

import { OrderSummaryComponent } from './order-summary.component'
import { MatCardModule } from '@angular/material/card'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { of } from 'rxjs'
import { throwError } from 'rxjs/internal/observable/throwError'
import { By } from '@angular/platform-browser'
import { QrCodeComponent } from '../qr-code/qr-code.component'
import { MatButtonToggleModule } from '@angular/material/button-toggle'

describe('OrderSummaryComponent', () => {
  let component: OrderSummaryComponent
  let fixture: ComponentFixture<OrderSummaryComponent>
  let dialog
  let userService
  let basketService
  let windowRefService
  let configurationService
  let translateService

  beforeEach(async(() => {

    dialog = jasmine.createSpyObj('MatDialog',['open'])
    dialog.open.and.returnValue(null)
    userService = jasmine.createSpyObj('UserService',['whoAmI'])
    userService.whoAmI.and.returnValue(of({}))
    basketService = jasmine.createSpyObj('BasketService', ['find','del','get','put','checkout','applyCoupon'])
    basketService.find.and.returnValue(of({ Products: [] }))
    basketService.del.and.returnValue(of({}))
    basketService.get.and.returnValue(of({}))
    basketService.put.and.returnValue(of({}))
    basketService.checkout.and.returnValue(of({}))
    basketService.applyCoupon.and.returnValue(of({}))

    // Stub for WindowRefService
    windowRefService = {
      get nativeWindow () {
        return {
          location: {
            replace (str) {
              return null
            }
          }
        }
      }
    }

    configurationService = jasmine.createSpyObj('ConfigurationService',['getApplicationConfiguration'])
    configurationService.getApplicationConfiguration.and.returnValue(of({}))
    translateService = jasmine.createSpyObj('TranslateService', ['get'])
    translateService.get.and.returnValue(of({}))

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatTableModule,
        MatButtonModule,
        MatExpansionModule,
        MatDialogModule,
        MatButtonToggleModule
      ],
      declarations: [ OrderSummaryComponent ],
      providers: [
        { provide: MatDialog, useValue: dialog },
        { provide: BasketService, useValue: basketService },
        { provide: UserService , useValue: userService },
        { provide: WindowRefService, useValue: windowRefService },
        { provide: ConfigurationService, useValue: configurationService },
        TranslateService
      ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSummaryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
