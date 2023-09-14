"use client";
import { useState } from "preact/hooks";

export type InfoBoxType = {
    index?: number;
    district?: string;
    BillQuantityJuly?: number | string;
    Q1_23?: number | string;
    Q1_24?: number | string;
    growth: number;
    Predictions_mt?: number | string;
    Target_mt?: number | string;
    Confidence?: number | string;
    shortfallinpercent?: number | string;
    shapeName?: string;
    shapeISO?: string;
    shapeID?: string;
    shapeGroup?: string;
    shapeType?: string;
    value?: number;
    state_name: string;
}

const InfoBox: React.FC<InfoBoxType> = (props) => {
    const shortfallinpercentValue = parseFloat(props.shortfallinpercent as string);
    const sign = shortfallinpercentValue >= 0 ? '+' : '-';
    const shortfallinpercentValueTitle = shortfallinpercentValue >= 0 ? 'Target Surplus % ' : 'Target Deficit % ';

    const growthSign = props.growth >= 0 ? '+' : '-';

    return (
        <div className="leaflet-top leaflet-right shadow-md shadow-slate-400">
            <div className="leaflet-control bg-white p-3">
                <h1 className="font-semibold text-black text-lg">{props.state_name ? "State Name: " : ""} {props.state_name}</h1>
                <h1 className="font-semibold text-black text-lg">District Name:  {props.shapeName ? props.shapeName : ""}</h1>
                <h2 className="font-[600] text-black text-sm">Error :{props.growth ? growthSign + Math.abs(props.growth) + " %" : "No Data Available"}</h2>
                <h1 className="font-[600] text-black text-sm">{props.Target_mt ? "Target (Aug): " : ""} {props.Target_mt ? props.Target_mt : ""} </h1>
                <h1 className="font-[600] text-black text-sm">{props.Predictions_mt ? "Prediction (Aug): " : ""} {props.Predictions_mt ? props.Predictions_mt : ""} </h1>
                <h1 className="font-[600] text-black text-sm">{props.Confidence ? "Confidence (Aug): " : ""} {props.Confidence ? props.Confidence : ""} </h1>
                <h1 className="font-[600] text-black text-sm">{props.BillQuantityJuly ? "Bill Quantity (July): " : ""} {props.BillQuantityJuly ? props.BillQuantityJuly : ""} </h1>
                <h1 className="font-[600] text-black text-sm">{props.shortfallinpercent ? shortfallinpercentValueTitle + ": " : ""} {props.shortfallinpercent ? sign + Math.abs(shortfallinpercentValue) + " %" : ""} </h1>
                <h2 className="font-[600] text-black text-sm">Target : {props.Q1_23}</h2>
                <h2 className="font-[600] text-black text-sm">Actual : {props.Q1_24}</h2>
            </div>
        </div>
    );
}

export default InfoBox;

export interface FeaturesEntity {
    type: string;
    properties: Properties;
    geometry: Geometry;
}
export interface Properties {
    index: number;
    district: string;
    BillQuantityJuly?: number;
    Q1_23: number;
    Q1_24: number;
    growth: number;
    Predictions_mt?: number;
    Target_mt?: number;
    Confidence?: number;
    shortfallinpercent?: number;
    shapeName: string;
    shapeISO: string;
    shapeID: string;
    shapeGroup: string;
    shapeType: string;
    value: number;
    state_name: string;
}
export interface Geometry {
    type: string;
    coordinates?: any | null;
}

export interface GeoJsonType {
    type: string;
    crs: CRS;
    features: FeaturesEntity[];
}

interface CRS {
    type: string;
    properties: {
        name: string;
    };
}
