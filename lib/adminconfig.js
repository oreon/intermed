AdminConfig = {
    collections: {
        //Products: {
        //
        //    omitFields: ['updatedAt']
        //},
        //Recipes: {},
        //Admissions:{},
        Drugs: {},
       // Patients: {},
       // Scripts: {},
       // Encounters: {},

        Facilities:{},
        LabTests:{},
        ChronicDiseases:{},
        Wards:{},
        Rooms:{},
        Beds:{},

        ScriptTemplates:{},
        TestResults:{},
        Services:{}
    }
};

AdminDashboard.addSidebarItem('New User', AdminDashboard.path('/new/Users'), { icon: 'plus' })
AdminDashboard.addSidebarItem('New Recipe', AdminDashboard.path('/new/Recipes'), { icon: 'plus' })


AdminDashboard.addSidebarItem('Analytics', {
    icon: 'line-chart',
    urls: [
        { title: 'Statistics', url: AdminDashboard.path('/analytics/statistics') },
        { title: 'Settings', url: AdminDashboard.path('/analytics/settings') }
    ]
});

