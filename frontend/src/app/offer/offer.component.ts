import { Component, AfterViewInit, OnDestroy } from '@angular/core'
import { ProductService } from '../Services/product.service'
import { BasketService } from '../Services/basket.service'
import { Subscription } from 'rxjs'
import { TranslateService } from '@ngx-translate/core'
import { ProductDetailsComponent } from '../product-details/product-details.component'
import { MatDialog } from '@angular/material'

export const offerExpire = new Date('2018-05-10')

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})

export class OfferComponent implements AfterViewInit,OnDestroy {
  public date = offerExpire
  public productData
  private productSubscription: Subscription
  public confirmation = undefined
  constructor (private dialog: MatDialog, private productService: ProductService, private basketService: BasketService, private translateService: TranslateService) {}

  ngAfterViewInit () {
    this.productSubscription = this.productService.offer().subscribe((tableData: any) => {
      this.productData = tableData[0]
      console.log(this.productData)
    }, (err) => console.log(err))
  }

  ngOnDestroy () {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe()
    }
  }

  addToBasket (id: number) {
    this.basketService.find(sessionStorage.getItem('bid')).subscribe((basket) => {
      let productsInBasket: any = basket.Products
      let found = false
      for (let i = 0; i < productsInBasket.length; i++) {
        if (productsInBasket[i].id === id) {
          found = true
          this.basketService.get(productsInBasket[i].BasketItem.id).subscribe((existingBasketItem) => {
            let newQuantity = existingBasketItem.quantity + 1
            this.basketService.put(existingBasketItem.id, { quantity: newQuantity }).subscribe((updatedBasketItem) => {
              this.productService.get(updatedBasketItem.ProductId).subscribe((product) => {
                this.translateService.get('BASKET_ADD_SAME_PRODUCT', { product: product.name }).subscribe((basketAddSameProduct) => {
                  this.confirmation = basketAddSameProduct
                }, (translationId) => {
                  this.confirmation = translationId
                })
              }, (err) => console.log(err))
            },(err) => console.log(err))
          }, (err) => console.log(err))
          break
        }
      }
      if (!found) {
        this.basketService.save({ ProductId: id, BasketId: sessionStorage.getItem('bid'), quantity: 1 }).subscribe((newBasketItem) => {
          this.productService.get(newBasketItem.ProductId).subscribe((product) => {
            this.translateService.get('BASKET_ADD_PRODUCT', { product: product.name }).subscribe((basketAddProduct) => {
              this.confirmation = basketAddProduct
            }, (translationId) => {
              this.confirmation = translationId
            })
          }, (err) => console.log(err))
        }, (err) => console.log(err))
      }
    }, (err) => console.log(err))
  }

  showDetail (element: any) {
    this.dialog.open(ProductDetailsComponent, {
      width: '500px',
      height: 'max-content',
      data: {
        productData: element
      }
    })
  }
  isLoggedIn () {
    return localStorage.getItem('token')
  }
}
