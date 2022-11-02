import React, { useEffect } from "react";
import * as Three from 'three';
import { Canvas } from "@react-three/fiber";
import Line from "./sceneComponents/Line";
import Plane from "./sceneComponents/Plane";
import { OrbitControls, OrthographicCamera, Center } from '@react-three/drei'

function getPointsFromGcode(gcode) {
    let gcodeData = {};

    let lines = gcode.split('\n');
    let points = [];
    let pointSets = [];

    let identifiers = ['G1'];
    let excluders = [';'];
    let specialCases = ['; intro line'];
    
    let coords = { 'X': 0, 'Y': 0, 'Z': 0 };

    let filamentCounter = 0;
    let colorChanges = [];
    let colors = {
        'cyan': 0x00FFFF,
        'magenta': 0xFF00FF,
        'yellow': 0xFFFF00,
        'black': 0x000000,
        'white': 0xFFFFFF,
    }
    let currColor = new Three.Color(colors.white); // default color

    for(let idx = 0; idx < lines.length; idx++) {
        let line = lines[idx];
        if(specialCases.some(el => line.includes(el))) {
            console.log('INTRO LINE')
        }
        if((identifiers.some(el => line.includes(el)) && !excluders.some(el => line.includes(el))) || (specialCases.some(el => line.includes(el)) && colorChanges.length < 1)) {
            let params = line.split(' ');
            ['X','Y','Z'].forEach((coord, index) => {
                params.forEach(param => {
                    if(param.includes(coord)) {
                        coords[coord] = parseFloat(param.substr(1));
                    }
                })
            })
            points.push(-coords['X'], coords['Z'], coords['Y']);

            params.forEach(param => {
                if(param.includes('E')) {
                    let extruderVal = parseFloat(param.substr(1));
                    if(!isNaN(extruderVal)) {
                        filamentCounter += extruderVal;
                    }
                }
            })
        }
        else if(line == "T0" || line == "T1" || line == "T2" || line == "T3" || line == "T4") {
            pointSets.push({ 'points': points, 'color': new Three.Color(currColor) })
            points = [];

            if(currColor == colors.cyan) { colorChanges.push(`E${filamentCounter} C1 M0 Y0 K0`) }
            else if(currColor == colors.magenta) { colorChanges.push(`E${filamentCounter} C0 M1 Y0 K0`) }
            else if(currColor == colors.yellow) { colorChanges.push(`E${filamentCounter} C0 M0 Y1 K0`) }
            else if(currColor == colors.black) { colorChanges.push(`E${filamentCounter} C0 M0 Y0 K1`) }
            else if(currColor == colors.white) { colorChanges.push(`E${filamentCounter} C0 M0 Y0 K0`) };
            
            if(line == "T0") { currColor = colors.cyan}
            else if(line == "T1") { currColor = colors.magenta }
            else if(line == "T2") { currColor = colors.yellow }
            else if(line == "T3") { currColor = colors.black }
            else if(line == "T4") { currColor = colors.white }


        }
        if(idx == lines.length-1){
            if(colorChanges.length > 0) {
                let firstLine = colorChanges[0];
                colorChanges.splice(0, 0, `E0${firstLine.substr(firstLine.indexOf(' '))}`);
                colorChanges.push(`E${filamentCounter}${colorChanges[colorChanges.length-2].substr(colorChanges[colorChanges.length-1].indexOf(' '))}`); 
                colorChanges.push(`E${filamentCounter+250} C0 M0 Y0 K0`); 
                if(typeof pointSets[pointSets.length-2] == 'undefined') {
                    pointSets.push({ 'points': points, 'color':  new Three.Color(currColor)})
                } else {
                    pointSets.push({ 'points': points, 'color': new Three.Color(currColor)})
                }
            } else {
                colorChanges.push(`E0 C0 M0 Y0 K0`);
                colorChanges.push(`E${filamentCounter} C0 M0 Y0 K0`); 
                colorChanges.push(`E${filamentCounter+250} C0 M0 Y0 K0`);
                console.log('filamentCounter'); 
                console.log(filamentCounter); 
            }
        }
    }

    
    gcodeData['colorChanges'] = colorChanges;
    console.log(colorChanges);
    if(pointSets.length == 0){ 
        pointSets.push({ 'points': points, 'color': new Three.Color(currColor)})
    }

    gcodeData['pointSets'] = pointSets;
    return gcodeData;
}

export default function GcodeViewer({ gcodeSource, getColorChanges }) {
    let gcodeData = getPointsFromGcode(gcodeSource);
    let rows = [];

    console.log(gcodeData['pointSets'][0]['points'])
    for(let i = 0; i < gcodeData['pointSets'].length; i++) {
        rows.push(<Line points={gcodeData['pointSets'][i]['points']} key={i} color={gcodeData['pointSets'][i]['color']}/>)
    }

    useEffect(() => {
        getColorChanges(gcodeData['colorChanges']);
    }, [gcodeSource]);

    return (
    <div className="w-2/3 h-full px-2 py-2 bg-slate-300 sm:px-0 flex rounded-lg">
        <Canvas
          shadows={true}
          className=''
          camera={{
              position: [60,100,-80]
          }}>
            <ambientLight color={"white"} intensity={0.2} />
            <OrthographicCamera />
            <OrbitControls makeDefault />
            <Center>
                {rows}
                <Plane/>
            </Center>
        </Canvas>
    </div>
    )
}
