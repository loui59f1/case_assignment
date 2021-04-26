"use strict";

document.addEventListener("DOMContentLoaded", init);

let allTeamMembers = [];
let myTeam = [];

const teamMemberPrototype = {
    name: "",
    position: "",
    description: ""
};

const settings = {
    filter: "all",
    sortBy: "name",
    sortDir: "asc",
};

function init() {
    document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));

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
    buildLoopView();
}

function selectFilter(event) {
    const filter = event.target.dataset.filter;
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

    clone.querySelector("[data-field=name]").textContent = teamMember.name;
    clone.querySelector("[data-field=position]").textContent = teamMember.position;
    clone.querySelector("[data-field=department]").textContent = teamMember.department;
    clone.querySelector("img").src = "img/" + teamMember.image;

    if (myTeam.includes(teamMember)) {
        clone.querySelector(".add").style.backgroundImage = 'url(img/icons/added_icon.svg)';
    } else {
        clone.querySelector(".add").style.backgroundImage = 'url(img/icons/add_icon.svg)';
    }

    clone.querySelector("img").addEventListener("click", () => showTeamMembermodal(teamMember));
    clone.querySelector(".add").addEventListener("click", () => addTeamMember(teamMember));

    document.querySelector("#team").appendChild(clone);

    checkMyTeamLength();

    document.querySelector(".clear").addEventListener("click", clearMyTeam);
}

function addTeamMember(teamMember) {
    if (myTeam.includes(teamMember)) {
        console.log("already member");
        removeSidebarTeamMember(teamMember);

    } else {
        console.log("adding member");
        myTeam.push(teamMember);
        console.log(myTeam);
    }
    buildSidebarTeam();
}

function buildSidebarTeam() {
    showAllSidebarTeam(myTeam);
    checkMyTeamLength();
    buildLoopView();
    closeLink();
}

function showAllSidebarTeam(myTeam) {
    document.querySelector("#member").innerHTML = "";

    myTeam.forEach(showSidebarTeam);
}

function showSidebarTeam(sidebarTeamMember) {
    const clone = document.querySelector("template#newTeamMember").content.cloneNode(true);

    clone.querySelector(".myteam_name").textContent = sidebarTeamMember.name;
    clone.querySelector(".myteam_position").textContent = sidebarTeamMember.position;
    clone.querySelector("img").src = "img/" + sidebarTeamMember.image;

    clone.querySelector("#remove_member").addEventListener("click", () => removeSidebarTeamMember(sidebarTeamMember));

    document.querySelector("#member").appendChild(clone);

    document.querySelector("#generate_link").addEventListener("click", showLink);

}

function showLink() {
    document.querySelector(".link_container").style.display = "block";

    const memberIDS = [];

    myTeam.forEach(function (member) {
        memberIDS.push(member.id);
    });

    const url = window.location.href;
    const link = document.querySelector("#link_input");

    link.value = url;
    link.scrollLeft = link.scrollWidth;

    link.value = "team.html?id=" + memberIDS;

    link.addEventListener("click", selectLink);
    document.querySelector("#clipboard_copy").addEventListener("click", copyLink);
}

function closeLink() {
    document.querySelector(".link_container").style.display = "none";
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

function removeSidebarTeamMember(teamMember) {
    console.log("Remove " + teamMember.name);

    const iOfMember = myTeam.indexOf(teamMember);
    myTeam.splice(iOfMember, 1);
    console.log(myTeam);
    buildSidebarTeam();
}

function clearMyTeam() {
    myTeam = [];
    document.querySelector("#member").innerHTML = "";
    closeLink();
    buildLoopView();
}

function checkMyTeamLength() {
    if (myTeam.length > 0) {
        document.querySelector(".info").style.display = "none";
        document.querySelector(".clear").style.display = "block";
        document.querySelector("#generate_link").style.display = "block";
    } else {
        document.querySelector(".info").style.display = "block";
        document.querySelector(".clear").style.display = "none";
        document.querySelector("#generate_link").style.display = "none";
    }
}

function showTeamMembermodal(teamMember) {
    console.log(teamMember);
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

    // // fix this
    // modal.querySelector(".add_modal").addEventListener("click", function () {
    //     if (myTeam.includes(teamMember)) {
    //         console.log("already member - modal");
    //         removeSidebarTeamMember(teamMember);

    //     } else {
    //         console.log("adding member - modal");
    //         myTeam.push(teamMember);
    //         console.log(myTeam);
    //     }
    //     closeModal();
    //     buildSidebarTeam();
    // });

    function closeModal() {
        modal.style.display = "none";
        buildLoopView();
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            buildLoopView();
        }
    };

}

// function addTeamMemberModal(teamMember) {
// if (myTeam.includes(teamMember)) {
//     console.log("already member - modal");
//     removeSidebarTeamMember(teamMember);

// } else {
//     console.log("adding member - modal");
//     myTeam.push(teamMember);
//     console.log(myTeam);
// }
// document.querySelector(".modal").style.display = "none";
// buildSidebarTeam();
// }