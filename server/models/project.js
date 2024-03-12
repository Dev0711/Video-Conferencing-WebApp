const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectId:{
    type : String ,
    required: true,
    unique : true
  },
  projectname: {
    type: String,
    required: true,
  },
  projectsummary: {
    type: String,
    required: false,
  },
  startdate: {
    type: Date,
    default: Date.now, // Set the default value to the current date and time
  },
  enddate: Date,
  teammembers: {
    type: [String], // Array of strings representing team members
    default: [],    // Default value is an empty array
  },
  teamleader : {
    type: String ,
    required :true
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);