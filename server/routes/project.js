const router = require('express').Router();
const Project = require("../models/project");
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

router.post('/create-project', async (req, res) => {
    const { projectname, projectsummary, startdate, enddate, teammembers, teamleader } = req.body;

    const projectId = uuidv4();
    console.log(teamleader);
    try {
        const project = new Project({
            projectId,
            projectname,
            projectsummary,
            startdate,
            enddate,
            teammembers,
            teamleader,
        });

        await project.save();
        console.log(teammembers);
        sendInvitations(projectId, teammembers,projectname);

        res.json({
            projectId,
            projectname,
            projectsummary,
            startdate,
            enddate,
            teammembers,
            teamleader,
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ success: false, message: 'Error creating project.' });
    }
});

router.get('/projects', async (req, res) => {

    try {
        const { email } = req.query;

        console.log(email);
    
        if (!email) {
          return res.status(400).json({ error: 'Please provide a team member username.' });
        }
    
        const projects = await Project.find({ teammembers: email });
    
        if (!projects || projects.length === 0) {
          return res.status(404).json({ error: 'No projects found for the specified team member.' });
        }
        console.log(projects)
        res.status(200).json({ projects });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

function sendInvitations(projectId, teamMembers,projectname) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'harshsonaiya09@gmail.com',
            pass: 'ckfenttblyccfsmq'
        },
    });

    teamMembers.forEach((email) => {
        const inviteLink = `http://localhost:3000/join/${projectId}`;

        const mailOptions = {
            from: 'harshsonaiya09@gmail.com',
            to: email,
            subject: `Welcome to ${projectname}`,
            text: `You have been added to the project.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending invitation email:', error);
            } else {
                console.log('Invitation email sent:', info.response);
            }
        });
    });
}

// function sendInvitationEmail(email, projectId) {
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: 'Zept',
//             pass: 'wcuy fely ufsd sooj',
//         },
//     });

//     const inviteLink = `http://localhost:3000/join/${projectId}`;

//     const mailOptions = {
//         from: 'your-email@gmail.com',
//         to: email,
//         subject: 'Invitation to Join Project',
//         text: `You have been invited to join the project. Click on the following link to accept the invitation:\n\n${inviteLink}`,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error('Error sending invitation email:', error);
//         } else {
//             console.log('Invitation email sent:', info.response);
//         }
//     });
// }

module.exports = router;