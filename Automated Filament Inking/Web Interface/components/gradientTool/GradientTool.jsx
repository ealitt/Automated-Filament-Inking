import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic'
import Draggable from './draggable.js'
import DownloadButton from "../DownloadButton.jsx";


const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
    ssr: false,
  })
  
  let gradientRegion = {
    x: 1,
    y: 1,
    h: 25,
    w: 0,
  }
  let toolSize = 20;
  
  let colors = [];
  let tool_0;
  let tool_1;
  let tool_2;
  let tool_3;
  let tool_4;
  let tool_0_text;
  
  let sel;
  
  let cnv;

  export default ({getColors}) => {
    const [p5, setP5] = useState();
    const [filamentLength, setFilamentLength] = useState();

    useEffect(() => {
        window.addEventListener("resize", windowResized);
             
        return () => window.removeEventListener("resize", windowResized);
    }, []);

    const setup = (p5, canvasParentRef) => {
        setP5(p5);
        cnv = p5.createCanvas(window.innerWidth/5, window.innerHeight/5).parent(canvasParentRef);
        gradientRegion.w = window.innerWidth/5 - 6;
        p5.colorMode(p5.HSB);
        p5.textSize(14);
        
        createColorPickers(p5);
        
        let anchor = new Draggable(p5, 0, 40, toolSize, toolSize, 'Tool 0', false);
        colors = [anchor];

        cnv.mousePressed((event, ...rest) => {
            addColor(p5);
            colors.forEach(color => {
                color.pressed(p5);
            })
        });

        cnv.mouseReleased((event, ...rest) => {
            colors.forEach(color => {
                color.released(p5);
            })
        });
    }
      
    const draw = (p5) => {
        p5.background('#94a3b8');
        colors.forEach((color) => {
            color.over(p5);
            color.update(p5, gradientRegion);
            color.show(p5, getColor(p5, color.sel.value()));
        })
        // text('Tool 0', 1, 300);
        createGradient(p5, colors);
        removeColors(p5, colors);
        // getColors({colors: colors, gradient: gradientRegion});
    }

    const removeColors = (p5, colors) => {
        colors.forEach((color, index) => {
            if(color.selected && color.remove) {
                color.sel.remove();
                colors.splice(index, 1);
            }
        })
    }
      
    const getColor = (p5, tool) => {
        if(tool == 'Tool 0') {
          return tool_0.color();
        } else if (tool == 'Tool 1') {
          return tool_1.color();
        } else if (tool == 'Tool 2') {
          return tool_2.color();
        } else if (tool == 'Tool 3') {
          return tool_3.color();
        } else {
          return tool_4.color();
        }
    }
      
    const createGradient = (p5, colors) => {
        let prevX = 1;
        let offsetX = toolSize/4;
        sortColors(colors).forEach((color) => {  
            p5.strokeWeight(2);
            p5.fill(getColor(p5, color.sel.value()));
        //   p5.rect(gradientRegion.x + prevX, gradientRegion.y, color.x+offsetX, gradientRegion.h); 
            p5.rect(color.x+offsetX, gradientRegion.y, gradientRegion.w-color.x, gradientRegion.h)
          prevX = color.x+offsetX;
        })
    }
      
    const sortColors = (colors) => {
        return colors.sort((a, b) => (a.x > b.x) ? 1 : (a.x === b.x) ? ((a.x > b.x) ? 1 : -1) : -1 )
    }
      
    const createColorPickers = (p5) => {
        tool_0 = p5.createColorPicker('#00FFFF');
        tool_1 = p5.createColorPicker('#FF00FF');
        tool_2 = p5.createColorPicker('#FFFF00');
        tool_3 = p5.createColorPicker('#000000');
        tool_4 = p5.createColorPicker('#FFFFFF');

        // tool_0.position(window.innerWidth/10,350);
        // tool_1.position(window.innerWidth/10,380);
        // tool_2.position(window.innerWidth/10,410);
        // tool_3.position(window.innerWidth/10,440);
        // tool_4.position(window.innerWidth/10,470);
        
        tool_0.position(window.innerWidth/10,350);
        tool_1.position(window.innerWidth/10+75,350);
        tool_2.position(window.innerWidth/10+75*2,350);
        tool_3.position(window.innerWidth/10+75*3,350);
        tool_4.position(window.innerWidth/10+75*4,350);
    }
      
    const addColor = (p5) => {
        if (p5.mouseX > gradientRegion.x && p5.mouseX < gradientRegion.x + gradientRegion.w && p5.mouseY > gradientRegion.y && p5.mouseY < gradientRegion.y + gradientRegion.h) {
          colors.push(new Draggable(p5, p5.mouseX, 40, toolSize, toolSize, 'Tool 0', true));
        }
    };

    function windowResized() {
        // keep in mind, `p5` can be `undefined`
        // so check it before using
        if (p5) {
            p5.resizeCanvas(window.innerWidth/5, window.innerHeight/5);
        }        
    }
    
    const generateInkingFile = () => {
        if(filamentLength > 0) {
            let colorChanges = [];
            sortColors(colors).forEach((color) => {
                let pos = filamentLength*(color.x/(gradientRegion.w));
                if(color.sel.value() == 'Tool 0') {
                    colorChanges.push(`E${pos} C1 M0 Y0 K0`);
                  } else if (color.sel.value() == 'Tool 1') {
                    colorChanges.push(`E${pos} C0 M1 Y0 K0`);
                  } else if (color.sel.value() == 'Tool 2') {
                    colorChanges.push(`E${pos} C0 M0 Y1 K0`);
                  } else if (color.sel.value() == 'Tool 3') {
                    colorChanges.push(`E${pos} C0 M0 Y0 K1`);
                  } else {
                    colorChanges.push(`E${pos} C0 M0 Y0 K0`);
                  }
            })
            colorChanges.push(`E${filamentLength} C0 M0 Y0 K0`);
            event.preventDefault();
            const blob = new Blob([colorChanges.join('\n')]);
            saveAs(blob, `inking.txt`);
        }
    }

    const setValue = (e) => setFilamentLength(e.target.value);

    return (
        <div className="flex flex-col">
            <div>
                Currently an experimental feature
            </div>
            <Sketch setup={setup} draw={draw}></Sketch>
            <div className="flex flex-col space-y-6">
                <div>
                    <label for="length" class="block text-md font-semibold text-gray-700">Length of Filament</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                        <input type="text" name="length" id="length" class="h-10 focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md" 
                                placeholder="0.00"
                                value={filamentLength}
                                onChange={setValue}></input>
                        <div class="absolute inset-y-0 right-0 flex items-center">
                        <label for="" class="sr-only"></label>
                        <select id="" name="" class="focus:ring-blue-500 focus:border-blue-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md">
                            {/* <option>Meters</option>
                            <option>Centimeters</option> */}
                            <option>Milimeters</option>
                        </select>
                        </div>
                    </div>
                </div>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg'
                    onClick={generateInkingFile}>Download</button>
            </div>
        </div>
    );
  };