const IDBRequest=indexedDB.open("contacts",1);

IDBRequest.addEventListener("upgradeneeded",()=>{
    const DB=IDBRequest.result;
        DB.createObjectStore("persons",{
            autoIncrement:true
    });
    console.log("el almacen de datos fue creado correctamente");
});

IDBRequest.addEventListener("success",()=>{
    console.log("todo salio correctamente");
});

IDBRequest.addEventListener("error",()=>{
    console.log("la base de datos no pudo ser creada");
});


//elements DOM
const nameInput=document.getElementById("input-name");
const numberInput=document.getElementById("input-number");
const directionInput=document.getElementById("input-direction");
const addButton=document.getElementById("btn-contact");
const btnShowContacts=document.getElementById("btn-show-contacts");
const display=document.querySelector(".display");



//general function
const getData=(mode)=>{
    const DB=IDBRequest.result;
        const IDBTransaction=DB.transaction("persons",mode);
            const IDBObjectStore=IDBTransaction.objectStore("persons");
                return[IDBObjectStore,IDBTransaction];
}

//function add objects
const addObjects=(object)=>{
    const IDBData= getData("readwrite");
        IDBData[0].add(object);
            IDBData[1].addEventListener("complete",()=>{
            alert("nuevo contacto ingresado con exito");
    });
    
}

// Function to read objects
const readObjects = () => {
    const IDBData = getData("readonly");
    const cursorRequest = IDBData[0].openCursor();
    cursorRequest.addEventListener("success", (event) => {
    const cursor = event.target.result;
    if (cursor) {
        
        const nameColumn = document.createElement("div");
        nameColumn.textContent = cursor.value.name;
        display.appendChild(nameColumn);
        
        const numberColumn = document.createElement("div");
        numberColumn.textContent = cursor.value.number;
        display.appendChild(numberColumn);
        
        const directionColumn = document.createElement("div");
        directionColumn.textContent = cursor.value.direction;
        display.appendChild(directionColumn);
        
        cursor.continue();
        } else {
        console.log("Todos los datos fueron leídos");
        }
    });
};


//function clean Inputs
const cleanInputs=()=>{
    nameInput.value = "";
    numberInput.value = "";
    directionInput.value = "";
}

//function clean display
const cleanDisplay=()=>{
    display.textContent="";
}

//buttons
addButton.addEventListener("click",()=>{
        const name=nameInput.value;
            const number=parseInt(numberInput.value);
                const direction=directionInput.value;

    //creation object 
    const contact={
        name:name,
        number:number,
        direction:direction
    };

    //validations
    if(name=="" || number=="" || direction=="" || isNaN(number)){
        alert("no has llenado los campos");  
    }else{
        addObjects(contact);
        cleanInputs();
    }
});

let isDisplayVisible=false;

btnShowContacts.addEventListener("click", (e) => {
    if(!isDisplayVisible){
        cleanDisplay();
            readObjects();
                display.style.display="grid";
    }else{display.style.display="none";}

    isDisplayVisible= !isDisplayVisible;
});





