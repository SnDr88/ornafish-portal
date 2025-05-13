import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { InventoryComponent } from 'app/pages/shipping/destinations/inventory.component';
import { InventoryService } from 'app/pages/shipping/destinations/inventory.service';
import { InventoryListComponent } from 'app/pages/shipping/destinations/list/list.component';

export default [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inventory',
    },
    {
        path: 'inventory',
        component: InventoryComponent,
        children: [
            {
                path: '',
                component: InventoryListComponent,
                resolve: {
                    brands: () => inject(InventoryService).getBrands(),
                    categories: () => inject(InventoryService).getCategories(),
                    products: () => inject(InventoryService).getProducts(),
                    tags: () => inject(InventoryService).getTags(),
                    vendors: () => inject(InventoryService).getVendors(),
                },
            },
        ],
    },
] as Routes;
