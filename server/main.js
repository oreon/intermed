import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
        // code to run on server at startup
        if (Drugs.find().count() == 0) {
            Drugs.insert({"name": "Piperacillin"})
            Drugs.insert({"name": "Penicillin"})
            Drugs.insert({"name": "Albendazole"})
            Drugs.insert({"name": "Aspirin"})
            Drugs.insert({"name": "Aspirin"})
        }
        if (LabTests.find().count() == 0) {
            LabTests.insert({"name": "CBC"})
            LabTests.insert({"name": "Fasting Sugar"})
            LabTests.insert({"name": "PP Sugar"})
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
    }
)
;
