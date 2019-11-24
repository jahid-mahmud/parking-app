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
var slots = [];
var index;
var slot;
var bookingIndex;
var pagenumber;
let data = ["SLOT ID", "CAR NUMBER", "CHECKED IN", "CHECKED OUT", "TOTAL INCOME"];
var bookings = []
$(function() {
    gotoTableTab()

})

function gotoGateManTab() {
    gatemanTab.style.display = "initial";
    adminTab.style.display = "none";
    tableTab.style.display = "none";
    showGateManView();
}

function gotoAdminTab() {
    gatemanTab.style.display = "none";
    adminTab.style.display = "initial";
    tableTab.style.display = "none";
    showAdminView()
}

function gotoTableTab() {
    gatemanTab.style.display = "none";
    adminTab.style.display = "none";
    tableTab.style.display = "initial";
    showTable()
}

function opneAddSlotModal() {
    addSlotButton.style.display = "none";
    AddSlotModal.style.display = "block";
    saveNewSlotButton.style.display = "initial";
}
closeAddSlotModal.onclick = function() {
    AddSlotModal.style.display = "none";
    addSlotButton.style.display = "block";
}
closebookSlotModal.onclick = function() {
    bookSlotModal.style.display = "none";
}
closeReportModal.onclick = function() {
    reportModal.style.display = "none";
}
closeEditSlotModal.onclick = function() {
    editSlotModal.style.display = "none"
    addSlotButton.style.display = "block";
}

function addNewSlot() {
    adminResponsibilities.saveNewSlot()
}

function showAdminView() {
    viewFacilties.adminView()
        // makedroppable()
}

function deleteSlot(event) {
    index = parseInt(event.target.dataset.index);
    adminResponsibilities.deleteASlot(index)
    viewFacilties.adminView()
}

function editSlot(event) {
    slot = JSON.parse(event.target.dataset.slot);
    index = parseInt(event.target.dataset.index);
    addSlotButton.style.display = "none";
    editSlotModal.style.display = "block"
    editSlotNumber.value = slot.slotId
    editRate.value = slot.slotRate
}

function saveEditedSlot() {
    adminResponsibilities.editASlot(index)
    AddSlotModal.style.display = "none";
    addSlotButton.style.display = "block";
    viewFacilties.adminView()
}

function discard() {
    closeAddSlotModal.onclick()
    closeEditSlotModal.onclick();
    closebookSlotModal.onclick()
}

function showGateManView() {
    viewFacilties.gateManView()
}

function bookSlot(event) {
    bookSlotModal.style.display = "block";
    bookingIndex = parseInt(event.target.dataset.index)
    slot = JSON.parse(event.target.dataset.lot);
}


function saveBookedSlot() {
    gateManResponsibilities.bookASlot(bookingIndex, slot)
}

function deBookSlot(event) {
    bookingIndex = parseInt(event.target.dataset.index)
    slot = JSON.parse(event.target.dataset.lot);
    gateManResponsibilities.debookASlot(bookingIndex, slot)
    viewFacilties.gateManView()
}

function showTable() {
    pagenumber = 1;
    tableComponents.generateTable()
}

function next() {
    var filteredList = [];
    tableComponents.goNext();
}

function prev() {
    tableComponents.goPrev();
}

function filter() {
    var searchKey = document.getElementById("searchKey").value
    tableComponents.searchList(searchKey)
}


var viewFacilties = (function() {
    var slots = [];

    var gateManView = function() {
        if ("slots" in localStorage) {
            slots = [...JSON.parse(localStorage.getItem("slots"))]
        }

        var text = '<div class="grid-container">'
        slots.map((slot, index) => {
            var time = new Date(slot.date).toLocaleTimeString('en-GB', {
                hour: "numeric",
                minute: "numeric"
            });
            var hour = new Date(slot.date).getHours()
            if (hour > 12) {
                hour = hour - 12;
                var minutes = new Date(slot.date).getMinutes()
                if (minutes < 10) {
                    minutes = "0" + minutes + " PM"
                } else {
                    minutes = minutes + " PM"
                }

            } else {
                var minutes = new Date(slot.date).getMinutes()
                minutes = minutes + " AM"
            }


            var strSlot = JSON.stringify(slot);
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
                      <button class="btn primary" style="float: left;margin-top:40px" id="deleteSlot" onclick="bookSlot(event) " data-index=${index} data-lot=${strSlot}>BOOK</button>
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
                      <button class="btn danger" style="float: left;margin-top:12px" id="deleteSlot" onclick="deBookSlot(event)" data-index=${index} data-lot=${strSlot}>DE-BOOK</button>
                    </div>
                `

            }

        })
        text += '</div>'

        document.getElementById("allSlotsForGateMan").innerHTML = text
    }
    var adminView = function() {
        if ("slots" in localStorage) {
            slots = [...JSON.parse(localStorage.getItem("slots"))]
        }

        var text = '<div class="grid-container4" >'
        slots.map((slot, index) => {
            var strSlot = JSON.stringify(slot);
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
            // slots.forEach(slot => {
            //     // dragElement(document.getElementById(slot.slotId));
            //     console.log("elmnt", document.getElementById(slot.slotId))
            //     elmnt = document.getElementById(slot.slotId);
            //     dragElement(elmnt)
            // })

    }


    return {
        gateManView: gateManView,
        adminView: adminView
    };
})();


var adminResponsibilities = (function() {
    var slots = []
    if ("slots" in localStorage) {
        slots = [...JSON.parse(localStorage.getItem("slots"))]
    }

    var saveNewSlot = function() {
        var x = slotNumber.value;
        var y = rate.value;
        if (isNaN(x) || x < 1 || x > 200) {
            alert("ID IS NOT VALID");
            slotNumber.value = ""
            return;
        }
        if (isNaN(y) || y == "") {
            alert("RATE IS NOT CORRECT");
            rate.value = ""
            return;
        }
        slots.forEach(slot => {
            if (slot.slotId == x) {
                alert("ID IS ALREADY TAKEN");
                slotNumber.value = ""
                return;
            }
        })
        var newObj = {
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

    var deleteASlot = function(index) {
        slots.splice(index, 1);
        localStorage.setItem("slots", JSON.stringify(slots));
    }

    var editASlot = function(index) {
        debugger;
        var x = editSlotNumber.value;
        var y = editRate.value;
        if (isNaN(x) || x < 1 || x > 200) {
            alert("ID IS NOT VALID");
            editSlotNumber.value = ""
            return;
        }
        if (isNaN(y) || y == "") {
            alert("RATE IS NOT CORRECT");
            editRate.value = ""
            return;
        }
        slots.forEach(slot => {
            if (slot.slotId == x) {
                alert("ID IS ALREADY TAKEN");
                editSlotNumber.value = ""
                return;
            }
        })
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

var gateManResponsibilities = (function() {
    var slots = []
    if ("slots" in localStorage) {
        slots = [...JSON.parse(localStorage.getItem("slots"))]
    }

    var bookASlot = function(index, slot) {

        if (carNumber.value == "") {
            alert("MUST PROVIDE CAR NUMBER");
            return;
        }
        var date = new Date();
        var hour = date.getHours();
        var minutes = date.getMinutes();
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

    var debookASlot = function(bookingIndex, slot) {
        var bookings = []
        var date = new Date();
        var hour = date.getHours();
        var minutes = date.getMinutes();

        var timeDifference = diff_minutes(date, slot.date);
        var totalCost = ((timeDifference * parseInt(slot.slotRate)) / 60)
        var newObj = {
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
            var bookings = [...JSON.parse(localStorage.getItem("bookings"))]
        }
        bookings.push(newObj);
        localStorage.setItem("bookings", JSON.stringify(bookings));
        localStorage.setItem("slots", JSON.stringify(slots));
        generateReport(date, slot.date, slot.slotRate, totalCost);
    }

    function diff_minutes(dt2, dt) {
        dt1 = new Date(dt)
        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60;
        return Math.abs(Math.round(diff));
    }

    function generateReport(checkoutDate, checkinDate, rate, cost) {
        checkoutDate = new Date(checkoutDate).toLocaleString();
        checkinDate = new Date(checkinDate).toLocaleString();
        reportModal.style.display = "block"
        var text =
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

var tableComponents = (function() {
    var earning;
    var filteredList = [];
    var bookings = []
    var generateTable = function() {
        earning = 0;
        pagenumber = 1;
        table.innerHTML = ""
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
        var text =
            `
            <span>TOTAL INCOME:${earning}</span>
            `
        document.getElementById("income").innerHTML = text;
        generateTableHead(table, data);
        generateTableBody(table, filteredList);
    }

    function covertToReadableDate(arr) {
        arr.forEach(data => {
            data.checkOutTime = new Date(data.checkOutTime).toLocaleString()
            data.incomingTime = new Date(data.incomingTime).toLocaleString()
        })
        return arr

    }
    var searchList = function(key) {
        document.getElementById("income").innerHTM = ""
        var earning = 0;
        filteredList = [];
        table.innerHTML = ""
        bookings.forEach((booking) => {
                if (booking.slotId == key) {
                    earning += booking.totalCost
                    filteredList.push(booking)
                }
            })
            // if (filteredList.length) {
            //     filteredList.forEach(booking => {
            //         earning += booking.totalCost
            //     })
            // }

        var text =
            `
            <span>TOTAL INCOME:${earning}</span>
            `
        filteredList = covertToReadableDate(filteredList)
        document.getElementById("income").innerHTML = text;

        generateTableHead(table, data);
        generateTableBody(table, filteredList);
        debugger
    }

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

    var goNext = function() {
        if (bookings.length < 11 || pagenumber > (bookings.length / 10)) {
            return
        }
        table.innerHTML = ""
        pagenumber += 1;
        var start = (pagenumber - 1) * 10;
        var end = (pagenumber * 10) - 1;
        if (end > bookings.length) {
            end = bookings.length;
        }
        filteredList = bookings.slice(start, end);
        filteredList = covertToReadableDate(filteredList)
        generateTableHead(table, data);
        generateTableBody(table, filteredList);
    }
    var goPrev = function() {
        if (pagenumber == 1) {
            return;
        }
        table.innerHTML = ""
        pagenumber = pagenumber - 1;
        var start = (pagenumber - 1) * 10;
        var end = (pagenumber * 10);
        if (start < 0) {
            start = 0;
        }
        filteredList = bookings.slice(start, end);
        filteredList = covertToReadableDate(filteredList)
        generateTableHead(table, data);
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


// function movable(event) {
//     var initialTop;
//     var initialLeft;
//     let elemBelow;
//     var currentElement;
//     var prevElement = "";
//     var bookings = []
//     var filteredList = []
//     var slots = []
//     var newList = []
//     bookingIndex = parseInt(event.target.dataset.divid)
//     var myObject = document.getElementById(bookingIndex);
//     if ("bookings" in localStorage) {
//         bookings = [...JSON.parse(localStorage.getItem("bookings"))]
//     }
//     bookings.forEach(booking => {
//         if (booking.slotId == bookingIndex) {
//             filteredList.push(booking);
//         }
//     })
//     if ("slots" in localStorage) {
//         slots = [...JSON.parse(localStorage.getItem("slots"))]
//     }
//     slots.forEach(slot => {
//         if (slot.slotId != bookingIndex) {
//             newList.push(slot)
//         }
//     })



//     console.log(myObject);
//     var offsets = document.getElementById(bookingIndex).getBoundingClientRect();
//     console.log("elmnt", document.getElementById(bookingIndex))
//     var initialTop = offsets.top;
//     var initialLeft = offsets.left;
//     let shiftX = event.clientX - myObject.getBoundingClientRect().left;
//     let shiftY = event.clientY - myObject.getBoundingClientRect().top;
//     console.log("initial position", initialTop, initialLeft)

//     myObject.style.position = 'absolute';
//     myObject.style.zIndex = 1000;
//     document.body.append(myObject);


//     moveAt(event.pageX, event.pageY);

//     function moveAt(pageX, pageY) {
//         myObject.style.left = pageX - shiftX + 'px';
//         myObject.style.top = pageY - shiftY + 'px';
//     }

//     function onMouseMove(event) {
//         moveAt(event.pageX, event.pageY);
//         myObject.hidden = true;
//         elemBelow = document.elementFromPoint(event.clientX, event.clientY);
//         prevElement = elemBelow;
//         // console.log("prev", prevElement);
//         if (!prevElement.id) {
//             prevElement = prevElement.parentElement;


//         }
//         console.log("prev2", prevElement);
//         myObject.hidden = false;
//         if (!elemBelow) return;
//     }

//     document.addEventListener('mousemove', onMouseMove);
//     myObject.onmouseup = function () {
//         var offsets = document.getElementById(bookingIndex).getBoundingClientRect();
//         var top = offsets.top;
//         var left = offsets.left;
//         console.log("top-left dropdiv", top, left);
//         if (top > 115 && top < 215 && left > 1500 && left < 1560) {
//             debugger;
//             var cost = 0
//             myObject.style.display = "none";
//             if (prevElement.id) {
//                 prevElement.style.display = "none"
//             }
//             generateInfodiv(filteredList, bookingIndex);
//             // myObject.style.top = initialTop;
//             // myObject.style.left = initialLeft;
//             // myObject.style.backgroundColor = "#455675"
//             // myObject.style.color = "#fff"
//             // text = '<div>'
//             // text += "<div>Car numbers:</div>"
//             // filteredList.forEach(list => {
//             //     cost += list.totalCost
//             //     text +=
//             //         `

//             //     <div>${list.carNumber}</div>
//             //     `
//             // })
//             // text += `<div>total income:${cost}</div>`
//             // text += "</div>"
//             // myObject.innerHTML = text
//         }
//         document.removeEventListener('mousemove', onMouseMove);
//         document.getElementById("allSlotsForAdmin").innerHTML = ""
//         gv(newList)
//         // moveDiv()

//     };

// };
// function returnToOriginalPosition(elmnt) {
//     debugger;
//     elmnt.style.zIndex = 0;
//     elmnt.style.top = initialTop;
//     elmnt.style.left = initialLeft;
//     elmnt.style.backgroundColor = "#221345"
// }

// function enterDroppable(elem) {
//     elem.style.background = 'pink';
// }

// function leaveDroppable(elem) {
//     elem.style.background = '';
// }
// if (bookingIndex) {
//     bookingIndex.ondragstart = function () {
//         return false;
//     };

// }
// function generateInfodiv(filteredList, bookingIndex) {
//     debugger;
//     var cost = 0;
//     var infodiv = document.getElementById("infoDiv");
//     infodiv.innerHTML = "";
//     var text = "";
//     text = '<div style="margin: 40px;">'
//     text += `<div>SLOT NUMBER:${bookingIndex}</div>`
//     text += "<div>Car numbers:</div>"
//     filteredList.forEach(list => {
//         cost += list.totalCost
//         text +=
//             `

//                 <div>${list.carNumber}</div>
//                 `
//     })
//     text += `<div>total income:${cost}</div>`
//     text += "</div>"
//     infodiv.innerHTML = text;
// }

// function gv(slots) {
//     var text = '<div class="grid-container" >'
//     slots.map((slot, index) => {
//         var strSlot = JSON.stringify(slot);
//         text +=
//             `
//             <div class="grid-item3" id="${slot.slotId}" onmousedown="movable(event)" data-divId=${slot.slotId} >
//               <div style="margin:10px">
//                     <span>Slot Number:${slot.slotId}</span>
//               </div>
//               <div style="margin:10px">
//                     <span>Slot Rate:${slot.slotRate} Per Hour</span>
//               </div>
//               <button class="btn danger" style="float: left;" id="deleteSlot" onclick="deleteSlot(event)" data-slot=${strSlot} data-index=${index}>DELETE</button>
//               <button class="btn warn" id="editSlot" style="float: right;" data-slot=${strSlot} data-index=${index}
//               onclick="editSlot(event)">EDIT</button>
//             </div>
//         `
//     })
//     text += '</div>'

//     document.getElementById("allSlotsForAdmin").innerHTML = text

// }

// function moveDiv() {
//     document.getElementById("dhon").innerHTML = ""

//     var text = ""
//     text +=
//         `
//             <div class="grid-item3"  id="d2" >
//               <div style="margin:10px">
//                     <span>Slot Number</span>
//               </div>
//               <div style="margin:10px">
//                     <span>Slot Rate Per Hour</span>
//               </div>
//               <button class="btn danger" style="float: left;" id="deleteSlot" onclick="deleteSlot(event)" </button>
//               <button class="btn warn" id="editSlot" style="float: right;"
//               onclick="editSlot(event)">EDIT</button>
//             </div>
//         `


//     document.getElementById("dhon").innerHTML = text
// }
// function makedroppable() {
//     // debugger;
//     // bookingIndex = parseInt(event.target.dataset.divid)
//     // var elmnt = `"` + `${bookingindex}` + `"`
//     // console.log("elmnt", elmnt);
//     $("#12").draggable({
//         revert: "valid",
//         drag: function (event, ui) {
//             console.log("hi")
//         }
//     });
//     // $("#s2").draggable({
//     //     revert: "invalid",
//     //     drag: function (event, ui) {
//     //         $("#info").html("<font color=red>This square will go back to it`s original position, unless it`s dropped in target zone.</font> ");
//     //     }
//     // });
//     $("#12").droppable({
//         drop: function (event, ui) {
//             console.log("hlw")
//         },
//         out: function (event, ui) {

//         }
//     });
// };

function makedroppable(event) {
    bookingIndex = parseInt(event.target.dataset.divid)
    var myObject = document.getElementById(bookingIndex);
    $(myObject).draggable({
        revert: "valid",
        drag: function(event, ui) {
            $("#info").html("<font color=red>This square will go back to it`s original position once it`s dropped in target zone. </font>");
        }
    });
    $("#infoDiv").droppable({
        drop: function(event, ui) {
            var cost = 0;
            var infodiv = document.getElementById("infoDiv");
            infodiv.innerHTML = "";
            var text = "";
            var bookings = []
            var filteredList = []
            if ("bookings" in localStorage) {
                bookings = [...JSON.parse(localStorage.getItem("bookings"))]
            }
            bookings.forEach(booking => {
                if (booking.slotId == bookingIndex) {
                    filteredList.push(booking);
                }
            })
            console.log("kajhsdkjhasd")

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