var callback_tree_data = "";
var payload_tree_data = "";
var process_new_callbacks = false;
var callback_tree = new Vue({
	el: '#callbacktree',
	data: {
		callback_tree_data,
        show_removed: false,
        show_strikethrough: false
	},
	delimiters: ['[[',']]']
});
var pload_tree = new Vue({
    el: '#payloadtree',
    data: {
        payload_tree_data,
        show_removed: false,
        show_strikethrough: false
    },
    delimiters: ['[[', ']]']
});
function startwebsocket_callbacks(){
	var ws = new WebSocket('{{ws}}://{{links.server_ip}}:{{links.server_port}}/ws/callbacks/current_operation');
	ws.onmessage = function(event){
		if(event.data != "" && process_new_callbacks){
			cdata = JSON.parse(event.data);
			//for now, when we get a new callback, just re call the tree function
			send_callback_tree_data();
		}
		else if(event.data == "" && process_new_callbacks == false){
		    process_new_callbacks = true;
		    send_callback_tree_data();
		}
	}
	ws.onclose = function(){}
	ws.onerror = function(){}
	ws.onopen = function(){}
}
function update_callback_tree(response){
	callback_tree_data = response;
	$( '#callbacktree' ).html(callback_tree_data);
}
function update_payload_tree(response){
    payload_tree_data = response;
    $( '#payloadtree' ).html(payload_tree_data);
}

function show_removed_button(){
    callback_tree.show_removed = !callback_tree.show_removed;
    send_callback_tree_data();
}
function show_removed_strike_button(){
    callback_tree.show_strikethrough = !callback_tree.show_strikethrough;
    send_callback_tree_data();
}
function show_removed_payload_button(){
    pload_tree.show_removed = !pload_tree.show_removed;
    send_pload_tree_data();
}
function show_removed_payload_strike_button(){
    pload_tree.show_strikethrough = !pload_tree.show_strikethrough;
    send_pload_tree_data();
}
function send_callback_tree_data(){
    if(callback_tree.show_removed || callback_tree.show_strikethrough){
        var data = {};
        data['inactive'] = callback_tree.show_removed;
        data['strikethrough'] = callback_tree.show_strikethrough;
        httpGetAsync("{{http}}://{{links.server_ip}}:{{links.server_port}}{{links.api_base}}/analytics/callback_tree", update_callback_tree, "POST", data);
    }
    else{
        httpGetAsync("{{http}}://{{links.server_ip}}:{{links.server_port}}{{links.api_base}}/analytics/callback_tree", update_callback_tree, "GET", null);
    }
}
function send_pload_tree_data(){
    if(pload_tree.show_removed || pload_tree.show_strikethrough){
        var data = {};
        data['inactive'] = pload_tree.show_removed;
        data['strikethrough'] = pload_tree.show_strikethrough;
        httpGetAsync("{{http}}://{{links.server_ip}}:{{links.server_port}}{{links.api_base}}/analytics/payload_tree", update_payload_tree, "POST", data);
    }
    else{
        httpGetAsync("{{http}}://{{links.server_ip}}:{{links.server_port}}{{links.api_base}}/analytics/payload_tree", update_payload_tree, "GET", null);
    }
}
var adjustCallbackRelationshipModal_Vue = new Vue({
    el: '#adjustCallbackRelationshipModal',
    data: {
        callbacks: [],
        parent: -1,
        child: -1
    },
    delimiters: ['[[',']]']
});
function adjust_callback_relationship_button(){
    httpGetAsync("{{http}}://{{links.server_ip}}:{{links.server_port}}{{links.api_base}}/callbacks/", list_possible_callbacks_callback, "GET", null);
    $( '#adjustCallbackRelationshipModal' ).modal('show');
    $( '#adjustCallbackRelationshipSubmit' ).unbind('click').click(function(){
        console.log(adjustCallbackRelationshipModal_Vue.parent);
        console.log(adjustCallbackRelationshipModal_Vue.child);
        httpGetAsync("{{http}}://{{links.server_ip}}:{{links.server_port}}{{links.api_base}}/callbacks/" + adjustCallbackRelationshipModal_Vue.child, relationship_adjust_callback, "PUT", {'parent': adjustCallbackRelationshipModal_Vue.parent});
    });
}
function list_possible_callbacks_callback(response){
    var data = JSON.parse(response);
    adjustCallbackRelationshipModal_Vue.callbacks = data;
    adjustCallbackRelationshipModal_Vue.child = adjustCallbackRelationshipModal_Vue.callbacks[0].id;
}
function relationship_adjust_callback(response){
    var data = JSON.parse(response);
    if(data['status'] == 'error'){
        alertTop("danger", data['error']);
    }
    else{
        alertTop("success", "Successfully edited callback relationship");
    }
}
startwebsocket_callbacks();
send_pload_tree_data();

