/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:adjustments-vertical',
        link: '/dashboard',
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
            },
            {
                id: 'agents',
                title: 'Agents',
                type: 'basic',
                icon: 'heroicons_outline:identification',
                link: '/crm/agents',
            },
            {
                id: 'dealers',
                title: 'Dealers',
                type: 'basic',
                icon: '',
                iconHtml: '<i class="fa-thin fa-people-group fa-xl"></i>',
                link: '/crm/dealers',
            },
            {
                id: 'breeders',
                title: 'Breeders',
                type: 'basic',
                icon: '',
                iconHtml: '<i class="fa-thin fa-user-cowboy fa-xl ms-1 pe-1"></i>',
                link: '/crm/breeders',
            },
            {
                id: 'others',
                title: 'Others',
                type: 'basic',
                icon: 'heroicons_outline:ellipsis-horizontal',
                link: '/crm/others',
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
