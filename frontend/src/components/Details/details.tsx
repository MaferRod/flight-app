import React, { useContext } from "react";
import FlightResultsContext from "../../contexts/FlightResultsContext";
import { Card, Col, Divider, List, Row, Typography } from "antd";
import "./details.css";
import dayjs from "dayjs";

const { Title, Paragraph, Text } = Typography;

const DetailsPage: React.FC = () => {
    const { selectedFlight } = useContext(FlightResultsContext);
    const traveler = selectedFlight.travelerPricings[0];

    return (
        <div className="detailsContainer">
            {/* Encabezado */}
            <Row className="detailsHeader" align="middle">
                <Col span={24}>
                    <Title>Flight Details</Title>
                </Col>
            </Row>

            <Row gutter={16}>
                {/* Columna izquierda: Información del itinerario */}
                <Col xs={24} md={17} className="itineraryColumn">
                    <List
                        itemLayout="vertical"
                        dataSource={selectedFlight.itineraries}
                        renderItem={(itinerary: any, itineraryIndex: number) => (
                            <List.Item key={itineraryIndex}>
                                <Title level={3}>
                                    {itineraryIndex === 0 ? "Departure" : "Return"}
                                </Title>
                                {itinerary.segments.map((segment: any, segmentIndex: number) => (
                                    <React.Fragment key={segmentIndex}>
                                        <Card className="segmentCard">
                                            <Row gutter={[16, 16]}>
                                                {/* Información del segmento */}
                                                <Col span={18}>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>Departure Date:</Text>
                                                            <div>{dayjs(segment.departure.at).format("YYYY-MM-DD")}</div>
                                                            <Text strong>Departure Hour:</Text>
                                                            <div>{dayjs(segment.departure.at).format("HH:mm")}</div>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text strong>Arrival Date:</Text>
                                                            <div>{dayjs(segment.arrival.at).format("YYYY-MM-DD")}</div>
                                                            <Text strong>Arrival Hour:</Text>
                                                            <div>{dayjs(segment.arrival.at).format("HH:mm")}</div>
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
                                                </Col>

                                                {/* Detalles de tarifas */}
                                                <Col span={6}>
                                                    <Title level={5}>Traveler Fare Details</Title>
                                                    {traveler.fareDetailsBySegment
                                                        .filter((fareDetail: any) => fareDetail.segmentId === segment.id)
                                                        .map((fareDetail: any, fareIndex: number) => (
                                                            <div key={fareIndex}>
                                                                <Paragraph>Cabin: {fareDetail.cabin}</Paragraph>
                                                                <Paragraph>Class: {fareDetail.class}</Paragraph>
                                                                <Paragraph>
                                                                    Amenities:{" "}
                                                                    {fareDetail.ammenities?.length > 0 ? (
                                                                        <ul>
                                                                            {fareDetail.ammenities.map(
                                                                                (ammenitie: any, index: number) => (
                                                                                    <li key={index}>
                                                                                        {ammenitie.description} -{" "}
                                                                                        {ammenitie.isChargeable
                                                                                            ? "Chargeable"
                                                                                            : "Free"}
                                                                                    </li>
                                                                                )
                                                                            )}
                                                                        </ul>
                                                                    ) : (
                                                                        "No amenities available"
                                                                    )}
                                                                </Paragraph>
                                                            </div>
                                                        ))}
                                                </Col>
                                            </Row>
                                        </Card>

                                        {/* Tiempo de escala */}
                                        {segmentIndex < itinerary.segments.length - 1 && (
                                            <Row className="layoverInfo">
                                                <Col span={24}>
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

                {/* Columna derecha: Desglose de precios */}
                <Col xs={24} md={7} className="priceBreakdown">
                    <div className="priceSection">
                        <Title level={4}>Base Price</Title>
                        <Paragraph>
                            <strong>Base:</strong> $ {selectedFlight.price.base} {selectedFlight.price.currency}
                        </Paragraph>
                    </div>

                    <Divider />

                    <div className="priceSection">
                        <Title level={4}>Price per Traveler</Title>
                        <ul>
                            {selectedFlight.travelerPricings.map((price: any) => (
                                <li key={price.travelerId}>
                                    {price.travelerType} ({price.travelerId}): $ {price.price.total}{" "}
                                    {price.price.currency}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Divider />

                    <div className="priceSection">
                        <Title level={4}>Fees</Title>
                        <ul>
                            {selectedFlight.price.fees.map((fee: any, index: number) => (
                                <li key={index}>
                                    {fee.type}: $ {fee.amount} {selectedFlight.price.currency}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Divider />

                    <div className="totalPriceSection">
                        <Title level={4}>Total</Title>
                        <Paragraph>
                            <strong>Total:</strong> $ {selectedFlight.price.total} {selectedFlight.price.currency}
                        </Paragraph>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default DetailsPage;
