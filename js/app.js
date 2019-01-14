
//Creates an module using an IIFE that will prevent variables from populating the global space.
(function () {

    "use strict";


    // Create an object that contains game session properties.
    var session  = {

        mySymbols: ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"], //card symbols
        isPlaying: true, // enable or disable game play.
        maxChances: 5,  // max number of changes.
        maxTries:  5, // max number of tries left.
        numberOfFlips: 2, // number of flips per chance.
        gamerRating: 3, // Gamer ranking to start
        selectedCards: [], // cards flipped per given chance.
        playerMoves:  0,
        gameClock: 0,
        clockCounter: 0

    };

    session.maxNumberOfMoves = session.mySymbols.length;// max number of matches per given session. 

    /**
     * @description Create an HTMLCollection list representing game cards.
     * @param {string[]} symbols 
     * @returns {HTMLElement[]} An array of li elements.
     */
    function createCardList(symbols) {
        var listOfCards = [];
        //loop through each card and create its HTML  
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

    /**
     *@description Aggregates an array of cards to create a complete card deck. 
    *@param {HTMLElement[]} cardsArray
    *@returns {HTMLElement[]} An array of li elements.
    */
    function createDeckOfCards(cardsArray){

        var deckOfCards = cardsArray.slice(0);

        for (var i = 1; i < session.numberOfFlips; i++) {

            deckOfCards = deckOfCards.concat(cardsArray.map(function (item){
                return item.cloneNode(true);
            }));
            
        }
        return deckOfCards;
    }

    /**
     *@description Display the cards on the page by appending a deck of cards to a DOM element.
    *@param {string[]} symbols.
    */
    function appendDecktoGrid(symbols) {

        var set = createCardList(symbols);
        var pairs = createDeckOfCards(set);
        var shufflePairs = shuffle(pairs);
        var cardDeckHolder = document.getElementsByClassName("deck")[0];
        //add each card's HTML to the page
        for (var i = 0; i < shufflePairs.length; i++) {
            cardDeckHolder.appendChild(shufflePairs[i]);
        }

    }

    //
    /**
     * @description Shuffle any array of cards using the provided "shuffle" method below.
     * Shuffle function borrowed from http://stackoverflow.com/a/2450976
     * @param {HTMLElement[]} array
     * @returns {HTMLElement[]} A randomly arranged array of html li elements.
     */
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

    /**
     * @description Determines if selected ("clicked") cards results in a match.
     * @param {Event} event 
     */
    function matchIdentifier (event) {

        if (!session.isPlaying ) {
            //ignore card deck events when session is over.
            return;
        }

        if (event.target.classList.contains("card")) {
            //push selected card into an array used for comparision.
            session.selectedCards.push(typeOfCard(event.target));
            
            if (session.selectedCards.length === session.numberOfFlips) {
                verifyMatch(session.selectedCards.slice(0));
                session.selectedCards.length = 0;
            }
        }
        
    }

    /**
     * @description Returns the symbol element of a given card. 
     * @param {HTMLElement} card 
     * @return {HTMLElement} i
     */
    function typeOfCard (card) {

        return card.querySelector('i');

    }

    /**
     * @description Checks if a set of selected cards are matched. If not, then 
     * flip back cards and verifies the number of tries left.
     * @param {HTMLElement[]} selections 
     */
    function verifyMatch (selections) {

        if (!session.isPlaying) { //if game is over, do nothing.
            return;
        }

        var firstSelected = selections[0];

        for (var i = 1; i < selections.length; i++) {

            if (selections[i].className !== firstSelected.className) {
                //mismatch;
                flipBack(selections); //turn over mismatched cards
                verifyGameTries(false/*isMatch*/); //removes chance
                return;
            }

        }
        verifyGameTries(true/*isMatch*/); //checks # of chances left.

    }

    /**
     * @description Hides mismatched selected cards symbols. 
     * @param {HTMLElement[]} selections 
     */
    function flipBack (selections) {

        for (var i = 0; i < selections.length; i++) {

            selections[i].parentNode.classList.add("mismatch");

        }

        //Hides mismatched selected cards symbols after a brief pause
        setTimeout(function() { 
            for (var i = 0; i < selections.length; i++) {

                selections[i].parentNode.classList
                    .remove("open", "mismatch");
            }
        },1000);

    }

    /**
     * @description Determines if a gamer wins the game or looses a chance to win the game.
     * @param {boolean} isMatch 
     */
    function verifyGameTries (isMatch) {

        //Checks if player has any chances left.
        if (isMatch) {
            session.playerMoves++;
            //Max number of matches reached.
            if(session.playerMoves === session.maxNumberOfMoves) {

                session.isPlaying = false;
                if (confirm("You Win!\n\nYou time was: " + session.clockCounter +
                    " second(s)" + "\n\n Star Rating: " + session.gamerRating + "\n\nTry again?")) {
                    resetGame();
                }
            }
        }
        else {
            session.maxTries--; //decrement max number of tries.
            paintStatus(); //updates the view of game chances.
            if (session.maxTries === 0) {
                session.isPlaying = false;
                if (confirm("You loose!\n\nTry again?")) {
                    resetGame();
                }
            }
        }
    }

    /**
     * @description Resets game session properties back to default and sets
     *  a new card deck.
     */
    function resetGame () {
        // game session properties
        session.isPlaying = false;
        session.maxChances = 5;
        session.maxTries = 5;
        session.numberOfFlips = 2;
        session.gamerRanking = 3;
        session.selectedCards = [];
        session.playerMoves = 0;
        session.gameClock = 0;
        session.clockCounter = 0;

        //removes old cards
        Array.prototype.slice.call(document.querySelectorAll(".card"))
            .forEach(function (element){
                element.parentNode.removeChild(element);
            });

        //manageGameClock();
        paintStatus(); //display game status bar
        appendDecktoGrid(session.mySymbols); //display new card deck
        initialReveal(); //briefly reveal card deck.
    }

    function updateGameCounter () {
        if(session.isPlaying) {
            updateGameCounterView();
            if (session.clockCounter === 0) {
                //alert("Counter has started");                
            }
            session.clockCounter++;
        }
    }

    function updateGameCounterView () {
        document.querySelector(".timer").innerHTML = session.clockCounter;
    }

    /**
     * @description Creates a status bar that displays game chances.
     */
    function paintStatus() {
        var scorePanel = document.querySelector(".score-panel");
        var moves = scorePanel.querySelector(".moves");
        clearElement(moves);
        moves.appendChild(document.createTextNode(session.maxTries));
        updateGameCounterView();

        //<li><i class="fa fa-star"></i></li>
        var li = document.createElement("li");
        var i = document.createElement("i");
        var stars = scorePanel.querySelector(".stars");

        li.setAttribute("class", "status-symbol-holder");
        i.className = "fa fa-star";
        li.appendChild(i);

        clearElement(stars);

        manageStarRanking();
        for (var j = 0; j < session.gamerRating; j++) {
            stars.appendChild(li.cloneNode(true));
        }

        showPerformanceStars();
    }

    function showPerformanceStars() {
        var stars = document.getElementsByClassName("status-symbol-holder");

        for(var i = session.gamerRanking; 3 > i; i++) {
            stars[i].classList.add("hidden");

        }
    }

    /**
     * @description This functions manages click events on the game deck.
     */
    function deckEventListener() {
        var deck = document.querySelector(".deck");
        deck.addEventListener("click", turnOverCard, false);
        deck.addEventListener("click", matchIdentifier, false);
    }

    /**
     * @description Removes an html element from the DOM.
     * @param {HTMLElement} elem 
     */
    function clearElement(elem) {

        while (elem.firstChild){

            elem.firstChild.parentNode.removeChild(elem.firstChild);

        }

    }

    /**
     * @description Briefly reveals card symbols on the card deck. Restart the game clock.
     */
    function initialReveal() {

        showAllCards();

        setTimeout(function(){
            session.isPlaying = true;
            hideAllCards();
            //manageGameClock();
        }, 3000);
    }

    function manageStarRanking () {
        var percentage = (session.maxTries/session.maxChances)*100;
        switch (true) {
            case (percentage === 100)  :   {
                                                session.gamerRanking = 3;
                                            }
                                            break;
            case (percentage < 100 &&
                   percentage > 50)    :   {
                                                session.gamerRanking = 2; 
                                            }
                                            break;
            case (percentage < 50)    :   {
                                                session.gamerRanking = 1;
                                          }
        }
    }

    /**
     * @description Adds class to card that reveal card symbols. 
     */
    function showAllCards() {

        var deck = document.getElementsByClassName("card");

        for (var i = 0; i < deck.length; i++) {

            deck[i].classList.add("open");

        }

    }

    /**
     * @description Adds class to card that hides card symbols. 
     */
    function hideAllCards() {

        var deck = document.getElementsByClassName("card");

        for (var i = 0; i < deck.length; i++) {

            deck[i].classList.remove("open");

        }

    }

    /**
     * @description toggles card flips
     * @param {event} event 
     */
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
    *  - set up the event listener for a card. If a card is clicked:
    *  - display the card's symbol (put this functionality in another function that you call from this one)
    *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
    *  - if the list already has another card, check to see if the two cards match
    *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
    *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
    *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
    *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
    */

    /**
     * @description Initalizes game and adds gameboard event listeners
     */
    document.addEventListener("DOMContentLoaded", function (){     
        resetGame();
        deckEventListener();
        document.querySelector(".restart")
            .addEventListener("click", resetGame, false);
    });

    setInterval(function () {
        session.gameClock = session.gameClock + 1;
        updateGameCounter();
    }, 1000);

})();