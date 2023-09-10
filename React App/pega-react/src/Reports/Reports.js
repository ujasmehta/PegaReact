import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Header, Segment } from "semantic-ui-react";

import { Worklist } from "../Worklist/Worklist";
import { DashboardWidget } from "../DashboardWidget/DashboardWidget";

class Reports extends Component {
  render() {
    return (
      <Container fluid>
        <div>
          Hello world
        </div>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

// const connectedReports = connect(mapStateToProps)(Reports);
export default Reports;
