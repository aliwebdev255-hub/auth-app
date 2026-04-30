import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/product.service';
import { DxDataGridModule, DxDataGridComponent } from 'devextreme-angular';
import { Product } from '../core/models/product';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DxDataGridModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild('productGrid', { static: false }) grid!: DxDataGridComponent;

  products: Product[] = [];
  isLoading = false;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.isLoading = true;

    this.api.getProducts().subscribe({
      next: (res: any) => {
        this.products = Array.isArray(res) ? res : (res.data || []);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Fetch Error:", err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  addProduct(): void {
    if (this.grid) {
      this.grid.instance.addRow();
    }
  }

  insertProduct(e: any): void {
    const payload = {
      name: e.data.name,
      price: e.data.price,
      description: e.data.description,
      stock: e.data.stock,
      imageUrl: e.data.imageUrl
    };

    this.api.addProduct(payload).subscribe({
      next: () => this.getProducts(),
      error: (err) => console.error("Insert failed:", err)
    });
  }

  updateProduct(e: any): void {
    const updatedData = e.data;

    this.api.updateProduct(updatedData.productId, updatedData).subscribe({
      next: () => this.getProducts(),
      error: (err) => console.error("Update failed:", err)
    });
  }

  deleteProduct(id: number): void {
    if (confirm("Are you sure you want to delete this product?")) {
      this.api.deleteProduct(id).subscribe({
        next: () => this.getProducts(),
        error: (err) => console.error("Delete failed:", err)
      });
    }
  }
}