import './sass/main.scss';

"use strict";

const url = location.search;
var idList = url.substring(url.lastIndexOf('=') + 1);
var result = idList.split(',').map(x => + x);
var myJsonString = JSON.parse(JSON.stringify(result))
console.log(myJsonString)

let index = 0;
while (index < myJsonString.length) {
    index++;
}

// Create array for teammembers and My Team
let allTeamMembers = [];

const teamMemberPrototype = {
    name: "",
    position: "",
    description: "",
    imageSrc: "null",
};

document.addEventListener("DOMContentLoaded", init);

function init() {
    console.log("Initialize program");

    // Load JSON document
    loadJSON("team.json", prepareData);
}

async function loadJSON(url, event) {
    const respons = await fetch(url);
    const jsonData = await respons.json();
    event(jsonData);

    console.log("JSON data is loaded")

}

function prepareData(jsonData) {
    jsonData.forEach((jsonObject) => {
        const teamMember = Object.create(teamMemberPrototype);

        // Define name, position, description and image
        const firstSpace = jsonObject.fullname.trim().indexOf(" ");

        teamMember.firstname = jsonObject.fullname.trim().substring(0, firstSpace);
        teamMember.name = jsonObject.fullname;
        teamMember.memberId = jsonObject.id;
        teamMember.position = jsonObject.position;
        teamMember.description = jsonObject.description;
        teamMember.department = jsonObject.department;
        teamMember.email = jsonObject.email;
        teamMember.phone = jsonObject.phone;

        if (teamMember.name === "Mads Lindum") {
            teamMember.image = "lindum.jpg";
        } else if (teamMember.name === "Tobias Lindhardt") {
            teamMember.image = "tobiaslindhardt.jpg";
        } else {
            teamMember.image = teamMember.firstname + ".jpg";
        }

        allTeamMembers.push(teamMember);
        // generate ID's to sidebar Team members
        allTeamMembers.forEach((o, i) => o.id = i + 1);


    });
    checkMemberIds();
}

function checkMemberIds() {
    const filteredArray = allTeamMembers.filter((teamMember) => result.includes(teamMember.id));

    console.log(filteredArray);

    filteredArray.forEach(addTeamMember);
}


function addTeamMember(teamMember) {
    const clone = document.querySelector("template#teamlist").content.cloneNode(true);

    // Placing teammembers data into template
    clone.querySelector("[data-field=name]").textContent = teamMember.name;
    clone.querySelector("[data-field=position]").textContent = teamMember.position;
    clone.querySelector("[data-field=department]").textContent = teamMember.department;
    clone.querySelector("img").src = "img/" + teamMember.image;

    // Tilføjer eventlistener på teammember, der åbner modal
    clone.querySelector("img").addEventListener("click", () => showTeamMembermodal(teamMember));

    document.querySelector("#team").appendChild(clone);
    console.log(teamMember.id)
}