import React, { useContext } from "react";
import FlightResultsContext from "../../contexts/FlightResultsContext";
import { Button, Card, Col, Divider, List, Row, Typography } from "antd";
import "./details.css";
import dayjs from "dayjs";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const DetailsPage: React.FC = () => {
    const { selectedFlight } = useContext(FlightResultsContext);
    const traveler = selectedFlight.travelerPricings[0];

    return (
        <div className="detailsContainer">
            <Row className="detailsHeader" align="middle">
                <Col span={24}>
                    <Title>Flight Details</Title>
                </Col>
            </Row>
            <Row>
                <Col span={17}>
                    <List
                        itemLayout="vertical"
                        dataSource={selectedFlight.itineraries}
                        renderItem={(itinerary: any, itineraryIndex: any) => (
                            <List.Item key={itineraryIndex}>
                                <Title level={3}>
                                    {itineraryIndex === 0 ? "Departure" : "Return"}
                                </Title>
                                {itinerary.segments.map((segment: any, segmentIndex: any) => (
                                    <React.Fragment key={segmentIndex}>
                                        <Row className="segmentRow">
                                            <Card className="segmentCard">
                                                <Row>
                                                    <Col span={18}>
                                                        <Title level={4}>Segment</Title>
                                                        <Row>
                                                            <Col span={12}>
                                                                <Text strong>Departure date:</Text>
                                                                <div>{dayjs(segment.departure.at).format("YYYY-MM-DD")}</div>
                                                                <Text strong>Departure hour:</Text>
                                                                <div>{dayjs(segment.departure.at).format("HH:mm")}</div>
                                                            </Col>
                                                            <Col span={12}>
                                                                <Text strong>Arrival date:</Text>
                                                                <div>{dayjs(segment.arrival.at).format("YYYY-MM-DD")}</div>
                                                                <Text strong>Arrival hour:</Text>
                                                                <div>{dayjs(segment.arrival.at).format("HH:mm")}</div>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col span={12}>
                                                                <Text strong>Deptarture airport:</Text>{" "}
                                                                {segment.departure.airportCommonName} ({segment.departure.iataCode})
                                                            </Col>
                                                            <Col span={12}>
                                                                <Text strong>Arr. airport:</Text>{" "}
                                                                {segment.arrival.airportCommonName} ({segment.arrival.iataCode})
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col span={12}>
                                                                <Text strong>Carrier:</Text> {segment.airlineCommonName}{" "}
                                                                {segment.carrierCode}
                                                            </Col>
                                                            <Col span={12}>
                                                                <Text strong>Flight number:</Text> {segment.number}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    {traveler.fareDetailsBySegment
                                                        .filter(
                                                            (fareDetail: any) => fareDetail.segmentId === segment.id
                                                        )
                                                        .map((fareDetail: any, fareIndex: any) => (
                                                            <Col span={6} key={fareIndex}>
                                                                <Title level={4}>Travelers fare details</Title>
                                                                <Paragraph>Cabin: {fareDetail.cabin}</Paragraph>
                                                                <Paragraph>Class: {fareDetail.class}</Paragraph>
                                                                <Paragraph>Ammenities:</Paragraph>
                                                                {fareDetail.ammenities ? (
                                                                    <ul>
                                                                        {fareDetail.ammenities.map(
                                                                            (ammenitie: any, index: any) => (
                                                                                <li key={index}>
                                                                                    {ammenitie.description},{" "}
                                                                                    {ammenitie.isChargeable
                                                                                        ? "chargeable"
                                                                                        : "not chargeable"}
                                                                                </li>
                                                                            )
                                                                        )}
                                                                    </ul>
                                                                ) : (
                                                                    <Paragraph>No ammenities available</Paragraph>
                                                                )}
                                                            </Col>
                                                        ))}
                                                </Row>
                                            </Card>
                                        </Row>
                                        {segmentIndex < itinerary.segments.length - 1 && (
                                            <Row>
                                                <Col span={24} className="layoverInfo">
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
                                                </Col>
                                            </Row>
                                        )}
                                    </React.Fragment>
                                ))}

                            </List.Item>
                        )}
                    />
                </Col>
                <Divider type="vertical" className="verticalDivider" />
                <Col span={6}>
                    <Title level={4}>Price Breakdown</Title>
                    <Paragraph>
                        Base: $ {selectedFlight.price.base} {selectedFlight.price.currency}
                    </Paragraph>
                    <Paragraph>Fees</Paragraph>
                    <ul>
                        {selectedFlight.price.fees.map((fee: any, index: any) => (
                            <li key={index}>
                                {fee.type}: ${fee.amount} {selectedFlight.price.currency}
                            </li>
                        ))}
                    </ul>
                    <Paragraph>
                        Total: $ {selectedFlight.price.total} {selectedFlight.price.currency}
                    </Paragraph>
                    <Paragraph>Price per traveler</Paragraph>
                    <ul>
                        {selectedFlight.travelerPricings.map((price: any) => (
                            <li key={price.travelerId}>
                                {price.travelerType} {price.travelerId}: ${" "}
                                {price.price.total} {price.price.currency}
                            </li>
                        ))}
                    </ul>
                </Col>
            </Row>
        </div>
    );
};

export default DetailsPage;
