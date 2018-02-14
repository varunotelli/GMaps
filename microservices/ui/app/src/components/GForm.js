import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  CardSubtitle
} from "reactstrap";

class GForm extends Component {
  constructor(props) {
    super(props);
    this.getDirections = this.getDirections.bind(this);
    this.fetchUpdatesState = this.fetchUpdatesState.bind(this);
    this.setFormValues = this.setFormValues.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.showInstruct = this.showInstruct.bind(this);
    this.state = {
      start: "",
      destination: "",
      profile: "",
      duration: "",
      steps: []
    };
  }

  //stores data in local storage if no previous data is present
  componentWillUpdate(nextProps, nextState) {
    if ((nextState.start.length !== 0) || (sessionStorage.getItem("start") && sessionStorage.getItem("start") !== null)) {
      sessionStorage.setItem("start", JSON.stringify(nextState.start));
      sessionStorage.setItem("destination",JSON.stringify(nextState.destination));
      sessionStorage.setItem("profile", JSON.stringify(nextState.profile));
      sessionStorage.setItem("steps", JSON.stringify(nextState.steps));
      sessionStorage.setItem("duration", JSON.stringify(nextState.duration));
    }
  }

  //parses data from local storage and sets state
  componentWillMount() {
    let start = JSON.parse(sessionStorage.getItem("start"));
    let destination = JSON.parse(sessionStorage.getItem("destination"));
    let profile = JSON.parse(sessionStorage.getItem("profile"));
    let duration = JSON.parse(sessionStorage.getItem("duration"));
    let steps = JSON.parse(sessionStorage.getItem("steps"));
    if(start !== null){
      this.setState({
        start: start,
        destination: destination,
        profile: profile,
        duration: duration,
        steps: steps
      });
    }   
  }
  //set form values to user Input values if page refreshed by calling setFormValues()
  componentDidMount() {
    if (sessionStorage.getItem("start") !== undefined && sessionStorage.getItem("start")) {
      this.setFormValues();
      this.showInstruct();
    }
  }
  //set form values using the data from sessionStorage on page refresh
  setFormValues() {
    let nodes = this.refs.formBody.childNodes[0].childNodes;
    nodes[0].childNodes[1].value = sessionStorage
      .getItem("start")
      .replace(/['"]+/g, "");
    nodes[1].childNodes[1].value = sessionStorage
      .getItem("destination")
      .replace(/['"]+/g, "");
    nodes[2].childNodes[1].value = sessionStorage
      .getItem("profile")
      .replace(/['"]+/g, "");
  }
  //this function is trigerred by submit button, it extracts values from form and passes it down to fetchUpdatesState()
  //if the request is "OK or  ==200"
  getDirections(e) {
    e.preventDefault();
    let nodes = this.refs.formBody.childNodes[0].childNodes;
    let start = nodes[0].childNodes[1].value;
    let destination = nodes[1].childNodes[1].value;
    let profile = nodes[2].childNodes[1].value;
    let vals = [start, destination, profile];
    //the url is updated to secure https
    fetch(
      `https://app.dutifulness58.hasura-app.io/directions?origin=${start}&destination=${destination}&mode=${profile}`   )
      .then(response => response.json())
      .then(parsedJSON => this.fetchUpdatesState(parsedJSON, vals))
      .catch(function(err) {
        alert("Something Went wrong! \nTry again with complete Address.");
      });
  }

  //This function update's the state using the data of fetch() if response is "OK or  ==200"
  fetchUpdatesState(parsedjson, details) {
    let duration = parsedjson.duration;
    let steps = parsedjson.steps;

    this.showInstruct();
    if(steps !== undefined || duration !== undefined){
    this.setState({
      start: details[0],
      destination: details[1],
      profile: details[2],
      duration: duration,
      steps: steps
    });}
  }
  //This function resets form data and deletes sessionStorage data.
  resetForm() {
    sessionStorage.clear();
    //extract values from form and set them to default
    let nodes = this.refs.formBody.childNodes[0].childNodes;
    nodes[0].childNodes[1].value = "";
    nodes[1].childNodes[1].value = "";
    nodes[2].childNodes[1].value = "Driving";
    //hide instructions div
    let instructdiv = document.getElementById("instructions-div").classList;
    instructdiv.remove("instructions-visible");
    instructdiv.add("instructions-hidden");
  }
  //show Instructions div
  showInstruct() {
    let instructdiv = document.getElementById("instructions-div").classList;
    instructdiv.remove("instructions-hidden");
    instructdiv.add("instructions-visible");
  }

  render() {
    let { duration, steps } = this.state;
    return (
      <div className="container-fluid">
        <div className="row">
          <div
            className="col-6 col-sm-4 col-md-3"
            id="form-instructions-div"
            ref="formBody"
          >
            <Form>
              <FormGroup>
                <Label for="from" className="form-label">
                  From
                </Label>
                <Input
                  type="text"
                  name="source"
                  id="source-place"
                  placeholder="Starting Place"
                />
              </FormGroup>
              <FormGroup>
                <Label for="to" className="form-label">
                  To
                </Label>
                <Input
                  type="text"
                  name="destination"
                  id="destination-place"
                  placeholder="Destination Place"
                />
              </FormGroup>
              <FormGroup>
                <Label for="profile" className="form-label">
                  Select
                </Label>
                <Input type="select" name="profile" id="profile-mode">
                  <option>Driving</option>
                  <option>Transit</option>
                  <option>Walking</option>
                </Input>
              </FormGroup>
              <Button
                onClick={this.getDirections}
                type="submit"
                outline
                id="form-submit-btn"
              >
                Let's Go
              </Button>
              <Button onClick={this.resetForm} outline id="form-clear-btn">
                Clear
              </Button>
            </Form>
            <div id="instructions-div" className="instructions-hidden">
              <Card>
                <CardBody>
                  <CardSubtitle id="duration-label">Duration: {duration}</CardSubtitle>
                  <div id="instructions-div-inner">
                    {
                       steps.map((item,index) => {
                         return  <div key={index}  dangerouslySetInnerHTML={{ __html: item +"<hr/>"}} />
                      })
                    }             
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GForm;