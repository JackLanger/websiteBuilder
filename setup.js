const toolsLink = document.querySelectorAll(".tool_link");
const handle = document.querySelector(".handle");
const toolsNav = document.querySelector(".tools_nav");
const body = document.querySelector(".outputBody");

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

/*
 *highlight selected tab
 */

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

/*
 *resize function, resizing the toolsbar on drag
 */
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
        window.innerWidth - sidebar.getBoundingClientRect().left + "px";
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

/**
 * create a new div element on the body
 */
function createElement() {
  let tools = document.querySelectorAll(".tools");

  tools.forEach((elem) => {
    elem.addEventListener("click", click);
  });

  function click() {
    //create the element
    let div = document.createElement("DIV");
    let dragArea = document.createElement("DIV");
    div.appendChild(dragArea);
    dragArea.style.width = "90%";
    dragArea.style.height = "90%";
    dragArea.style.position = "relative";
    dragArea.style.border = "#ddd dashed thin";
    dragArea.style.left = "5%";
    dragArea.style.top = "5%";
    dragArea.style.boxSizing = "border-box";

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
    borders.forEach((el) => {
      el.className = "border";
      div.appendChild(el);
      el.addEventListener("mousedown", adjust);
    });

    body.appendChild(div);

    div.style.width = "150px";
    div.style.height = "150px";
    div.style.border = "thin solid #ced6e0";
    div.style.position = "relative";
    dragArea.addEventListener("mousedown", mousedown);

    //borders for resizing
    let rect = div.getBoundingClientRect();

    function mousedown() {
      //subscribe to events
      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);

      dragArea.style.cursor = "move";
      div.style.position = "absolute";
    }

    //adjust the size of the div
    function adjust() {
      let id = this.id;
      window.addEventListener("mouseup", mouseup);
      window.addEventListener("mousemove", resize);
        //check object for bugs
      var divObj = {
        x: rect.left,
        x2:rect.left + rect.width,
        y: rect.top,
        y2:rect.top+rect.height,
        width:rect.width,
        height:rect.height
      };

      function resize(e) {
        e.preventDefault();

        let rect = div.getBoundingClientRect();

        let pos = {
          x: e.clientX || e.pageX,
          y: e.clientY || e.pageY,
        };
        /**
         * resize the div take the original position and size for resizing
         * need to define which elem was pressed for directional purpose
         * do not shrink on initial click.. keep size as is unless user reduces size
         */
        if (id == "e" || id == "w") {
          //resize horizontally
          if (id == "e") {
            div.style.width = pos.x - rect.left + "px";
          } else {
            /**
             * move the div to the right while reducing the size
             * bug moves the initial position back to 300 
             */
            let newPos = pos.x - divObj.x;
            let newWidth = divObj.width - newPos;

            div.style.left = newPos + "px";
            div.style.width = newWidth + "px";
          }
        } else {
          //resize vertically
          if (id == "n") {
          } else {
            div.height = pos.y - divObj.y + "px";
          }
        }
      }

      // unsubscribe from the events
      function mouseup() {
        window.removeEventListener("mousemove", resize);
        window.removeEventListener("mouseup", mouseup);
      }
    }
    /**
     * move the div on the screen and drop it where the mouse button is released
     */
    function mousemove(e) {
      e.preventDefault();

      let pos = {
        x: e.clientX || e.pageX,
        y: e.clientY || e.pageY,
      };

      div.style.left = pos.x + "px";
      div.style.top = pos.y + "px";
    }

    function mouseup() {
      div.style.cursor = "auto";
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("mouseup", mouseup);
    }
  }
}
