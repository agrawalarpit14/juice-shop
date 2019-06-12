import { FormControl, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { PaymentService } from '../Services/payment.service'
import { MatTableDataSource } from '@angular/material/table'
import { ConfigurationService } from '../Services/configuration.service'
import { BasketService } from '../Services/basket.service'
import { TranslateService } from '@ngx-translate/core'
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import {
  faCartArrowDown,
  faCreditCard,
  faGift,
  faHeart,
  faMinusSquare,
  faPlusSquare,
  faThumbsUp,
  faTshirt,
  faStickyNote,
  faHandHoldingUsd,
  faCoffee,
  faTimes
} from '@fortawesome/free-solid-svg-icons'
import { faCreditCard as faCredit, faTrashAlt } from '@fortawesome/free-regular-svg-icons/'
import { faBtc, faEthereum, faPaypal, faLeanpub, faPatreon } from '@fortawesome/free-brands-svg-icons'

library.add(faMinusSquare, faPlusSquare, faCartArrowDown, faGift, faCreditCard, faTrashAlt, faHeart, faBtc, faPaypal, faLeanpub, faEthereum, faCredit, faThumbsUp, faTshirt, faStickyNote, faHandHoldingUsd, faCoffee, faPatreon, faTimes)
dom.watch()

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  public displayedColumns = ['Radio', 'Number', 'Name', 'Expiry']
  public radioControl: FormControl = new FormControl('', [Validators.required])
  public nameControl: FormControl = new FormControl('', [Validators.required])
  public numberControl: FormControl = new FormControl('',[Validators.required,Validators.min(1000000000000000),Validators.max(9999999999999999)])
  public pinControl: FormControl = new FormControl('',[Validators.required,Validators.min(100),Validators.max(999)])
  public monthControl: FormControl = new FormControl('',[Validators.required,Validators.min(1),Validators.max(12)])
  public yearControl: FormControl = new FormControl('',[Validators.required,Validators.min(2019),Validators.max(2999)])
  public cvvControl: FormControl = new FormControl('',[Validators.required,Validators.min(100),Validators.max(999)])
  public confirmation: any
  public error: any
  public couponConfirmation: any
  public couponError: any
  public storedCards: any
  public card: any = {}
  public dataSource
  public twitterUrl = null
  public facebookUrl = null
  public applicationName = 'OWASP Juice Shop'
  private campaignCoupon: string
  public couponControl: FormControl = new FormControl('',[Validators.required, Validators.minLength(10), Validators.maxLength(10)])
  public clientDate: any
  public monthRange: any[]
  public yearRange: any[]
  public cvvField: boolean = false
  public cardsExist: boolean = false
  public paymentId: any = undefined
  constructor (public paymentService: PaymentService, private configurationService: ConfigurationService, private basketService: BasketService, private translate: TranslateService) { }

  ngOnInit () {
    this.monthRange = Array.from(Array(12).keys()).map(i => i + 1)
    this.yearRange = Array.from(Array(50).keys()).map(i => i + new Date().getFullYear())
    this.paymentService.get().subscribe((cards) => {
      this.cardsExist = cards.length
      this.storedCards = cards
      this.dataSource = new MatTableDataSource<Element>(this.storedCards)
    }, (err) => console.log(err))

    this.configurationService.getApplicationConfiguration().subscribe((config) => {
      if (config && config.application) {
        if (config.application.twitterUrl !== null) {
          this.twitterUrl = config.application.twitterUrl
        }
        if (config.application.facebookUrl !== null) {
          this.facebookUrl = config.application.facebookUrl
        }
        if (config.application.name !== null) {
          this.applicationName = config.application.name
        }
      }
    },(err) => console.log(err))
  }

  save () {
    this.card.fullName = this.nameControl.value
    this.card.cvv = this.pinControl.value
    this.card.cardNum = this.numberControl.value
    this.card.expMonth = this.monthControl.value
    this.card.expYear = this.yearControl.value
    this.paymentService.save(this.card).subscribe((savedCards) => {
      this.error = null
      this.confirmation = 'Your card ending with ' + String(savedCards.cardNum).substring(String(savedCards.cardNum).length - 4) + ' has been saved for your convinience.'
      this.card = {}
      this.ngOnInit()
      this.resetForm()
    }, (error) => {
      this.error = error.error
      this.confirmation = null
      this.card = {}
      this.resetForm()
    })
  }

  applyCoupon () {
    this.campaignCoupon = this.couponControl.value
    this.clientDate = new Date()
    this.clientDate.setHours(0,0,0,0)
    this.clientDate = this.clientDate.getTime()
    if (this.couponControl.value === 'WMNSDY2019') { // TODO Use internal code table or retrieve from AWS Lambda instead
      if (this.clientDate === 1551999600000) { // = Mar 08, 2019
        this.showConfirmation(75)
      } else {
        this.couponConfirmation = undefined
        this.couponError = { error: 'Invalid Coupon.' } // FIXME i18n error message
        this.resetCouponForm()
      }
    } else {
      this.basketService.applyCoupon(sessionStorage.getItem('bid'), encodeURIComponent(this.couponControl.value)).subscribe((discount: any) => {
        this.showConfirmation(discount)
      },(err) => {
        this.couponConfirmation = undefined
        this.couponError = err
        this.resetCouponForm()
      })
    }
  }

  showConfirmation (discount) {
    this.resetForm()
    this.couponError = undefined
    this.translate.get('DISCOUNT_APPLIED', { discount }).subscribe((discountApplied) => {
      this.couponConfirmation = discountApplied
    }, (translationId) => {
      this.couponConfirmation = translationId
    })
  }

  choosePayment () {
    sessionStorage.setItem('paymentDetails', this.paymentId.toString() + '-' + this.cvvControl.value.toString())
  }

  showCVVField (id: number) {
    this.paymentId = id
    this.cvvField = true
  }

  resetCouponForm () {
    this.couponControl.setValue('')
    this.couponControl.markAsPristine()
    this.couponControl.markAsUntouched()
  }

  resetForm () {
    this.nameControl.markAsUntouched()
    this.nameControl.markAsPristine()
    this.nameControl.setValue('')
    this.numberControl.markAsUntouched()
    this.numberControl.markAsPristine()
    this.numberControl.setValue('')
    this.pinControl.markAsUntouched()
    this.pinControl.markAsPristine()
    this.pinControl.setValue('')
    this.monthControl.markAsUntouched()
    this.monthControl.markAsPristine()
    this.monthControl.setValue('')
    this.yearControl.markAsUntouched()
    this.yearControl.markAsPristine()
    this.yearControl.setValue('')
  }
}
