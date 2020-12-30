const toolsLink = document.querySelectorAll(".tool_link");
const handle = document.querySelector(".handle");
const toolsNav = document.querySelector(".tools_nav");
const body = document.querySelector(".outputBody");
const standardBorderStyle = "solid thin #888";
const highlightedBorderStyle = "solid 5px #88f";

var containerArray = [];

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

    var element = {
      isScaled: {
        horizontal: false,
        vertical: false,
      },
      isDocked: false,
      dockTo: {
        object: false,
        screen: false,
      },
      isParent: false,
      children: [],
    };

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
              canDockToObject(window.innerWidth, pos.x) &&
              canDockToObject(rect.left, sidebar.getBoundingClientRect().width)
            ) {
              div.style.borderRight = highlightedBorderStyle;
              div.style.borderLeft = highlightedBorderStyle;
              setFullWidth = true;
            }
            //can dock to side
            else if (
              canDockToObject(window.innerWidth, pos.x) &&
              !canDockToObject(rect.left, sidebar.getBoundingClientRect().width)
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
              canDockToObject(pos.x, sidebar.getBoundingClientRect().width) &&
              canDockToObject(window.innerWidth, rect.right)
            ) {
              div.style.borderRight = highlightedBorderStyle;
              div.style.borderLeft = highlightedBorderStyle;
              setFullWidth = true;
            } else if (
              canDockToObject(pos.x, sidebar.getBoundingClientRect().width) &&
              !canDockToObject(window.innerWidth, rect.right)
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

            if (canDockToObject(pos.y, 0)) {
              div.style.borderTop = highlightedBorderStyle;
              dockTo.top = true;
            } else reset();
          }
          function resizeBottom() {
            div.style.height = pos.y - rect.top + "px";
            //can scale
            if (rect.top == 0 && canDockToObject(window.innerHeight, pos.y)) {
              div.style.borderBottom = highlightedBorderStyle;
              setFullHeight = true;
            }
            //can dock
            else if (
              rect.top != 0 &&
              canDockToObject(window.innerHeight, pos.y)
            ) {
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
            element.isScaled.horizontal = true;
          }
          if (setFullHeight) {
            setHeight(100);
            element.isScaled.vertical = true;
          }
          if (dockTo.bottom) {
            dockToScreenBottom(offsetY, height);
            element.bottom = true;
          }
          if (dockTo.right) {
            dockToScreenRight();
            element.right = true;
          }
          if (dockTo.left) {
            dockToScreenLeft(offsetLeft, width);
            element.left = true;
          }
          if (dockTo.top) {
            dockToScreenTop(offsetY, height);
            element.top = true;
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
        /**
         * reset to base values
         */
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

    function canDockToObject(dockable, parent) {
      if (dockable - parent <= 10 && dockable -parent >= -10 ) {
        return true;
      } else {
        return false;
      }
    }

    body.appendChild(div);
    containerArray.push(div);
    /**************************************
     * move the new divs by drag and drop *
     * BUG: on bottom dock offset the offset is off by sidebarwidth as bottom dock works so far only with absolute position and we don't have to account for the sidebar
     *************************************/
    dragArea.addEventListener("mousedown", (e) => {
      //subscribe to events
      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);

      var canDock = { left: false, right: false, top: false, bottom: false };

      dragArea.style.cursor = "move";
      div.style.position = "absolute";

      var divRect = div.getBoundingClientRect();
      var sidebarWidth = sidebar.getBoundingClientRect().width;
      var maxRight = body.getBoundingClientRect().width + sidebarWidth;
      let left = div.getBoundingClientRect().left - sidebarWidth;

      offset = {
        x: left - e.clientX + sidebarWidth,
        y: divRect.top - e.clientY,
      };

      //#region mousemove
      function mousemove(e) {
        e.preventDefault();

        var pos = {
          x: e.clientX || e.pageX,
          y: e.clientY || e.pageY,
        };

        if (element.isDocked) {
          resetDock();
        }

        //#region if is scaled

        if (element.isScaled.horizontal || element.isScaled.vertical) {
          if (element.isScaled.horizontal) {
            scaleDownHorizontal();
            resetDock();
          }
          if (element.isScaled.horizontal && element.isScaled.vertical) {
            scaleDownVertical();
            scaleDownHorizontal();
            resetDock();
          } else {
            scaleDownVertical();
            resetDock();
          }
        }

        function scaleDownHorizontal() {
          div.style.position = "absolute";
          div.style.width = absoluteDistanceInPixel(
            body.getBoundingClientRect().width * 0.95
          );
          element.isScaled.horizontal = false;
        }
        function scaleDownVertical() {
          div.style.position = "absolute";
          div.style.height = absoluteDistanceInPixel(divRect.height * 0.95);
          element.isScaled.vertical = false;
        }

        //#endregion if scaled

        let x = pos.x + offset.x;
        let y = pos.y + offset.y;

        div.style.left = absoluteDistanceInPixel(x);
        div.style.top = absoluteDistanceInPixel(y);

        //recall for updated position
        let updatedRight = div.getBoundingClientRect().left + divRect.width;

        //#region if can dock

        if (
          canDockToObject(x, sidebarWidth) ||
          canDockToObject(y, 0) ||
          canDockToObject(maxRight, updatedRight)
        ) {
          element.dockTo.screen = true;

          if (canDockToObject(x, sidebarWidth)) {
            canDockLeft();
          }
          if (canDockToObject(y, 0)) {
            canDockTop();
          }
          if (canDockToObject(maxRight, updatedRight)) {
            canDockRight();
          }
        } else {
          resetDock();
          dockToParent();
          console.log(dockToParent());
        }
/**
 * loops through all available objects and checks for position of the draged object 
 * TODO:optimize for performance, taxing with a lot of divs
 * DO NOT COPY! bad performance when a lot of divs on screen
 * @returns the div that will be a parent 
 */
        function dockToParent(){
          var parent = null;
          if (containerArray.length > 1) {
            for (let i = 0; i< containerArray.length;i++) {

              if (containerArray[i].id == div.id) continue;
              
              let divObj = {
                left: div.getBoundingClientRect().left,
                right:
                  div.getBoundingClientRect().left +
                  div.getBoundingClientRect().width,
                top: div.getBoundingClientRect().top,
                bottom:
                  div.getBoundingClientRect().top +
                  div.getBoundingClientRect().height,
              };

              let obj = {
                left: containerArray[i].getBoundingClientRect().left,
                right:
                containerArray[i].getBoundingClientRect().left +
                containerArray[i].getBoundingClientRect().width,
                top: containerArray[i].getBoundingClientRect().top,
                bottom:
                containerArray[i].getBoundingClientRect().top +
                containerArray[i].getBoundingClientRect().height,
              };

              if (canDockToObject(divObj.left,obj.right)) {
                //dock right
                containerArray[i].style.borderRight = highlightedBorderStyle;
                parent = containerArray[i];
                canDock.right = true;
              } else if (canDockToObject(divObj.right, obj.left)) {
                //dock left
                containerArray[i].style.borderLeft = highlightedBorderStyle;
                parent = containerArray[i];
                canDock.left = true;
              } else if (canDockToObject(divObj.top, obj.bottom)) {
                //dock bottom
                containerArray[i].style.borderBottom = highlightedBorderStyle;
                parent = containerArray[i];
                canDock.bototm = true;
              } else if (canDockToObject(divObj.bottom, obj.top)) {
                //dock top
                containerArray[i].style.borderTop = highlightedBorderStyle;
                parent = containerArray[i];
                canDock.top = true;
              }else{
                parent = null;
                resetContaierArray(i);
              }
            }
          }
          return parent;
        }

        //#endregion if
        function canDockLeft() {
          div.style.borderLeft = highlightedBorderStyle;
          canDock.left = true;
        }
        function canDockRight() {
          div.style.borderRight = highlightedBorderStyle;
          canDock.right = true;
        }
        function canDockTop() {
          div.style.borderTop = highlightedBorderStyle;
          canDock.top = true;
        }
      }
      /**
       * reset docking and border
       */
      function resetDock() {
        resetCanDock();
        resetIsDocked();
        div.style.border = standardBorderStyle;
      }

      function resetContaierArray(index){
        containerArray[index].style.border = standardBorderStyle;
        Object.keys(canDock).forEach(k=>{
          canDock[k] = false;
        });
      }

      /**
       * loop through keys and set as false
       */
      function resetIsDocked() {
        element.isDocked = false;
        Object.keys(element.dockTo).forEach((key) => {
          element.dockTo[key] = false;
        });
      }
      /**
       * loop through keys and set as false
       */
      function resetCanDock() {
        Object.keys(canDock).forEach((key) => {
          canDock[key] = false;
        });
      }
      //#region mouseup

      // unsubscribe from the events
      function mouseup() {
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);

        dragArea.style.cursor = "auto";

        //multiple docking locations allowed
        if (element.dockTo.screen) {
          if (canDock.left) {
            dockToLeft(sidebarWidth);
          }
          if (canDock.top) {
            dockToTop(0);
          }
          if (canDock.right) {
            let rightDockingPosition = window.innerWidth - divRect.width;
            dockToRight(rightDockingPosition);
          }
          if (canDock.bottom) {
            dockToBottom();
          }
        } else if (element.dockTo.object) {
          parent = "";

          if (canDock.left) {
            dockAsChild(parent, div);
          } else if (canDock.right) {
            dockAsChild(parent, div);
          } else if (canDock.top) {
            dockAsChild(parent, div);
          } else if (canDock.bottom) {
            dockAsChild(parent, div);
          }
        }
        resetCanDock();

        /**
         * dock to the right border of the other object
         * @param {int} position
         */
        function dockToLeft(position) {
          div.style.left = absoluteDistanceInPixel(position);
          element.isDocked = true;
        }
        function dockToRight(position) {
          div.style.left = absoluteDistanceInPixel(position);
          element.isDocked = true;
        }
        function dockToTop(position) {
          element.isDocked = true;
          div.style.top = absoluteDistanceInPixel(position);
        }
        function dockToBottom(position) {
          element.isDocked = true;
          let callerName = "dockToBottom";
          throw new NotImplementedError(callerName);
        }

        /**
         * dock a container as child to another container
         * @param {object} parent
         * @param {object} child
         */
        function dockAsChild(parent, child) {
          callerName = "dockAsChild";
          //not implemented
          throw new NotImplementedError(callerName);
        }

        adjustLeftPosition();
      }
      //#endregion mouseup
      /**
       * set the minimus left of the div to the sidebar width so it stays in the outputbody
       */
      function adjustLeftPosition() {
        if (div.getBoundingClientRect().left < sidebarWidth) {
          div.style.left = absoluteDistanceInPixel(sidebarWidth);
        }
        //reset borders
        div.style.border = standardBorderStyle;
      }
    });
    //#endregion mousemove
  }
}

/**
 * distance in pixel
 * @returns {string} distance+px
 * @param {int} distance
 */
function absoluteDistanceInPixel(distance) {
  return distance + "px";
}

/**
 * @summary A error thrown when a method is defined but not implemented (yet).
 * @param {any} message An additional message for the error.
 */
function NotImplementedError(message) {
  ///<summary>The error thrown when the given function isn't implemented.</summary>
  const sender = new Error().stack.split("\n")[2].replace(" at ", "");

  this.message = `The method ${sender} isn't implemented.`;

  // Append the message if given.
  if (message) this.message += ` Message: "${message}".`;

  let str = this.message;

  while (str.indexOf("  ") > -1) {
    str = str.replace("  ", " ");
  }

  this.message = str;
}
