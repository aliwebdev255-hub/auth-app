import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule } from 'devextreme-angular';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/product.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class CartComponent implements OnInit {

  carts: any[] = [];
  productsMap: { [key: number]: string } = {};

  isLoading = false;

  // 🔥 TOAST
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private cartApi: CartService,
    private productApi: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  // ==========================
  // LOAD PRODUCTS + CART
  // ==========================
  loadData() {
    this.isLoading = true;

    this.productApi.getProducts().subscribe({
      next: (products) => {

        this.productsMap = {};
        products.forEach((p: any) => {
          this.productsMap[p.productId] = p.name;
        });

        this.cartApi.getCart().subscribe({
          next: (cart) => {
            this.carts = cart || [];
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error(err);
            this.isLoading = false;
          }
        });

      },
      error: () => this.isLoading = false
    });
  }

  // ==========================
  // GET PRODUCT NAME
  // ==========================
  getProductName = (row: any) => {
    return this.productsMap[row.productId] || 'Unknown';
  };

  // ==========================
  // ADD AGAIN
  // ==========================
  openAddToCart(productId: number) {

    const payload = {
      productId,
      quantity: 1
    };

    this.cartApi.addCart(payload).subscribe({
      next: () => {
        this.showToastMessage('Added again ✅', 'success');
        this.loadData();
      },
      error: () => {
        this.showToastMessage('Failed ❌', 'error');
      }
    });
  }

  // ==========================
  // EDIT
  // ==========================
  editCart(data: any) {

    const qty = prompt('Enter quantity:', data.quantity);

    if (!qty || isNaN(+qty)) return;

    const payload = {
      productId: data.productId,
      quantity: +qty
    };

    this.cartApi.addCart(payload).subscribe({
      next: () => {
        this.showToastMessage('Updated ✅', 'success');
        this.loadData();
      },
      error: () => {
        this.showToastMessage('Update failed ❌', 'error');
      }
    });
  }

  // ==========================
  // DELETE
  // ==========================
  deleteCartItem(productId: number) {

    if (!confirm('Delete item?')) return;

    this.cartApi.deleteCart(productId).subscribe({
      next: () => {
        this.showToastMessage('Removed ✅', 'success');
        this.loadData();
      },
      error: () => {
        this.showToastMessage('Delete failed ❌', 'error');
      }
    });
  }

  // ==========================
  // TOAST
  // ==========================
  showToastMessage(msg: string, type: 'success' | 'error') {
    this.toastMessage = msg;
    this.toastType = type;
    this.showToast = true;

    this.cdr.detectChanges();

    setTimeout(() => {
      this.showToast = false;
      this.cdr.detectChanges();
    }, 2500);
  }
}