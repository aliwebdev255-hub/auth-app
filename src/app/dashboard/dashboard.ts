import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/product.service';
import { DxDataGridModule, DxDataGridComponent } from 'devextreme-angular';
import { RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild('productGrid') grid!: DxDataGridComponent;

  products: any[] = [];

  // TOAST
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private api: ApiService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getProducts();
  }

  // LOAD
  getProducts() {
    this.api.getProducts().subscribe({
      next: (res: any) => {
        this.products = Array.isArray(res) ? res : res.data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.showToastMessage('Failed to load ❌', 'error');
      }
    });
  }

  // ADD BUTTON
  addProduct() {
    this.grid.instance.addRow();
  }

  // INSERT
  insertProduct(e: any) {
    const d = e.data;

    const payload = {
      name: d.name ?? '',
      price: Number(d.price) || 0,
      stock: Number(d.stock) || 0,
      description: d.description ?? '',
      imageUrl: d.imageUrl ?? ''
    };

    console.log('SENDING:', payload);

    this.api.addProduct(payload).subscribe({
      next: () => {
        this.showToastMessage('Product added ✅', 'success');
        this.getProducts();
      },
      error: (err) => {
        console.error('ERROR:', err.error);
        this.showToastMessage('Insert failed ❌', 'error');
      }
    });
  }

  // UPDATE
  updateProduct(e: any) {
    const d = e.data;

    const payload = {
      name: d.name,
      price: d.price,
      stock: d.stock,
      description: d.description,
      imageUrl: d.imageUrl
    };

    this.api.updateProduct(d.productId, payload).subscribe({
      next: () => {
        this.showToastMessage('Updated ✅', 'success');
        this.getProducts();
      },
      error: () => {
        this.showToastMessage('Update failed ❌', 'error');
      }
    });
  }

  // DELETE
  deleteProduct(id: number) {
    this.api.deleteProduct(id).subscribe({
      next: () => {
        this.showToastMessage('Deleted ✅', 'success');
        this.getProducts();
      },
      error: () => {
        this.showToastMessage('Delete failed ❌', 'error');
      }
    });
  }

  // ADD TO CART
  openAddToCart(productId: number) {
    const payload = {
      productId,
      quantity: 1
    };

    this.cartService.addCart(payload).subscribe({
      next: () => {
        this.showToastMessage(`Product ${productId} added ✅`, 'success');
      },
      error: () => {
        this.showToastMessage('Failed ❌', 'error');
      }
    });
  }

  // TOAST
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