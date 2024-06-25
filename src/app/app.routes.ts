import { Routes } from '@angular/router';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { NotFoundComponent } from './domains/info/pages/not-found/not-found.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('@assets/pages/list/list.component')
            },
            {
                path: 'about',
                loadComponent: () => import('./domains/info/pages/about/about.component')
            },
            {
                path: 'depreciation',
                loadComponent: () => import('./domains/depreciations/pages/depreciation/depreciation.component')
            },
            {
                path: 'byId/:assetIdD',
                loadComponent: () => import('./domains/assets/components/asset-modal/asset-modal.component')
            },
            {
                path: 'depreciationById/:depreciationIdD',
                loadComponent: () => import('./domains/depreciations/components/depreciation-modal/depreciation-modal.component')
            },            
        ]
    },
    
    {
        path: '**',
        component: NotFoundComponent
    }



];
