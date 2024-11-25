import React, { useContext, useState } from "react";
import { List, Card, Row, Col, Typography, Divider, Button, RadioChangeEvent, Radio } from "antd";
import FlightResultsContext from "../../contexts/FlightResultsContext";
import { useNavigate } from "react-router-dom";
import "./results.css";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";

dayjs.extend(duration);

const { Title, Text } = Typography;

const Results: React.FC = () => {
    const { flightResults, setFlightResults } = useContext(FlightResultsContext);
    const { setSelectedFlight } = useContext(FlightResultsContext);
    const [visibleResults, setVisibleResults] = useState(5);
    const navigate = useNavigate();

    const loadMore = () => {
        setVisibleResults((prev) => prev + 5);
    };

    const handleClick = (flightOffer: any) => {
        setSelectedFlight(flightOffer);
        navigate('/details');
    };

    const onChange = async (e: RadioChangeEvent) => {
        try {
            const response = await axios.get('http://localhost:8080/flights/sort', {
                params: {
                    type: e.target.value
                }
            }
            );
            const data = response.data;
            setFlightResults(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (

        <div className="resultsContainer">
            <Row className="resultsHeader" align="middle">
                <Col span={24}>
                    <Title level={3}>Results</Title>
                </Col>
                <Col span={7}>
                    <Button onClick={() => navigate("/")} icon={<ArrowLeftOutlined />}>
                        Back
                    </Button>
                </Col>
                <Col offset={8}>
                    <Title level={5}>Sort by:</Title>
                    <Radio.Group onChange={onChange} defaultValue={'price'}>
                        <Radio.Button value={"price"}>Price</Radio.Button>
                        <Radio.Button value={"duration"}>Duration</Radio.Button>
                        <Radio.Button value={"price-duration"}>Price-Duration</Radio.Button>
                        <Radio.Button value={"duration-price"}>Duration-price</Radio.Button>
                    </Radio.Group>
                </Col>
            </Row>
            <div className="resultsListContainer">
                <List
                    className="resultsList"
                    dataSource={flightResults.slice(0, visibleResults)}
                    renderItem={(offer: any) => (
                        <List.Item
                            onClick={() => handleClick(offer)}
                            key={offer.id}
                            className="clickableItem"
                        >
                            {offer.itineraries.map((itinerary: any, itineraryIndex: any) => (
                                <React.Fragment key={itineraryIndex}>
                                    <div className="itinerarySection">
                                        <Title level={4}>
                                            {itineraryIndex === 0 ? "Departure" : "Return"}
                                        </Title>

                                        {itinerary.segments.map((segment: any, segmentIndex: any) => (
                                            <React.Fragment key={segmentIndex}>
                                                <Card className="segmentCard">
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>Departure:</Text>{" "}
                                                            {dayjs(segment.departure.at).format("YYYY-MM-DD HH:mm")}
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text strong>Arrival:</Text>{" "}
                                                            {dayjs(segment.arrival.at).format("YYYY-MM-DD HH:mm")}
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>Departure Airport:</Text>{" "}
                                                            {segment.departure.airportCommonName} ({segment.departure.iataCode})
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text strong>Arrival Airport:</Text>{" "}
                                                            {segment.arrival.airportCommonName} ({segment.arrival.iataCode})
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <Text strong>Flight Duration:</Text>{" "}
                                                            {(() => {
                                                                const flightDuration = dayjs.duration(segment.duration).asMinutes();
                                                                const hours = Math.floor(flightDuration / 60);
                                                                const minutes = flightDuration % 60;
                                                                return `${hours}h ${minutes}m`;
                                                            })()}
                                                        </Col>
                                                    </Row>
                                                </Card>
                                                {segmentIndex < itinerary.segments.length - 1 && (
                                                    <div className="layoverInfo">
                                                        <Text strong>Layover Time:</Text>{" "}
                                                        {(() => {
                                                            const currentArrival = dayjs(segment.arrival.at);
                                                            const nextDeparture = dayjs(
                                                                itinerary.segments[segmentIndex + 1].departure.at
                                                            );
                                                            const layoverMinutes = nextDeparture.diff(currentArrival, "minutes");
                                                            const hours = Math.floor(layoverMinutes / 60);
                                                            const minutes = layoverMinutes % 60;
                                                            return `${hours}h ${minutes}m`;
                                                        })()}
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        ))}

                                    </div>
                                </React.Fragment>
                            ))}
                            <div className="offerSummary">
                                <Title level={5}>
                                    Total Time:{" "}
                                    {dayjs.duration(offer.totalDuration).format("HH[h] mm[m]")}
                                </Title>
                                <Title level={4}>
                                    Total: ${offer.price.total} {offer.price.currency}
                                </Title>
                                <List
                                    size="small"
                                    dataSource={offer.travelerPricings}
                                    renderItem={(price: any) => (
                                        <List.Item>
                                            <Text>{price.travelerType} {price.travelerId}: ${price.price.total} {price.price.currency}</Text>
                                        </List.Item>
                                    )}
                                />
                            </div>

                        </List.Item>
                    )}
                />
            </div>
            {visibleResults < flightResults.length && (
                <div className="loadMoreContainer">
                    <Button onClick={loadMore}>Load more</Button>
                </div>
            )}
        </div>
    );
};

export default Results;
