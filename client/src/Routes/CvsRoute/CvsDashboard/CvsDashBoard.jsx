import React from "react";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Inject } from '@syncfusion/ej2-react-grids';
import Avatar from "react-avatar";

export default function CvsDashBoard() {
  // Replace the following with actual user data

  const universityUsers = [
    {
      username: "jaydeep Khandla",
      email: "jaydeepkhandla1@gmail.com",
    },
    {
      username: "Dev Oza",
      email: "devoza007@gmail.com",
    },
    {
      username: "Harsh Sonaiya",
      email: "harsh@gmail.com",
    },
    {
      username: "Arun Kumar",
      email: "arunjetli@gmail.com",
    },
    {
      username: "Raj Kumar",
      email: "rajkumar@gmail.com",
    },
    {
      username: "Saurabh Gandhi",
      email: "saurabhgandhi@gmail.com",
    },
    {
      username: "Gaurav Tiwari",
      email: "gaurav@gmail.com",
    },
    {
      username: "Mit Patel",
      email: "mit@gmail.com",
    },
  
    // Add more user data as needed
  ]
  const columns = [
    {
      headerText: "Profile Pic",
      template: (props) => (
        // <img
        //   src={props.profilePic}
        //   alt="Profile Pic"
        //   style={{ width: "50px", height: "50px" }}
        // />
        <Avatar name={props.username} size={30} round={true} />
      )
    },
    { field: "username", headerText: "Name" },
    { field: "email", headerText: "Email" },
    // Add more columns as needed
  ];
  return (
    <div className="w-full">

  {/* CRD Dashboard (Top) */}
 
  <h2 className="text-2xl font-bold text-center mb-6">Project Id: #1 || Project Name: DoorDarshan</h2>
  {/* Coollaborating University (Above the Boxes) */}
  {/* <h2 className="text-2xl font-bold text-center mb-6">Collaborating University</h2> */}

  <div className="mt-24">


    {/* Team Members (Above the Table) */}
    <h2 className="text-2xl font-bold text-center mt-12 mb-6">Team Members</h2>

    <div className="m-3">
      <GridComponent
        dataSource={universityUsers}
        allowPaging
        pageSettings={{ pageSize: 10 }}
      >
        <ColumnsDirective>
          {columns.map((column) => (
            <ColumnDirective
              key={column.field}
              field={column.field}
              headerText={column.headerText}
              template={column.template}
            />
          ))}
        </ColumnsDirective>
        <Inject services={[Page]} />
      </GridComponent>
    </div>
  </div>
</div>

 
 
  );
}
