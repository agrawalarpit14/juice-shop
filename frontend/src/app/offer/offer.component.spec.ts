import { LayoutModule } from '@angular/cdk/layout'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import {
  MatButtonModule,
  MatCardModule,
  MatGridListModule,
  MatIconModule,
  MatMenuModule
} from '@angular/material'

import { OfferComponent } from './offer.component'
import { CountdownTimerModule } from 'ngx-countdown-timer'

describe('OfferComponent', () => {
  let component: OfferComponent
  let fixture: ComponentFixture<OfferComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OfferComponent],
      imports: [
        NoopAnimationsModule,
        LayoutModule,
        MatButtonModule,
        MatCardModule,
        MatGridListModule,
        MatIconModule,
        MatMenuModule,
        CountdownTimerModule
      ]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should compile', () => {
    expect(component).toBeTruthy()
  })
})
