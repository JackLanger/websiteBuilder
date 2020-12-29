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
handle.addEventListener("mousedown", resizeSidebar);
const sidebar = document.querySelector(".sidebar");

function resizeSidebar() {
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
  let tools = document.querySelectorAll(".tools"); //get all tools from the sidebar
  //subscribe the clickevent to all
  tools.forEach((elem) => {
    elem.addEventListener("click", createNewContainer);
  });
  /********************************************
   * create a new container with resize actions*
   ********************************************/
  function createNewContainer() {
    ++id; //individual id for each

    let div = document.createElement("DIV");
    let dragArea = document.createElement("DIV");

    div.className = "newDiv";
    div.id = id;
    dragArea.className = "grab";

    div.appendChild(dragArea);

    //areas for resize action
    let borders = [
      document.createElement("DIV"),
      document.createElement("DIV"),
      document.createElement("DIV"),
      document.createElement("DIV"),
    ];
    //assign a id for each border depending on its location
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
        let dockTo = {
          left: false,
          right: false,
          top: false,
          bottom: false,
        };

        let rect = div.getBoundingClientRect();

        function mousemove(e) {
          var pos = {
            x: e.clientX || e.pageX,
            y: e.clientY || e.pageY,
          };

          resizeElement(el.id);
          /**
           * reset to base values
           */

          function resizeElement(id) {
            switch (id) {
              case "e":
                resizeRight();
                break;
              case "s":
                resizeBottom();
                break;
              case "n":
                resizeTop();
                break;
              case "w":
                resizeLeft();
                break;
            }
          }

          function resizeRight() {
            if (
              //can scale to full
              dockToObject(window.innerWidth, pos.x) &&
              dockToObject(rect.left, sidebar.getBoundingClientRect().width)
            ) {
              div.style.borderRight = highlightedBorderStyle;
              div.style.borderLeft = highlightedBorderStyle;
              setFullWidth = true;
            }
            //can dock to side
            else if (
              dockToObject(window.innerWidth, pos.x) &&
              !dockToObject(rect.left, sidebar.getBoundingClientRect().width)
            ) {
              dockTo.right = true;
              setFullWidth = false;
              div.style.borderRight = highlightedBorderStyle;
              div.style.borderLeft = standardBorderStyle;
            } else {
              reset();
            }
            div.style.width = pos.x - rect.left + "px";
          }
          function resizeLeft() {
            if (
              //can scale
              dockToObject(pos.x, sidebar.getBoundingClientRect().width) &&
              dockToObject(window.innerWidth, rect.right)
            ) {
              div.style.borderRight = highlightedBorderStyle;
              div.style.borderLeft = highlightedBorderStyle;
              setFullWidth = true;
            } else if (
              dockToObject(pos.x, sidebar.getBoundingClientRect().width) &&
              !dockToObject(window.innerWidth, rect.right)
            ) {
              div.style.borderLeft = highlightedBorderStyle;
              dockTo.left = true;
            } else {
              reset();
            }
            div.style.width = rect.left + rect.width - pos.x + "px";
            div.style.left = pos.x + "px";
          }
          function resizeTop() {
            div.style.height = rect.top + rect.height - pos.y + "px";
            div.style.top = pos.y + "px";

            if (dockToObject(pos.y, 0)) {
              div.style.borderTop = highlightedBorderStyle;
              dockTo.top = true;
            } else reset();
          }
          function resizeBottom() {
            div.style.height = pos.y - rect.top + "px";
            //can scale
            if (rect.top == 0 && dockToObject(window.innerHeight, pos.y)) {
              div.style.borderBottom = highlightedBorderStyle;
              setFullHeight = true;
            }
            //can dock
            else if (rect.top != 0 && dockToObject(window.innerHeight, pos.y)) {
              div.style.borderBottom = highlightedBorderStyle;
              dockTo.bottom = true;
            } else reset();
          }
        }

        function mouseup() {
          window.removeEventListener("mousemove", mousemove);
          window.removeEventListener("mouseup", mouseup);

          let offsetY = div.getBoundingClientRect().top;
          let width = div.getBoundingClientRect().width;
          let height = div.getBoundingClientRect().height;
          let offsetLeft =
            div.getBoundingClientRect().left -
            sidebar.getBoundingClientRect().width;

          console.log(offsetY);

          if (setFullWidth) {
            setWidth(100);
          }
          if (setFullHeight) {
            setHeight(100);
          }
          if (dockTo.bottom) {
            dockToScreenBottom(offsetY, height);
          }
          if (dockTo.right) {
            dockToScreenRight();
          }
          if (dockTo.left) {
            dockToScreenLeft(offsetLeft, width);
          }
          if (dockTo.top) {
            dockToScreenTop(offsetY, height);
          }
        }
        /**
         * takes a value for relative screen height
         * @param {int} value
         */
        function setHeight(value) {
          div.style.height = value + "%";
          div.style.position = "relative";
          div.style.left =
            rect.left - sidebar.getBoundingClientRect().width + "px";
          reset();
        }
        /**
         * takes a value for relative screen width
         * @param {int} value
         */
        function setWidth(value) {
          div.style.width = value + "%";
          div.style.position = "relative";
          div.style.left = "0px";
          reset();
        }
        function dockToScreenBottom(offset, height) {
          reset();
          console.log(div.getBoundingClientRect().bottom);
          div.style.top = "auto";
          div.style.bottom = "0%";
          div.style.position = "absolute";
          div.style.left = rect.left + "px";
        }
        function dockToScreenTop(offset, height) {
          reset();
          div.style.top = 0;
          div.style.height = height + offset + "px";
        }
        function dockToScreenLeft(offset, width) {
          reset();

          div.style.left = sidebar.getBoundingClientRect().width + "px";
          div.style.width = offset + width + "px";
        }
        function dockToScreenRight() {
          reset();
          div.style.left =
            rect.left - sidebar.getBoundingClientRect().width + "px";
          div.style.position = "relative";
          div.style.width = window.innerWidth - rect.left + "px";
        }

        function reset() {
          setFullHeight = false;
          setFullWidth = false;
          dockTo.bottom = false;
          dockTo.top = false;
          dockTo.left = false;
          dockTo.right = false;
          div.style.border = standardBorderStyle;
        }
      });
    });
    /**
     * if dockable -parent <20 true
     * @param {int} dockable
     * @param {int} parent
     */

    function dockToObject(dockable, parent) {
      if (dockable - parent <= 20) {
        return true;
      } else {
        return false;
      }
    }

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
      div.style.position = "absolute";

      var divRect = div.getBoundingClientRect();

      var sidebarWidth = sidebar.getBoundingClientRect().width;
      var maxRight = body.getBoundingClientRect().width + sidebarWidth;
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
        let updatedRight = div.getBoundingClientRect().left + divRect.width;

        if (dockToObject(x, sidebarWidth)) {
          console.log(x - sidebarWidth);
          dock.left = true;
          div.style.borderLeft = highlightedBorderStyle;
          canDock = true;
        } else if (dockToObject(y, 0)) {
          dock.top = true;
          div.style.borderTop = highlightedBorderStyle;
          canDock = true;
        } else if (dockToObject(maxRight, updatedRight)) {
          div.style.borderRight = highlightedBorderStyle;
          dock.right = true;
          canDock = true;
        } else {
          canDock = false;
          dock.left = false;
          dock.top = false;
          dock.right = false;
          dock.bottom = false;
          div.style.border = standardBorderStyle;
        }
      }

      // unsubscribe from the events
      function mouseup() {
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
        dragArea.style.cursor = "auto";

        if (canDock) {
          if (dock.left) {
            div.style.left = sidebarWidth + "px";
            div.style.borderLeft = standardBorderStyle;
          }
          if (dock.top) {
            div.style.top = 0;
            div.style.borderTop = standardBorderStyle;
          }
          if (dock.right) {
            div.style.left = window.innerWidth - divRect.width + "px";
            div.style.borderRight = standardBorderStyle;
          }
        }
      }
    });
  }
}
