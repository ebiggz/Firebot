const JsonDB = require('node-json-db');
const mixerInteractive = require('./mixer-interactive.js');

// Cooldown Router
function cooldownRouter(mixerControls, mixerControl, firebot, control, callback){
    var cooldown = control.cooldown;
    var groupName = control.cooldownGroup;

    if(groupName !== undefined && groupName !== ""){
        // This button has a cooldown group... so it's time to cool them all down.
        var groupsJson = firebot.cooldownGroups[groupName];

        // This will error out if the cooldown group this button is assigned to no longer exists.
        try{
            var buttons = groupsJson.buttons;
            var cooldown = parseInt( groupsJson['length'] ) * 1000;

            // For each button in the cooldown group...
            groupCooldown(buttons, cooldown, firebot)
        }catch(err){
            // This cooldown group was deleted. Fix this control.
            var dbSettings = new JsonDB("./user-settings/settings", true, true);
            var gameName = dbSettings.getData('/interactive/lastBoard');
            var dbControls = new JsonDB("./user-settings/controls/"+gameName, true, true);
            dbControls.delete('./firebot/controls/'+control.controlId+'/cooldownGroup');

            // Let's check to see if this one button needs to cool down then...
            if (cooldown !== undefined && cooldown > 0){
                var cooldown = parseInt(control.cooldown) * 1000;
                mixerControl.setCooldown(cooldown);
            }
        }
        
    } else {
        // Button doesn't have a cooldown group, so let's just cool down this one button.

        // If cooldown is not listed or zero, then don't do anything.
        if (cooldown !== undefined && cooldown > 0){
            var cooldown = parseInt(control.cooldown) * 1000;
            mixerControl.setCooldown(cooldown);
        }
    }

    // Callback
    callback('finished');
}

// Group Cooldown
// Buttons should be an array of controlIDs that should be cooled down.
function groupCooldown(buttons, cooldown, firebot){
    
    // Loop through and find button to cool down.
    for(button of buttons){
        var buttonJson = firebot.controls[button];
        var scene = buttonJson.scene;
        mixerInteractive.returnButton(button, scene)
        .then((control) => {
            console.log('Cooling Down: '+ control.controlID);
            control.setCooldown(cooldown);
        })
    }
}

// Exports
exports.router = cooldownRouter;
exports.group = groupCooldown;