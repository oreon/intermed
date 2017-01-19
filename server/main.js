import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    if (Meteor.users.find().count() < 200) {

        // user = {
        //     "emails": [
        //         {
        //             "address": "singhjess@gmail.com",
        //             "verified": false
        //         }
        //     ],
        //     "roles": ["admin"],password: 'mohali'
        // }

        // Meteor.users.insert(user)

        // Roles.setUserRoles(userId, 'admin');

    }
    //  if (Roles.find().count() == 0) {
    //      Roles.insert('admin');
    //      Roles.insert('physician');
    //      Roles.insert('labTech');
    //      Roles.insert('nurse');

    //      Roles.insert('manager');
    //      Roles.insert('clerk');
    //      Roles.insert('patient');
    // }
    // code to run on server at startup
    if (Drugs.find().count() == 0) {
        Drugs.insert({ "name": "Piperacillin" })
        Drugs.insert({ "name": "Penicillin" })
        Drugs.insert({ "name": "Albendazole" })
        Drugs.insert({ "name": "Aspirin" })
        Drugs.insert({ "name": "Captopril" })
        Drugs.insert({ "name": "Diclofenac" })
        Drugs.insert({ "name": "Metformin" })
        Drugs.insert({ "name": "Glipizide" })



    }
    if (LabTests.find().count() == 0) {
        LabTests.insert({ "name": "CBC" })
        LabTests.insert({ "name": "Fasting Sugar" })
        LabTests.insert({ "name": "PP Sugar" })
        LabTests.insert({ "name": "Random Sugar" })
        LabTests.insert({ "name": "PSA" })
        LabTests.insert({ "name": "Thyroid Panel" })
        LabTests.insert({ "name": "Blood Chemistry" })
    }
    if (Services.find().count() == 0) {
        Services.insert({ "name": "Lab Tests", price: 0, autoCreated: true })
        Services.insert({ "name": "Room Stay", price: 0, autoCreated: true })

        Services.insert({ "name": "Abdominal Surgery", price: 5000, autoCreated: false })
        Services.insert({ "name": "Laproscopy", price: 3000, autoCreated: false })
        Services.insert({ "name": "Angiography", price: 8400, autoCreated: false })
        Services.insert({ "name": "Gastrectocomy", price: 7800, autoCreated: false })
    }
    if (Specializations.find().count() == 0) {
        Specializations.insert({ "name": "Opthalmology" })
        Specializations.insert({ "name": "Gyanecology" })
        Specializations.insert({ "name": "Cardiology" })
        Specializations.insert({ "name": "Internal Medicine" })
        Specializations.insert({ "name": "Dermatology" })
        Specializations.insert({ "name": "Surgery" })
    }
    if (ChronicDiseases.find().count() == 0) {
        ChronicDiseases.insert({ "name": "Asthma" })
        ChronicDiseases.insert({ "name": "Cancer" })
        ChronicDiseases.insert({ "name": "CAD" })
        ChronicDiseases.insert({ "name": "Hypertension" })
        ChronicDiseases.insert({ "name": "CKD" })
        ChronicDiseases.insert({ "name": "Diabetes" })
        ChronicDiseases.insert({ "name": "Osteoporosis" })
        ChronicDiseases.insert({ "name": "Rheumatoid Arthritis" })
    }
    if (Charts.find().count() == 0) {
        Charts.insert({
            "name": "Diabetes",
            assesments: [
                { "name": "HbA1C", "frequency": { "every": 90, "type": "Day" } },
                { "name": "Foot Exam", "frequency": { "every": 180, "type": "Day" } },
                { "name": "Eye Exam", "frequency": { "every": 180, "type": "Day" } },
                { "name": "Renal and Heart Exam", "frequency": { "every": 120, "type": "Day" } },
            ]
        })

        Charts.insert({
            "name": "Hypertension",
            assesments: [
                { "name": "Eye Exam", "frequency": { "every": 180, "type": "Day" } },
                { "name": "Blood pressure", "frequency": { "every": 7, "type": "Day" } },
                { "name": "Renal Panel", "frequency": { "every": 120, "type": "Day" } },
                { "name": "Blood Lipids", "frequency": { "every": 180, "type": "Day" } },
            ]
        })

        Charts.insert({
            "name": "Asthma",
            assesments: [
                { "name": "Spirometry", "frequency": { "every": 180, "type": "Day" } },
            ]
        })

         Charts.insert({
            "name": "Pediatric Immunization",
            startFromBirthDate:true,
            assesments: [
                { "name": "BCG ,OPV 0, Hep-B 1",
                 "frequency": { "every": 0, "type": "Day", isRecurring:false } },

                 { "name": "DTwP 1,IPV 1,Hep-B 2,Hib 1,Rotavirus 1, PCV 1" ,
                 "frequency": { "every": 6, "type": "Week", isRecurring:false } },
            ]

            //, "6 weeks""


        })


    }


    //   if (Wards.find().count() > 0) {
    //     wd = Wards.insert({"name": "Female General" , price:150}, function(error, res){
    //         //console.log(res)
    //         Rooms.insert({"name": "RMG1" , ward:res}, function(error, res){
    //             for(i = 1; i < 5; i++)
    //                 Beds.insert({"name": "B" + i , room:res})
    //         })
    //     })
    //}
}
)
    ;
