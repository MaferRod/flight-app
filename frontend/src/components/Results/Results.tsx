import React, { useContext, useState } from "react";
import { List, Card, Row, Col, Typography, Divider, Button } from "antd";
import FlightResultsContext from "../../contexts/FlightResultsContext";
import { useNavigate } from "react-router-dom";
import "./results.css";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { ArrowLeftOutlined } from "@ant-design/icons";

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
        /*navigate to details*/
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
                                            <Card className="segmentCard" key={segmentIndex}>
                                                <Row>
                                                    <Col span={12}>
                                                        <Text strong>Dept. date:</Text>{" "}
                                                        {dayjs(segment.departure.at).format(
                                                            "YYYY-MM-DD HH:mm"
                                                        )}
                                                    </Col>
                                                    <Col span={12}>
                                                        <Text strong>Arr. date:</Text>{" "}
                                                        {dayjs(segment.arrival.at).format(
                                                            "YYYY-MM-DD HH:mm"
                                                        )}
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={12}>
                                                        <Text strong>Dept. airport:</Text>{" "}
                                                        {segment.departure.airportCommonName} (
                                                        {segment.departure.iataCode})
                                                    </Col>
                                                    <Col span={12}>
                                                        <Text strong>Arr. airport:</Text>{" "}
                                                        {segment.arrival.airportCommonName} (
                                                        {segment.arrival.iataCode})
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <Text strong>Duration:</Text>{" "}
                                                        {dayjs
                                                            .duration(segment.duration)
                                                            .format("HH[h] mm[m]")}
                                                    </Col>
                                                </Row>
                                            </Card>
                                        ))}
                                    </div>
                                </React.Fragment>
                            ))}
                            <div className="offerSummary">
                                <Title level={5}>
                                    Total time:{" "}
                                    {dayjs
                                        .duration(offer.totalDuration)
                                        .format("HH[h] mm[m]")}
                                </Title>
                                <Title level={4}>
                                    ${offer.price.total} {offer.price.currency} Total
                                </Title>
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
