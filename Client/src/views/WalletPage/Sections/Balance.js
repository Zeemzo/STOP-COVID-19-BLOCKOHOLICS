import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Badge from 'components/Badge/Badge.js';

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { getWalletBalance } from "services/UserManagement.js";

import styles from "assets/jss/material-kit-react/views/componentsSections/loginStyle.js";
// import DetailsExpansions from "views/WalletPage/Sections/Components/DetailsExpansions.js"

const useStyles = makeStyles(styles);

export default function Balance(props) {
  const [balanceArray, setBalanceArray] = useState(null)

  const classes = useStyles();
  useEffect(async () => {

    const balance = await getWalletBalance(props.publicKey)
    if (balance == null) {
      return
    }
    setBalanceArray(balance)

  }, []);

  return (

    <Card>
      <CardHeader color="primary" className={classes.cardHeader}>
        <h4>Balance</h4>
      </CardHeader>
      <CardBody>
        {balanceArray && balanceArray.length > 0 && (
          balanceArray.map((item1, index) => (
            <div key={index}><Typography noWrap gutterBottom variant="body1" component="p">
              {item1.assetCode ? item1.assetCode : "XLM"} TOKEN: <Badge >{item1.balance}</Badge>
            </Typography> </div>
          ))
        )}
        {/* <DetailsExpansions name="Name" value="Azeem" disabled />
          <DetailsExpansions name="Age" value="Azeem" />
          <DetailsExpansions name="DOB" value="Azeem" /> */}
      </CardBody>
    </Card >
  );
}
