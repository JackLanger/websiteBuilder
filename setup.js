const toolsLink = document.querySelectorAll(".tool_link");
const handle = document.querySelector(".handle");
const toolsNav = document.querySelector(".tools_nav");
const body = document.querySelector(".outputBody");
const standardBorderStyle = "solid thin #888";
const highlightedBorderStyle = "solid 5px #88f";

var divArr = [];

var id = -1;

//transform nodelist to array

var toolsArr = Array.from(toolsLink);

/*
 *setup the toolsbar
 */
window.addEventListener("load", () => {
  toolsArr[0].style.background = "#fff";
  //toolsArr[0].style.boxShadow = "0 -1px 5px 0 rgba(0,0,0,.5)";
  toolsArr[0].style.border = "solid #dfe4ea 2px";
  toolsArr[0].style.zIndex = 2;

  body.style.width =
    window.innerWidth - handle.getBoundingClientRect().left + "px";
  body.style.height = window.innerHeight + "px";
  createElement();
});

/************************
 *highlight selected tab*
 ***********************/

toolsArr.forEach((elem) => {
  elem.addEventListener("click", () => {
    toolsArr.forEach((v) => {
      v.style.background = "#f1f2f6";
      v.style.border = "none";
      v.style.zIndex = 1;
    });
    elem.style.background = "#fff";
    //elem.style.boxShadow = "0 -10px 0px 1px #dfe4ea";
    elem.style.border = "solid #dfe4ea 2px";
    elem.style.zIndex = 2;
  });
});

/************************************************
 *resize function, resizing the toolsbar on drag*
 ***********************************************/
handle.addEventListener("mousedown", resize);
const sidebar = document.querySelector(".sidebar");

function resize() {
  window.addEventListener("mousemove", mousemove);
  window.addEventListener("mouseup", mouseup);

  function mousemove(e) {
    e.preventDefault();

    let pos = {
      x: e.clientX || e.pageX,
      y: e.clientY || e.pageY,
    };

    //hide the toolbar buttons if the toolbar is getting to narrow
    let mostRightRect = toolsArr[toolsArr.length - 1].getBoundingClientRect();
    if (pos.x > 50) {
      sidebar.style.width = pos.x + "px";
      handle.left = pos.x + "px";
      body.style.width =
        window.innerWidth - sidebar.getBoundingClientRect().width + "px";
      body.style.height = window.innerHeight + "px";
    } else {
      sidebar.style.width = "50px";
    }
  }

  function mouseup() {
    window.removeEventListener("mousemove", mousemove);
    window.removeEventListener("mouseup", mouseup);
  }
}

/***************************************
 * create a new div element on the body*
 **************************************/
function createElement() {
  let tools = document.querySelectorAll(".tools");

  tools.forEach((elem) => {
    elem.addEventListener("click", click);
  });

  function click() {
    /**
     * create the element
     * */
    ++id;

    let div = document.createElement("DIV");
    let dragArea = document.createElement("DIV");

    div.className = "newDiv";
    div.id = id;
    dragArea.className = "grab";

    div.appendChild(dragArea);

    let borders = [
      document.createElement("DIV"),
      document.createElement("DIV"),
      document.createElement("DIV"),
      document.createElement("DIV"),
    ];

    for (let i = 0; i < borders.length; i++) {
      switch (i) {
        case 0:
          borders[i].id = "e";
          break;
        case 1:
          borders[i].id = "n";
          break;
        case 2:
          borders[i].id = "s";
          break;
        case 3:
          borders[i].id = "w";
          break;
        default:
          i;
          break;
      }
    }
    /*****************************
     * resize divs on border drag*
     ****************************/
    borders.forEach((el) => {
      el.className = "border";
      div.appendChild(el);

      el.addEventListener("mousedown", (e) => {
        window.addEventListener("mousemove", mousemove);
        window.addEventListener("mouseup", mouseup);

        let setFullWidth = false;
        let setFullHeight = false;

        let rect = div.getBoundingClientRect();

        function mousemove(e) {
          var pos = {
            x: e.clientX || e.pageX,
            y: e.clientY || e.pageY,
          };
          let heigth = rect.top + rect.height - pos.y;

          if (el.id == "e") {
            if (
              pos.x > window.innerWidth - 25 &&
              rect.left <= sidebar.getBoundingClientRect().width + 20
            ) {
              div.style.borderRight = highlightedBorderStyle;
              div.style.borderLeft = highlightedBorderStyle;
              setFullWidth = true;
            } else {
              div.style.borderRight = standardBorderStyle;
              div.style.borderLeft = standardBorderStyle;
              setFullWidth = false;
            }
            div.style.width = pos.x - rect.left + "px";
          } else if (el.id == "w") {
            if (
              pos.x < sidebar.getBoundingClientRect().width + 20 &&
              rect.right >= window.innerWidth - 20
            ) {
              div.style.borderRight = highlightedBorderStyle;
              div.style.borderLeft = highlightedBorderStyle;
              setFullWidth = true;
            } else {
              div.style.borderRight = standardBorderStyle;
              div.style.borderLeft = standardBorderStyle;
              setFullWidth = false;
            }
            div.style.width = rect.left + rect.width - pos.x + "px";
            div.style.left = pos.x + "px";
          } else if (el.id == "n") {
            div.style.height = rect.top + rect.height - pos.y + "px";
            div.style.top = pos.y + "px";
          } else {
            div.style.height = pos.y - rect.top + "px";
          }
        }
        function mouseup() {
          window.removeEventListener("mousemove", mousemove);
          window.removeEventListener("mouseup", mouseup);

          if (setFullWidth == true) {
            div.style.width = "100%";
            div.style.position = "relative";
            div.style.left = "0px";
            div.style.borderRight = standardBorderStyle;
            div.style.borderLeft = standardBorderStyle;
          }
        }
      });
    });

    body.appendChild(div);
    divArr.push(div);
    /*************************************
     * move the new divs by drag and drop*
     ************************************/
    dragArea.addEventListener("mousedown", (e) => {
      //subscribe to events
      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);

      var dock = { left: false, right: false, top: false, bottom: false };
      var canDock = false;      
      
      dragArea.style.cursor = "move";
      
      var divRect = div.getBoundingClientRect();
      
      var sidebarWidth = sidebar.getBoundingClientRect().width;
      var maxRight = body.getBoundingClientRect().width +sidebarWidth;
      let left = div.getBoundingClientRect().left - sidebarWidth;
      let top = div.getBoundingClientRect().top;

      offset = {
        x: left - e.clientX,
        y: top - e.clientY,
      };

      function mousemove(e) {
        e.preventDefault();

        var pos = {
          x: e.clientX || e.pageX,
          y: e.clientY || e.pageY,
        };

        // let x = pos.x + offset.x;
        let x = pos.x - divRect.width / 2;
        let y = pos.y + offset.y;

        div.style.left = x + "px";
        div.style.top = y + "px";

        //recall for updated position
        let updatedRight = div.getBoundingClientRect().left +divRect.width;

        if(dockToObject(x,sidebarWidth)){
          console.log ( x - sidebarWidth);
          dock.left = true;
          div.style.borderLeft = highlightedBorderStyle;
          canDock = true;
          
        }else if (dockToObject(y,0)){
          dock.top = true;
          div.style.borderTop = highlightedBorderStyle;
          canDock = true;
        }
        else if(dockToObject(maxRight, updatedRight)){
          div.style.borderRight = highlightedBorderStyle;
          dock.right = true;
          canDock = true;
        }
        else{
          canDock = false;
          dock.left = false;
          dock.top = false;
          dock.right = false;
          dock.bottom = false;
          div.style.border = standardBorderStyle;
        }
        
      }

      function dockToObject(dockable, parent){
        if (dockable - parent <= 20 ){
          return true;
        }else{
          return false;
        }
      }

      // unsubscribe from the events
      function mouseup() {
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
        dragArea.style.cursor = "auto";

        if(canDock){
          if (dock.left){
            div.style.left = sidebarWidth+"px";
            div.style.borderLeft = standardBorderStyle;
          }
          if(dock.top){
            div.style.top = 0;
            div.style.borderTop = standardBorderStyle;
          }
          if(dock.right){
            div.style.left = window.innerWidth-divRect.width+"px";
            div.style.borderRight = standardBorderStyle;
          }
        }
      }
    });
  }
}
