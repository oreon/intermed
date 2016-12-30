import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
        // code to run on server at startup
        if (Drugs.find().count() == 0) {
            Drugs.insert({"name": "Piperacillin"})
            Drugs.insert({"name": "Penicillin"})
            Drugs.insert({"name": "Albendazole"})
            Drugs.insert({"name": "Aspirin"})
            Drugs.insert({"name": "Captopril"})
            Drugs.insert({"name": "Diclofenac"})
            Drugs.insert({"name": "Metformin"})
            Drugs.insert({"name": "Glipizide"})
            
            
            
        }
        if (LabTests.find().count() == 0) {
            LabTests.insert({"name": "CBC"})
            LabTests.insert({"name": "Fasting Sugar"})
            LabTests.insert({"name": "PP Sugar"})
            LabTests.insert({"name": "Random Sugar"})
            LabTests.insert({"name": "PSA"})
            LabTests.insert({"name": "Thyroid Panel"})
            LabTests.insert({"name": "Blood Chemistry"})
        }
         if (Services.find().count() == 0) {
            Services.insert({"name": "Lab Tests" , price:0, autoCreated:true})
            Services.insert({"name": "Room Stay" , price:0, autoCreated:true})
            
            Services.insert({"name": "Abdominal Surgery" , price:5000 , autoCreated:false})
            Services.insert({"name": "Laproscopy" , price:3000, autoCreated:false})
            Services.insert({"name": "Angiography" , price:8400, autoCreated:false})
            Services.insert({"name": "Gastrectocomy" , price:7800, autoCreated:false})
        }
         if (Specializations.find().count() == 0) {
            Specializations.insert({"name": "Opthalmology" })
            Specializations.insert({"name": "Gyanecology" })
            Specializations.insert({"name": "Cardiology" })
            Specializations.insert({"name": "Internal Medicine" })
            Specializations.insert({"name": "Dermatology" })
            Specializations.insert({"name": "Surgery" })    
           
        }


        //   if (Wards.find().count() > 0) {
        //     wd = Wards.insert({"name": "Female General" , price:150}, function(error, res){
        //         console.log(res)
        //         Rooms.insert({"name": "RMG1" , ward:res}, function(error, res){
        //             for(i = 1; i < 5; i++)
        //                 Beds.insert({"name": "B" + i , room:res})
        //         })
        //     })
        //}
    }
)
;
