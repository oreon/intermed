
export const BaseSchema = new SimpleSchema({

    createdAt: {
        type: Date,
        optional: true,
        autoValue: function () {
            try {
                if (this.isInsert) {
                    return new Date();
                } else if (this.isUpsert) {
                    return { $setOnInsert: new Date() };
                } else {
                    this.unset();  // Prevent user from supplying their own value
                }
            } catch (e) {
                console.log(e)
            }
        },
        autoform: {
            type: "hidden"
        }
    },

    createdBy: {
        type: String,
        optional: true,
        autoValue: function () {
            try {
                if (this.isInsert) {
                    return this.userId
                } else if (this.isUpsert) {
                    return { $setOnInsert: this.userId };
                } else {
                    this.unset();  // Prevent user from supplying their own value
                }
            } catch (error) {
                console.log(error)
            }
        },
        autoform: {
            type: "hidden"
        }
    },


    // Force value to be current date (on server) upon update
    // and don't allow it to be set upon insert.
    updatedAt: {
        type: Date,
        autoValue: function () {
            try {
                if (this.isUpdate) {
                    return new Date();
                }
            } catch (error) {
                console.log(error)
            }
        },
        denyInsert: true,
        optional: true,
        autoform: {
            type: "hidden"
        }
    },

    facility: {
        type: String,
        autoValue: function () {
            try {
                if (this.isInsert && Meteor.isClient) {
                    return Meteor.user().profile.facility;
                }
            } catch (error) {
                console.error(error)
            }
        },
        optional: true,
        autoform: {
            type: "hidden"
        }
    },

    
})