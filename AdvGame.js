/* Aniea Essien
* File: AdvGame.js
* ----------------
* This file defines the AdvGame class, which records the information
* necessary to play a game.
*/

/*
* Factory method: AdvGame
* Usage: let game = AdvGame();
* ----------------------------
* Creates an AdvGame object by reading data from the GameData element
* in the index.html file.
*/

function AdvGame() {
  let element = document.getElementById("GameData");
  if (element === undefined) return undefined;
  let rooms = readRooms(element);
  let currentRoom = rooms["START"];
  let game = { };
  let objLocations = [ ];
  let objNames = [ ];
  let objects = readObjects(element, objLocations, objNames);
  let playerInventory = [  ];
  initializeObjects();
  let synonyms = readSynonyms(element);

  /*
  * Method: play
  * Usage: game.play();
  * -------------------
  * Plays the Adventure game.
  */

  game.play = function() {
    chooseRoom();
  };

  /*Describes room player is in and allows input of next instructions*/
  function chooseRoom(){
    if (currentRoom.hasBeenVisited() === false){
      currentRoom.printLongDescription();
      currentRoom.describeObjects();
      currentRoom.setVisited(true);
    } else {
      currentRoom.printShortDescription();
      currentRoom.describeObjects();
    }
    console.requestInput(">", checkPassage);
  }

  /* Reads player input and sends to next room, responds to action commands to take or drop objects, answer inventory or help requests */
  function checkPassage(passage){
    passage = passage.toLowerCase();
    if (synonyms[passage] !== undefined){
      passage = synonyms[passage];
    }

    if (passage.indexOf(" ") !== -1){
      let parts = [ ];
      let space = passage.indexOf(" ");
      let command = passage.substring(0, space);
      if (synonyms[command] !== undefined){
        command = synonyms[command];
      }
      let object = passage.substring(space + 1);
      if (synonyms[object] !== undefined){
        object = synonyms[object];
      }
      parts.push(command);
      parts.push(object);
      let key = object.toUpperCase();
      let obj = objects[key];

      if (command === "take"){
        if (currentRoom.roomObjects.indexOf(obj) !== -1){
          take(obj, playerInventory, currentRoom);
        } else {
          console.log("Object not found.");
        }
      }
      if (command === "drop"){
        if (playerInventory.indexOf(obj) !== -1) {
          playerInventory = drop(obj, playerInventory, currentRoom);
        } else {
          console.log("Object not found.");
        }
      }
      console.requestInput(">", checkPassage);
    } else  if (passage === "inventory"){
      if (playerInventory[0] !== undefined ){
        inventory(playerInventory);
      } else {
        console.log("You are empty-handed.");
      }
      console.requestInput(">", checkPassage);
    } else if (passage === "help"){
      help();
      chooseRoom(currentRoom);
    } else if (passage === "quit"){
      quit();
    } else  if (passage === "look"){
      look(currentRoom);
      currentRoom.describeObjects();
      console.requestInput(">", checkPassage);
    } else {
      let nextRoomName = currentRoom.getNextRoom(passage, playerInventory);
      if (nextRoomName === undefined){
        console.log("I don't understand that response.");
      } else {
        if (nextRoomName === "EXIT") return;
        currentRoom = rooms[nextRoomName];

        let pass = currentRoom.getPassages();
        let isForced = pass[0];

        if (isForced.getDirection() === "forced"){
          currentRoom.printLongDescription();
          nextRoomName = isForced.getDestinationRoom();
          currentRoom = rooms[nextRoomName];
        }
      }
      chooseRoom(currentRoom);
    }
  }

  /*Places adventure items in their respective initial rooms*/
  function initializeObjects(){
    for (let i = 0; i < objNames.length; i++){
      let location = objLocations[i];
      let room = rooms[location];
      let obj = objNames[i];
      let object = objects[obj];
      if (room !== undefined){
        room.addObject(object);
      } else {
        playerInventory.push(object);
      }
    }
  }

  return game;

}

/*Stops player from inputing further commands*/
function quit(){
  return;
}

/*Reads player help script*/
function help(){
  for (let i = 0; i < HELP_TEXT.length; i++) {
    console.log(HELP_TEXT[i]);
  }
}

/*Describes player's surroundings*/
function look(currentRoom){
  currentRoom.printLongDescription();
}
/*Adds specified item to player inventory*/
function take(obj, playerInventory, currentRoom){
  playerInventory.push(obj);
  currentRoom.removeObject(obj);
  console.log("Taken.");
}

/*Drops selected item into current room*/
function drop(obj, playerInventory, currentRoom){
  let objIndex = playerInventory.indexOf(obj);
  let beginning = playerInventory.slice(0, objIndex);
  let end = playerInventory.slice(objIndex + 1, playerInventory.length);
  playerInventory = beginning.concat(end);
  currentRoom.addObject(obj);
  console.log("Dropped.")
  return playerInventory;
}

/*Tells player which items are in their posession*/
function inventory(playerInventory){
  for (let i = 0; i < playerInventory.length; i++){
    console.log("There is "+ playerInventory[i].getDescription() + " here.");
  }
}

/* Creates map of all possible synonyms for user input*/
function readSynonyms(element){
  let tags = element.getElementsByTagName("synonym");
  let synonyms = { };
  for (let i = 0; i < tags.length; i++){
    let synonymsXML = tags[i];
    let word = synonymsXML.getAttribute("word").toLowerCase();
    let definition = synonymsXML.getAttribute("definition").toLowerCase();
    synonyms[word] = definition;
  }
  return synonyms;
}


/*
* This constant defines the instructions for the adventure game
*/

const HELP_TEXT = [
  "Welcome to Adventure!",
  "Somewhere nearby is Colossal Cave, where others have found fortunes in",
  "treasure and gold, though it is rumored that some who enter are never",
  "seen again.  Magic is said to work in the cave.  I will be your eyes",
  "and hands.  Direct me with natural English commands; I don't understand",
  "all of the English language, but I do a pretty good job.",
  "",
  "It's important to remember that cave passages turn a lot, and that",
  "leaving a room to the north does not guarantee entering the next from",
  "the south, although it often works out that way.  You'd best make",
  "yourself a map as you go along.",
  "",
  "Much of my vocabulary describes places and is used to move you there.",
  "To move, try words like IN, OUT, EAST, WEST, NORTH, SOUTH, UP, or DOWN.",
  "I also know about a number of objects hidden within the cave which you",
  "can TAKE or DROP.  To see what objects you're carrying, say INVENTORY.",
  "To reprint the detailed description of where you are, say LOOK.  If you",
  "want to end your adventure, say QUIT."
];
