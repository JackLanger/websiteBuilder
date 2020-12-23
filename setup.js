const toolsLink = document.querySelectorAll(".tool_link");
const handle = document.querySelector(".handle");
const toolsNav = document.querySelector(".tools_nav");
const body = document.querySelector(".outputBody");

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

/**
 * create a new div element on the body
 */
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
    borders.forEach((el) => {
      el.className = "border";
      div.appendChild(el);

      /**
       * resize function for divs 
       */
      el.addEventListener("mousedown", (e)=>{
          window.addEventListener('mousemove',mousemove);
          window.addEventListener('mouseup',mouseup);

          let rect = div.getBoundingClientRect();

          function mousemove(e){

            var pos = {
              x:e.clientX||e.pageX,
              y:e.clientY||e.pageY
            };

            let heigth = rect.top + rect.height - pos.y;

            if(el.id == "e"){
              div.style.width =  pos.x -rect.left+ "px";
            }else if(el.id == "w"){
              console.log(rect);
              div.style.width = rect.left + rect.width - pos.x +"px";
              div.style.left = pos.x - sidebar.getBoundingClientRect().width +"px"
            }
            else if(el.id == "n"){
              div.style.height  = rect.top + rect.height - pos.y +"px";
              div.style.top = (rect.top)-(rect.top+pos.y) +"px";
            }else{
              div.style.height  =  pos.y -rect.top +"px";
            }

          }
          function mouseup(){            
          window.removeEventListener('mousemove',mousemove);
          window.removeEventListener('mouseup',mouseup);
          }
      });
    });

    body.appendChild(div);
/**
 * move the new divs by drag and drop
 */
    dragArea.addEventListener("mousedown", (e) => {
      //subscribe to events
      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);

      dragArea.style.cursor = "move";

      var sideWidth = sidebar.getBoundingClientRect().width;

      let left = div.getBoundingClientRect().left - sideWidth;
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

        let x = pos.x + offset.x;
        let y = pos.y + offset.y;

        div.style.left = x + "px";
        div.style.top = y-(div.getBoundingClientRect().height*div.id) + "px";

      }

      // unsubscribe from the events
      function mouseup() {
        //div.style.left = recalcPosition()+"px";
        //div.style.position = "relative";
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
        dragArea.style.cursor = "auto";
      }
    });
  }
}
