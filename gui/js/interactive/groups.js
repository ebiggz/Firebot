const List = require('list.js');

// Group Modal
// This opens up the group modal.
function groupModal(){
    var dbGroup = new JsonDB("./user-settings/groups", true, true);

    // Clear saved settings
    $('.interactive-group-id').text('');
    $('#group-user-list .list').empty();

    // Set default variable for listjs
    var usernames = [];

    // Set options for the list.
    var options = {
        valueNames: [ 'username' ],
        page: 10,
        pagination: true,
        item: '<li class="group-item"><p class="username"></p><button class="btn btn-danger remove-group-user pull-right">X</button></li>'
    };

    // Initalize List
    var userList = new List('group-user-list', options, usernames);

    // Initialize Remove Button
    $('.remove-group-user').click(function() {
        removeGroupUsername(userList);
    });

    // Initialize Add Button
    $('.user-group-addition button').click(function() {
        addGroupUsername(userList);
    });

    // Save group modal on click.
    $( ".group-edit-save" ).click(function() {
        var groupName = $('.interactive-group-id').text();
        saveGroupUserlist(userList, groupName);
    });

    // Show modal
    $('#edit-group-modal').modal('toggle');
}

// Add New Group
// This button adds a new group to the app.
function refreshGroups(){

    // TODO: Clear groups in ui, then loop through json and add in all groups.

    var uniqueid = getUniqueId();

    var groupTemplate = `
        <div class="interactive-group-wrap col-sm-12 col-md-3 group${uniqueid}">
            <div class="interactive-groupheader">
            <div class="interactive-group-name pull-left">
                Unnamed
            </div>
            <div class="interactive-group-controls pull-right">
                <div class="edit-interactive-control">
                <button class="edit-group btn btn-default" group="${uniqueid}">
                    <i class="fa fa-pencil" aria-hidden="true"></i>
                </button>
                </div>
            </div>
            </div>
            <div class="interactive-group-main">
            <div class="description">
                Custom Userlist
            </div>
            </div>
        </div>
    `;

    // Throw it onto the page.
    $('.interactive-group-container').append(groupTemplate);

    // Edit group on click.
    $( ".edit-group" ).click(function() {
        var uniqueid = $(this).attr('group');
        editGroupModal(uniqueid);
    });
}

// Edit Group
// This function edits a group.
function editGroupModal(uniqueid){

}

// Add Username
// This adds a username to the current list.
function addGroupUsername(userList){
    var inputData = $('.user-group-addition input').val();
    var username = {username: inputData};

    // Clear Field
    $('.user-group-addition input').val('');

    // Add user to list and json.
    userList.add(username);
};

// Remove Username
// Removes a username from the list
function removeGroupUsername(userList){
    var username = $(this).closest('.group-item').find('.username').text();
    userList.remove('username', username);
};

// Save List
// Takes the entire finished list and saves it.
function saveGroupUserlist(userList, groupName){
    var dbGroup = new JsonDB("./user-settings/groups", true, true);
    var users = [];

    // Loop through final list.
    for(user of userList.items){
        users.push( user['_values'].username );
    }

    // Push to db
    dbGroup.push('./'+groupName+'/groupName', groupname);
    dbGroup.push('./'+groupName+'/users', users);
}

//////////////////////
// On Click Functions
/////////////////////

// Add in a new group on click.
$( ".add-group" ).click(function() {
    groupModal();
});