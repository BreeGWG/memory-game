
//Creates an module using an IIFE that will prevent variables from populating the global space.
(function () {

    "use strict";


// Create an object that contains game session properties.
 var session  = {

    mySymbols: ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"], //card symbols
    isPlaying: true, // enable or disable game play.
    maxTries:  3, // max number of chances.
    numberOfFlips: 2, // number of flips per chance.
    selectedCards: [], // cards flipped per given chance.
    playerMoves:  0

 };

 session.maxNumberOfMoves = session.mySymbols.length;// max number of matches per given session. 

/**
 * @description Create an HTMLCollection list representing game cards.
 * @param {string[]} symbols 
 * @returns {HTMLElement[]} An array of li elements.
 */
function createCardList(symbols) {
    var listOfCards = [];

    for (var i = 0; i < symbols.length; i++) {
        var card = document.createElement("li"),
            cardSymbol = document.createElement("i");

        card.setAttribute("class", "card");
        cardSymbol.setAttribute("class", "fa fa-" + symbols[i]);
        card.appendChild(cardSymbol);
        listOfCards.push(card); //card deck will consist of li's.
    }
    return listOfCards;
}

// Function creates a cloned a list of cards and merges it with the original card list. 
/**
 * 
 * @param {HTMLCollection} cardsArray 
 */

function createDeckOfCards(cardsArray){

    var deckOfCards = cardsArray.slice(0);

    for (var i = 1; i < session.numberOfFlips; i++) {

        deckOfCards = deckOfCards.concat(cardsArray.map(function (item){
            return item.cloneNode(true);
        }));
        
    }
    
    return (deckOfCards);
}

function appendDecktoGrid(symbols) {

    var set = createCardList(symbols);
    var pairs = createDeckOfCards(set);
    var shufflePairs = shuffle(pairs); 
    var cardDeckHolder = document.getElementsByClassName("deck")[0];
    
    for (var i = 0; i < shufflePairs.length; i++) {
        
        cardDeckHolder.appendChild(shufflePairs[i]);
    }

}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function clickCounter (event) {
    if (!session.isPlaying) {
        return;
    }

    if (event.target.classList.contains("card")) {

        session.selectedCards.push(typeOfCard(event.target));
        
        if (session.selectedCards.length === session.numberOfFlips) {
            verifyMatch(session.selectedCards.slice(0));
            session.selectedCards.length = 0;
        }
    }
    
}

/**
 * 
 * @param {HTMLElement} card 
 */
function typeOfCard (card) {

    return card.querySelector('i');

}

/**
 * 
 * @param {HTMLElement[]} selection 
 */
function verifyMatch (selection) {
console.log(selection);
    if (!session.isPlaying) {
        return;
    }

    var firstSelected = selection[0];

    for (var i = 1; i < selection.length; i++) {

        if (selection[i].className !== firstSelected.className) {
            //mismatch;
            flipBack(selection);
            
            verifyGameTries(false/*isMatch*/);
            return;
        }

    }
    verifyGameTries(true/*isMatch*/);
    
}

/**
 * 
 * @param {HTMLElement[]} selection 
 */
function flipBack (selection) {

    for (var i = 0; i < selection.length; i++) {

        selection[i].parentNode.classList.add("mismatch");

    }

    setTimeout(function() {
        for (var i = 0; i < selection.length; i++) {

            selection[i].parentNode.classList
                .remove("open", "mismatch");

        }
    },1000);
    
   
}

/**
 * 
 * @param {boolean} isMatch 
 */
function verifyGameTries (isMatch) {

    session.playerMoves++;

    if (isMatch) {
         if( session.playerMoves === session.maxNumberOfMoves) {
            
            session.isPlaying = false;
            if (confirm("You Win!\n\nTry again?")) {
                resetGame();
            } 
         }
    }
    else {
        session.maxTries--; //decrement max number of tries.
        paintStatus();
        if (session.maxTries === 0) {
            session.isPlaying = false;
            if (confirm("You loose!\n\nTry again?")) {
                resetGame();
            } 

        }
    }

}

function resetGame () {

    session.isPlaying = true;
    session.maxTries = 3;
    session.numberOfFlips = 2;
    session.selectedCards = [];
    session.playerMoves = 0;

   Array.prototype.slice.call(document.querySelectorAll(".card"))
    .forEach(function (element) {
        element.parentNode.removeChild(element);
    });

    paintStatus();
    appendDecktoGrid(session.mySymbols);
    initialReveal();
}

function paintStatus() {
    var scorePanel = document.querySelector(".score-panel");
    var moves = scorePanel.querySelector(".moves");
    clearElement(moves);
    moves.appendChild(document.createTextNode(session.maxTries)); 

    //<li><i class="fa fa-star"></i></li>
    var li = document.createElement("li");
    var i = document.createElement("i");
    i.className = "fa fa-star";
    li.appendChild(i);

    var stars = scorePanel.querySelector(".stars");
    clearElement(stars);

    for (var j = 0; j < session.maxTries; j++) {
        stars.appendChild(li.cloneNode(true));
    }

}

function deckEventListener() {
    var deck = document.querySelector(".deck");
    deck.addEventListener("click", turnOverCard, false);
    deck.addEventListener("click", clickCounter, false);
}

/**
 * 
 * @param {HTMLElement} elem 
 */
function clearElement(elem) {

    while (elem.firstChild){

        elem.firstChild.parentNode.removeChild(elem.firstChild);

    }

}

function initialReveal() {

    showAllCards();
   
    setTimeout(function(){
        
        hideAllCards();
    
    }, 3000);
    
}

function showAllCards() {

    var deck = document.getElementsByClassName("card");

    for (var i = 0; i < deck.length; i++) {

        deck[i].classList.add("open");
        
    }

}

function hideAllCards() {

    var deck = document.getElementsByClassName("card");

    for (var i = 0; i < deck.length; i++) {

        deck[i].classList.remove("open");
        
    }


}


function turnOverCard(event){

    if (!session.isPlaying) {
        return;
    }
    
    if (event.target.classList.contains("open")) {
        event.target.classList.remove("open");
    }
    else {
        event.target.classList.add("open");
    }
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

document.addEventListener("DOMContentLoaded", function (){
    
    resetGame();
    deckEventListener();
    document.querySelector(".restart")
        .addEventListener("click", resetGame, false);
    
   
});
})(); 