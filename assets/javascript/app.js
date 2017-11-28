// Initialize Firebase
//To play the game the browser has to open in order 
//because the connection breaks when it refreshes due to (set) method used in
//firebase the data was not saved.
var player1;
var player2;
var me = null;
var score1=0;
var score2=0;
var answer1= null;
var answer2= null;
//-------------------------------INITIALIZE FIREBASE-------------
$(document).ready(function(){
	var config = {
	apiKey: "AIzaSyC_Pzlo8rR8LlZfK0idMBlZdN3Q56dpzj0",
	authDomain: "multiplayer-rps-46546.firebaseapp.com",
	databaseURL: "https://multiplayer-rps-46546.firebaseio.com",
	projectId: "multiplayer-rps-46546",
	storageBucket: "",
	messagingSenderId: "362328088425"
	};

	firebase.initializeApp(config);

	var database = firebase.database();
	var chatRef = database.ref("/chat");
	chatRef.on("value", function(snapshot){
		$("#displayMessage").append("<div>"+snapshot.val()+"</div>");
	})
	var ourConnectionsRef= database.ref("/connections");
	var googleConnectedRef= database.ref(".info/connected"); 

	googleConnectedRef.on("value", function(snap){
	  	if(snap.val()){
	   	 	var con =ourConnectionsRef.push(true);
	    	con.onDisconnect().remove();
	  	}
	});

//-----------------------GETTING THE CONNECTIONS--------------------------------------	
	ourConnectionsRef.on("value", function(snap){
		console.log(snap.val());
//-------By just using snap by itself i'm getting an error but when you
//stringify and convert it back to an object it worked.
		var o=JSON.stringify(snap);
			o=JSON.parse(o);
//----------ln 44-45 not sure why I have to do this 
	    //console.log("--->"+ Object.keys(o)[0]);
	    var numConn = snap.numChildren();
	    // console.log("numconn" + numConn);
	     	if(numConn === 1) {
	     		player1 = Object.keys(o)[0];
	     		//console.log(player1);
	     		me = player1;
		     	$("#p1").text("Me");
		     	$("#p2").text("Opponent");
		     	$(".player1").mouseover(function(){
		     		$(this).css('cursor', 'pointer');
		     	});
		     	$("#rock_1").on("click", function(){
		     		var meRef= database.ref("/connections/"+me).set({
		     			answer: "rock"
		     		});
		     		$("#paper_1").hide();
		     		$("#scissors_1").hide();
		     	});
		     	$("#paper_1").on("click", function(){
		     		var meRef= database.ref("/connections/"+me).set({
		     			answer: "paper"
		     		});
		     		$("#rock_1").hide();
		     		$("#scissors_1").hide();
		     	});
		     	$("#scissors_1").on("click", function(){
		     		var meRef= database.ref("/connections/"+me).set({
		     			answer: "scissors"
		     		});
		     		$("#rock_1").hide();
		     		$("#paper_1").hide();
	     		});
//------------------------------chat app for player 1--------------------------------------
		     	// $("#submit").on("click", function(){
		     	// 	var message = $(".mess").val().trim();
		     	// 	//$("#displayMessage").append(message);
		     	// 	var meRef=database.ref("/connections/"+me).set({
		     	// 		message:message
		     	// 	});
		     	// 	database.ref("/connections/"+me).on("child_added", function(childSnapshot, prevChildKey){
		     	// 		console.log(childSnapshot.val().message);
		     	// 	})
		     	// 	// console.log(message);
		     	// });
//-----------------------------------------------------------------------------------------------
	     	//console.log(player1);
		    } else if(numConn === 2) {
		     	player2 = Object.keys(o)[1];
		     	if (me === null){
		     		me = player2;
		     		$("#p1").text("Opponent");
		     		$("#p2").text("Me");
		     		$(".player2").mouseover(function(){
			     		$(this).css('cursor', 'pointer');
			     	});
			     	$("#rock_2").on("click", function(){
			     		var meRef= database.ref("/connections/"+me).set({
			     			answer: "rock"
			     		});
			     		$("#paper_2").hide();
			     		$("#scissors_2").hide();
			     	});
			     	$("#paper_2").on("click", function(){
			     		var meRef= database.ref("/connections/"+me).set({
			     			answer: "paper"
			     		});
			     		$("#rock_2").hide();
			     		$("#scissors_2").hide();
			     	});
			     	$("#scissors_2").on("click", function(){
			     		var meRef= database.ref("/connections/"+me).set({
			     			answer: "scissors"
			     		});
			     		$("#rock_2").hide();
			     		$("#paper_2").hide();
			     	});
	//------------------------------chat app for player 2--------------------------------------
			     	// $("#submit").on("click", function(){
			     	// 	var message = $(".mess").val().trim();
			     	// 	var meRef=database.ref("/connections/"+me).set({
			     	// 		message:message
			     	// 	});
			     	// });
			    }// end of if(me===null)
	//--------------------------------------------------------------------------------------
	     	} else {
			     	if(me===null){
			     		$(".container").hide();
			     		alert("Too many players. Wait!");
				    }
	     	}
	});

//-------------------TO GET THE VALUE FROM DATABASE & TO SCORE PLAYERS-----------------------
	database.ref("/connections").on("value",function(snapshot){
		if (snapshot.exists()){
			//console.log(JSON.stringify(snapshot));
			console.log("------SNAP------");
			//console.log(snapshot.val());
			var ans =JSON.stringify(snapshot.val());
			ans=JSON.parse(ans);
			answer1 = ans[player1];
			answer2 = ans[player2];
			if((answer1!= null) &&(answer2!=null)){
				if(answer1.hasOwnProperty("answer") && (answer2.hasOwnProperty("answer"))){
					answer1 = ans[player1].answer;
					answer2 = ans[player2].answer;
					console.log(answer1);
					console.log(answer2);
				//---------------------------tie
					if (answer1 === answer2){
						//score ties += 1;
						console.log("tie!");
					} else if (answer1 ==="rock"&& answer2 ==="scissors"||answer1 ==="paper" && answer2==="rock" || answer1 ==="scissors" && answer2 ==="paper"){
						// score player1 +=
						score1 = score1 + 1;
						console.log("PLayer1 wins");
						//$("scoreboard").html("P1 scores: " + score1); 
					} else{
						// score player2 ++
						score2 = score2 + 1;
						console.log("PLayer2 wins");
						//$("scoreboard").html("P2 scores: " + score2);
					}
					var meRef= database.ref("/connections/"+player1).set({
		     			score: score1
		     		});
					var meRef= database.ref("/connections/"+player2).set({
		     			score: score2
		     		});
				}
				//still need code that updates database and updates scores and updates 
				//pictures too so both player can see the guessed answers
				//RESULTS ARE DISPLAYED ON THE CONSOLE.
			}
			// if ((answer1 != null) && (answer2 != null)){
			// 	console.log("check");
			// }
		}
	});
	$("#submit").on("click",function(){
		var msg = $(".mess").val().trim();
		if(me === player1){
			msg = "player1: " + msg;
		} else{
			msg = "player2: " + msg;
		}	
		var meRef= database.ref("/chat").set(msg);
		$(".mess").val("");
		
	});

 });



// $("#submit").on("click", function(){
	// 	var message = $(".mess").val().trim();
	// 	var meRef=database.ref("/connections/"+me).set({
	// 		message:message
	// 	});
	// });





// }); //document.ready (end)
// var wins = 0;
// var losses = 0;
// var ties = 0;
// var names = ["rock", "paper", "scissors"];
//user key converted to number: r=0, p=1, s=2
// // random number generated: 0, 1, 2
// function play(u) {
// 	var c = Math.floor(Math.random() * 3)
// 	// wins number
// 	// losses number
// 	if (c === u) {
// 		ties += 1;
// 		console.log("You Tied. You and the computer picked: " + names[u]);
// 	} else if (u === 0 && c === 2 || u === 1 && c === 0 || u === 2 && c === 1) {
// 		wins += 1;
// 		//console.log("You Win! You picked: " + names[u] + ", computer picked: " + names[c]);
// 	} else {
// 		losses += 1;
// 		//console.log("You Lost! You picked: " + names[u] + ", computer picked: " + names[c]);
// 	}
// 	document.getElementById("UserPick").textContent = names[u];
// 	document.getElementById("CompPick").textContent = names[c];
// 	document.getElementById("Wins").textContent = wins.toString();
// 	document.getElementById("Losses").textContent = losses.toString();
// 	document.getElementById("Ties").textContent = ties.toString();
// }

// document.onkeypress = function(event) {
// 	var key = event.keyCode;
// 	var cKey = String.fromCharCode(key).toLowerCase()
// 	switch(cKey) {
// 	    case "r":
// 	        play(0);
// 	        break;
// 	    case "p":
// 	        play(1);
// 	        break;
// 	    case "s":
// 	    	play(2);
// 	        break;
// 	     default:
// 	     	alert("Hey wrong key! Press (r p s) only.");
// 	}
// };

//--------------------------------chat application
