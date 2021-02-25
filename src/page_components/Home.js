import React, {Component} from "react";

class Home extends Component {
  render() {
    return (
      <div className="text-page">
        <div className="title-pane">
          {/* <span className="title-pane-title">Booper</span>
          <span className="title-pane-subtitle">A visualization tool for bootstrap percolation.</span> */}
          <h1>Booper</h1>
          <p>A visualization tool for bootstrap percolation</p>
          <br/>
          <p>Booper is free (libre) software built during a project at WPI. The source code is available on <a href="https://github.com/thaumavorio/booper">GitHub</a>. For more info, see our <a href="about-us">About Us</a> page.</p>
        </div>
      </div>
    );
  }
}

export default Home;
