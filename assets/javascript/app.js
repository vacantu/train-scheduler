//$(document).ready(function () {
    
    const firebaseConfig = {
        apiKey: "AIzaSyBy_JKrHE0OhLK13PiWTTa_qSlps2oBKyg",
        authDomain: "ft-vcantu.firebaseapp.com",
        databaseURL: "https://ft-vcantu.firebaseio.com",
        projectId: "ft-vcantu",
        storageBucket: "ft-vcantu.appspot.com",
        messagingSenderId: "362903158601",
        appId: "1:362903158601:web:2ead65dc49172fbd6e2498",
        measurementId: "G-0Q5HC468C0"
      };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    
        var database = firebase.database();

$(document).ready(function() {
    
// Button listener for adding Trains
    $("#add-train-btn").on("click", function (e) {
        e.preventDefault();
    
        // Grabs user input from the form
        var trainName = $("#input-trainname").val().trim();
        var destination = $("#input-destination").val().trim();
        var firstTrain = $("#input-firstTrainTime").val().trim();
        var frequency = $("#input-frequency").val().trim();
        
// Creates "temporary" object to hold train data
        var newTrain = {
            name:  trainName,
            dest:  destination,
            start: firstTrain,
            frequency: frequency
        };

// Uploads train data to the database
        database.ref().push(newTrain);
// add a popup window that lasts only 5 secs.
        // alert("Train successfully added");

// Clears all input-boxes
        $("#input-trainname").val("");
        $("#input-destination").val("");
        $("#input-firstTrain").val("");
        $("#input-frequency").val("");
    });

// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
    database.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());

// Store everything into a variable.
        var trainName = childSnapshot.val().name;
        var destination = childSnapshot.val().dest;
        var firstTrain = childSnapshot.val().start;
        var frequency = childSnapshot.val().frequency;

// Convert first train to milisecondas
        var firstTrainMiliseconds = moment(firstTrain, 'HH:MM:SS').diff(moment().startOf('day'), 'seconds')*1000;
        console.log("First train miliseconds: ", firstTrainMiliseconds);
// Determine current time in miliseconds
        var nowMilliseconds = moment().unix();

// Calc next train departure
        let nextTrain = firstTrainMiliseconds + (frequency*1000);
        while (nextTrain < nowMilliseconds+ (frequency*1000)) {
            nextTrain = nextTrain + (frequency*1000);
        }

// Humanizes the next train vaue 
        nextTrain = moment(nextTrain).format("HH:MM:SS");
        // Create the new row
        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(firstTrain),
            $("<td>").text(frequency),
            $("<td id='nextTrain'>").text(nextTrain)
        );

        // Append the new row to the table
        $("#trains-table > tbody").append(newRow);
    });

// Displays and updates clock every second
var clockElement = document.getElementById( "clock" );  
var nextElement =   document.getElementById( "nextTrain" );

function updateClock ( clock ) {
        clock.innerHTML = new Date().toLocaleTimeString({hour12: true}); 
    }
    setInterval(function () {
        updateClock( clockElement );
    }, 1000); 
    

})