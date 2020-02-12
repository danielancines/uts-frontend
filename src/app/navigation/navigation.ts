import { FuseNavigation } from '@fuse/types';

const navigation: FuseNavigation[] = [
    {
        id: 'menu',
        title: 'Menu',
        translate: 'NAV.MENU',
        type: 'group',
        children: [
            {
                id: 'home',
                title: 'Home',
                translate: 'NAV.HOME.TITLE',
                type: 'item',
                icon: 'home',
                url: '/home'
            }
        ]
    }
];

const videosLibrayNavigation: FuseNavigation = {
    id: 'videosLibrary',
    title: 'Videos',
    translate: 'NAV.VIDEOS.TITLE',
    type: 'item',
    icon: 'movie',
    url: '/videoslibrary'
};

const studyNavigation: FuseNavigation = {
    id: 'studyMenu',
    title: 'Study',
    translate: 'NAV.STUDY_MENU',
    type: 'collapsable',
    icon: 'chrome_reader_mode',
    children: []
};

const adminNavigation: FuseNavigation = {
    id: 'adminMenu',
    title: 'Admin',
    translate: 'NAV.ADMIN_MENU',
    type: 'collapsable',
    icon: 'settings',
    children: []
};

const financialNavigation: FuseNavigation = {
    id: 'financialMenu',
    title: 'Financial',
    translate: 'NAV.FINANCIAL_MENU',
    type: 'collapsable',
    icon: 'attach_money',
    children: []
};

const videosNavigation: FuseNavigation = {
    id: 'videos',
    title: 'Videos',
    translate: 'NAV.VIDEOS.TITLE',
    type: 'item',
    icon: 'movie',
    url: '/videos'
};

const usersNavigation: FuseNavigation = {
    id: 'users',
    title: 'Users',
    translate: 'NAV.USERS.TITLE',
    type: 'item',
    icon: 'person',
    url: '/users'
};

const groupsNavigation: FuseNavigation = {
    id: 'groups',
    title: 'Groups',
    translate: 'NAV.GROUPS.TITLE',
    type: 'item',
    icon: 'group',
    url: '/groups'
};

const categoriesNavigation: FuseNavigation = {
    id: 'categories',
    title: 'Categories',
    translate: 'NAV.CATEGORIES.TITLE',
    type: 'item',
    icon: 'category',
    url: '/categories'
};

const pokerRoomsNavigation: FuseNavigation = {
    id: 'pokerRooms',
    title: 'PokerRooms',
    translate: 'NAV.POKER_ROOMS.TITLE',
    type: 'item',
    icon: 'local_play',
    url: '/pokerrooms'
};

const moneyRequestsNavigation: FuseNavigation = {
    id: 'moneyRequests',
    title: 'MoneyRequests',
    translate: 'NAV.MONEY_REQUESTS.TITLE',
    type: 'item',
    icon: 'attach_money',
    url: '/moneyrequests'
};

const dailyBalancesNavigation: FuseNavigation = {
    id: 'dailyBalances',
    title: 'DailyBalances',
    translate: 'NAV.DAILY_BALANCES.TITLE',
    type: 'item',
    icon: 'date_range',
    url: '/dailybalances'
};

export { navigation, adminNavigation as adminNavigation, financialNavigation, videosNavigation, usersNavigation, groupsNavigation, categoriesNavigation, pokerRoomsNavigation, moneyRequestsNavigation, dailyBalancesNavigation, studyNavigation, videosLibrayNavigation };
