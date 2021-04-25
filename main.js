import './sass/main.scss';

"use strict";

document.addEventListener("DOMContentLoaded", init);

let allTeamMembers = [];
let myTeam = [];

const teamMemberPrototype = {
    name: "",
    position: "",
    description: "",
    imageSrc: "null",
};

const settings = {
    filter: "all",
    sortBy: "name",
    sortDir: "asc",
};

function init() {
    console.log("Initialize program");

    addEventListenersToBtns();

    loadJSON("team.json", prepareData);
}

function addEventListenersToBtns() {
    document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
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

        teamMember.firstname = jsonObject.fullname.trim().substring(0, firstSpace);
        teamMember.name = jsonObject.fullname;
        teamMember.position = jsonObject.position;
        teamMember.description = jsonObject.description;
        teamMember.department = jsonObject.department;
        teamMember.email = jsonObject.email;
        teamMember.phone = jsonObject.phone;

        if (teamMember.name === "Mads Lindum") {
            teamMember.image = "lindum.jpg";
        } else {
            teamMember.image = teamMember.firstname + ".jpg";
        }

        allTeamMembers.push(teamMember);
        allTeamMembers.forEach((o, i) => o.id = i + 1);

    });

    buildLoopView();
}

function selectFilter(event) {
    const filter = event.target.dataset.filter;
    console.log(`User selected ${filter}`);
    defineFilter(filter);
}

function defineFilter(filter) {
    settings.filterBy = filter;
    buildLoopView();
}

function filterList(filteredList) {
    if (settings.filterBy === "consultants") {
        filteredList = allTeamMembers.filter(isConsultants);
    } else if (settings.filterBy === "strategists") {
        filteredList = allTeamMembers.filter(isStrategists);
    } else if (settings.filterBy === "designers") {
        filteredList = allTeamMembers.filter(isDesigners);
    } else if (settings.filterBy === "tech") {
        filteredList = allTeamMembers.filter(isTech);
    } else if (settings.filterBy === "innovation") {
        filteredList = allTeamMembers.filter(isInnovation);
    } else if (settings.filterBy === "creatives") {
        filteredList = allTeamMembers.filter(isCreatives);
    }

    function isConsultants(department) {
        return department.department === "Consultants";
    }

    function isStrategists(department) {
        return department.department === "Strategists";
    }

    function isDesigners(department) {
        return department.department === "Designers";
    }

    function isTech(department) {
        return department.department === "Tech";
    }

    function isInnovation(department) {
        return department.department === "Innovation Leads";
    }

    function isCreatives(department) {
        return department.department === "Creatives";
    }
    return filteredList;
}

function sortList(sortedList) {
    let direction = -1;
    if (settings.sortDir === "desc") {
        direction = -1;
    } else {
        direction = 1;
    }

    sortedList = sortedList.sort(sortByProperty);

    function sortByProperty(studentA, studentB) {
        if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
            return -1 * direction;
        } else {
            return 1 * direction;
        }
    }
    return sortedList;
}

function buildLoopView() {
    console.log("Build Loop view");
    const currentList = filterList(allTeamMembers);
    const sortedList = sortList(currentList);

    showAllTeamMembers(sortedList);
}

function showAllTeamMembers(teamList) {
    document.querySelector("#team").innerHTML = "";
    teamList.forEach(showTeamMember);
}

function showTeamMember(teamMember) {
    const clone = document.querySelector("template#teamlist").content.cloneNode(true);

    // Placing teammembers data into template
    clone.querySelector("[data-field=name]").textContent = teamMember.name;
    clone.querySelector("[data-field=position]").textContent = teamMember.position;
    clone.querySelector("[data-field=department]").textContent = teamMember.department;
    clone.querySelector("img").src = "img/" + teamMember.image;

    if (myTeam.includes(teamMember)) {
        clone.querySelector(".add").style.backgroundImage = 'url(img/icons/added_icon.svg)';
    } else {
        clone.querySelector(".add").style.backgroundImage = 'url(img/icons/add_icon.svg)';
    }

    // Tilføjer eventlistener på teammember, der åbner modal
    clone.querySelector("img").addEventListener("click", () => showTeamMembermodal(teamMember));

    // Tilføjer eventlistener på teammember, der åbner modal
    clone.querySelector(".add").addEventListener("click", () => addTeamMember(teamMember));

    document.querySelector("#team").appendChild(clone);

    checkMyTeamLength();

    document.querySelector(".clear").addEventListener("click", clearMyTeam);

}