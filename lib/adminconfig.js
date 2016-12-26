common = [
    { label: 'Name', name: 'name' },
    { label: 'Updated', name: 'updated' }
]

AdminConfig = {
    collections: {

        //Recipes: {},
        //Admissions:{},
        Drugs: {
            tableColumns: common
        },
        // Patients: {},
        // Scripts: {},
        // Encounters: {},

        Facilities: {
            tableColumns: common
        },
        LabTests: {
            tableColumns: common
        },
        ChronicDiseases: {
            tableColumns: common
        },
        Wards: {
            tableColumns: common
        },
        Rooms: {
            tableColumns: common
        },
        Beds: {
            tableColumns: common
        },

        ScriptTemplates: {
            tableColumns: common
        },

        Services: {
            tableColumns: common
        }
    }
};

AdminDashboard.addSidebarItem('New User', AdminDashboard.path('/new/Users'), { icon: 'plus' })
AdminDashboard.addSidebarItem('New Appointment', AdminDashboard.path('/new/Recipes'), { icon: 'plus' })


AdminDashboard.addSidebarItem('Analytics', {
    icon: 'line-chart',
    urls: [
        { title: 'Statistics', url: AdminDashboard.path('/analytics/statistics') },
        { title: 'Settings', url: AdminDashboard.path('/analytics/settings') }
    ]
});

