document.addEventListener('DOMContentLoaded', () => {
    
    document.querySelector('#newchannel').style.display = "none";    
    // Get user existing in local storage or display form to create new user.
    var username = localStorage.getItem('username');    
    if(username)
        handleLoggedUser(username);    
    else{        
        document.querySelector('#logout').style.display = "none";
        displayNewUserForm();
        username = localStorage.getItem('username');    
    }
    var channel = localStorage.getItem('channel');    
    if(channel)
        handleSelectedChannel(channel);

});
function handleLoggedUser(username){
    console.log(`Logged user ${username}.`);    
    document.querySelector('#newuser').style.display = "none";
    setDivMessage('#loginmessage', `Welcome <i>${username}</i>.`,"black");    
    document.querySelector('#logout').style.display = "inline";
    document.querySelector('#logout').onclick = () => {
        logoutUser(username);
    }
    displayChannelList();
}
function logoutUser(username) {
    console.log(`Logging out user ${username}.`);
    const request = new XMLHttpRequest();
    request.open('POST', '/logout');
    request.onload = () => {
        const data = JSON.parse(request.responseText);        
        if(data.success)
        {
            localStorage.removeItem('username');            
            location.reload();        
        }
        else{
            alert("Unable to logout right now. Try again later.");
        }
    }
    // Add data to send with request
    const data = new FormData();
    data.append('username', username);
    // Send request    ;
    request.send(data);
    return false;       
}
function displayNewUserForm(){
    document.querySelector('#newuser').style.display = "block";
    // Validate input text field
    document.querySelector('#newuser-submit').disabled = true;
    document.querySelector('#username').onkeyup = () => {
        if (document.querySelector('#username').value.length > 0)
            document.querySelector('#newuser-submit').disabled = false;
        else            
            document.querySelector('#newuser-submit').disabled = true;
    };

    // Create new user if the name is available
    document.querySelector('#newuser').onsubmit = () => {

        const name = document.querySelector('#username').value;
        registerNewUser(name);
    };    
}
function registerNewUser(name){
    // Initialize new request
    const request = new XMLHttpRequest();
    request.open('POST', '/register');                
    request.onload = () => {            
        const data = JSON.parse(request.responseText);                    
        if (data.success) {                                                
            localStorage.setItem('username', name);
            handleLoggedUser(name);                        
        }
        else {                
            setDivMessage('#loginmessage',`The name ${name} is already taken.`,"red");                
        }
    }
    // Add data to send with request
    const data = new FormData();
    data.append('username', name);
    // Send request
    request.send(data);
    return false;           
}
function setDivMessage(id, message, color){
    messageDiv = document.querySelector(id);
    messageDiv.innerHTML = message;
    messageDiv.style.color = color;
}

function displayChannelList(){
    // Initialize new request
    const h = document.createElement('h2'); 
    h.innerHTML = "Please select a channel or create your own.";
    document.querySelector('#channels').append(h);
    const ul = document.createElement('ul'); 
    ul.id = "channels-ul";
    document.querySelector('#channels').append(ul);      
    updateChannelList(); // Reads list of channels from server.
    displayNewChannelForm();

}
function updateChannelList(){
    const request = new XMLHttpRequest();    
    request.open('GET', '/channels');        
    // Callback function for when request completes
    request.onload = () => {                
        // Extract JSON data from request
        const data = JSON.parse(request.responseText);
        var channels = data.channels;
        if (channels.length > 0) {                
            // Remove previous list
            document.querySelector('#channels-ul').innerHTML = "";
            // List all channels                                                        
            channels.forEach(c => {
                const li = document.createElement('li');                
                li.innerHTML = `<a href="" id="${c}">#${c}</a>`;
                li.onclick = () => {
                    localStorage.setItem("channel",c)
                    handleSelectedChannel(c);
                }
                document.querySelector('#channels-ul').append(li);
            });
        }
        else {                
            channels.innerHTML = "There are no channels yet. Create one";
        }
        
    };
    // Send request
    request.send(null);    
    return false;  
}
function displayNewChannelForm(){
    document.querySelector('#newchannel').style.display = "block";
    // Validate input text field
    document.querySelector('#newchannel-submit').disabled = true;    
    document.querySelector('#channelname').onkeyup = () => {
        if (document.querySelector('#channelname').value.length > 0)
            document.querySelector('#newchannel-submit').disabled = false;
        else            
            document.querySelector('#newchannel-submit').disabled = true;
    };

    // Create new channel if the name is available
    document.querySelector('#newchannel').onsubmit = () => {

        const request = new XMLHttpRequest();
        const name = document.querySelector('#channelname').value;
        request.open('POST', '/createchannel');                
        request.onload = () => {            
            const data = JSON.parse(request.responseText);                    
            if (data.success) {                                                
                localStorage.setItem('channelname', name);
                channel = name;
                updateChannelList();
                document.querySelector('#channelname').value = '';
                handleSelectedChannel(name);    

            }
            else {                
                setDivMessage('#channelmessage', `The channel ${name} already exists.`, "red");                
            }
        }

        // Add data to send with request
        const data = new FormData();
        data.append('channelname', name);
        // Send request
        request.send(data);
        return false;       
    };    
}
function handleSelectedChannel(channelname){
    localStorage.setItem('channel', channelname);
    console.log(`Selected channel #${channelname}`);
}