import { ProductService } from '../Services/product.service'
import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { Subscription, forkJoin } from 'rxjs'
import { MatTableDataSource } from '@angular/material/table'
import { QuantityService } from '../Services/quantity.service'
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

library.add(faCheck)
dom.watch()

interface DataTableEntry {
  name: string
  quantity?: number
  price: number
  productId: number
  quantityId?: number
}

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.scss']
})
export class AccountingComponent implements AfterViewInit {

  public displayedColumns = ['Product', 'Price', 'Quantity']
  public dataSource: MatTableDataSource<DataTableEntry>
  public confirmation = undefined
  public error = undefined
  @ViewChild(MatPaginator) paginator: MatPaginator
  constructor (private productService: ProductService, private quantityService: QuantityService) { }

  ngAfterViewInit () {
    const quantities = this.quantityService.getAll()
    const products = this.productService.search('')
    forkJoin(quantities, products).subscribe(([quantities, products]) => {
      let dataTable: DataTableEntry[] = []
      for (const product of products) {
        dataTable.push({
          name: product.name,
          price: product.price,
          productId: product.id
        })
      }
      for (const quantity of quantities) {
        const entry = dataTable.find((dataTableEntry) => {
          return dataTableEntry.productId === quantity.ProductId
        })
        if (entry === undefined) {
          continue
        }
        entry.quantityId = quantity.id
        entry.quantity = quantity.quantity
      }
      this.dataSource = new MatTableDataSource<DataTableEntry>(dataTable)
      this.dataSource.paginator = this.paginator
    })
  }

  modifyPrice (id, value) {
    this.error = null
    this.productService.put(id, { price: value < 0 ? 0 : value }).subscribe((product) => {
      this.confirmation = 'Price for ' + product.name + ' has been updated.'
      this.ngAfterViewInit()
    },(err) => {
      this.error = err.error
      this.confirmation = null
      console.log(err)
    })
  }

  modifyQuantity (id, value) {
    this.error = null
    this.quantityService.put(id, { quantity: value < 0 ? 0 : value }).subscribe((product) => {
      // this.confirmation = 'Quantity for ' + this.tableData[product.ProductId - 1].name + ' has been updated.'
      this.ngAfterViewInit()
    },(err) => {
      this.error = err.error
      this.confirmation = null
      console.log(err)
    })
  }
}
