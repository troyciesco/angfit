import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ProductsService } from "./products.service";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"]
})
export class ProductsComponent implements OnInit, OnDestroy {
  productName = "";
  isDisabled = true;
  products = [];
  private productSubscription: Subscription;

  constructor(private productsService: ProductsService) {
    setTimeout(() => {
      this.isDisabled = false;
    }, 1500);
  }

  onAddProduct(form) {
    if (form.valid) {
      // this.products.push(form.value.productName);
      this.productsService.addProduct(form.value.productName);
    } else {
      alert("ahahhhhhhhh");
    }
    console.log(form);
  }

  // onRemoveProduct(productName: string) {
  //   this.products = this.products.filter(p => p !== productName);
  // }

  ngOnInit(): void {
    this.products = this.productsService.getProducts();
    this.productSubscription = this.productsService.productsUpdated.subscribe(
      () => {
        this.products = this.productsService.getProducts();
      }
    );
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }
}
