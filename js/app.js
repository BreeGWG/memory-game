/*
 * Create a list that holds all of your cards
 */
 var mySymbols = ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"]; 
// Symbol is the font-awesome icon class name.
// I would list the types of cards. From that list of card types, I could create as many of each types that I would like to. 
// Each card has unique characteristics. The symbol and the front-facing color.
// In the array, I will list each unique symbol as a string.
// Using that array of symbols, I will create a list of cards. 

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
function createDeckOfCards(cardsArray){

    var deckOfCards = cardsArray.slice(0);
    deckOfCards = deckOfCards.concat(cardsArray.map(function (item){
        return item.cloneNode(true);
    }));
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

function deckEventListener(){
    var deck = document.getElementsByClassName("deck")[0];
    deck.addEventListener("click", turnOverCard, false);
}

function turnOverCard(elem){

    var target = elem.target;
    if (target.classList.contains("open")) {
        
        if (target.classList.contains("show")) {
            target.classList.remove("show", "open");
        }
        else {
            target.classList.remove("open");
        }
    }
    else {
        target.classList.add("show", "open");
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
    
    appendDecktoGrid(mySymbols);
    deckEventListener();
    
   
});