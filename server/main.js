import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    if (Meteor.users.find().count() == 0) {

         user = {
             "emails": [
                 {
                     "address": "singhjess@gmail.com",
                     "verified": false
                 }
             ],
             "roles": ["admin"],password: 'mohali'
         }

         Meteor.users.insert(user)

         Roles.setUserRoles(userId, 'admin');

    }

    // code to run on server at startup
    if (Facilities.find().count() == 0) {
        Facilities.insert({ "name": "Morningside Clinic", _id:'10001' , 'address': '123', city:'malvern'})
        Facilities.insert({ "name": "Neilson Diabetes", _id:'10002', 'address': '123' , city:'Scarborough'})
    }

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
            "name": "Growth Chart",
            startFromBirthDate:true,
            assesments: [
                { "name": "Height",
                 "frequency": { "every": 6, "type": "Month"} },

                  { "name": "Weight",
                 "frequency": { "every": 6, "type": "Month"} },

                  { "name": "Head Circumference",
                 "frequency": { "every": 6, "type": "Month"} },
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

                 { "name":"DTwP 2,IPV 2,Hib 2,Rotavirus 2,PCV 2",
                 "frequency": { "every": 10, "type": "Week", isRecurring:false } },

                 { "name":"DTwP 3,IPV 3,Hib 3,Rotavirus 3,PCV 3",
                 "frequency": { "every": 14, "type": "Week", isRecurring:false } },
                 
                 { "name":"OPV 1,Hep-B 3",
                 "frequency": { "every": 6, "type": "Month", isRecurring:false } },

                  { "name":"OPV 2,MMR 1",
                 "frequency": { "every": 9, "type": "Month", isRecurring:false } },

                 { "name":"Hep-A 1, Typhoid Conjugate Vaccine",
                 "frequency": { "every": 12, "type": "Month", isRecurring:false } }, //validate

                  { "name":" MMR 2 ,Varicella 1 ,PCV booster",
                 "frequency": { "every": 15, "type": "Month", isRecurring:false } }, 

                 { "name":" DTwP B1/DTaP B1,IPV B1,Hib B1, Hep-A 2", 
                 "frequency": { "every": 18, "type": "Month", isRecurring:false } }, 

                  { "name":" Booster of TyphoidConjugate Vaccine", 
                 "frequency": { "every": 2, "type": "Year", isRecurring:false } }, 

                  { "name":" DTwP B2/DTaP B2,OPV 3,Varicella 2,MMR 3", 
                 "frequency": { "every": 5, "type": "Year", isRecurring:false } }, 

                 { "name":" Tdap/Td, HPV", 
                 "frequency": { "every": 11, "type": "Year", isRecurring:false } }, 
                 
            ]

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
