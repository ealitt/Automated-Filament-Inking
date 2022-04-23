export default class Draggable {
  constructor(p5, x, y, w, h, tool, draggable) {
    this.draggable = draggable;
    this.dragging = false; // Is the object being dragged?
    this.rollover = false; // Is the mouse over the ellipse?
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.offsetX = 0;
    this.offsetY = 0;
    this.tool = tool;
    this.selOffsetY = 265;
    this.selOffsetX = 152;
    this.selected = false;
    this.remove = false;
    this.createOptions(p5);
  }
  
  createOptions(p5) {
    this.sel = p5.createSelect();
    this.sel.position(this.x + this.selOffsetX, this.y + this.selOffsetY);
    this.sel.option('Tool 0');
    this.sel.option('Tool 1');
    this.sel.option('Tool 2');
    this.sel.option('Tool 3');
    this.sel.option('Tool 4');
    this.sel.selected(this.tool);
  }

  over(p5) {
    // Is mouse over object
    if (this.draggable && p5.mouseX > this.x && p5.mouseX < this.x + this.w && p5.mouseY > this.y && p5.mouseY < this.y + this.h) {
      this.rollover = true;
    } else {
      this.rollover = false;
    }
  }

  update(p5, gradientRegion) {
    // Adjust location if being dragged
    if (this.dragging && p5.mouseX > 0 && p5.mouseX < gradientRegion.x + gradientRegion.w) {
      this.x = p5.mouseX + this.offsetX;
      this.sel.position(this.x + this.selOffsetX, this.y + this.selOffsetY);
      if(p5.mouseY > 200) { this.remove = true }
      else { this.remove = false }
    }
  }

  show(p5, color) {
    p5.stroke(0);
    p5.fill(color);
    // Different fill based on state
    if (this.dragging || this.rollover || this.selected) {
      p5.strokeWeight(3);
    } else {
      p5.strokeWeight(1);
    }
    p5.rect(this.x, this.y, this.w, this.h);
  }

  pressed(p5) {
    // Did I click on the rectangle?
    if (this.draggable && p5.mouseX > this.x && p5.mouseX < this.x + this.w && p5.mouseX > 0 && p5.mouseY > this.y && p5.mouseY < this.y + this.h) {
      this.dragging = true;
      // If so, keep track of relative location of click to corner of rectangle
      this.offsetX = this.x - p5.mouseX;
      this.offsetY = this.y - p5.mouseY;
      this.selected = true;
    } else {
      this.selected = false;
    }
  }

  released(p5) {
    // Quit dragging
    this.dragging = false;
    this.remove = false;
  }
}