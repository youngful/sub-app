const mongoose = require("mongoose")

const subSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String
    },
    price:{
        type: Number,
        required: true,
        get: (v) => parseFloat(v).toFixed(2)
    },
    duration:{
        type: Date,
        default: () => {
            const currentDate = new Date();
            const dueDate = new Date();
            dueDate.setMonth(currentDate.getMonth() + 1);
            return dueDate;
        }
    },
})



module.exports = {subSchema}
