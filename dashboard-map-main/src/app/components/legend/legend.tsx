import { useCallback, useMemo, useState } from "react"
import { Rectangle, useMap, useMapEvent } from "react-leaflet"
import './legend.css'
const outerBounds = [
    [50.505, -29.09],
    [52.505, 29.09],
]

type LegendProps = {
    LegendName: string;
}
const Legend: React.FC<LegendProps> = (props) => {
    const grades: number[] = [-200, -100, -50, 0, 50, 100, 200, 500];
    return (
        <div className="leaflet-bottom leaflet-right shadow-md shadow-slate-400">
            <div className="leaflet-control bg-white p-3">
                <h1 className="text-black font-bold text-sm">
                    {props.LegendName}
                </h1>
                <div className="info legend text-black" >
                    <i style={{ backgroundColor: getColor(-75) }}></i>-100 to -50
                </div>
                <div className="info legend text-black" >
                    <i style={{ backgroundColor: getColor(-30) }}></i>-50 to -20
                </div>
                <div className="info legend text-black" >
                    <i style={{ backgroundColor: getColor(-10) }}></i>-20 to 0
                </div>
                <div className="info legend text-black" >
                    <i style={{ backgroundColor: getColor(10) }}></i>0 to 20
                </div>
                <div className="info legend text-black" >
                    <i style={{ backgroundColor: getColor(30) }}></i>20 to 50
                </div>
                <div className="info legend text-black" >
                    <i style={{ backgroundColor: getColor(75) }}></i>50 to 100
                </div>
                <div className="info legend text-black" >
                    <i style={{ backgroundColor: getColor(150) }}></i>100+
                </div>
                <div className="info legend text-black" >
                    <i style={{ backgroundColor: "#AED6F1" }}></i>No Data
                </div>
            </div>
        </div >
    )
}

export default Legend;

function getColor(d: number) {
    if (d > 100) {
        return "#0B5345"
    } else if (50 < d && d <= 100) {
        return "#145A32"
    } else if (20 < d && d <= 50) {
        return "#1E8449"
    } else if (0 < d && d <= 20) {
        return "#27AE60"
    } else if (-20 < d && d <= 0) {
        return "#EC7063"
    } else if (-50 < d && d <= -20) {
        return "#E74C3C"
    } else if (-100 < d && d <= -50) {
        return "red"
    }
}
