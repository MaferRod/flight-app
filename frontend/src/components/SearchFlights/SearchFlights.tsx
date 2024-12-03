import React, { useContext } from "react";
import { Form, Button, DatePicker, InputNumber, Select, Checkbox, AutoCompleteProps, AutoComplete, Typography, Spin } from "antd";
import dayjs from "dayjs";
import { RangePickerProps } from "antd/es/date-picker";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FlightResultsContext from "../../contexts/FlightResultsContext";
import "./Search.css";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const SearchForm: React.FC = () => {
    const { setFlightResults } = useContext(FlightResultsContext);
    const [options, setOptions] = React.useState<AutoCompleteProps["options"]>([]);
    const [spinning, setSpinning] = React.useState(false);
    const navigate = useNavigate();

    const handleSearch = async (keyword: string) => {
        if (!keyword) {
            setOptions([]);
        } else {
            try {
                const response = await axios.get('http://localhost:8080/airportSearch', {
                    params: { keyword: keyword }
                });
                const data = response.data;
                setOptions(data.map((airport: { iataCode: any; name: any; }) => ({
                    value: airport.iataCode,
                    label: `(${airport.iataCode}) ${airport.name}`,
                })));
            } catch (error) {
                console.log(error);
            }
        }
    };

    const disabledDate: RangePickerProps["disabledDate"] = (current) => {
        return current  && current.isBefore(dayjs(), 'day');
    };

    const handleSubmit = async (values: any) => {
        setSpinning(true);
        try {
            console.log(values);
            const response = await axios.get("http://localhost:8080/flights", {
                params: {
                    originLocationCode: values.originLocationCode,
                    destinationLocationCode: values.destinationLocationCode,
                    departureDate: values.dates?.[0].format("YYYY-MM-DD"),
                    returnDate: values.dates?.[1]?.format("YYYY-MM-DD"),
                    adults: values.adults,
                    currencyCode: values.currencyCode,
                    nonStop: values.nonStop
                }
            });
            const data = response.data;
            console.log(data);
            setFlightResults(data);
            navigate("/results");
        } catch (error) {
            console.log(error);
        } finally {
            setSpinning(false);
        }
    };

    return (
        <div className="formContainer">
            <Spin spinning={spinning} className="loadingOverlay" />
            <div className="formHeader">
                <Title level={3} className="formTitle">
                    Find Your Perfect Flight
                </Title>
            </div>
            <Form onFinish={handleSubmit} className="customForm">
                <Form.Item
                    name="originLocationCode"
                    label="Departure Airport"
                    rules={[{ required: true, message: "Please select a departure airport" }]}
                >
                    <AutoComplete
                        options={options}
                        onSearch={handleSearch}
                        placeholder="Search your airport"
                    />
                </Form.Item>

                <Form.Item
                    name="destinationLocationCode"
                    label="Arrival Airport"
                    rules={[{ required: true, message: "Please select an arrival airport" }]}
                >
                    <AutoComplete
                        options={options}
                        onSearch={handleSearch}
                        placeholder="Search your airport"
                    />
                </Form.Item>

                <Form.Item
                        name={'dates'}
                        label={'Dates'}
                        rules={[{required: true, message: 'Please select at least the departure date'}]}
                     >
                    <RangePicker
                        allowEmpty={[false, true]}
                        disabledDate={disabledDate}
                        placeholder={['Departure date', 'Return date']}
                    >
                    </RangePicker>
                </Form.Item>

                <Form.Item
                    name="adults"
                    label="Number of Adults"
                    rules={[{ required: true, message: "Please select the number of adults" }]}
                    initialValue={1}
                >
                    <InputNumber min={1} className="customInput" />
                </Form.Item>

                <Form.Item
                    name="currencyCode"
                    label="Currency"
                    rules={[{ required: true, message: "Please select the currency" }]}
                    initialValue="USD"
                >
                    <Select
                        options={[
                            { value: "USD", label: "USD" },
                            { value: "MXN", label: "MXN" },
                            { value: "EUR", label: "EUR" }
                        ]}
                        className="customSelect"
                    />
                </Form.Item>

                <Form.Item
                    name="nonStop"
                    label="Non-stop"
                    valuePropName="checked"
                    initialValue={false}
                >
                    <Checkbox className="customCheckbox" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="customButton">
                        Search
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default SearchForm;
