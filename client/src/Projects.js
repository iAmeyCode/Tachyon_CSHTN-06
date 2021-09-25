import React, { Component } from "react";
import Fundraising from "./contracts/Fundraising.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class Projects extends Component {
  state = {
    time: 0,
    loaded: false,
    contract: "0x0",
    name: "",
    goal: 0,
    minimumAcceptingContribution: 0,
    amountRaised: 0,
  };

  handleInput = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = async () => {
    const { address } = this.state;
    let contract = await address;
    Fundraising.address = contract;
    console.log(Fundraising.address);
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.

      const networkId = "5777";

      let contract = "0x216B0f432D15C213c39FF57DC73f27a2b76a4cc3";

      Fundraising.address = contract;

      this.fundraising = await new this.web3.eth.Contract(
        Fundraising.abi,
        Fundraising.networks[networkId] && Fundraising.address,
        console.log(Fundraising.address)
      );

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

  nameclick = async () => {
    const name = await this.fundraising.methods.Viewprojectname().call();
    this.setState({ name });
  };

  deadline = async () => {
    const time = await this.fundraising.methods.acceptsUntil().call();
    this.setState({ time });
  };

  goalclick = async () => {
    const goal = await this.fundraising.methods.thegoal().call();
    this.setState({ goal });
  };

  minimumAcceptingclick = async () => {
    const minimumAcceptingContribution = await this.fundraising.methods
      .minimumAccepting()
      .call();
    this.setState({ minimumAcceptingContribution });
  };

  totalraisedclick = async () => {
    const amountRaised = await this.fundraising.methods.amounttill().call();
    this.setState({ amountRaised });
  };

  deadline = async () => {
    const time = await this.fundraising.methods.acceptsUntil().call();
    this.setState({ time });
  };

  handleContrib = async () => {
    console.log();
    let yourcontribution = await this.fundraising.methods
      .contribute()
      .send({ from: this.accounts[0] });
    console.log(yourcontribution);
  };

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract... Address input</div>;
    }
    return (
      <main>
        <div>
          Loading Web3, accounts, and contract... Address input
          <input
            type="text"
            name="your"
            value={this.state.yourcontribution}
            onChange={this.handleInput}
          />
          <button type="button" onClick={this.handleContrib}>
            Your contribution
          </button>
        </div>

        <div className="landing data">
          <button type="button" onClick={this.nameclick}>
            Name={this.state.name}
          </button>
          <button type="button" onClick={this.deadline}>
            Deadline={this.state.time}
          </button>
          <button type="button" onClick={this.goalclick}>
            Goal={this.state.goal}
          </button>
          <button type="button" onClick={this.minimumAcceptingclick}>
            Min Acceptance={this.state.minimumAcceptingContribution}
          </button>
          <button type="button" onClick={this.totalraisedclick}>
            Amount Raised={this.state.amountRaised}
          </button>
        </div>
      </main>
    );
  }
}

export default Projects;
