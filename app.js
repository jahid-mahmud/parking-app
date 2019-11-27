var gatemanTab = document.getElementById("gatemanTab");
var adminTab = document.getElementById("adminTab");
var tableTab = document.getElementById("tableTab");
var addSlotButton = document.getElementById("addSlotButton");
var AddSlotModal = document.getElementById("AddSlotModal");
var closeAddSlotModal = document.getElementById("closeAddSlotModal");
var slotNumber = document.getElementById("slotNumber");
var rate = document.getElementById("rate");
var saveNewSlotButton = document.getElementById("saveNewSlotButton");
var saveEditedSlotButton = document.getElementById("saveEditedSlotButton");
var bookSlotModal = document.getElementById("bookSlotModal");
var closebookSlotModal = document.getElementById("closebookSlotModal");
var carNumber = document.getElementById("carNumber");
var reportModal = document.getElementById("reportModal");
var closeReportModal = document.getElementById("closeReportModal");
let table = document.querySelector("table");
var editSlotModal = document.getElementById("editSlotModal");
var closeEditSlotModal = document.getElementById("closeEditSlotModal");
var editSlotNumber = document.getElementById("editSlotNumber");
var editRate = document.getElementById("editRate");
var infodiv = document.getElementById("infoDiv");
var slots = [];
var index;
var slot;
var bookingIndex;
var pagenumber;
let tableHeaders = ["SLOT ID", "CAR NUMBER", "CHECKED IN", "CHECKED OUT", "TOTAL INCOME"];
var bookings = []

//invoke-function for rendering table view while loading the app
$(function() {
    gotoTableTab()

})

//is called for gateman
function gotoGateManTab() {
    gatemanTab.style.display = "initial";
    adminTab.style.display = "none";
    tableTab.style.display = "none";
    showGateManView();
}

//is called for admin
function gotoAdminTab() {
    gatemanTab.style.display = "none";
    adminTab.style.display = "initial";
    tableTab.style.display = "none";
    showAdminView()
}

//is called for table content
function gotoTableTab() {
    gatemanTab.style.display = "none";
    adminTab.style.display = "none";
    tableTab.style.display = "initial";
    showTable()
}

//generates admin view
function showAdminView() {
    viewFacilties.adminView()
}

//modal for adding new slot
function opneAddSlotModal() {
    addSlotButton.style.display = "none";
    AddSlotModal.style.display = "block";
    saveNewSlotButton.style.display = "initial";
}

//closes adding modal
closeAddSlotModal.onclick = function() {
    AddSlotModal.style.display = "none";
    addSlotButton.style.display = "block";
}

//closes booking slot modal
closebookSlotModal.onclick = function() {
    bookSlotModal.style.display = "none";
}

//closes report modal
closeReportModal.onclick = function() {
    reportModal.style.display = "none";
}

//closes slot editing modal
closeEditSlotModal.onclick = function() {
    editSlotModal.style.display = "none"
    addSlotButton.style.display = "block";
}

//saves newly created modal 
function addNewSlot() {
    adminResponsibilities.saveNewSlot()
}

//delete a slot 
function deleteSlot(event) {
    index = parseInt(event.target.dataset.index);
    adminResponsibilities.deleteASlot(index)
}

//edit a slot
function editSlot(event) {
    slot = JSON.parse(event.target.dataset.slot);
    index = parseInt(event.target.dataset.index);
    addSlotButton.style.display = "none";
    editSlotModal.style.display = "block"
    editSlotNumber.value = slot.slotId
    editRate.value = slot.slotRate
}

//saves edited slot
function saveEditedSlot() {
    adminResponsibilities.editASlot(index)
    AddSlotModal.style.display = "none";
    addSlotButton.style.display = "block";
    viewFacilties.adminView()
}

//closes opened modal
function discard() {
    closeAddSlotModal.onclick()
    closeEditSlotModal.onclick();
    closebookSlotModal.onclick()
}

//generates gateman view
function showGateManView() {
    viewFacilties.gateManView()
}

//opens booking modal while gateman try to book a slot
function bookSlot(event) {
    bookSlotModal.style.display = "block";
    bookingIndex = parseInt(event.target.dataset.index)
    slot = JSON.parse(event.target.dataset.lot);
}

//books a slot with car number and time
function saveBookedSlot() {
    gateManResponsibilities.bookASlot(bookingIndex, slot)
}

//called when checks out and generates report
function deBookSlot(event) {
    bookingIndex = parseInt(event.target.dataset.index)
    slot = JSON.parse(event.target.dataset.lot);
    gateManResponsibilities.debookASlot(bookingIndex, slot)
    viewFacilties.gateManView()
}

//generating table view
function showTable() {
    pagenumber = 1;
    tableComponents.generateTable()
}

//goes to the next page
function next() {
    tableComponents.goNext();
}

//goes to the previous page
function prev() {
    tableComponents.goPrev();
}

//filter the table with a search value
function filter() {
    var searchKey = document.getElementById("searchKey").value
    tableComponents.searchList(searchKey)
}


//generates admin view and gateman view
var viewFacilties = (function() {
    var slots = [];  
    var gateManView = function() {
        var hour;
        var minutes
        var strSlot 
        var text=""
        if ("slots" in localStorage) {
            slots = [...JSON.parse(localStorage.getItem("slots"))]
        }

        text = '<div class="grid-container">'
        slots.map((slot, index) => {
            hour= new Date(slot.date).getHours()
            if (hour > 12) {
                hour = hour - 12;
                 minutes = new Date(slot.date).getMinutes()
                if (minutes < 10) {
                    minutes = "0" + minutes + " PM"
                } else {
                    minutes = minutes + " PM"
                }

            } else {
                minutes = new Date(slot.date).getMinutes()
                minutes = minutes + " AM"
            }


            strSlot = JSON.stringify(slot);
            if (!slot.isBooked) {
                text +=
                    `
                    <div class="grid-item">
                      <div style="margin:10px">
                            <span>Slot Number:${slot.slotId}</span>
                      </div>
                      <div style="margin:10px">
                            <span>Slot Rate:${slot.slotRate} Per Hour</span>
                      </div>
                      <button class="btn primary" style="float: left;margin-top:40px" id="deleteSlot" onclick="bookSlot(event) " data-index=${index} data-lot='${strSlot}'>BOOK</button>
                    </div>
                `
            } else {
                text +=
                    `
                    <div class="grid-item">
                      <div style="margin:10px">
                            <span>Slot Number:${slot.slotId}</span>
                      </div>
                      <div style="margin:10px">
                            <span>Car Number:${slot.carNumber} </span>
                      </div>
                      <div style="margin:10px">
                            <span>Parked At :  ${hour} : ${minutes} </span>
                      </div>
                      <button class="btn danger" style="float: left;margin-top:12px" id="deleteSlot" onclick="deBookSlot(event)" data-index=${index} data-lot='${strSlot}'>DE-BOOK</button>
                    </div>
                `

            }

        })
        text += '</div>'

        document.getElementById("allSlotsForGateMan").innerHTML = text
    }

    var adminView = function() {
        var strSlot
        var text =""
        if ("slots" in localStorage) {
            slots = [...JSON.parse(localStorage.getItem("slots"))]
        }

        text = '<div class="grid-container4" >'
        slots.map((slot, index) => {
            strSlot = JSON.stringify(slot);
            text +=
                `
                    <div class="grid-item3" id="${slot.slotId}" onmousedown=" makedroppable(event)" data-divid=${slot.slotId} >
                      <div style="margin:10px">
                            <span>Slot Number:${slot.slotId}</span>
                      </div>
                      <div style="margin:10px">
                            <span>Slot Rate:${slot.slotRate} Per Hour</span>
                      </div>
                      <button class="btn danger" style="float: left;" id="deleteSlot" onclick="deleteSlot(event)" data-slot=${strSlot} data-index=${index}>DELETE</button>
                      <button class="btn warn" id="editSlot" style="float: right;" data-slot=${strSlot} data-index=${index}
                      onclick="editSlot(event)">EDIT</button>
                    </div>
                `
        })
        text += '</div>'

        document.getElementById("allSlotsForAdmin").innerHTML = text

    }


    return {
        gateManView: gateManView,
        adminView: adminView
    };
})();

//responsibilities of an admin like creating or editing or deleting a slot
var adminResponsibilities = (function() {
    var slots = [];
    if ("slots" in localStorage) {
        slots = [...JSON.parse(localStorage.getItem("slots"))]
    }

    //eavluates new created slot and saves to the storage
    var saveNewSlot = function() {
        var taken = false;
        var newObj={}
        var slotnumber = slotNumber.value;
        var slotrate = rate.value;
        if (isNaN(slotnumber) || slotnumber < 1 || slotnumber > 200) {
            // debugger;
            // var popup = document.getElementById("myPopup");
            // popup.classList.toggle("show");
            slotNumber.value="ID IS NOT CORRECT"
            slotNumber.style.backgroundColor="#e88282"
            setTimeout(function() { slotNumber.style.backgroundColor="#ffffff";slotNumber.value = "";slotNumber.focus()}, 1000);          
            return;
        }

        if (isNaN(slotrate) || slotrate == "") {
            rate.style.backgroundColor="#e88282"
            rate.value="RATE IS EITHER NOT A NUMBER OR EMPTY"
            setTimeout(function() { rate.style.backgroundColor="#ffffff" ; rate.value = "" ;rate.focus()}, 1000);           
            return;
        }

        slots.forEach(slt => {
            if (slt.slotId == slotnumber) {
                taken = true
            }
        })
        
        if (taken) {
            slotNumber.style.backgroundColor="#e88282"
            slotNumber.value="ID ALREADY TAKEN"
            setTimeout(function() { slotNumber.style.backgroundColor="#ffffff";slotNumber.value = "";slotNumber.focus() }, 1000);
            
            return
        }
         newObj = {
            slotId: slotNumber.value,
            slotRate: rate.value,
            carNumber: "",
            date: "",
            hour: "",
            minutes: "",
            isBooked: false,
        }

        slots.push(newObj);
        localStorage.setItem("slots", JSON.stringify(slots));
        AddSlotModal.style.display = "none";
        addSlotButton.style.display = "block";
        slotNumber.value = "",
            rate.value = "",
            closeAddSlotModal.onclick()
        viewFacilties.adminView()
    }

    //deletes a particular slot
    var deleteASlot = function(index) {
        slots.splice(index, 1);
        localStorage.setItem("slots", JSON.stringify(slots));
        viewFacilties.adminView()
    }

    //eavluates edited and saves to the storage
    var editASlot = function(index) {
        var taken = false;
        var editNumber = editSlotNumber.value;
        var edtRate = editRate.value;
        if (isNaN(editNumber) || editNumber < 1 || editNumber > 200) {
            editSlotNumber.style.backgroundColor="#e88282"
            editSlotNumber.value="ID IS INVALID"
            setTimeout(function() { editSlotNumber.style.backgroundColor="#ffffff";editSlotNumber.value = "";editSlotNumber.focus() }, 1000);
            return;
        }
        if (isNaN(edtRate) || edtRate == "") {
            editRate.style.backgroundColor="#e88282"
            editRate.value="ID IS INVALID"
            setTimeout(function() { editRate.style.backgroundColor="#ffffff";editRate.value = "";editRate.focus() }, 1000);
            return;
        }
        slots.forEach(slot => {
            if (slot.slotId == editNumber) {
                taken = true
            }
        })
        if (slot.slotId == editNumber) {
            taken = false
        }
        if (taken) {
            editSlotNumber.style.backgroundColor="#e88282"
            editSlotNumber.value="ID IS ALREADY TAKEN"
            setTimeout(function() { editSlotNumber.style.backgroundColor="#ffffff";editSlotNumber.value = ""; editSlotNumber.focus()}, 1000);
            return;
        }
        slots[index].slotId = editSlotNumber.value;
        slots[index].slotRate = editRate.value;
        localStorage.setItem("slots", JSON.stringify(slots))
        editSlotModal.style.display = "none";
        editSlotNumber.value = "",
            editRate.value = "",
            viewFacilties.adminView()
    }

    return {
        saveNewSlot: saveNewSlot,
        deleteASlot: deleteASlot,
        editASlot: editASlot
    };
})();

//responsibilities of a gateman like book and debook a slot and generating report of a booking
var gateManResponsibilities = (function() {
    var slots = []
    var newObj={};
    var regx1=/^([A-Z]){3}([-])([A-Z]){2}([-])\d...../;
    var date 
    var hour 
    var minutes
    // var regx1=new RegExp('([A-Z]){3}')
    
    if ("slots" in localStorage) {
        slots = [...JSON.parse(localStorage.getItem("slots"))]
    }

    //evaluates car number and bookes the slot starting form current time(GMT+6)
    var bookASlot = function(index, slot) {
        var valid=false;
        if ("slots" in localStorage) {
            slots = [...JSON.parse(localStorage.getItem("slots"))]
        }
        if(regx1.test(carNumber.value)) {
              valid=true;
        }
        if(!valid){
            carNumber.style.backgroundColor="#e88282"
            carNumber.value="CAR NUMBER IS NOT VALID"
            setTimeout(function() { carNumber.style.backgroundColor="#ffffff";carNumber.value = "";carNumber.focus() }, 1000);
            return;
        }
        date = new Date();
        hour = date.getHours();
        minutes = date.getMinutes();
        slots[bookingIndex].isBooked = true;
        slots[bookingIndex].date = date;
        slots[bookingIndex].hour = hour;
        slots[bookingIndex].minutes = minutes;
        slots[bookingIndex].carNumber = carNumber.value;
        slots[bookingIndex].slotRate = slot.slotRate;
        localStorage.setItem("slots", JSON.stringify(slots));
        bookSlotModal.style.display = "none";
        carNumber.value = ""
        viewFacilties.gateManView()
    }

    //checks out for a slot 
    var debookASlot = function(bookingIndex, slot) {
        if ("slots" in localStorage) {
            slots = [...JSON.parse(localStorage.getItem("slots"))]
        }
        var bookings = []
        var date = new Date();
        var timeDifference = diff_minutes(date, slot.date);
        var totalCost = ((timeDifference * parseInt(slot.slotRate)) / 60)
        newObj = {
            slotId: slot.slotId,
            carNumber: slot.carNumber,
            incomingTime: slot.date,
            checkOutTime: date,
            totalCost: totalCost
        }
        slots[bookingIndex].isBooked = false;
        slots[bookingIndex].date = "";
        slots[bookingIndex].hour = "";
        slots[bookingIndex].minutes = "";
        slots[bookingIndex].carNumber = "";
        if ("bookings" in localStorage) {
             bookings = [...JSON.parse(localStorage.getItem("bookings"))]
        }
        bookings.push(newObj);
        localStorage.setItem("bookings", JSON.stringify(bookings));
        localStorage.setItem("slots", JSON.stringify(slots));
        generateReport(date, slot.date, slot.slotRate, totalCost);
    }

    //calculates difference between checkin time and checkout time
    function diff_minutes(dt2, dt) {
        dt1 = new Date(dt)
        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60;
        return Math.abs(Math.round(diff));
    }

    //generates report with checkin date,checkout date and total cost
    function generateReport(checkoutDate, checkinDate, rate, cost) {
        var text
        checkoutDate = new Date(checkoutDate).toLocaleString();
        checkinDate = new Date(checkinDate).toLocaleString();
        reportModal.style.display = "block"
        text =
            `
            <div>
             <div class="summeryHeader">
                <span>SUMMERY OF PARKING</span>
             </div>
                <div style="margin:10px">SLOT RATE:${rate}</div>
                <div style="margin:10px">CHECK IN:${checkinDate}</div>
                <div style="margin:10px">CHECK OUT:${checkoutDate}</div>
                <div style="margin:10px">_________________</div>
                <div style="margin:10px">TOTAL COST:${cost}</div>
            </div>
            `
        document.getElementById("reportTemp").innerHTML = text;
    }

    return {
        bookASlot: bookASlot,
        debookASlot: debookASlot,
    };


})()

//table components for generating table,searching and paging
var tableComponents = (function() {
    var earning;
    var filteredList = [];
    var bookings = []

    //generates the table with initial header and at most first 10 data
    var generateTable = function() {
        earning = 0;
        pagenumber = 1;
        table.innerHTML = ""
        var text
        if ("bookings" in localStorage) {
            bookings = [...JSON.parse(localStorage.getItem("bookings"))]
        }
        if (bookings.length) {

            bookings.forEach(booking => {
                earning += booking.totalCost
            })
        }
        if (bookings.length > 10) {
            filteredList = bookings.slice(0, 10)
        } else {
            filteredList = bookings
        }
        filteredList = covertToReadableDate(filteredList);
        text =
            `
            <span>TOTAL INCOME:${earning}</span>
            `
        document.getElementById("income").innerHTML = text;
        generateTableHead(table, tableHeaders);
        generateTableBody(table, filteredList);
    }

    //converts to read-able dates(local-date)
    function covertToReadableDate(arr) {
        arr.forEach(data => {
            data.checkOutTime = new Date(data.checkOutTime).toLocaleString()
            data.incomingTime = new Date(data.incomingTime).toLocaleString()
        })
        return arr
    }

    //search for a search key in the database and calculate income from the slot
    var searchList = function(key) {
        var regx=new RegExp(key);
        var earning = 0;
        var text
        document.getElementById("income").innerHTM = ""
        filteredList = [];
        table.innerHTML = ""
        bookings.forEach((booking) => {
            if (regx.test(booking.slotId)) {
                earning += booking.totalCost
                filteredList.push(booking)
            }
        })

        text =
            `
            <span>TOTAL INCOME:${earning}</span>
            `
        filteredList = covertToReadableDate(filteredList)
        document.getElementById("income").innerHTML = text;

        generateTableHead(table, tableHeaders);
        generateTableBody(table, filteredList);
    }

    //generates table headers
    var generateTableHead = function(table, data) {
        let thead = table.createTHead();
        let row = thead.insertRow();
        for (let key of data) {
            let th = document.createElement("th");
            let text = document.createTextNode(key);
            th.appendChild(text);
            row.appendChild(th);
        }
    }

    //generates table body with given data array
    var generateTableBody = function(table, data) {
        for (let element of data) {
            let row = table.insertRow();
            for (key in element) {
                let cell = row.insertCell();
                let text = document.createTextNode(element[key]);
                cell.appendChild(text);
            }
        }
    }

    //go next page of the table
    var goNext = function() {
        var start
        var end 
        if (bookings.length < 11 || pagenumber > (bookings.length / 10)) {
            return
        }
        table.innerHTML = ""
        pagenumber += 1;
        start = (pagenumber - 1) * 10;
        end = (pagenumber * 10);
        if (end > bookings.length) {
            end = bookings.length;
        }
        filteredList = bookings.slice(start, end);
        filteredList = covertToReadableDate(filteredList)
        generateTableHead(table, tableHeaders);
        generateTableBody(table, filteredList);
    }

    //go previous page of the table
    var goPrev = function() {
        var start
        var end
        if (pagenumber == 1) {
            return;
        }
        table.innerHTML = ""
        pagenumber = pagenumber - 1;
        start = (pagenumber - 1) * 10;
        end = (pagenumber * 10);
        if (start < 0) {
            start = 0;
        }
        filteredList = bookings.slice(start, end);
        filteredList = covertToReadableDate(filteredList)
        generateTableHead(table, tableHeaders);
        generateTableBody(table, filteredList);
    }



    return {
        generateTable: generateTable,
        goNext: goNext,
        goPrev: goPrev,
        searchList: searchList,
        generateTableBody: generateTableBody,
        generateTableHead: generateTableHead
    }
})()



/*dropping a slot inside details division and generating information of that slot
jquery was used for this*/
function makedroppable(event) {
    bookingIndex = parseInt(event.target.dataset.divid)
    var myObject = document.getElementById(bookingIndex);
    $(myObject).draggable({
        revert: "invalid",
        drag: function(event, ui) {
            $("#info").html("<font color=red>This square will go back to it`s original position once it`s dropped in target zone. </font>");
        }
    });
    $("#infoDiv").droppable({
        drop: function(event, ui) {
            var cost = 0;
            $(myObject).draggable({
                revert: "valid"})           
            var text = "";
            var bookings = []
            var filteredList = []
            infodiv.innerHTML = "";
            if ("bookings" in localStorage) {
                bookings = [...JSON.parse(localStorage.getItem("bookings"))]
            }
            bookings.forEach(booking => {
                if (booking.slotId == bookingIndex) {
                    filteredList.push(booking);
                }
            })

            text = '<div style="margin: 40px;">'
            text += `<div>SLOT NUMBER:${bookingIndex}</div>`
            text += "<div>Car numbers:</div>"
            filteredList.forEach(list => {
                cost += list.totalCost
                text +=
                    `

                        <div>${list.carNumber}</div>
                        `
            })

            text += `<div>total income:${cost}</div>`
            text += "</div>"
            infodiv.innerHTML = text;
        },
        out: function(event, ui) {
            console.log("out")
        }
    });
};