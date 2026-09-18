/* =========================================================
   CASOBE BEACH RESORT
   BOOKING SYSTEM
   ========================================================= */


/* =========================================================
   1. NORMAL ACCOMMODATION ROOM RATES
   ========================================================= */

const accommodationRates = {

    "Chairman's Cabin": 33000,
    "Cupola": 11600,
    "Apollo Aeropods": 15000,
    "Cocoons": 8400,
    "Beach Suite": 21600,
    "VIP Beach Suite": 30000,
    "Private Villa": 36000,
    "Villa for 15 Pax": 43000,
    "Villa for 22 Pax": 52000,
    "Villa for 30 Pax": 59000,
    "Villa for 38 Pax": 70000,
    "Crusoe Cabins": 17200

};


/* =========================================================
   2. OVERNIGHT GUEST FEES
   ---------------------------------------------------------
   IMPORTANT:
   These are temporary placeholders until you provide
   the official guest fee for each accommodation.

   The fee is:
   - Per paying guest
   - Per night
   - Guests below 7 are free
   ========================================================= */

const overnightGuestFees = {

    "Chairman's Cabin": 0,
    "Cupola": 0,
    "Apollo Aeropods": 0,
    "Cocoons": 0,
    "Beach Suite": 0,
    "VIP Beach Suite": 0,
    "Private Villa": 0,
    "Villa for 15 Pax": 0,
    "Villa for 22 Pax": 0,
    "Villa for 30 Pax": 0,
    "Villa for 38 Pax": 0,
    "Crusoe Cabins": 0

};


/* =========================================================
   3. DAY TOUR RATES
   ========================================================= */

const dayTourRates = {

    peak: {
        weekday: {
            adult: 1050,
            child: 525
        },

        weekend: {
            adult: 1200,
            child: 600
        }
    },


    offPeak: {
        weekday: {
            adult: 850,
            child: 425
        },

        weekend: {
            adult: 1000,
            child: 500
        }
    },


    regular: {
        weekday: {
            adult: 1000,
            child: 500
        },

        weekend: {
            adult: 1150,
            child: 575
        }
    },


    holiday: {
        weekday: {
            adult: 1100,
            child: 550
        },

        weekend: {
            adult: 1250,
            child: 625
        }
    }

};


/* =========================================================
   4. GET FORM ELEMENTS
   ========================================================= */

const bookingForm = document.getElementById("bookingForm");

const bookingType = document.getElementById("bookingType");

const overnightFields = document.getElementById("overnightFields");

const dayTourFields = document.getElementById("dayTourFields");

const room = document.getElementById("room");

const checkin = document.getElementById("checkin");

const checkout = document.getElementById("checkout");

const nights = document.getElementById("nights");

const payingGuests = document.getElementById("payingGuests");

const childrenUnder7 = document.getElementById("childrenUnder7");

const tourDate = document.getElementById("tourDate");

const tourAdults = document.getElementById("tourAdults");

const tourChildren = document.getElementById("tourChildren");

const tourInfants = document.getElementById("tourInfants");


/* =========================================================
   5. BOOK NOW BUTTONS FROM ROOMS PAGE
   ========================================================= */

const bookRoomButtons = document.querySelectorAll(".book-room-btn");

bookRoomButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const selectedRoom = button.dataset.room;

        window.location.href =
            "booking.html?room=" +
            encodeURIComponent(selectedRoom);

    });

});


/* =========================================================
   6. SHOW / HIDE BOOKING TYPE
   ========================================================= */

function updateBookingType() {

    if (!bookingType) {
        return;
    }


    if (bookingType.value === "overnight") {

        overnightFields.style.display = "block";

        dayTourFields.style.display = "none";

        setOvernightRequired(true);

        setDayTourRequired(false);

        calculateOvernight();


    } else if (bookingType.value === "day-tour") {

        overnightFields.style.display = "none";

        dayTourFields.style.display = "block";

        setOvernightRequired(false);

        setDayTourRequired(true);

        calculateDayTour();


    } else {

        overnightFields.style.display = "none";

        dayTourFields.style.display = "none";

        setOvernightRequired(false);

        setDayTourRequired(false);

        resetSummary();

    }

}


/* =========================================================
   7. REQUIRED FIELDS
   ========================================================= */

function setOvernightRequired(required) {

    if (checkin) {
        checkin.required = required;
    }

    if (checkout) {
        checkout.required = required;
    }

    if (room) {
        room.required = required;
    }

}


function setDayTourRequired(required) {

    if (tourDate) {
        tourDate.required = required;
    }

}


/* =========================================================
   8. CALCULATE NUMBER OF NIGHTS
   ========================================================= */

function calculateNights() {

    if (!checkin || !checkout || !nights) {
        return 0;
    }


    if (!checkin.value || !checkout.value) {

        nights.value = "";

        return 0;

    }


    const startDate = new Date(checkin.value);

    const endDate = new Date(checkout.value);


    const difference =
        endDate.getTime() - startDate.getTime();


    const calculatedNights =
        Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        );


    if (calculatedNights <= 0) {

        nights.value = "";

        return 0;

    }


    nights.value = calculatedNights;

    return calculatedNights;

}


/* =========================================================
   9. CALCULATE OVERNIGHT BOOKING
   ========================================================= */

function calculateOvernight() {

    if (!room) {
        return;
    }


    const selectedRoom = room.value;

    const numberOfNights = calculateNights();


    const numberOfPayingGuests =
        Number(payingGuests?.value) || 0;


    const numberOfChildren =
        Number(childrenUnder7?.value) || 0;


    if (!selectedRoom || numberOfNights <= 0) {

        updateOvernightSummary(
            selectedRoom,
            numberOfNights,
            numberOfPayingGuests,
            numberOfChildren,
            0
        );

        return;

    }


    const roomRate =
        accommodationRates[selectedRoom] || 0;


    const guestFee =
        overnightGuestFees[selectedRoom] || 0;


    /*
       Room cost
    */

    const roomTotal =
        roomRate * numberOfNights;


    /*
       Guest cost

       Only guests aged 7+ are charged.

       Children below 7 are NOT charged.
    */

    const guestTotal =
        numberOfPayingGuests *
        guestFee *
        numberOfNights;


    const total =
        roomTotal + guestTotal;


    updateOvernightSummary(
        selectedRoom,
        numberOfNights,
        numberOfPayingGuests,
        numberOfChildren,
        total
    );

}


/* =========================================================
   10. UPDATE OVERNIGHT SUMMARY
   ========================================================= */

function updateOvernightSummary(
    selectedRoom,
    numberOfNights,
    numberOfPayingGuests,
    numberOfChildren,
    total
) {

    const summaryBookingType =
        document.getElementById("summaryBookingType");

    const summaryRoom =
        document.getElementById("summaryRoom");

    const summaryDate =
        document.getElementById("summaryDate");

    const summaryCheckout =
        document.getElementById("summaryCheckout");

    const summaryNights =
        document.getElementById("summaryNights");

    const summaryPayingGuests =
        document.getElementById("summaryPayingGuests");

    const summaryChildren =
        document.getElementById("summaryChildren");

    const expectedAmount =
        document.getElementById("expectedAmount");


    if (summaryBookingType) {
        summaryBookingType.textContent =
            "Overnight Stay";
    }


    if (summaryRoom) {

        summaryRoom.textContent =
            selectedRoom || "-";

    }


    if (summaryDate) {

        summaryDate.textContent =
            formatDate(checkin?.value);

    }


    if (summaryCheckout) {

        summaryCheckout.textContent =
            formatDate(checkout?.value);

    }


    if (summaryNights) {

        summaryNights.textContent =
            numberOfNights || "-";

    }


    if (summaryPayingGuests) {

        summaryPayingGuests.textContent =
            numberOfPayingGuests;

    }


    if (summaryChildren) {

        summaryChildren.textContent =
            numberOfChildren;

    }


    if (expectedAmount) {

        expectedAmount.textContent =
            formatCurrency(total);

    }

}


/* =========================================================
   11. DETERMINE WEEKDAY OR WEEKEND
   ========================================================= */

function getDayType(dateString) {

    if (!dateString) {
        return null;
    }


    const date = new Date(dateString + "T00:00:00");

    const day = date.getDay();


    /*
       Sunday = 0
       Saturday = 6

       Therefore:
       Saturday/Sunday = weekend
       Monday-Friday = weekday
    */

    if (day === 0 || day === 6) {

        return "weekend";

    }


    return "weekday";

}


/* =========================================================
   12. DETERMINE DAY TOUR SEASON
   =========================================================

   IMPORTANT:
   The actual dates for Peak, Off-peak, Regular and Holiday
   should eventually come from the database/admin panel.

   For now, this function uses "regular" as the default.

   We will make the dates editable later.
   ========================================================= */

function getDayTourSeason(dateString) {

    /*
       Temporary default.
       
       Later:
       Admin will define season start/end dates.
    */

    return "regular";

}


/* =========================================================
   13. CALCULATE DAY TOUR
   ========================================================= */

function calculateDayTour() {

    if (!tourDate) {
        return;
    }


    const selectedDate =
        tourDate.value;


    const adults =
        Number(tourAdults?.value) || 0;


    const children =
        Number(tourChildren?.value) || 0;


    const infants =
        Number(tourInfants?.value) || 0;


    if (!selectedDate) {

        updateDayTourSummary(
            adults,
            children,
            infants,
            0
        );

        return;

    }


    const season =
        getDayTourSeason(selectedDate);


    const dayType =
        getDayType(selectedDate);


    const rates =
        dayTourRates[season][dayType];


    /*
       Adult entrance fees
    */

    const adultTotal =
        adults * rates.adult;


    /*
       Child entrance fees
    */

    const childTotal =
        children * rates.child;


    /*
       Infants are FREE.
    */

    const infantTotal = 0;


    const total =
        adultTotal +
        childTotal +
        infantTotal;


    updateDayTourSummary(
        adults,
        children,
        infants,
        total
    );

}


/* =========================================================
   14. UPDATE DAY TOUR SUMMARY
   ========================================================= */

function updateDayTourSummary(
    adults,
    children,
    infants,
    total
) {

    const summaryBookingType =
        document.getElementById("summaryBookingType");

    const summaryRoom =
        document.getElementById("summaryRoom");

    const summaryDate =
        document.getElementById("summaryDate");

    const summaryCheckout =
        document.getElementById("summaryCheckout");

    const summaryNights =
        document.getElementById("summaryNights");

    const summaryPayingGuests =
        document.getElementById("summaryPayingGuests");

    const summaryChildren =
        document.getElementById("summaryChildren");

    const expectedAmount =
        document.getElementById("expectedAmount");


    if (summaryBookingType) {

        summaryBookingType.textContent =
            "Day Tour";

    }


    if (summaryRoom) {

        summaryRoom.textContent =
            "Aquaria Water Park";

    }


    if (summaryDate) {

        summaryDate.textContent =
            formatDate(tourDate?.value);

    }


    if (summaryCheckout) {

        summaryCheckout.textContent =
            "-";

    }


    if (summaryNights) {

        summaryNights.textContent =
            "-";

    }


    if (summaryPayingGuests) {

        summaryPayingGuests.textContent =
            adults;

    }


    if (summaryChildren) {

        summaryChildren.textContent =
            children + infants;

    }


    if (expectedAmount) {

        expectedAmount.textContent =
            formatCurrency(total);

    }

}


/* =========================================================
   15. FORMAT DATE
   ========================================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }


    const date =
        new Date(dateString + "T00:00:00");


    if (isNaN(date.getTime())) {
        return "-";
    }


    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}


/* =========================================================
   16. FORMAT CURRENCY
   ========================================================= */

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-PH",
        {
            style: "currency",
            currency: "PHP"
        }
    ).format(amount || 0);

}


/* =========================================================
   17. RESET SUMMARY
   ========================================================= */

function resetSummary() {

    const summaryBookingType =
        document.getElementById("summaryBookingType");

    const summaryRoom =
        document.getElementById("summaryRoom");

    const summaryDate =
        document.getElementById("summaryDate");

    const summaryCheckout =
        document.getElementById("summaryCheckout");

    const summaryNights =
        document.getElementById("summaryNights");

    const summaryPayingGuests =
        document.getElementById("summaryPayingGuests");

    const summaryChildren =
        document.getElementById("summaryChildren");

    const expectedAmount =
        document.getElementById("expectedAmount");


    if (summaryBookingType) {
        summaryBookingType.textContent = "-";
    }

    if (summaryRoom) {
        summaryRoom.textContent = "-";
    }

    if (summaryDate) {
        summaryDate.textContent = "-";
    }

    if (summaryCheckout) {
        summaryCheckout.textContent = "-";
    }

    if (summaryNights) {
        summaryNights.textContent = "-";
    }

    if (summaryPayingGuests) {
        summaryPayingGuests.textContent = "0";
    }

    if (summaryChildren) {
        summaryChildren.textContent = "0";
    }

    if (expectedAmount) {
        expectedAmount.textContent = "₱0.00";
    }

}


/* =========================================================
   18. EVENT LISTENERS
   ========================================================= */


/*
   Booking type changes between:

   Overnight Stay
   and
   Day Tour
*/

if (bookingType) {

    bookingType.addEventListener(
        "change",
        updateBookingType
    );

}


/*
   Overnight fields
*/

if (room) {

    room.addEventListener(
        "change",
        calculateOvernight
    );

}


if (checkin) {

    checkin.addEventListener(
        "change",
        calculateOvernight
    );

}


if (checkout) {

    checkout.addEventListener(
        "change",
        calculateOvernight
    );

}


if (payingGuests) {

    payingGuests.addEventListener(
        "input",
        calculateOvernight
    );

}


if (childrenUnder7) {

    childrenUnder7.addEventListener(
        "input",
        calculateOvernight
    );

}


/*
   Day Tour fields
*/

if (tourDate) {

    tourDate.addEventListener(
        "change",
        calculateDayTour
    );

}


if (tourAdults) {

    tourAdults.addEventListener(
        "input",
        calculateDayTour
    );

}


if (tourChildren) {

    tourChildren.addEventListener(
        "input",
        calculateDayTour
    );

}


if (tourInfants) {

    tourInfants.addEventListener(
        "input",
        calculateDayTour
    );

}


/* =========================================================
   19. ROOM FROM "BOOK NOW" BUTTON
   ========================================================= */

function loadSelectedRoom() {

    if (!room) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const selectedRoom =
        params.get("room");


    if (selectedRoom) {

        room.value = selectedRoom;

        /*
           Automatically select Overnight Stay
           when coming from a room's Book Now button.
        */

        if (bookingType) {

            bookingType.value =
                "overnight";

            updateBookingType();

        }

    }

}


/* =========================================================
   20. FORM SUBMISSION
   ========================================================= */

if (bookingForm) {

    bookingForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            if (!bookingType.value) {

                alert(
                    "Please select a booking type."
                );

                return;

            }


            /*
               OVERNIGHT VALIDATION
            */

            if (
                bookingType.value ===
                "overnight"
            ) {

                const numberOfNights =
                    calculateNights();


                if (numberOfNights <= 0) {

                    alert(
                        "Please select a valid check-in and check-out date."
                    );

                    return;

                }


                if (!room.value) {

                    alert(
                        "Please select an accommodation."
                    );

                    return;

                }

            }


            /*
               DAY TOUR VALIDATION
            */

            if (
                bookingType.value ===
                "day-tour"
            ) {

                if (!tourDate.value) {

                    alert(
                        "Please select your Day Tour date."
                    );

                    return;

                }


                const adults =
                    Number(tourAdults.value) || 0;


                const children =
                    Number(tourChildren.value) || 0;


                const infants =
                    Number(tourInfants.value) || 0;


                const totalVisitors =
                    adults +
                    children +
                    infants;


                if (totalVisitors <= 0) {

                    alert(
                        "Please enter at least one Day Tour guest."
                    );

                    return;

                }

            }


            /*
               Generate a TEMPORARY reference code.

               IMPORTANT:
               The final official reference code will
               eventually be generated by Supabase/backend.
            */

            const referenceCode =
                generateTemporaryReference();


            alert(
                "Reservation submitted successfully!\n\n" +
                "Temporary Reference Code: " +
                referenceCode +
                "\n\n" +
                "The next stage will connect this booking to the database."
            );


            console.log(
                "Booking submitted:",
                {
                    bookingType:
                        bookingType.value,

                    referenceCode:
                        referenceCode,

                    firstName:
                        document.getElementById(
                            "firstName"
                        )?.value,

                    lastName:
                        document.getElementById(
                            "lastName"
                        )?.value,

                    email:
                        document.getElementById(
                            "email"
                        )?.value,

                    phone:
                        document.getElementById(
                            "phone"
                        )?.value
                }
            );

        }
    );

}


/* =========================================================
   21. TEMPORARY REFERENCE CODE
   ========================================================= */

function generateTemporaryReference() {

    const randomPart =
        Math.random()
            .toString(36)
            .substring(2, 7)
            .toUpperCase();


    return "CBR-2026-" + randomPart;

}


/* =========================================================
   22. INITIALIZE PAGE
   ========================================================= */

loadSelectedRoom();

updateBookingType();

// =================================
// CONTACT FORM
// =================================

const contactForm = document.getElementById("contactForm");

if (contactForm) {

contactForm.addEventListener("submit", function(event) {

event.preventDefault();

const name = document.getElementById("contactName").value;
const email = document.getElementById("contactEmail").value;
const subject = 

document.getElementById("contactSubject").value;
const message = document.getElementById("contactMessage").value;

if (!name || !email || !subject || !message) {
alert("Please fill in all required fields.");
return;
}

alert(
"Thank you, " + name +
"! Your message has been received."
);

contactForm.reset();
});
}
