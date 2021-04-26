"use strict";

document.addEventListener("DOMContentLoaded", init);

const url = window.location.href;
var idList = url.substring(url.lastIndexOf('=') + 1);
var result = idList.split(',').map(x => + x);

let index = 0;
while (index < result.length) {
    index++;
}

let allTeamMembers = [];

const teamMemberPrototype = {
    name: "",
    position: "",
    description: "",
    imageSrc: "null",
};

function init() {
    loadJSON("team.json", prepareData);
}

async function loadJSON(url, event) {
    const respons = await fetch(url);
    const jsonData = await respons.json();
    event(jsonData);
}

function prepareData(jsonData) {
    jsonData.forEach((jsonObject) => {
        const teamMember = Object.create(teamMemberPrototype);

        const firstSpace = jsonObject.fullname.trim().indexOf(" ");

        teamMember.firstname = jsonObject.fullname.trim().substring(0, firstSpace).toLowerCase();
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

        allTeamMembers.forEach((o, i) => o.id = i + 1);

    });
    checkMemberIds();
}

function checkMemberIds() {
    const filteredArray = allTeamMembers.filter((teamMember) => result.includes(teamMember.id));

    filteredArray.forEach(addTeamMember);
}

function addTeamMember(teamMember) {
    const clone = document.querySelector("template#teamlist").content.cloneNode(true);

    clone.querySelector("[data-field=name]").textContent = teamMember.name;
    clone.querySelector("[data-field=position]").textContent = teamMember.position;
    clone.querySelector("[data-field=department]").textContent = teamMember.department;
    clone.querySelector("img").src = "img/" + teamMember.image;

    clone.querySelector("img").addEventListener("click", () => showTeamMembermodal(teamMember));

    document.querySelector("#team").appendChild(clone);

    const link = document.querySelector("#link_input");
    link.value = url;
    link.scrollLeft = link.scrollWidth;

    link.addEventListener("click", selectLink);
    document.querySelector("#clipboard_copy").addEventListener("click", copyLink);
}

function selectLink() {
    document.querySelector("#link_input").select();
}

function copyLink() {
    let copyText = document.querySelector("#link_input");

    copyText.select();
    copyText.setSelectionRange(0, 99999);

    document.execCommand("copy");
    document.querySelector(".copy_text").style.display = "block";
    setTimeout(function () {
        document.querySelector(".copy_text").style.display = "none";
    }, 3000);
}

function showTeamMembermodal(teamMember) {
    const modal = document.querySelector(".modal");

    modal.style.display = "block";

    modal.querySelector("h2").textContent = teamMember.name;
    modal.querySelector("h3").textContent = teamMember.position;
    modal.querySelector("[data-field=description]").textContent = teamMember.description;
    modal.querySelector("[data-field=department]").textContent = teamMember.department;

    if (teamMember.phone === "") {
        modal.querySelector(".phone").textContent = "";
    } else {
        modal.querySelector(".phone").textContent = "Phone: " + teamMember.phone;
    }

    modal.querySelector(".e-mail").textContent = "E-mail: " + teamMember.email;
    modal.querySelector("img").src = "img/" + teamMember.image;

    modal.querySelector("#close_modal").addEventListener("click", closeModal);

    function closeModal() {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

}