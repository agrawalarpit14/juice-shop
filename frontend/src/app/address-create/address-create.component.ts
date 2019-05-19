import { FormControl, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { FormSubmitService } from '../Services/form-submit.service'
import { AddressService } from '../Services/address.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-address-create',
  templateUrl: './address-create.component.html',
  styleUrls: ['./address-create.component.scss']
})
export class AddressCreateComponent implements OnInit {

  public countryControl: FormControl = new FormControl('', [Validators.required])
  public nameControl: FormControl = new FormControl('', [Validators.required])
  public numberControl: FormControl = new FormControl('',[Validators.required,Validators.min(0),Validators.max(9999999999)])
  public pinControl: FormControl = new FormControl('',[Validators.required,Validators.min(0),Validators.max(999999)])
  public addressControl: FormControl = new FormControl('', [Validators.required, Validators.maxLength(160)])
  public cityControl: FormControl = new FormControl('', [Validators.required])
  public stateControl: FormControl = new FormControl('', [Validators.required])
  public confirmation: any
  public error: any
  public address: any = undefined

  constructor (private formSubmitService: FormSubmitService, private addressService: AddressService, private router: Router) { }

  ngOnInit () {
    this.address = {}
    this.formSubmitService.attachEnterKeyHandler('address-form', 'submitButton', () => this.save())
  }

  save () {
    this.address.country = this.countryControl.value
    this.address.fullName = this.nameControl.value
    this.address.mobileNum = this.numberControl.value
    this.address.pinCode = this.pinControl.value
    this.address.streetAddress = this.addressControl.value
    this.address.city = this.cityControl.value
    this.address.state = this.stateControl.value
    this.addressService.save(this.address).subscribe((savedAddress) => {
      this.error = null
      this.confirmation = 'The address at ' + savedAddress.city + ' has been successfully added to your addresses.'
      this.address = {}
      this.ngOnInit()
      this.resetForm()
      this.router.navigate(['/payment'])
    }, (error) => {
      this.error = error.error
      this.confirmation = null
      this.address = {}
      this.resetForm()
    })
  }

  resetForm () {
    this.countryControl.markAsUntouched()
    this.countryControl.markAsPristine()
    this.countryControl.setValue('')
    this.nameControl.markAsUntouched()
    this.nameControl.markAsPristine()
    this.nameControl.setValue('')
    this.numberControl.markAsUntouched()
    this.numberControl.markAsPristine()
    this.numberControl.setValue('')
    this.pinControl.markAsUntouched()
    this.pinControl.markAsPristine()
    this.pinControl.setValue('')
    this.addressControl.markAsUntouched()
    this.addressControl.markAsPristine()
    this.addressControl.setValue('')
    this.cityControl.markAsUntouched()
    this.cityControl.markAsPristine()
    this.cityControl.setValue('')
    this.stateControl.markAsUntouched()
    this.stateControl.markAsPristine()
    this.stateControl.setValue('')
  }
}
