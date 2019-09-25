"use strict";


class ViewController {

    constructor() {

        this.orderName = $("#orderName");
        this.orderCheckboxes = $("input[data-type=ingredient]");
        this.submitOrderBTN = $("#submitOrderBTN");
        this.devourBTNs = $("div[data-type=devour]");

        for (const blah of this.devourBTNs) {

            console.log(blah.dataset.type);
            console.log(blah.dataset.id);
            console.log(blah.dataset.name);
        }


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

        if (this.isInputValid(name, ingredientIDs, event)) {

            event.preventDefault();

            this.clearInputFields();

            this.submitOrderBTN.off("click");

            const newBurger =
            {
                name,
                ingredientIDs: JSON.stringify(ingredientIDs) //JSON.stringify (client) then JSON.parse (server) allows empty arrays to be used for POST
            };

            $.post("/api/burgers", newBurger, () => {

                location.reload();

            }).fail((error) => {

                console.log(`${error.responseJSON.message}  ${error.responseJSON.reason}\n\n`);

                alert(`${error.responseJSON.message}  ${error.responseJSON.reason}\n\n`);
            });
        }
    }

    isInputValid(name, ingredientIDs, event) {

        if (typeof name !== "string" || name.length === 0) {

            return false;
        }

        if (name.length > 30) {

            event.preventDefault();

            alert("Burger name is too long, please keep it to at most 30 characters.");

            return false;
        }

        if (!Array.isArray(ingredientIDs) || ingredientIDs.length > this.orderCheckboxes.length) {

            return false;
        }

        for (const id of ingredientIDs) {

            if (typeof id !== "number" || id <= 0 || id > this.orderCheckboxes.length) {

                return false;
            }
        }

        return true;
    }

    clearInputFields() {

        this.orderName.val("");

        for (const checkbox of this.orderCheckboxes) {

            $(checkbox).prop("checked", false);
        }
    }
} 
