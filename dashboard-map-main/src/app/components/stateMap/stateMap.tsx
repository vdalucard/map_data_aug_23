'use-client';

import React, { useEffect, useState } from "react";
import { GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { GetColor } from "../IndiaMap/indiaMap";
import { FeaturesEntity, InfoBoxType } from "../infobox/infobox";
import "./stateMap.css"
interface StateMapProps {
    data: any | null
    sendDataToParent: (data: InfoBoxType) => void; // Declare the prop type for the callback function
    Unit: string;
    ColorCode: string
}

const StateMap: React.FC<StateMapProps> = ({ data, sendDataToParent, Unit, ColorCode }) => {
    const handleClickState: (e: any) => void = (e: any) => {
        const layer = e.target;
    }

    const handleHoverState: (e: any) => void = (e) => {
        const layer = e.target;
        layer.setStyle({
            weight: 3,
            opacity: 1,
            color: "#181818",
            dashArray: '',
            fillOpacity: 1,
            transition: 'all 0.4 ease',
        });
        layer.openPopup();
        sendDataToParent({
            shapeName: layer.feature.properties.shapeName,
            growth: layer.feature.properties.growth,
            Q1_23: layer.feature.properties.Q1_23,
            Q1_24: layer.feature.properties.Q1_24,
            district: layer.feature.properties.district,
            state_name: layer.feature.properties.state_name,
            BillQuantityJuly: layer.feature.properties.BillQuantityJuly,
            Target_mt: layer.feature.properties.Target_mt,
            Confidence: layer.feature.properties.Confidence,
            Predictions_mt: layer.feature.properties.Predictions_mt,
            shortfallinpercent: layer.feature.properties.shortfallinpercent
        });
    };

    const resetHoverState: (e: any) => void = (e: any) => {
        const layer = e.target;
        layer.setStyle({
            weight: 1.5,
            opacity: 1,
            color: "#181818",
            dashArray: '3',
            fillOpacity: 1,
            transition: 'all 0.4 ease',
        });
        layer.closePopup();
    };

    const onEachFeatureState: (feature: FeaturesEntity, layer: any) => void = (feature: FeaturesEntity, layer) => {
        layer.on({
            mouseover: handleHoverState,
            mouseout: resetHoverState,
            click: handleClickState
        });

        if (ColorCode == "growth") {
            layer.setStyle({
                fillColor: GetColor!(feature.properties.growth) || "#909497",
            });
        }
        if (ColorCode == "shortfallinpercent") {
            layer.setStyle({
                fillColor: GetColor!(feature.properties.shortfallinpercent!) || "#909497",
            });
        }
        layer.setStyle({
            weight: 1.5,
            opacity: 1,
            color: '#181818',
            dashArray: '3',
            fillOpacity: 1,
            transition: 'all 0.4 ease',
        });

        if (layer.feature.properties.district == 0) {
            layer.setStyle({
                fillColor: "#AED6F1",
            });
            layer.bindTooltip(`<p className="distric_name">${layer.feature.properties.shapeName}</p>`, {
                permanent: true,
                direction: "center",
                className: "dis-custom-tooltip",
            })

        } else {
            layer.bindTooltip(`<p className="distric_name">${layer.feature.properties.shapeName}</p>`, {
                permanent: true,
                direction: "center",
                className: "dis-custom-tooltip",
            })

            const shortfallinpercentValue = parseFloat(feature.properties.shortfallinpercent as unknown as string);
            const sign = shortfallinpercentValue >= 0 ? '+' : '-';
            const shortfallinpercentValueTitle = shortfallinpercentValue >= 0 ? 'Target Surplus % ' : 'Target Deficit % ';
            layer.bindPopup(`
        <b>${feature.properties.shapeName}</b><br>
        Error: ${feature.properties.growth} % </br>
         ${feature.properties.Target_mt ? "Target (Aug): " + feature.properties.Target_mt + " " + Unit + "</br>" : ""}
       ${feature.properties.Target_mt ? "Predictions (Aug): " + feature.properties.Predictions_mt + " " + Unit + "</br>" : ""}
       ${feature.properties.Confidence ? "Confidence (Aug): " + feature.properties.Confidence + "</br>" : ""}
       ${feature.properties.BillQuantityJuly ? "Bill Quantity July: " + feature.properties.BillQuantityJuly + " " + Unit + "</br >" : ""}
       ${feature.properties.shortfallinpercent ? shortfallinpercentValueTitle + " : " + sign + Math.abs(feature.properties.shortfallinpercent) + " % </br>" : ""}
        Actual : ${parseFloat(feature.properties.Q1_23!.toString()).toFixed(2)} ${Unit} </br>
        Target : ${parseFloat(feature.properties.Q1_24!.toString()).toFixed(2)} ${Unit} </br>
        `, {
                direction: "right",
                className: "dis-custom-tooltip",
            })
            layer.closePopup();
        }
    };

    useEffect(() => {
    }, [data]);

    return (
        <GeoJSON
            data={data}
            onEachFeature={onEachFeatureState}
        />
    );
};

export default StateMap;


export interface RootGeoJson {
    type: string;
    features: Feature[];
}

interface Feature {
    type: string;
    properties: Properties | PropertiesDist;
    geometry: Geometry;
}

interface Geometry {
    type: string;
    coordinates: (number[] | number)[][][];
}

interface Properties {
    shapeName: string;
    shapeISO: string;
    shapeID: string;
    shapeGroup: string;
    shapeType: string;
    value: number;
}

interface PropertiesDist {
    ID_0: number;
    ISO: string;
    NAME_0: string;
    ID_1: number;
    NAME_1: string;
    ID_2: number;
    NAME_2: string;
    NL_NAME_2?: any;
    VARNAME_2?: any;
    TYPE_2: string;
    ENGTYPE_2: string;
}