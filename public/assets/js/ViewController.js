"use strict";
/* global surveyQuestions, surveyOptions */


class ViewController {

    constructor() {

        this.orderName = $("#orderName");
        this.orderCheckboxes = $('input[data-type=ingredient]');
        this.submitOrderBTN = $("#submitOrderBTN");

        this.assignListeners();
    }

    assignListeners() {

        this.orderName.focus();

        this.submitOrderBTN.on("click", (event) => {

            this.submitOrder(event);
        });
    }

    submitOrder(event) {

        const name = this.orderName.val().trim();

        const ingredientIDs = [];

        for (const checkbox of this.orderCheckboxes) {

            if ($(checkbox).prop("checked")) {

                const id = $(checkbox).attr("data-id").trim();

                ingredientIDs.push(parseInt(id));
            }
        }

        if (this.isInputValid(name, ingredientIDs)) {

            event.preventDefault();

            this.submitOrderBTN.off("click");

            const newBurger =
            {
                name: name,
                ingredientIDs: ingredientIDs
            };

            console.log(newBurger);

            // $.post("/api/friends", newBurger, (friendMatch) => {

            //     console.log(`Friend Match...\n   id    : ${friendMatch.id}\n   name  : ${friendMatch.name}\n   photo : ${friendMatch.photo}\n   scores: [${friendMatch.scores}]\n   match%: ${friendMatch.percentageMatch}\n\n`);

            //     this.showFriendMatchModal(friendMatch.name, friendMatch.photo, friendMatch.percentageMatch);

            //     this.clearInputFields();

            // }).fail((error) => {

            //     console.log(`${error.responseJSON.message}  ${error.responseJSON.reason}\n\n`);

            //     alert(`${error.responseJSON.message}  ${error.responseJSON.reason}\n\n`);

            // });
        }
        // else {

        //     alert("Invalid input: Unable to submit order!");
        // }
    }

    isInputValid(name, ingredientIDs) {

        if (typeof name !== 'string' || name.length === 0) {

            return false;
        }

        if (name.length > 100) {

            alert("Burger name is too long, please keep it to less than 100 characters.");
        }

        if (!Array.isArray(ingredientIDs) || ingredientIDs.length > this.orderCheckboxes.length) {

            return false;
        }

        for (const id of ingredientIDs) {

            if (typeof id !== 'number' || id <= 0 || id > this.orderCheckboxes.length) {

                return false;
            }
        }

        return true;
    }


    // submitSurvey(event) {

    //     const name = this.nameInputElement.val().trim();
    //     const photo = this.photoInputElement.val().trim();
    //     const scores = [];

    //     for (const selectElement of this.selectElements) {

    //         const score = selectElement.val().trim();

    //         scores.push(score);
    //     }

    //     if (this.isInputValid(name, photo, scores)) {

    //         event.preventDefault();

    //         const newFriend =
    //         {
    //             name: name,
    //             photo: photo,
    //             scores: scores
    //         };

    //         $.post("/api/friends", newFriend, (friendMatch) => {

    //             console.log(`Friend Match...\n   id    : ${friendMatch.id}\n   name  : ${friendMatch.name}\n   photo : ${friendMatch.photo}\n   scores: [${friendMatch.scores}]\n   match%: ${friendMatch.percentageMatch}\n\n`);

    //             this.showFriendMatchModal(friendMatch.name, friendMatch.photo, friendMatch.percentageMatch);

    //             this.clearInputFields();

    //         }).fail((error) => {

    //             console.log(`${error.responseJSON.message}  ${error.responseJSON.reason}\n\n`);

    //             alert(`${error.responseJSON.message}  ${error.responseJSON.reason}\n\n`);

    //         });
    //     }
    // }



    // clearInputFields() {

    //     this.nameInputElement.val("");

    //     this.photoInputElement.val("");

    //     for (const selectElement of this.selectElements) {

    //         selectElement.val("");
    //     }
    // }
} 
