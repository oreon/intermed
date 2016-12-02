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
            Services.insert({"name": "Abdominal Surgery" , price:5000 })
            LabTests.insert({"name": "Laproscopy" , price:3000})
        }
    }
)
;
