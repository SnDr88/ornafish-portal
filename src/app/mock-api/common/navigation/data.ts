/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:adjustments-vertical',
        link: '/',
        exactMatch: true
    },
    {
        id: 'shipping',
        title: 'SHIPPING',
        type: 'group',
        icon: 'heroicons_outline:user-group',
        children: [
            {
                id: 'shipments',
                title: 'Shipments',
                type: 'basic',
                icon: '',
                iconHtml: '<i class="fa-thin fa-truck-ramp-couch fa-xl ms-1 pe-1"></i>',
                link: '/shipping/shipments',
                exactMatch: true
            },
            {
                id: 'destinations',
                title: 'Destinations',
                type: 'basic',
                icon: '',
                iconHtml: '<i class="fa-thin fa-plane-arrival fa-xl ms-1 pe-1"></i>',
                link: '/shipping/destinations',
                exactMatch: true
            }
        ]
    },
    {
        id: 'crm',
        title: 'CRM',
        type: 'group',
        icon: 'heroicons_outline:user-group',
        children: [
            {
                id: 'new-requests',
                title: 'New Requests',
                type: 'basic',
                icon: 'heroicons_outline:inbox-arrow-down',
                link: '/crm/new-requests',
                exactMatch: true
            },
            {
                id: 'customers',
                title: 'Customers',
                type: 'basic',
                icon: '',
                iconHtml: '<i class="fa-thin fa-people-group fa-xl"></i>',
                link: '/crm/customers',
                exactMatch: true
            },
            {
                id: 'breeders',
                title: 'Breeders',
                type: 'basic',
                icon: '',
                iconHtml: '<i class="fa-thin fa-user-cowboy fa-xl ms-1 pe-1"></i>',
                link: '/crm/breeders',
                exactMatch: true
            },
            {
                id: 'others',
                title: 'Others',
                type: 'basic',
                icon: 'heroicons_outline:ellipsis-horizontal',
                link: '/crm/others',
                exactMatch: true
            },
        ]
    },
    {
        id: 'backend-settings',
        title: 'Settings',
        type: 'group',
        icon: 'heroicons_outline:cog-8-tooth',
        children: [
            {
                id: 'users-staff',
                title: 'Ornafish Users',
                type: 'basic',
                icon: 'heroicons_outline:user',
                link: '/backend/users',
                exactMatch: true
            }
        ]
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
