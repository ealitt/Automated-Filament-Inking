import React, { useCallback, useState } from 'react'
import DownloadButton from './DownloadButton.jsx';

import GradientTool from './gradientTool/GradientTool.jsx';

export default function FileInfo({gcode}) {
    const getColors = (getColors) => {
        
    }

    return (
        <div className='h-full w-full p-2'>
            <GradientTool getColors={getColors}></GradientTool>
        </div>
    )
}