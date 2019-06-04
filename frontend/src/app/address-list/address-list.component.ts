import { FormControl, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { FormSubmitService } from '../Services/form-submit.service'
import { AddressService } from '../Services/address.service'
import { Router } from '@angular/router'
import { MatTableDataSource } from '@angular/material/table'
@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent implements OnInit {

  public storedAddresses: any
  public dataSource
  public gridDataSource
  public breakpoint: number

  constructor (private addressService: AddressService, private router: Router) { }

  ngOnInit () {
    this.addressService.get().subscribe((addresses) => {
      this.storedAddresses = addresses
      this.dataSource = new MatTableDataSource<Element>(this.storedAddresses)
      if (window.innerWidth <= 1740) {
        this.breakpoint = 3
        if (window.innerWidth <= 1300) {
          this.breakpoint = 2
          if (window.innerWidth <= 850) {
            this.breakpoint = 1
          }
        }
      } else {
        this.breakpoint = 4
      }
      this.gridDataSource = this.dataSource.connect()
    }, (error) => {
      console.log(error)
    })
  }

  chooseAddress (id: number) {
    sessionStorage.setItem('addressid', id.toString())
    this.router.navigate(['/payment'])
  }

  deleteAddress (id) {
    this.addressService.del(id).subscribe(() => {
      this.ngOnInit()
    })
  }

  onResize (event) {
    if (event.target.innerWidth <= 1740) {
      this.breakpoint = 3
      if (event.target.innerWidth <= 1300) {
        this.breakpoint = 2
        if (event.target.innerWidth <= 850) {
          this.breakpoint = 1
        }
      }
    } else {
      this.breakpoint = 4
    }
  }
}
