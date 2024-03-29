import React from "react";
import convertAndSortDates from "../utility/convertAndSortDates";
import removeDuplicates from "../utility/removeDuplicates";
import { inject, observer } from "mobx-react";
import { useState, useEffect } from "react";
import {
  FormField,
  Button,
  Dropdown,
  Form,
  Select,
  label,
  Icon,
  Modal,
  Input,
  Message,
  Segment,
  Loader,
} from "semantic-ui-react";
import buyStore from "/store/BuyStore";
import positionStore from "/store/positionStore";
import combineData from "../utility/combineData";
const Position = ({ handleStepClick }) => {
  const [price, setPrice] = useState("");
  const [saveButton, setSaveButton] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [ivError, setIvError] = useState(false);
  const [scriptData, setScriptData] = useState([]);
  const [strike, setStrike] = useState([]);
  const [expairy, SetExpairy] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scriptJsonData, setScriptJsonData] = useState([]);
  const [symbolToken, setSymbolToken] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/getscripts");
        //console.log(response)
        const newData = await response.json();
        if (newData) {
          //console.log(newData);
          const processedData = [];
          newData.map((item) => {
            processedData.push({ key: item, text: item, value: item });
          });
          setScriptData(processedData);
        }
      } catch (error) {
        console.log("Error fetching data " + error);
      }
    };
    fetchData();
  }, []);

  const script = [
    { key: "tata", text: "tata", value: "tata" },
    { key: "microsoft", text: "microsoft", value: "microsoft" },
    { key: "reliance", text: "reliance", value: "reliance" },
    { key: "jio", text: "jio", value: "jio" },
  ];
  const sprice = [
    { key: "1", text: "25000", value: "25000" },
    { key: "2", text: "70000", value: "70000" },
    { key: "3", text: "30000", value: "30000" },
    { key: "4", text: "60000", value: "60000" },
  ];
  const cepe = [
    { key: "CE", text: "CE", value: "CE" },
    { key: "PE", text: "PE", value: "PE" },
  ];
  const bs = [
    { key: "Buy", text: "Buy", value: "Buy" },
    { key: "Sell", text: "Sell", value: "Sell" },
  ];
  const expdate = [
    { key: "22/10/2024", text: "22/10/2024", value: "22/10/2024" },
    { key: "22/10/2025", text: "22/10/2025", value: "22/10/2025" },
  ];

  const [formData, setformData] = useState({
    script: "",
    sprice: "",
    cepe: "",
    bs: "",
    expdate: "",
    price: "",
    iv: "",
  });
  const handleAddScript = () => {
    if (!validateInputs()) return;
    buyStore.orders.push({
      script: formData.script,
      sprice: formData.sprice,
      cepe: formData.cepe,
      bs: formData.bs,
      expdate: formData.expdate,
      price: formData.price,
      iv: formData.iv,
      symbol_token: returnSymbolToken(formData.cepe),
    });
    console.log(buyStore.orders);
    toggleOrderCount(buyStore.orders.length);
  };
  const [orderCount, setOrderCount] = useState(0);
  const toggleOrderCount = (count) => {
    setOrderCount(count);

    setformData({
      script: "",
      sprice: "",
      cepe: "",
      bs: "",
      expdate: "",
      price: "",
      iv: "",
    });
  };
  const validateInputs = () => {
    let isValid = true;

    if (!formData.price || isNaN(formData.price)) {
      setPriceError(true);
      isValid = false;
    } else {
      setPriceError(false);
    }

    if (!formData.iv || isNaN(formData.iv)) {
      setIvError(true);
      isValid = false;
    } else {
      setIvError(false);
    }

    return isValid;
  };

  const handleScriptChange = async (e, { value }) => {
    setIsLoading(true);
    setformData({ ...formData, script: value });
    const scriptDataResponse = await fetch(
      "http://localhost:3000/api/v1/getscriptbyname?name=" + value
    );
    if (!scriptDataResponse.ok) {
      throw new Error("Unable to get data .. error");
    }
    const data = await scriptDataResponse.json();
    setScriptJsonData(data);
    console.log(data);
    const strikePriceArray = [];
    const expDateArray = [];

    data.map((item) => {
      const formattedStrike = parseFloat(item.strike / 100).toFixed(2);
      strikePriceArray.push(formattedStrike);
    });
    const tempStrikePrice = removeDuplicates(strikePriceArray);
    const strikePriceDropdown = [];
    tempStrikePrice.map((item) => {
      strikePriceDropdown.push({
        key: item,
        text: item,
        value: item,
      });
    });
    // Sort the strikePriceDropdown array based on the 'key' property
    strikePriceDropdown.sort((a, b) => a.key - b.key);

    data.map((item) => {
      expDateArray.push(item.expiry);
    });

    const tempExpdateArray = removeDuplicates(expDateArray);
    const expiryDateArrayDropdown = [];
    tempExpdateArray.map((item) => {
      expiryDateArrayDropdown.push({
        key: item,
        text: item,
        value: item,
      });
    });
    // Sort the expiryDateArrayDropdown array by dates
    expiryDateArrayDropdown.sort((a, b) => new Date(a.key) - new Date(b.key));
    console.log(expDateArray);
    console.log(expiryDateArrayDropdown);
    setStrike(strikePriceDropdown);
    SetExpairy(expiryDateArrayDropdown);
    setIsLoading(false);
  };

  const returnSymbolToken = (symbol) => {
    for (const obj of scriptJsonData) {
      if (obj.symbol === symbol) {
        return obj.token;
      }
    }
    return null; // Symbol not found
  };

  const handleSaveClick = () => {
    const timestamp = Date.now();
    const combinedOrders = buyStore.orders;
    const ordersWithTimestamp = combinedOrders.map((order) => ({
      ...order,
      lastUpdate: timestamp,
    }));
    //positionStore.buys.push(...ordersWithTimestamp);
    positionStore.buys.push(...combineData(ordersWithTimestamp));
    buyStore.clearOrders();
    console.log(positionStore.buys);
    handleStepClick(0);
  };
  return (
    <Form fluid size="mini">
      <FormField>
        <label>Script</label>
        <Dropdown
          placeholder="Script"
          fluid
          selection
          options={scriptData}
          value={formData.script}
          onChange={handleScriptChange}
        />
      </FormField>
      <FormField>
        <label>Strike Price</label>
        {isLoading ? ( // Show loader if isLoading is true
          <Segment>
            <Loader active inline="centered" size="small"></Loader>
          </Segment>
        ) : (
          <Dropdown
            placeholder="strike price"
            fluid
            selection
            options={strike}
            value={formData.sprice}
            onChange={(e, { value }) =>
              setformData({ ...formData, sprice: value })
            }
          />
        )}
      </FormField>
      <FormField>
        <label>Ce/Pe</label>
        <Dropdown
          placeholder="ce/pe"
          fluid
          selection
          options={cepe}
          value={formData.cepe}
          onChange={(e, { value }) => setformData({ ...formData, cepe: value })}
        />
      </FormField>
      <FormField>
        <label>B/S</label>
        <Dropdown
          placeholder="Buy/Sell"
          fluid
          selection
          options={bs}
          value={formData.bs}
          onChange={(e, { value }) => setformData({ ...formData, bs: value })}
        />
      </FormField>
      <FormField>
        <label>Exp date</label>
        <Dropdown
          placeholder="expdate"
          fluid
          selection
          options={expairy}
          value={formData.expdate}
          onChange={(e, { value }) =>
            setformData({ ...formData, expdate: value })
          }
        />
      </FormField>
      <FormField error={priceError}>
        <label>Price</label>
        <Input
          value={formData.price}
          onChange={(e, { value }) =>
            setformData({ ...formData, price: value })
          }
        />
        {priceError && <Message error content="Price must be a number" />}
      </FormField>
      <FormField error={ivError}>
        <label>Iv</label>
        <Input
          value={formData.iv}
          onChange={(e, { value }) => setformData({ ...formData, iv: value })}
        />
        {ivError && <Message error content="Iv must be a number" />}
      </FormField>

      <Button color="green" onClick={handleAddScript}>
        ADD MORE SCRIPT
      </Button>
      <Button
        color="red"
        onClick={handleSaveClick}
        disabled={buyStore.orders.length <= 0}
      >
        SAVE {buyStore.orders.length <= 0 ? "" : `(+${buyStore.orders.length})`}
      </Button>
    </Form>
  );
};
export default inject("buyStore", "positionStore")(observer(Position));
