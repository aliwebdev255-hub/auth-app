import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridModule, DxDataGridComponent } from 'devextreme-angular';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, DxDataGridModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class CartComponent implements OnInit {

  @ViewChild(DxDataGridComponent) grid!: DxDataGridComponent;

  carts: any[] = [];
  isLoading = false;

  constructor(
    private api: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  
  ngOnInit(): void {
    this.loadCart();
  }

  // 🔹 LOAD CART
  loadCart() {
    this.isLoading = true;

    this.api.getCart().subscribe({
      next: (res) => {
        this.carts = res || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        this.isLoading = false;
      }
    });
  }

  // 🔹 HANDLE DELETE BUTTON CLICK (DevExtreme event)
  onDeleteClick(e: any) {
    const id = e.row?.data?.cartId;

    if (!id) {
      console.error('Cart ID not found');
      return;
    }

    this.delete(id);
  }

  // 🔹 DELETE ITEM
  delete(id: number) {
    if (!confirm('Delete this item?')) return;

    this.api.deleteCart(id).subscribe({
      next: () => {
        this.loadCart(); // refresh grid
      },
      error: (err) => {
        console.error('Delete failed:', err);
      }
    });
  }
}