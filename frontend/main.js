//const { default: Web3 } = require("web3");

Moralis.initialize("R05hhKuxNxq0qDmNLsu3PDkhZgxbkzpfQCF3BWMV"); // Application id from moralis.io
Moralis.serverURL = "https://nnalc8p0wdxf.moralishost.com:2053/server"; //Server url from moralis.io
var currentUser;
var currentSelectedOrgaId = 0;

async function login() {
    try {
        currentUser = Moralis.User.current();
        if(!currentUser){
            currentUser = await Moralis.Web3.authenticate();
        }
        display_data_based_on_logged_status();
        //By default, display tab_my_memberships
        change_active_tab("tab_my_memberships");
    } catch (error) {
        console.log(error);
    }
}

//Function refreshing: only logged/not logged areas
async function display_data_based_on_logged_status() {
    //If user not logged to a wallet
    if (!currentUser) {
        showElementById("login_button_area");
        hideElementById("logout_button_area");
        hideElementById("only_logged_in_area");
    }
    //If user is logged to a wallet
    else {
        hideElementById("login_button_area");
        showElementById("logout_button_area");
        showElementById("only_logged_in_area");
        document.getElementById("wallet_truncated").textContent = get_trunc_address(currentUser.attributes.ethAddress);
        await refresh_platform_statistics();
    }
}

//Function refreshing: only logged/not logged areas
async function refresh_platform_statistics() {
    window.web3 = await Moralis.Web3.enable();
    let contractInstance = new web3.eth.Contract(window.membership_abi, window.membership_address);
    let orgaNb = await contractInstance.methods.orgaCounter().call({from: currentUser.attributes.ethAddress });
    document.getElementById("orgaNb").textContent = orgaNb;
    let memberNb = await contractInstance.methods.memberCounter().call({from: currentUser.attributes.ethAddress });
    document.getElementById("memberNb").textContent = memberNb;
}

async function create_orga() {
    let orga_name = document.getElementById("orga_name").value;
    let orga_logo_uri = document.getElementById("orga_logo_uri").value;
    let orga_certif_uri = document.getElementById("orga_certif_uri").value;
    let orga_membership_criteria = document.getElementById("orga_membership_criteria").value;
    let orga_revokation_criteria = document.getElementById("orga_revokation_criteria").value;
    let can_revoke = document.getElementById("can_revoke").checked;
    window.web3 = await Moralis.Web3.enable();
    let contractInstance = new web3.eth.Contract(window.membership_abi, window.membership_address);
    contractInstance.methods.createOrganization(orga_name, orga_logo_uri, orga_certif_uri, orga_membership_criteria,orga_revokation_criteria,can_revoke).send({from: currentUser.attributes.ethAddress })
    .on('receipt', function (receipt) {
        console.log(receipt);
        refresh_platform_statistics();
    })
}

function get_trunc_address(str) {
    return str.substring(0, 6) + "..." + str.substring(38, 42);
}

function addRowToTable(tableId, data) {
    let tableRow = document.createElement('tr');
    data.forEach(element => {
        let newColumn = document.createElement('td');
        newColumn.innerHTML = element;
        tableRow.appendChild(newColumn);
    });
    document.getElementById(tableId).appendChild(tableRow);
}

function removeRowsFromTable(tableId) {
    var elmtTable = document.getElementById(tableId);
    var tableRows = elmtTable.getElementsByTagName('tr');
    var rowCount = tableRows.length;

    for (var x=rowCount-1; x>0; x--) {
        elmtTable.removeChild(tableRows[x]);
    }
}

async function logout() {
    await Moralis.User.logOut();
    currentUser = undefined;
    display_data_based_on_logged_status();
}

async function change_active_tab(selected_tab) {

    //=== 1/ Makes visible only the selected tab

    let tabs_list = [
        "tab_my_memberships",
        "tab_my_organizations",
        "tab_new_organization",
        "tab_check_wallet",
        "tab_check_organization"
    ]
    tabs_list.forEach(element => {
        if (element == selected_tab) {
            showElementById(element);
        }
        else {
            hideElementById(element);
        }
    });

    //=== 2/ Fill the content of the selected tab

    if (selected_tab == "tab_my_memberships") {
        //1- empty table
        removeRowsFromTable("my_memberships");
        //2- fill table
        window.web3 = await Moralis.Web3.enable();
        let contractInstance = new web3.eth.Contract(window.membership_abi, window.membership_address);
        let memberships_orga_ids = await contractInstance.methods.memberOf(currentUser.attributes.ethAddress).call({ from: currentUser.attributes.ethAddress });
        
        //for each orgaId, acquire directly with the smart contract the description of the associated organization
        memberships_orga_ids.forEach(async element => {
            await contractInstance.methods._organizations(element).call({ from: currentUser.attributes.ethAddress })
                .then(receipt => {
                    addRowToTable(
                        "my_memberships",
                        [receipt.name, receipt.logoURI, receipt.certificationURI, receipt.membershipCriteria, receipt.canRevoke, receipt.revokationCriteria]
                    );
                });
        });
    }
    else if (selected_tab == "tab_my_organizations") {
        showElementById("my_organizations_all");
        hideElementById("my_organizations_details");

        //1- empty table
        removeRowsFromTable("my_managed_organizations");
        //2- fill table
        window.web3 = await Moralis.Web3.enable();
        let contractInstance = new web3.eth.Contract(window.membership_abi, window.membership_address);
        let myManagedOrganizations = await Moralis.Cloud.run("get_managed_organizations", {});
        //for each orgaId, acquire directly with the smart contract the description of the associated organization
        myManagedOrganizations.forEach(async orga => {
            await contractInstance.methods._organizations(orga.attributes.orgaId).call({ from: currentUser.attributes.ethAddress })
                .then(receipt => {
                    // create tempRow
                    let tableRow = document.createElement('tr');
                    // add a column for each value
                    let data = [
                        receipt.name,
                        receipt.logoURI,
                        receipt.certificationURI,
                        receipt.membershipCriteria,
                        receipt.canRevoke,
                        receipt.revokationCriteria
                    ]
                    data.forEach(element => {
                        let newColumn = document.createElement('td');
                        newColumn.innerHTML = element;
                        tableRow.appendChild(newColumn);
                    });
                    
                    // add button with an onclick listener and add it to a td element that will be add to tableRow
                    let button = document.createElement('button');
                    button.innerHTML = 'more';
                    button.className = 'btn btn-info';
                    button.onclick = function () {
                        display_my_organizations_details(receipt.id);
                    };
                    let newColumn = document.createElement('td');
                    newColumn.appendChild(button);
                    tableRow.appendChild(newColumn);

                    document.getElementById("my_managed_organizations").appendChild(tableRow);
                });
        });
    }
    else if (selected_tab == "tab_new_organization") {
        //do nothing
    }
    else if (selected_tab == "tab_check_wallet") {
        //empty table
        removeRowsFromTable("checked_wallet_memberships");
        hideElementById("check_wallet_after_button_click_only");
    }
    else if (selected_tab == "tab_check_organization") {
        //empty tables
        removeRowsFromTable("checked_organization");
        removeRowsFromTable("orga_modifications_history");
        hideElementById("check_orga_after_button_click_only");
    }
}

function get_added_members_minus_revoked_ones(added_members,revoked_members) {
    //Remove duplicates from both list, and add to result list each added member that has not been later revoked
    let result = [];

    //remove duplicates from added_members
    let already_treated_added_members = new Set();
    let added_without_duplicates = [];
    for (var i = added_members.length - 1; i > -1; i--) {
        if (!already_treated_added_members.has(added_members[i].attributes.addedMember)) {
            already_treated_added_members.add(added_members[i].attributes.addedMember);
            added_without_duplicates.push(added_members[i]);
        }
    }

    //remove duplicates from revoked_members
    let already_treated_revoked_members = new Set();
    let revoked_without_duplicates = [];
    for( i = revoked_members.length - 1; i > -1; i--) {
        if (!already_treated_revoked_members.has(revoked_members[i].attributes.addedMember)) {
            already_treated_revoked_members.add(revoked_members[i].attributes.addedMember);
            revoked_without_duplicates.push(revoked_members[i]);
        }
    }

    //add to result only added members that were not revoked later
    for (i = 0; i < added_without_duplicates.length; i++) {
        let can_add = true;
        for (let j = 0; j < revoked_without_duplicates.length; j++) {
            console.log(added_without_duplicates[i].attributes.addedMember+" "+revoked_without_duplicates[j].attributes.addedMember)
            if (added_without_duplicates[i].attributes.addedMember == revoked_without_duplicates[j].attributes.addedMember) {
                console.log(new Date(added_without_duplicates[i].createdAt)+" "+new Date(revoked_without_duplicates[j].createdAt))
                if (new Date(added_without_duplicates[i].createdAt) < new Date(revoked_without_duplicates[j].createdAt)) {
                    console.log("cannot add, has been revoked");
                    can_add = false;
                }
            }
        }
        if (can_add) {
            result.push(added_without_duplicates[i]);
        }
    }

    return result;
}

async function display_my_organizations_details(orgaId) {
    hideElementById("my_organizations_all");
    showElementById("my_organizations_details");
    removeRowsFromTable("members_of_my_organization");
    currentSelectedOrgaId = orgaId;

    let addedMembers = await Moralis.Cloud.run("get_added_members_for_id", {orgaId:currentSelectedOrgaId});
    let revokedMembers = await Moralis.Cloud.run("get_revoked_members_for_id", {orgaId:currentSelectedOrgaId});

    let added_members_minus_revoked_ones = get_added_members_minus_revoked_ones(addedMembers, revokedMembers);
    
    added_members_minus_revoked_ones.forEach(member => {
        // create tempRow
        let tableRow = document.createElement('tr');
        // add a column for each value
        let data = [
            member.attributes.addedMember
        ]
        data.forEach(element => {
            let newColumn = document.createElement('td');
            newColumn.innerHTML = element;
            tableRow.appendChild(newColumn);
        });
        // add button with an onclick listener and add it to a td element that will be add to tableRow
        let button = document.createElement('button');
        button.innerHTML = 'revoke';
        button.className = 'btn btn-warning';
        button.onclick = function () {
            revoke_member(currentSelectedOrgaId,member.attributes.addedMember);
        };
        let newColumn = document.createElement('td');
        newColumn.appendChild(button);
        tableRow.appendChild(newColumn);

        document.getElementById("members_of_my_organization").appendChild(tableRow);
    });
}

async function revoke_member(orgaId, member_address) {
    window.web3 = await Moralis.Web3.enable();
    let contractInstance = new web3.eth.Contract(window.membership_abi, window.membership_address);
    contractInstance.methods.revokeMember(orgaId, member_address).send({ from: currentUser.attributes.ethAddress })
    .on('receipt', function (receipt) {
        refresh_platform_statistics();
        display_my_organizations_details(orgaId);
    })
}

function on_click_button_back_to_my_organizations() {
    showElementById("my_organizations_all");
    hideElementById("my_organizations_details");
}

async function check_wallet() {
    
    removeRowsFromTable("checked_wallet_memberships");
    let checked_wallet = document.getElementById("checked_wallet").value;

    //2- fill table
    window.web3 = await Moralis.Web3.enable();
    let contractInstance = new web3.eth.Contract(window.membership_abi, window.membership_address);
    let memberships_orga_ids = await contractInstance.methods.memberOf(checked_wallet).call({ from: currentUser.attributes.ethAddress });

    //for each orgaId, acquire directly with the smart contract the description of the associated organization
    memberships_orga_ids.forEach(async element => {
        await contractInstance.methods._organizations(element).call({ from: currentUser.attributes.ethAddress })
            .then(receipt => {
                addRowToTable(
                    "checked_wallet_memberships",
                    [receipt.name, receipt.logoURI, receipt.certificationURI, receipt.membershipCriteria, receipt.canRevoke, receipt.revokationCriteria]
                );
            });
    });
    showElementById("check_wallet_after_button_click_only");
}

async function add_member() {
    let newMemberWallet = document.getElementById("new_member_wallet").value;
    window.web3 = await Moralis.Web3.enable();
    let contractInstance = new web3.eth.Contract(window.membership_abi, window.membership_address);

    contractInstance.methods.addMember(currentSelectedOrgaId, newMemberWallet).send({ from: currentUser.attributes.ethAddress })
        .then('receipt', function (receipt) {
            refresh_platform_statistics();
            display_my_organizations_details(currentSelectedOrgaId);
        });
}

async function check_organization() {
    removeRowsFromTable("checked_organization");
    removeRowsFromTable("orga_modifications_history");
    let checked_orga_id = document.getElementById("checked_orga_id").value;

    window.web3 = await Moralis.Web3.enable();
    let contractInstance = new web3.eth.Contract(window.membership_abi, window.membership_address);
    
    //get orga info to fill orga table
    await contractInstance.methods._organizations(checked_orga_id).call({ from: currentUser.attributes.ethAddress })
        .then(receipt => {
            addRowToTable(
                "checked_organization",
                [receipt.name, receipt.logoURI, receipt.certificationURI, receipt.membershipCriteria, receipt.canRevoke, receipt.revokationCriteria]
            );
        });
    
    //get orga item modifications info to fill modifications table
    let recorded_modifications = await Moralis.Cloud.run("get_organization_modifications_for_id", {orgaId:checked_orga_id});

    recorded_modifications.forEach((row) => {
        addRowToTable(
            "orga_modifications_history",
            [
                row.attributes.itemDesc,
                row.attributes.block_number,
                row.attributes.old,
                row.attributes.newValue
            ]
        );
    })

    showElementById("check_orga_after_button_click_only");

}

function hideElementById(elementId) {
    document.getElementById(elementId).style.display = "none";
}

function showElementById(elementId) {
    document.getElementById(elementId).style.display = "block";
}

async function edit_orga_name() {
    let newValue = document.getElementById("orga_name_edit").value;
    window.web3 = await Moralis.Web3.enable();
    let contractInstance = new web3.eth.Contract(window.membership_abi, window.membership_address);
    await contractInstance.methods.changeName(currentSelectedOrgaId, newValue).send({ from: currentUser.attributes.ethAddress })
        .then( () => {
            change_active_tab("tab_my_organizations");
        });
    
}

async function edit_orga_logo_uri() {
    let newValue = document.getElementById("orga_logo_uri_edit").value;
    window.web3 = await Moralis.Web3.enable();
    let contractInstance = new web3.eth.Contract(window.membership_abi, window.membership_address);
    await contractInstance.methods.changeLogoURI(currentSelectedOrgaId, newValue).send({ from: currentUser.attributes.ethAddress })
        .then( () => {
            change_active_tab("tab_my_organizations");
        });
}

async function edit_orga_certif_uri() {
    let newValue = document.getElementById("orga_certif_uri_edit").value;
    window.web3 = await Moralis.Web3.enable();
    let contractInstance = new web3.eth.Contract(window.membership_abi, window.membership_address);
    await contractInstance.methods.changeCertificationURI(currentSelectedOrgaId, newValue).send({ from: currentUser.attributes.ethAddress })
        .then( () => {
            change_active_tab("tab_my_organizations");
        });
}

async function edit_orga_membership_criteria() {
    let newValue = document.getElementById("orga_membership_criteria_edit").value;
    window.web3 = await Moralis.Web3.enable();
    let contractInstance = new web3.eth.Contract(window.membership_abi, window.membership_address);
    await contractInstance.methods.changeMembershipCriteria(currentSelectedOrgaId, newValue).send({ from: currentUser.attributes.ethAddress })
        .then( () => {
            change_active_tab("tab_my_organizations");
        });
}

async function edit_orga_revokation_criteria() {
    let newValue = document.getElementById("orga_revokation_criteria_edit").value;
    window.web3 = await Moralis.Web3.enable();
    let contractInstance = new web3.eth.Contract(window.membership_abi, window.membership_address);
    await contractInstance.methods.changeRevokationCriteria(currentSelectedOrgaId, newValue).send({ from: currentUser.attributes.ethAddress })
        .then( () => {
            change_active_tab("tab_my_organizations");
        });
}

document.getElementById("login_button").onclick = login;
document.getElementById("logout_button").onclick = logout;
document.getElementById("create_orga").onclick = function () { create_orga() };
document.getElementById("check_wallet").onclick = function () { check_wallet() };
document.getElementById("button_new_member").onclick = function () { add_member() };
document.getElementById("check_orga_id").onclick = function () { check_organization() };
document.getElementById("button_back_to_my_orgas").onclick = function () { on_click_button_back_to_my_organizations() };
document.getElementById("button_edit_name").onclick = function () { edit_orga_name() };
document.getElementById("button_edit_logo_uri").onclick = function () { edit_orga_logo_uri() };
document.getElementById("button_edit_certif_uri").onclick = function () { edit_orga_certif_uri() };
document.getElementById("button_edit_membership_criteria").onclick = function () { edit_orga_membership_criteria() };
document.getElementById("button_edit_revokation_criteria").onclick = function () { edit_orga_revokation_criteria() };

document.getElementById("title_tab_my_memberships").onclick = function () { change_active_tab("tab_my_memberships") };
document.getElementById("title_tab_my_organizations").onclick = function () { change_active_tab("tab_my_organizations") };
document.getElementById("title_tab_new_organization").onclick = function () { change_active_tab("tab_new_organization") };
document.getElementById("title_tab_check_wallet").onclick = function () { change_active_tab("tab_check_wallet") };
document.getElementById("title_tab_check_organization").onclick = function () { change_active_tab("tab_check_organization") };