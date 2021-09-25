import React, { Component } from "react";
import Tachyontoken from "./contracts/Tachyontoken.json";
import Pitch from "./contracts/Pitch.json";
// import Fundraising from "./contracts/Fundraising.json";
import getWeb3 from "./getWeb3";
// import Projects from "./Projects";

import "./App.css";

class App extends Component {
  state = {
    name: "blastoff",
    goal: 0,
    deadline: 0,
    minimumAcceptingContribution: 0,
    address: 0,
    tokens: 0,
    adminaddress: "0x0",
    arrayprojects: [],
    token: 0,
    tac: 0,

    loaded: false,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.

      const networkId = await this.web3.eth.net.getId();

      this.tachyontoken = new this.web3.eth.Contract(
        Tachyontoken.abi,
        Tachyontoken.networks[networkId] &&
          Tachyontoken.networks[networkId].address
      );

      this.pitch = new this.web3.eth.Contract(
        Pitch.abi,
        Pitch.networks[networkId] && Pitch.networks[networkId].address
      );
      console.log(this.pitch);

      // this.fundraising = new this.web3.eth.Contract(
      //   Fundraising.abi,
      //   Fundraising.networks[networkId] &&
      //     // Fundraising.networks[networkId].address
      // );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ loaded: true });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = async () => {
    const { name, goal, deadline, minimumAcceptingContribution, address } =
      this.state;
    console.log(name, goal, deadline, minimumAcceptingContribution, address);
    let result = await this.pitch.methods
      .Pay(name, goal, deadline, minimumAcceptingContribution, address)
      .send({ from: this.accounts[0] });
    console.log(result);
    alert(
      `Your project has been deployed on` +
        result.events.PhaseStart.returnValues._address
    );

    // const data = {
    //   name: this.state.name,
    //   goal: this.state.goal,
    //   deadline: this.state.deadline,
    //   minimumAcceptingContribution: this.state.minimumAcceptingContribution,
    //   address: this.state.address,
    // };
    // this.dataset.push(data);
  };

  clickAdmin = async () => {
    const adminaddress = await this.pitch.methods.seeAdmin().call();
    this.setState({ adminaddress });
  };

  handlefee = async () => {
    const { tokens } = this.state;
    console.log(tokens);
    let result = await this.pitch.methods
      .Eligibility(tokens)
      .send({ from: this.accounts[0] });
    console.log(result);
  };

  clickTac = async () => {
    const tac = await this.pitch.methods
      .balanceTAC({ from: this.accounts })
      .call();
    this.setState({ tac });
  };

  clickHandler = async () => {
    let arrayprojects = await this.pitch.methods.BoostedProjects().call();
    this.setState({ arrayprojects });
    console.log(arrayprojects);
  };

  // handleSubmit = async () => {
  //   const { tokens } = this.state;
  //   console.log(tokens);
  //   let token = await this.pitch.methods.Eligibility(tokens).send({
  //     from: this.accounts[0],
  //   });
  //   console.log(token);
  // };

  //load data fundraising

  render() {
    // if (!this.state.loaded) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    return (
      <div className="app-container">
        <h2>Project Pitch</h2>
        Name:
        <input
          type="text"
          name="name"
          value={this.state.name}
          onChange={this.handleInputChange}
        />
        Goal:
        <input
          type="text"
          name="goal"
          value={this.state.goal}
          onChange={this.handleInputChange}
        />
        Deadline:
        <input
          type="text"
          name="deadline"
          value={this.state.deadline}
          onChange={this.handleInputChange}
        />
        MinAccepting:
        <input
          type="text"
          name="minimumAcceptingContribution"
          value={this.state.minimumAcceptingContribution}
          onChange={this.handleInputChange}
        />
        Owner:
        <input
          type="text"
          name="address"
          value={this.state.address}
          onChange={this.handleInputChange}
        />
        <button type="button" onClick={this.handleSubmit}>
          Boost Your Project
        </button>
        {this.address}
        {/* <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Goal</th>
              <th>Deadline </th>
              <th>MinimumAccepting</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.state.name}</td>
              <td>{this.state.goal}</td>
              <td>{this.state.deadline}</td>
              <td>{this.state.minimumAcceptingContribution}</td>
              <td>{this.state.address}</td>
            </tr>
          </tbody>
        </table> */}
        <button type="button" onClick={this.clickHandler}>
          Boosted Projects=
        </button>
        {this.state.arrayprojects.map((txt) => (
          <p>{txt}</p>
        ))}
      </div>
    );
  }
}

export default App;
