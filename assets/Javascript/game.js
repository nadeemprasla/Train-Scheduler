$(document).ready(function() {

        var firebaseConfig = {
            apiKey: "AIzaSyBcYbgX-_tAPjZnPnsNsrnzkOsS4YLaO1s",
            authDomain: "trainpredictionnp.firebaseapp.com",
            databaseURL: "https://trainpredictionnp.firebaseio.com",
            projectId: "trainpredictionnp",
            storageBucket: "trainpredictionnp.appspot.com",
            messagingSenderId: "995654151667",
            appId: "1:995654151667:web:6192e51140b197bd773686",
            measurementId: "G-0M21LJHX5X"
        };

        firebase.initializeApp(firebaseConfig);
        firebase.analytics();

        var database = firebase.database();


        $("#add-train-btn").on("click", function(event) {
            event.preventDefault();

            var trainInput = $("#train-name-input").val().trim();
            var destInput = $("#destination-input").val().trim();
            var firstInput = $("#first-input").val().trim();
            var freqInput = $("#frequency-input").val().trim();
            if (trainInput && destInput && firstInput && freqInput !== "") {
                if (firstInput < 2400) {

                    database.ref("/train").push({
                        name: trainInput,
                        destination: destInput,
                        firstStart: firstInput,
                        frequency: freqInput,
                    })
                    $("#train-name-input").val("");
                    $("#destination-input").val("");
                    $("#first-input").val("");
                    $("#frequency-input").val("");
                }
            }
        });

        database.ref("/train").on("child_added", function(snapshot) {
            var snap = snapshot.val();
            var tFrequency = snap.frequency;
            var firstTime = snap.firstStart;
            var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
            var currentTime = moment();
            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
            var tRemainder = diffTime % tFrequency;
            var tMinutesTillTrain = tFrequency - tRemainder;
            var nextTrain = moment().add(tMinutesTillTrain, "minutes");

            var trainRow = $("<tr>").addClass("trainRow");

            var colCreate = `<th class="${snapshot.key}" > ${snap.name}</th>
            <th class="${snapshot.key}" >${snap.destination}</th>
            <th class="${snapshot.key}" >${snap.frequency}</th>
            <th>${moment(nextTrain).format("hh:mm")}</th>
            <th>${tMinutesTillTrain}</th>`;

            trainRow.append(colCreate);
            $("#tableStart").append(trainRow);


        });

    },
    function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });