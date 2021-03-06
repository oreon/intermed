//Admin.collections.add('Services');

let nameOnly = [
    { label: 'Name', name: 'name' },
]

let common = [
    { label: 'Name', name: 'name' },
   { label: 'Created', name: 'createdAt' },
      { label: 'Updated', name: 'updatedAt' },
   
     { label: 'Facility', name: 'facility' }
]

AdminConfig = {
    collections: {

        //Recipes: {},
        //Admissions:{},
        Drugs: {

            tableColumns: common
        },

         Patients: {
               changeSelector(selector, userId) {
                // modify it here ...
                 return{ facility: Meteor.users.findOne({_id:userId}).profile.facility } ;
            },
            selector (userId) { 
                return{ facility: Meteor.users.findOne({_id:userId}).profile.facility } 
            },
            tableColumns: common.concat({ label: 'Name', name: 'firstName' })
         },

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
        Charts:{
            tableColumns: common
        },
        ScriptTemplates: {
            tableColumns: common
        },

        Services: {
            tableColumns: common
        },

        Differentials:{
            tableColumns:nameOnly
        },

        LabFindings:{
            tableColumns:nameOnly
        },

        PhysicalFindings:{
             tableColumns:nameOnly
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

