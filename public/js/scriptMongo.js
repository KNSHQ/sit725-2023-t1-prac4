// Function to add cards dynamically to the page
const addCards = (items) => {
    items.forEach(item => {
        let itemToAppend = `<div class="col s4 center-align">
                                <div class="card medium">
                                    <div class="card-image waves-effect waves-block waves-light">
                                        <img class="activator" src="${item.path}">
                                    </div>
                                    <div class="card-content">
                                        <span class="card-title activator grey-text text-darken-4">${item.title}<i class="material-icons right">more_vert</i></span>
                                        <p><a href="#"></a></p>
                                    </div>
                                    <div class="card-reveal">
                                        <span class="card-title grey-text text-darken-4">${item.subTitle}<i class="material-icons right">close</i></span>
                                        <p class="card-text">${item.description}</p>
                                    </div>
                                </div>
                            </div>`;
        $("#card-section").append(itemToAppend);
    });
};

// Function to handle form submission
const formSubmitted = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    let formData = {
        title: $('#title').val(),
        subTitle: $('#subTitle').val(),
        path: $('#path').val(),
        description: $('#description').val()
    };

    postCat(formData);
};

// Function to send a POST request to the server
function postCat(cat){
    $.ajax({
        url: '/api/cat',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(cat), // Ensure proper JSON formatting
        success: (result) => {
            if (result.statusCode === 201) {
                alert('Cat post successful');
                getAllCats(); // Refresh the list of cats
            }
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Error posting cat:', textStatus, errorThrown);
            alert('Error posting cat');
        }
    });
}

// Function to get all cats from the server
function getAllCats(){
    $.get('/api/cats', (response) => {
        if (response.statusCode === 200) {
            $("#card-section").empty(); // Clear existing cards
            addCards(response.data);
        }
    }).fail(function() {
        alert("Error fetching cats");
    });
}

// Document ready function
$(document).ready(function(){
    $('.materialboxed').materialbox(); // Initialize Materialize components
    $('#formSubmit').click(formSubmitted); // Attach event handler to the form submit button
    $('.modal').modal(); // Initialize modal
    getAllCats(); // Fetch and display all cats initially
});
