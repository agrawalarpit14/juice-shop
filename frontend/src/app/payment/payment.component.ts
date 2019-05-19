import { FormControl, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { FormSubmitService } from '../Services/form-submit.service'
import { PaymentService } from '../Services/payment.service'
import { MatTableDataSource } from '@angular/material/table'
import { ConfigurationService } from '../Services/configuration.service'
import { BasketService } from '../Services/basket.service'
import { TranslateService } from '@ngx-translate/core'
import { MatDialog } from '@angular/material/dialog'
import { QrCodeComponent } from '../qr-code/qr-code.component'
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
  faCoffee
} from '@fortawesome/free-solid-svg-icons'
import { faCreditCard as faCredit, faTrashAlt } from '@fortawesome/free-regular-svg-icons/'
import { faBtc, faEthereum, faPaypal, faLeanpub, faPatreon } from '@fortawesome/free-brands-svg-icons'
import { Router } from '@angular/router'

library.add(faMinusSquare, faPlusSquare, faCartArrowDown, faGift, faCreditCard, faTrashAlt, faHeart, faBtc, faPaypal, faLeanpub, faEthereum, faCredit, faThumbsUp, faTshirt, faStickyNote, faHandHoldingUsd, faCoffee, faPatreon)
dom.watch()

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  public displayedColumns = ['Number', 'Name', 'Expiry', 'Select']
  public nameControl: FormControl = new FormControl('', [Validators.required])
  public numberControl: FormControl = new FormControl('',[Validators.required,Validators.min(0),Validators.max(9999999999999999)])
  public pinControl: FormControl = new FormControl('',[Validators.required,Validators.min(100),Validators.max(999)])
  public monthControl: FormControl = new FormControl('',[Validators.required,Validators.min(1),Validators.max(12)])
  public yearControl: FormControl = new FormControl('',[Validators.required,Validators.min(2019),Validators.max(2999)])
  public confirmation: any
  public error: any
  public couponConfirmation: any
  public couponError: any
  public storedCards: any
  public card: any = undefined
  public dataSource
  public twitterUrl = null
  public facebookUrl = null
  public applicationName = 'OWASP Juice Shop'
  private campaignCoupon: string
  public couponControl: FormControl = new FormControl('',[Validators.required, Validators.minLength(10), Validators.maxLength(10)])
  public clientDate: any

  constructor (private dialog: MatDialog, private formSubmitService: FormSubmitService, public paymentService: PaymentService, private configurationService: ConfigurationService, private basketService: BasketService, private translate: TranslateService, private router: Router) { }

  ngOnInit () {
    this.card = {}
    this.paymentService.get().subscribe((cards) => {
      this.storedCards = cards
    }, (error) => {
      this.error = error
      console.log(error)
    })

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

    this.formSubmitService.attachEnterKeyHandler('card-form', 'submitButton', () => this.save())
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

  showBitcoinQrCode () {
    this.dialog.open(QrCodeComponent, {
      data: {
        data: 'bitcoin:1AbKfgvw9psQ41NbLi8kufDQTezwG8DRZm',
        url: '/redirect?to=https://blockchain.info/address/1AbKfgvw9psQ41NbLi8kufDQTezwG8DRZm',
        address: '1AbKfgvw9psQ41NbLi8kufDQTezwG8DRZm',
        title: 'TITLE_BITCOIN_ADDRESS'
      }
    })
  }

  showDashQrCode () {
    this.dialog.open(QrCodeComponent, {
      data: {
        data: 'dash:Xr556RzuwX6hg5EGpkybbv5RanJoZN17kW',
        url: '/redirect?to=https://explorer.dash.org/address/Xr556RzuwX6hg5EGpkybbv5RanJoZN17kW',
        address: 'Xr556RzuwX6hg5EGpkybbv5RanJoZN17kW',
        title: 'TITLE_DASH_ADDRESS'
      }
    })
  }

  showEtherQrCode () {
    this.dialog.open(QrCodeComponent, {
      data: {
        data: '0x0f933ab9fCAAA782D0279C300D73750e1311EAE6',
        url: 'https://etherscan.io/address/0x0f933ab9fcaaa782d0279c300d73750e1311eae6',
        address: '0x0f933ab9fCAAA782D0279C300D73750e1311EAE6',
        title: 'TITLE_ETHER_ADDRESS'
      }
    })
  }

  choosePayment (id: number) {
    sessionStorage.setItem('paymentid', id.toString())
    this.router.navigate(['/summary'])
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
