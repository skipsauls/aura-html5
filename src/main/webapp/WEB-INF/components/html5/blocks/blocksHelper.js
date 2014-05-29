({

  reset: function(component, event) {
    this.grid = [
      [
        0, 0, 0, 0
      ], [
        0, 0, 0, 0
      ], [
        0, 0, 0, 0
      ], [
        0, 0, 0, 0
      ]
    ];
    console.warn("--------------: ", this.scores);
    this.scores.current = 0;
    this.refresh(component);
  },

  
  showPanel: function(component, name) {
    var panels = document.getElementsByClassName("panel");
    for (var i = 0; i < panels.length; i++) {
      if (panels[i].name === name) {
        //panels[i].style.setProperty("display", "block");
        $A.util.removeClass(panels[i], "hidden");
        $A.util.addClass(panels[i], "visible");
      } else {
        //panels[i].style.setProperty("display", "none");
        $A.util.removeClass(panels[i], "visible");
        $A.util.addClass(panels[i], "hidden");
      } 
    }
  },
  
  options: function(component, event) {
    this.showPanel(component, "options");
  },

  resume: function(component, event) {
    this.showPanel(component, "main");
  },
  
  start: function(component, event) {
    this.reset(component);
    var newCells = [];
    newCells.push(this.addValue(component));
    newCells.push(this.addValue(component));
    this.refresh(component, newCells);
    this.running = true;
    this.showPanel(component, "main");
  },

  setup: function(component) {
    this.running = false;
    this.moves = {};
    var grid = [];
    for (var row = 0; row < 4; row++) {
      grid[row] = [];
      for (var col = 0; col < 4; col++) {
        grid[row][col] = 0;
      }
    }
    this.grid = grid;
  },

  refresh: function(component, newCells) {
    newCells = newCells instanceof Array ? newCells : [newCells];
    var cell = null;
    var val = null;
    var newCell = null;
    for (var row = 0; row < this.grid.length; row++) {
      for (var col = 0; col < this.grid[row].length; col++) {
        val =  this.grid[row][col];
        cell = component.find("cell" + ((row * 4) + col)).getElement();
        cell.className = "val" + val;
        if (newCells) {
          for (var i = 0; i < newCells.length; i++) {
            newCell = newCells[i];
            if (newCell && newCell.row === row && newCell.col === col) {
              $A.util.addClass(cell, "new");
              $A.util.addClass(cell, "fadein");
              // cell.style.setProperty("opacity", 1);
            }
          }
          cell.textContent = val > 0 ? val : "";
        }
      }
    }
    var score = component.find("score");
    score.getElement().textContent = this.scores.current;
    var best = component.find("best");
    best.getElement().textContent = this.scores.best;
  },

  init: function(component, event) {
    // Load the best score from SFDC!
    this.scores = {
      current: 0,
      best: 0
    };
    
    this.setup(component);
    var self = this;
    setTimeout(function() {
      self.start(component);
    }, 1000);    
  },

  shiftZeros: function(row) {
    var trow = [];
    var zrow = [];
    for (var col = 0; col < row.length; col++) {
      if (row[col] !== 0) {
        trow.push(row[col]);
      } else {
        zrow.push(0);
      }
    }
    
    row = zrow.concat(trow);
    
    return row;
  },
  
  shiftRow: function(index, row, rev) {
    if (rev) {
      row = row.reverse();
    }
    var check = 0;

    // Shift zeroes
    row = this.shiftZeros(row);
    /*
    var trow = [];
    var zrow = [];
    for (var col = 0; col < row.length; col++) {
      if (row[col] !== 0) {
        trow.push(row[col]);
      } else {
        zrow.push(0);
      }
    }
    
    row = zrow.concat(trow);
     */
    
    // Combine like numbers
    for (var col = row.length - 1; col >= 1; col--) {
      if (row[col] !== 0 && row[col] === row[col - 1]) {
        // Add the values (double them as they are the same)
        row[col] *= 2;
        // Zero out the cell that was merged
        row[col - 1] = 0;
        // Increment the score
        this.scores.current += row[col];
        this.scores.best = this.scores.current > this.scores.best ? this.scores.current : this.scores.best;
        // Track the modified cells
        this.gridMod[index] = this.gridMod[index] || {};
        this.gridMod[index][col] = true;
      }
    }

    // Shift zeroes
    row = this.shiftZeros(row);
    /*
    var trow = [];
    var zrow = [];
    for (var col = 0; col < row.length; col++) {
      if (row[col] !== 0) {
        trow.push(row[col]);
      } else {
        zrow.push(0);
      }
    }
    
    row = zrow.concat(trow);
    */
    
    if (rev) {
      row = row.reverse();
    }
    return row;
  },

  rotateGrid: function(rev) {
    var tgrid = [];
    for (var row = 0; row < this.grid.length; row++) {
      tgrid[row] = tgrid[row] || [];
      for (var col = 0; col < this.grid[row].length; col++) {
        // tgrid[row][col] = tgrid[row][col] || [];
        // console.log(col, row, this.grid[col][row]);
        tgrid[row][col] = this.grid[col][row];
      }
    }
    // console.warn("tgrid: ", tgrid);
    this.grid = tgrid;
  },

  rotate: function(component, event) {
    console.warn("rotate");
    this.rotateGrid(false);
    this.refresh(component);
  },

  combineRows: function(component, dir) {

    this.gridMod = {};
    
    if (dir === "up" || dir === "down") {
      this.rotateGrid(false);
    }
    var rev = false;
    var index = 0;
    for (var row = 0; row < this.grid.length; row++) {
      var rev = dir === "left" || dir === "up";
      index = rev ? this.grid.length - row : row;
      this.grid[row] = this.shiftRow(index, this.grid[row], rev);
    }
    if (dir === "up" || dir === "down") {
      this.rotateGrid(false);
    }
  },

  addValue: function(component) {
    var empty = {};
    var i = 0;
    for (var row = 0; row < this.grid.length; row++) {
      for (var col = 0; col < this.grid[row].length; col++) {
        if (this.grid[row][col] === 0) {
          empty[i] = {
            row: row,
            col: col
          };
          i++;
        }
      }
    }
    if (i === 0) {
      console.warn("No empty cells!")
    } else {
      var pos = Math.round(Math.random() * (i - 1));
      // console.warn("pos: ", pos);
      var val = Math.random() > 0.5 ? 4 : 2;
      empty[pos].val = val;
      // console.warn("val: ", val);
      // console.warn("empty[pos]: ", empty[pos]);
      this.grid[empty[pos].row][empty[pos].col] = val;
    }
    // this.refresh(component);
    return empty[pos];
  },

  swipe: function(component, dir) {
    // This is where the work is done!
    var t1 = Date.now();
    this.combineRows(component, dir);
    var t2 = Date.now();
    var newCell = this.addValue(component);
    var t3 = Date.now();
    this.refresh(component, newCell);
    var t4 = Date.now();
    console.warn("combineRows: " + (t2 - t1) + "ms");
    console.warn("addValue: " + (t3 - t2) + "ms");
    console.warn("refresh: " + (t4 - t3) + "ms");
    console.warn("total: " + (t4 - t1) + "ms");
  },
  
  startMove: function(component, clientX, clientY) {
    var id = component.getGlobalId();
    this.moves[id] = this.moves[id] || {};
    this.moves[id].startX = clientX;
    this.moves[id].startY = clientY;
  },

  move: function(component, clientX, clientY) {
    var id = component.getGlobalId();
    this.moves[id] = this.moves[id] || {};
    this.moves[id].lastX = clientX;
    this.moves[id].lastY = clientY;
  },

  endMove: function(component) {
    var id = component.getGlobalId();
    this.calculateDirection(component);
  },

  cancelMove: function(component, clientX, clientY) {

  },

  calculateDirection: function(component) {
    var id = component.getGlobalId();
    var move = this.moves[id];
    var x = move.startX - move.lastX;
    var y = move.startY - move.lastY;
    var z = Math.round(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    var r = Math.atan2(y, x);
    var swipeAngle = Math.round(r * 180 / Math.PI);
    swipeAngle = swipeAngle < 0 ? 360 - Math.abs(swipeAngle) : swipeAngle;
    var swipeDirection = null;
    if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
      swipeDirection = "left";
    } else if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
      swipeDirection = "left";
    } else if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
      swipeDirection = "right";
    } else if ((swipeAngle > 45) && (swipeAngle < 135)) {
      swipeDirection = "up";
    } else {
      swipeDirection = "down";
    }
    this.swipe(component, swipeDirection);
  },

  onTouchEvent: function(component, event) {
    if (!this.running) {
      return;
    }
    var e = event.touches[0];
    if (event.type === "touchstart") {
      this.startMove(component, e.clientX, e.clientY);
    } else if (event.type === "touchmove") {
      this.move(component, e.clientX, e.clientY);
    } else if (event.type === "touchend") {
      this.endMove(component);
    } else if (event.type === "touchcancel") {
      this.cancelMove(component);
    }
  },

  onMouseEvent: function(component, event) {
    if (!this.running) {
      return;
    }
    var e = event;
    if (e.which === 1) {
      if (event.type === "mousedown") {
        this.startMove(component, e.clientX, e.clientY);
      } else if (event.type === "mousemove") {
        this.move(component, e.clientX, e.clientY);
      } else if (event.type === "mouseup") {
        this.endMove(component);
      } else if (event.type === "mouseout") {
        this.cancelMove(component);
      }
    }
  },

  onKeyEvent: function(component, event) {
    this.keyMap = this.keyMap || {
      27: "stop",
      32: "start",
      37: "left",
      38: "up",
      39: "right",
      40: "down"      
    };
    var keyCode = event.charCode + event.keyCode;
    var command = this.keyMap[keyCode];
    if (!this.running) {
      if (command === "start") {
        this.start(component);
      }
    } else {
      if (command === "stop") {
        this.stop(component);
      } else {
        this.swipe(component, command);
      }
    }
    /*
     * up       37
     * left     38
     * right    39
     * down     40
     * escape   27
     * return   13
     * space    32
     */

  }
  
})