import { FormControl, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { FormSubmitService } from '../Services/form-submit.service'
import { AddressService } from '../Services/address.service'
import { Router } from '@angular/router'
@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent implements OnInit {

  public confirmation: any
  public error: any
  public storedAddresses: any

  constructor (private addressService: AddressService, private router: Router) { }

  ngOnInit () {
    this.addressService.get().subscribe((addresses) => {
      this.storedAddresses = addresses
    }, (error) => {
      this.error = error
      console.log(error)
    })
  }

  chooseAddress (id: number) {
    sessionStorage.setItem('addressid', id.toString())
    this.router.navigate(['/payment'])
  }
}
