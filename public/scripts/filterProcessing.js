/*global $*/
/*global filters*/


//adding locker to avoid submitting mutiple requests until a response is returned
var processingReq = false;

//called upon clicking filter button to send async requests in order to update matches
function getFilteredData(){
    if(processingReq){
        return;
    } else {
        processingReq = true;
    }
    
    // create a FormData object which will be sent as the data payload in the AJAX request
    var formData = new FormData();
    
    filters.hasPhoto = $('#hasPhoto').is(":checked");
    filters.inContact = $('#inContact').is(":checked");
    filters.favourite = $('#favourite').is(":checked");

    // add current filters to formData object for the data payload
    formData = {
        'filters': filters
    };
    
    console.log(formData);

    $.ajax({
      url        : '/',
      type       : 'POST',
      data       : formData,
      dataType   : 'json', // what type of data we expect back from the server
      encode     : true,
      success: function(data){
          console.log('updated filters sent!\n');
          //console.log(data);
      }
    })
        .done(function(data) {    // using the done promise callback
            console.log("response data:");
            //console.log(data); 
            renderMatches(data.users);
            processingReq = false;
            // TODO handle errors and validation messages
        })
        .fail(function(data) {    // using the fail promise callback
            processingReq = false;
            
            // show any errors
            console.log(data);
        });
}

//TODO: DOM comparison
function renderMatches(filteredUsers){
    var newContent = '';
    for(var i=0; i<filteredUsers.length; i++){
        var imgSrc = '';
        if (filteredUsers[i].main_photo) {
            imgSrc = '<img src="' + filteredUsers[i].main_photo + '" class="img-responsive">';
        } else {
            imgSrc = '<img src="/images/no_photo.jpg" class="img-responsive">';
        }
        newContent += 
            '<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 profile">' +
                '<div class="thumbnail">' +
                    '<div class="img-box text-center">' +
                        imgSrc +
                        '<ul class="text-center">' +
                            '<a href="#"><li><i class="glyphicon glyphicon-user"></i></li></a>' +
                            '<a href="#"><li><i class="glyphicon glyphicon-heart"></i></li></a>' +
                            '<a href="#"><li><i class="glyphicon glyphicon-envelope"></i></li></a>' +
                        '</ul>' +
                    '</div>' +
                    '<h1>' + filteredUsers[i].display_name + ', ' + filteredUsers[i].age + '</h1>' +
                    '<h2>' + filteredUsers[i].religion + '</h2>' +
                    '<h2>' + filteredUsers[i].job_title + ' - ' + filteredUsers[i].city.name + '</h2>' +
                    '<p>Match: ' + filteredUsers[i].compatibility_score * 100 + '%</p>' +
                '</div>' +
            '</div>';
    }
    $('#usersContainer').html(newContent);
}