/* Aniea Essien
* File: AdvRoom.js
* ----------------
* This file defines a class that models a single room in Adventure.
* Each room is characterized by the following properties:
*
* - The room name, which uniquely identifies the room
* - The short description
* - The multiline long description
* - The passage table specifying the exits and where they lead
* - A list of objects contained in the room
* - A flag indicating whether the room has been visited
*
* The XML format for a room is described in the assignment.
*/

"use strict";

// The definition of the AdvRoom class includes the header lines
// of the methods you need to implement, but not the actual code.

/*
* Factory method: AdvRoom
* Usage: let room = AdvRoom(name, shortDescription, longDescription, passages)
* ----------------------------------------------------------------------------
* Creates an AdvRoom object from the specified properties.
*/

function AdvRoom(name, shortDescription, longDescription, passages) {
  let room = { };
  let isVisited = false;
  room.roomObjects = [ ];

  /*
  * Method: getName
  * Usage: let name = room.getName();
  * ---------------------------------
  * Returns the name of the room.
  */

  room.getName = function() {
    return name;
  };

  room.getPassages = function(){
    return passages;
  }

  /*
  * Method: printShortDescription
  * Usage: room.printShortDescription();
  * ------------------------------------
  * Prints the short description of the room.  If no short description
  * exists, this method prints the long description.
  */

  room.printShortDescription = function() {
    for (let i = 0; i < shortDescription.length; i++) {
      console.log(shortDescription[i]);
    }
  };

  /*
  * Method: printLongDescription
  * Usage: room.printLongDescription();
  * -----------------------------------
  * Prints the long description of the room, which may consist of several
  * lines.
  */

  room.printLongDescription = function() {
    for (let i = 0; i < longDescription.length; i++) {
      console.log(longDescription[i]);
    }
  };

  /*
  * Method: getNextRoom
  * Usage: let nextRoomName = room.getNextRoom(dir);
  * ------------------------------------------------
  * Returns the name of the next room that comes from following the passage
  * in the indicated direction.  If no direction applies, this function
  * returns the constant undefined.
  */

  room.getNextRoom = function(dir, playerInventory) {
    for (let i = 0; i < passages.length; i++){
      if (passages[i].getDirection() === dir){
        let key = passages[i].getKey();
        if (key !== undefined){
          for (let j = 0; j < playerInventory.length; j++){
            let object = playerInventory[j];
            let name = object.getName().toLowerCase();
            if (name === key){
              return passages[i].getDestinationRoom();
            }
          }
        } else {
          return passages[i].getDestinationRoom();
        }
      }
    }
  };

  /*
  * Method: setVisited
  * Usage: room.setVisited(flag);
  * -----------------------------
  * Sets an internal flag in the room that determines whether it has been
  * visited.  The Boolean argument flag must be either true or false.
  */

  room.setVisited = function(flag) {
    isVisited = flag;
  };

  /*
  * Method: hasBeenVisited
  * Usage: if (room.hasBeenVisited()) . . .
  * ---------------------------------------
  * Returns true if the room has been visited, and false otherwise.
  */

  room.hasBeenVisited = function() {
    return isVisited;
  };

  /*
  * Method: describeObjects
  * Usage: room.describeObjects();
  * ------------------------------
  * Describes the objects that exist in the room.
  */

  room.describeObjects = function() {
    for(let i = 0; i < room.roomObjects.length; i++){
      let description = room.roomObjects[i].getDescription();
      console.log("There is " + description + " here.");
    }
  };

  /*
  * Method: addObject
  * Usage: room.addObject(obj);
  * ---------------------------
  * Adds the specified object to the list of objects in the room.
  */

  room.addObject = function(object) {
    room.roomObjects.push(object);
  };

  /*
  * Method: removeObject
  * Usage: room.removeObject(obj);
  * ------------------------------
  * Removes the specified object from the list of objects in the room.
  */

  room.removeObject = function(obj) {
    let objIndex = room.roomObjects.indexOf(obj);
    let beginning = room.roomObjects.slice(0, objIndex);
    let end = room.roomObjects.slice(objIndex+ 1, room.roomObjects.length);
    room.roomObjects = beginning.concat(end);
  };

  /*
  * Method: contains
  * Usage: if (room.contains(obj)) . . .
  * ------------------------------------
  * Returns true if the room contains the specified object.
  */

  room.contains = function(obj) {
    if (roomObjects.indexOf(obj) !== -1){
      return true;
    }
  };

  /*
  * Method: toString
  * Usage: (usually called implicitly)
  * ----------------------------------
  * Returns the string form of the AdvRoom.
  */

  room.toString = function() {
    return "<AdvRoom:" + name + ">";
  };
  return room;
}

/*
* Function: readRooms
* Usage: let rooms = readRooms(gameXML);
* --------------------------------------
* Creates a map for the rooms by reading all the room tags from the
* XML data for the game.  The keys in the map are the room names,
* and the values are the AdvRoom objects that contain the data for
* the corresponding room.  To ensure that the game starts with the
* first room in the XML data, the map also stores a reference to the
* first room under the name "START".
*/

/*Parses data structure for room information*/
function readRooms(gameXML) {
  let tags = gameXML.getElementsByTagName("room");
  let rooms = { };
  for (let i = 0; i < tags.length; i++) {
    let roomXML = tags[i];
    let name = roomXML.getAttribute("name");
    let short = roomXML.getAttribute("short");
    let longDescription = readLongDescription(roomXML);
    let shortDescription = readShortDescription(roomXML);
    let passages = readPassages(roomXML);
    let room = AdvRoom(name, shortDescription, longDescription, passages);
    if (i === 0) rooms["START"] = room;
    rooms[name] = room;
  }
  return rooms;
}

/*Parses data structure for long descriptions*/
function readLongDescription (roomXML) {
  let longDescription = [ ];
  let lines = roomXML.innerHTML.split("\n");
  if (lines[0] === "") lines.shift();
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line.startsWith("<")) {
      longDescription.push(line);
    }
  }
  return longDescription;
}

/*Parses data structure for short descriptions*/
function readShortDescription (roomXML) {
  let shortDescription = [ ];
  let lines = roomXML.innerHTML.split("\n");
  if (lines[0] === "") lines.shift();
  if (roomXML.getAttribute("short") !== null) {
    let shortName = roomXML.getAttribute("short");
    shortDescription.push(shortName);
  } else {
    shortDescription.push(readLongDescription(roomXML));
  }
  return shortDescription;
}

/*Parses data structure for passages*/
function readPassages(roomXML) {
  let passages = [ ];
  let tags = roomXML.getElementsByTagName("passage");
  for (let i = 0; i < tags.length; i++) {
    let passageXML = tags[i];
    let passage = readPassage(passageXML);
    passages.push(passage);

  }
  return passages;
}
