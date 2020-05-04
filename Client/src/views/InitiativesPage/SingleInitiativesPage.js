import React, { useEffect, useState, useLayoutEffect } from "react";
import { useSnackbar } from 'notistack';

// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
// import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
// import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { getInitiativeById, getInitiatives, addInitiative } from "services/KnowledgeManagement.js";
import { TransferFund } from "services/UserManagement.js";
// import CustomInput from "components/CustomInput/CustomInput.js";
// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import NavPills from "components/NavPills/NavPills.js";
import Parallax from "components/Parallax/Parallax.js";
import Initiative from "./Sections/Initiative.js";
import FundPage from "./Sections/FundPage.js";
import InitiativeDummy from "./Sections/InitiativeDummy.js";

// import SectionLogin from "views/Components/Sections/SectionLogin.js";
import { getUserSession } from "services/UserManagement.js"
// import image from "assets/img/covers/comotion.jpg";
import sidebar from "assets/img/sidebar.png";
// import InputAdornment from "@material-ui/core/InputAdornment";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

// import VpnKeyIcon from '@material-ui/icons/VpnKey';

import styles from "assets/jss/material-kit-react/views/profilePage.js";
// import LinearProgress from '@material-ui/core/LinearProgress';
// import CardFooter from "components/Card/CardFooter.js";

const useStyles = makeStyles(styles);
export default function SingleBeneficiariesPage(props) {
  const { id } = props.match.params

  const [user, setUser] = useState(getUserSession())

  const classes = useStyles();
  const { ...rest } = props;
  const [loading, setLoading] = useState(false);
  const [initiative, setInitiative] = useState(null);
  const [password, setPassword] = useState("");
  const [amount, setAmount] = useState("");
  const [endDate, setEndDate] = useState(new Date().getTime());

  const [timer, setTimer] = useState("Evaluating Remaining Time");
  const { enqueueSnackbar } = useSnackbar();

  const [loading1, setLoading1] = useState(false);


  const county = () => {
    // Get todays date and time
    var now = new Date().getTime();

    // Find the distance between now an the count down date
    var distance = endDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="demo"
    setTimer("Ends in " + days + "d " + hours + "h " + minutes + "m " + seconds + "s ")


    // If the count down is over, write some text
    if (distance < 0) {
      setTimer("Ended")
    }
  }
  useEffect(() => {

    async function fetch() {
      setLoading(true)
      setTimer("Evaluating Remaining Time")
      const init = await getInitiativeById(id)
      if (init != null) {
        //console.log(init)
        setInitiative(init)
        setEndDate(new Date(init.endDate).getTime())
      }
      setLoading(false)
      setTimer("Evaluating Remaining Time")
    }
    fetch()
  }, [id]);

  useLayoutEffect(() => {
    const Sid = setInterval(county, 1000)
    return () => clearInterval(Sid)
  }, [county]);
  return (
    <div>
      <Header
        color="white"
        brand={<img height="50px" src={sidebar} onClick={(e) => {

          props.history.push("/")

        }}></img>}
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 200,
          color: "white"
        }}
        {...rest}
      />
      <Parallax style={{ height: "200px" }} small filter image={require("assets/img/profile-bg.jpg")} />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div>
          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12} lg={12}>
                <Card style={{ "min-height": "500px" }}>
                  <CardHeader color="primary"
                    className={classes.cardHeader}>
                    <h4>{initiative ? initiative.name : "Initiative"}</h4>
                  </CardHeader>
                  <CardBody>
                    {initiative && (
                      <GridContainer>
                        <GridItem xs={12} sm={4} md={4} lg={3}>
                          <Initiative name={initiative.name} image={initiative.cover}
                            description={initiative.description} /></GridItem>
                        <GridItem xs={12} sm={8} md={8} lg={9}>
                          <Card className={classes.root} >

                            <CardContent>
                              <Typography gutterBottom variant="h5" component="h2">
                                {initiative.name}
                              </Typography>
                              <Typography align="right" variant="overline" component="h2">
                                {timer}
                              </Typography>
                              <Typography variant="body1" color="textSecondary" component="p">
                                {initiative.description}
                              </Typography>

                              {user && (<>

                                <Typography gutterBottom variant="overline" component="h2">
                                  Feeling Charitable? Pick A Card!
                              </Typography>
                                <NavPills
                                  color="primary"
                                  tabs={[
                                    {
                                      tabButton: "ALPHA",
                                      tabIcon: AttachMoneyIcon,
                                      tabContent: (
                                        <FundPage Initiative={initiative} coin={"ALPHA"} rate={3} />)
                                    },
                                    {
                                      tabButton: "BETA",
                                      tabIcon: AttachMoneyIcon,
                                      tabContent: (<FundPage Initiative={initiative} coin={"BETA"} rate={2} />
                                      )
                                    }, {
                                      tabButton: "OMEGA",
                                      tabIcon: AttachMoneyIcon,
                                      tabContent: (
                                        <FundPage Initiative={initiative} coin={"OMEGA"} rate={1} />)
                                    }
                                  ]}
                                /></>)}
                            </CardContent>



                            <CardActions>
                              {initiative.creator != initiative.recipient &&
                                <Button size="small" color="primary" onClick={() => {
                                  props.history.push("/profile/" + initiative.recipient)
                                }}>
                                  View Recipient Profile</Button>

                              }
                              <Button size="small" color="primary" onClick={() => {
                                props.history.push("/profile/" + initiative.creator)
                              }}>
                                View Creator Profile</Button>

                              {!user && <Button size="small" color="primary" onClick={() => {
                                props.history.push(
                                  `/auth?from=${btoa(props.location.pathname)}`
                                );
                              }}>
                                Fund Initiative</Button>}
                            </CardActions>
                            <Divider />
                          </Card>
                        </GridItem>
                      </GridContainer>
                    )}
                    {loading &&
                      <GridContainer  >
                        <GridItem xs={12} sm={4} md={4} lg={3}>
                          <InitiativeDummy /></GridItem>
                        <GridItem xs={12} sm={8} md={8} lg={9} >
                          <Card  >
                            <CardContent className={"loadingCard"} style={{ "min-height": "300px" }}>
                              <Typography gutterBottom variant="h5" component="h2">
                                ******* *** ***
                              </Typography>
                              <Typography align="right" variant="overline" component="h2">
                                ***** **** ***
                              </Typography>
                              <Typography variant="body1" color="textSecondary" component="p">
                                **** ***** **** ** ** ********* **** ****
                              </Typography>


                            </CardContent>



                            <CardActions className={"loadingCard"}>
                              <Button size="small" color="primary" >
                                **** ******** ******</Button>
                              {!user && <Button size="small" color="primary">
                                **** ********</Button>}
                            </CardActions>
                            <Divider />
                          </Card>
                        </GridItem>
                      </GridContainer>

                    }
                    {!loading && !initiative && (
                      <GridItem xs={12} sm={12} md={12} lg={12}
                        style={{ "text-align": "center" }}>
                        <Typography variant="h4" noWrap>Initiative Not Found</Typography>
                      </GridItem>
                    )}
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
