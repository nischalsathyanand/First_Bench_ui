import React, { useState, useEffect } from "react";
import { inject, observer } from "mobx-react";
import positionStore from "/store/positionStore";
import combineBuys from "../utility/combinedBuys";
import combineData from "../utility/combineData";
import {
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableCell,
  TableBody,
  Table,
  Icon,
} from "semantic-ui-react";

const Order = ({ positionStore }) => {
  const [highlightedRows, setHighlightedRows] = useState([]);
  const [oldRows, setOldRows] = useState([]);
  const currentPrice = 100;
  const threshold = 2000;

  const calculatePositive = (lastUpdate) => Date.now() - lastUpdate < threshold;

  const orderRows = combineData(positionStore.buys).map((orders, index) =>
    orders.cepe.map((content, contentIndex) => {
      const isPositive = calculatePositive(
        orders.sprice[contentIndex].lastUpdate
      );
      return (
        <TableRow key={`${index}-${contentIndex}`}>
          {contentIndex === 0 && (
            <>
              <TableCell rowSpan={orders.rowspan}>{orders.script}</TableCell>
              <TableCell positive={isPositive}>
                {orders.sprice[contentIndex].item}
              </TableCell>
              <TableCell positive={isPositive}>
                {orders.cepe[contentIndex].item}
              </TableCell>
              <TableCell positive={isPositive}>
                {orders.bs[contentIndex].item}
              </TableCell>
              <TableCell rowSpan={orders.rowspan}>{orders.expdate}</TableCell>
              <TableCell positive={isPositive}>
                {orders.iv[contentIndex].item}
              </TableCell>

              <TableCell rowSpan={orders.rowspan}>{orders.price}</TableCell>
              <TableCell rowSpan={orders.rowspan}>CIV</TableCell>

              <TableCell rowSpan={orders.rowspan}>
                {currentPrice}{" "}
                {currentPrice > orders.price ? (
                  <Icon name="caret up" color="green" />
                ) : (
                  <Icon name="caret down" color="red" />
                )}
              </TableCell>
              <TableCell rowSpan={orders.rowspan}>PROFIT</TableCell>
            </>
          )}
          {contentIndex !== 0 && (
            <>
              <TableCell positive={isPositive}>
                {orders.sprice[contentIndex].item}
              </TableCell>
              <TableCell positive={isPositive}>
                {orders.cepe[contentIndex].item}
              </TableCell>
              <TableCell positive={isPositive}>
                {orders.bs[contentIndex].item}
              </TableCell>
              <TableCell positive={isPositive}>
                {orders.iv[contentIndex].item}
              </TableCell>
            </>
          )}
        </TableRow>
      );
    })
  );

  return (
    <div>
      <Table basic="very" celled structured compact>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Script</TableHeaderCell>
            <TableHeaderCell>Stright Price</TableHeaderCell>
            <TableHeaderCell>Ce/Pe</TableHeaderCell>
            <TableHeaderCell>Buy/Sell</TableHeaderCell>
            <TableHeaderCell>Exp Date</TableHeaderCell>
            <TableHeaderCell>Iv</TableHeaderCell>
            <TableHeaderCell>Bought</TableHeaderCell>
            <TableHeaderCell>Current Iv</TableHeaderCell>

            <TableHeaderCell>Current Price</TableHeaderCell>
            <TableHeaderCell>Profite</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>{orderRows}</TableBody>
      </Table>
    </div>
  );
};

export default inject("positionStore")(observer(Order));
