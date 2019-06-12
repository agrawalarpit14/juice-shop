import { TranslateModule } from '@ngx-translate/core'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { UserService } from '../Services/user.service'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { PaymentComponent } from './payment.component'
import { MatInputModule } from '@angular/material/input'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { BarRatingModule } from 'ng2-bar-rating'
import { of } from 'rxjs'
import { MatTableModule } from '@angular/material/table'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatDividerModule } from '@angular/material/divider'
import { MatRadioModule } from '@angular/material/radio'

describe('PaymentComponent', () => {
  let component: PaymentComponent
  let fixture: ComponentFixture<PaymentComponent>
  let userService
  let addressService

  beforeEach(async(() => {

    userService = jasmine.createSpyObj('UserService',['whoAmI'])
    userService.whoAmI.and.returnValue(of({}))
    addressService = jasmine.createSpyObj('AddressService',['save'])
    addressService.save.and.returnValue(of({}))

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        ReactiveFormsModule,
        BarRatingModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatExpansionModule,
        MatDividerModule,
        MatRadioModule
      ],
      declarations: [ PaymentComponent ],
      providers: [
        { provide: UserService, useValue: userService }
      ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
