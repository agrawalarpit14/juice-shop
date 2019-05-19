import { FormControl, Validators } from '@angular/forms'
import { WindowRefService } from '../Services/window-ref.service'
import { UserService } from '../Services/user.service'
import { BasketService } from '../Services/basket.service'
import { Component, OnInit } from '@angular/core'
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faCartArrowDown } from '@fortawesome/free-solid-svg-icons'
import { AddressService } from '../Services/address.service'
import { PaymentService } from '../Services/payment.service'

library.add(faCartArrowDown)
dom.watch()

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent implements OnInit {

  public userEmail: string
  public displayedColumns = ['product','price','quantity','total price']
  public dataSource = []
  public bonus = 0
  public couponPanelExpanded: boolean = false
  public paymentPanelExpanded: boolean = false
  public couponControl: FormControl = new FormControl('',[Validators.required, Validators.minLength(10), Validators.maxLength(10)])
  public error = undefined
  public confirmation = undefined
  public applicationName = 'OWASP Juice Shop'
  public redirectUrl = null
  public clientDate: any
  private campaignCoupon: string
  public address: any
  public paymentMethod: any

  constructor (private basketService: BasketService,private userService: UserService,private windowRefService: WindowRefService, private addressService: AddressService, private paymentService: PaymentService) {}

  ngOnInit () {
    this.load()
    this.userService.whoAmI().subscribe((data) => {
      this.userEmail = data.email || 'anonymous'
      this.userEmail = '(' + this.userEmail + ')'
    },(err) => console.log(err))
  }

  load () {
    this.basketService.find(sessionStorage.getItem('bid')).subscribe((basket) => {
      this.dataSource = basket.Products
      let bonusPoints = 0
      basket.Products.map(product => {
        if (product.BasketItem && product.BasketItem.quantity) {
          bonusPoints += Math.round(product.price / 10) * product.BasketItem.quantity
        }
      })
      this.bonus = bonusPoints
    },(err) => console.log(err))
    this.addressService.getById(sessionStorage.getItem('addressid')).subscribe((address) => {
      this.address = address
      // console.log(this.address)
    })
    this.paymentService.getById(sessionStorage.getItem('paymentid')).subscribe((paymentMethod) => {
      this.paymentMethod = paymentMethod
      // console.log(this.paymentMethod)
    })
  }

  checkout () {
    this.basketService.checkout(sessionStorage.getItem('bid'), btoa(this.campaignCoupon + '-' + this.clientDate)).subscribe((orderConfirmationPath) => {
      this.redirectUrl = this.basketService.hostServer + orderConfirmationPath
      this.windowRefService.nativeWindow.location.replace(this.redirectUrl)
    }, (err) => console.log(err))
  }
}
