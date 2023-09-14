'use-client';

import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Tooltip, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import './heatmap.css';
import Legend from "../legend/legend";
import InfoBox, { FeaturesEntity, GeoJsonType, InfoBoxType } from "../infobox/infobox";
import StateMap from "../stateMap/stateMap";
import { GetColor, markers, markersType, replaceSLCase } from "../IndiaMap/indiaMap";

const FeaturesEntityDefulte: GeoJsonType = {
    type: "FeatureCollection",
    crs: {
        type: "name",
        properties: {
            name: "urn:ogc:def:crs:OGC:1.3:CRS84"
        }
    },
    features: []
}

const HeatMap: React.FC = () => {
    const center: [number, number] = [20.5937, 78.9629];
    const [showStateMap, setShowStateMap] = useState(false);
    const [stateGeoJson, setstateGeoJson] = useState<any | null>(null)
    const [stateName, setstateName] = useState<string>("")
    const [indiaMapShow, setIndiaMapShow] = useState<boolean>(false)
    const [indiaState, setIndiaState] = useState<GeoJsonType | any>(null)
    const [opacity, setOpacity] = useState<number>(1)
    const [stateBorder, setStateBorder] = useState<GeoJsonType | any>(null)
    const [shapeData, setShapeData] = useState<InfoBoxType>({
        index: 0,
        district: "",
        BillQuantityJuly: 0,
        Q1_23: 0,
        Q1_24: 0,
        growth: 0,
        Predictions_mt: 0,
        shapeName: "",
        shapeISO: "",
        shapeID: "",
        shapeGroup: "",
        shapeType: "",
        value: 0,
        state_name: "",
    })

    fetch(`${'https://raw.githubusercontent.com/vdalucard/map_data_aug_23/main/india_aug_map_v2.geojson'}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data: any) => {
            setIndiaState(data);
            setIndiaMapShow(true)
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
        
    const handleDataReceived = (data: InfoBoxType) => {
        setShapeData(prevState => ({
            ...prevState,
            shapeName: data.shapeName,
            growth: data.growth,
            Q1_23: data.Q1_23 + " KMT",
            Q1_24: data.Q1_24 + " KMT",
            state_name: data.state_name,
            BillQuantityJuly: data.BillQuantityJuly + " KMT",
            Confidence: data.Confidence,
            Target_mt: data.Target_mt + " KMT",
            Predictions_mt: data.Predictions_mt + " KMT",
            shortfallinpercent: data.shortfallinpercent
        }));
        
        if (data.district == "0") {
            setShapeData(objectdata => ({
                ...objectdata,
                Q1_23: "No Data Available",
                Q1_24: "No Data Available",
                BillQuantityJuly: "No Data Available",
                Confidence: "No Data Available",
                Target_mt: "No Data Available",
                Predictions_mt: "No Data Available",
                shortfallinpercent: "No Data Available"
            }))
        }
        setstateName(data.state_name)
    };

    const handleHover: (e: any) => void = (e: any) => {
        const layer = e.target;

        setstateName(layer.feature.properties.shapeName)
        setShapeData(e => ({
            ...e,
            growth: layer.feature.properties.growth,
            shapeName: "",
            Q1_23: layer.feature.properties.Q1_23 + " KMT",
            Q1_24: layer.feature.properties.Q1_24 + " KMT",
            state_name: layer.feature.properties.shapeName,
            shortfallinpercent: layer.feature.properties.shortfallinpercent,
            BillQuantityJuly: layer.feature.properties.BillQuantityJuly + " KMT",
            Confidence: layer.feature.properties.Confidence,
            Target_mt: layer.feature.properties.Target_mt + " KMT",
            Predictions_mt: layer.feature.properties.Predictions_mt + " KMT",
        }))
        if (layer.feature.properties.district == "0" || layer.feature.properties.shortfallinpercent == null) {
            setShapeData(objectdata => ({
                ...objectdata,
                Q1_23: "No Data Available",
                Q1_24: "No Data Available",
                shortfallinpercent: 0,
                BillQuantityJuly: "No Data Available",
                Confidence: "No Data Available",
                Target_mt: "No Data Available",
                Predictions_mt: "No Data Available"
            }))
        }

        layer.setStyle({
            weight: 3,
        });
    };

    const resetHover: (e: any) => void = (e: any) => {
        const layer = e.target;
        layer.setStyle({
            weight: 1,
        });
    };


    const clickOnState: (e: any) => void = (e: any) => {
        const layer = e.target;

        layer.setStyle({
            weight: 3,
        });

        setShowStateMap(false)
        setstateName(layer.feature.properties.shapeName)
        const stateName = layer.feature.properties.shapeName.replace(/\s/g, '');
        fetch(`${'https://raw.githubusercontent.com/vdalucard/map_data_aug_23/main/states_aug_v2/' + stateName + '.geojson'}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data: GeoJsonType) => {
                setstateGeoJson(data);
                indiaState.features.forEach((e: FeaturesEntity) => {
                    if (replaceSLCase(e.properties.shapeName) == replaceSLCase(layer.feature.properties.shapeName)) {
                        let arr: FeaturesEntity[] = [e]
                        setStateBorder(() => ({
                            ...FeaturesEntityDefulte,
                            features: arr
                        }))
                    }
                })

                setShowStateMap(true);
                setOpacity(0)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });

        setShapeData(e => ({
            ...e,
            growth: layer.feature.properties.growth,
            shapeName: ""
        }))
    };

    const onEachFeature: (feature: any, layer: any) => void = (feature: any, layer) => {
        layer.on({
            mouseover: handleHover,
            mouseout: resetHover,
            click: clickOnState
        });

        if (replaceSLCase(feature.properties.shapeName) == replaceSLCase("Gujarat") || replaceSLCase(feature.properties.shapeName) == replaceSLCase("Goa") || replaceSLCase(feature.properties.shapeName) == replaceSLCase("UttarPradesh") || replaceSLCase(feature.properties.shapeName) == replaceSLCase("AndhraPradesh") || replaceSLCase(feature.properties.shapeName) == replaceSLCase("Odisha") || replaceSLCase(feature.properties.shapeName) == replaceSLCase("WestBengal") || replaceSLCase(feature.properties.shapeName) == replaceSLCase("Maharashtra") || replaceSLCase(feature.properties.shapeName) == replaceSLCase("TamilNadu") || replaceSLCase(feature.properties.shapeName) == replaceSLCase("MadhyaPradesh") || replaceSLCase(feature.properties.shapeName) == replaceSLCase("Assam") || replaceSLCase(feature.properties.shapeName) == replaceSLCase("Bihar") || replaceSLCase(feature.properties.shapeName) == replaceSLCase("Karnataka")) {

        } else {
            layer.bindTooltip(`<p><b>${feature.properties.shapeName}</b></p>`, {
                permanent: true,
                direction: "center",
                className: "custom-tooltip",
            })
        }

        layer.setStyle({
            fillColor: GetColor!(feature.properties.shortfallinpercent) || "#909497",
            weight: 1,
            opacity: 1,
            color: '#181818',
            dashArray: '',
        });

        if (layer.feature.properties.district == 0 || feature.properties.shortfallinpercent == null) {
            layer.setStyle({
                fillColor: "#AED6F1",
            });
        }
    };

    const customIcon = new L.Icon({
        iconUrl: '/gj.png',
        iconSize: [1, 1],
        iconAnchor: [1, 1],
        popupAnchor: [0, 0],
    });

    const SetViewOnClick = () => {
        const map = useMapEvent('click', (e) => {
            map.setView(e.latlng, 7)
        })

        return null
    }
    const SetViewOnZoom = () => {
        const map = useMapEvent('zoom', (e) => {
            if (map.getZoom() < 6) {
                setShowStateMap(false)
                setOpacity(1)
            }
        })

        return null
    }

    return (
        <div>
            {
                indiaMapShow &&
                <MapContainer center={center} zoom={5} minZoom={4} style={{ height: "93vh", position: "relative" }}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
                    />
                    <Legend LegendName="Target Deficit/Surplus %" />
                    <InfoBox
                        shapeName={shapeData.shapeName}
                        growth={shapeData.growth}
                        state_name={stateName}
                        Q1_23={shapeData.Q1_23}
                        Q1_24={shapeData.Q1_24}
                        BillQuantityJuly={shapeData.BillQuantityJuly}
                        Confidence={shapeData.Confidence}
                        Target_mt={shapeData.Target_mt}
                        Predictions_mt={shapeData.Predictions_mt}
                        shortfallinpercent={shapeData.shortfallinpercent}
                    />
                    {
                        markers.map((marker: markersType) => (
                            <Marker key={marker.id} position={marker.position} icon={customIcon}>
                                <Tooltip direction="center" opacity={1} permanent className="custom-tooltip-class">
                                    <p className="font-extrabold">{marker.name}</p>
                                </Tooltip>
                            </Marker>
                        ))
                    }

                    <GeoJSON
                        data={indiaState}
                        onEachFeature={onEachFeature}
                        style={{
                            fillOpacity: opacity,
                        }}
                    />

                    {
                        showStateMap &&
                        <GeoJSON data={stateBorder} style={{
                            fillColor: "#181818",
                            weight: 5,
                            opacity: 1,
                            color: '#181818',
                            dashArray: '',
                            fillOpacity: 0,
                        }}
                        />
                    }

                    {
                        showStateMap &&
                        <StateMap data={stateGeoJson} sendDataToParent={handleDataReceived} Unit="KMT" ColorCode="shortfallinpercent" />
                    }

                    <SetViewOnClick />
                    <SetViewOnZoom />
                </MapContainer>
            }
        </div>
    );
};

export default HeatMap;
