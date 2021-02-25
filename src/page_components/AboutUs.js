import React, {Component} from "react";

class AboutUs extends Component {
  render() {
    return (
      <div className="text-page">
        <h1>About Us</h1>
        <p>Booper was made during a Major Qualifying Project (MQP), the equivalent of an undergraduate thesis, at <a href="https://wpi.edu">Worcester Polytechnic Institute</a> during the 2020-2021 academic year. The project was made up of three computer science and mathematical sciences students, Connor Anderson, Achaj Balasubramanian, and Henry Poskanzer, and advised by <a href="https://web.cs.wpi.edu/~gsarkozy/">Gabor Sarkozy</a> and <a href="https://www.wpi.edu/people/faculty/dreichman">Daniel Reichman</a>.</p>
        <p>During our study of bootstrap percolation, we noticed a lack of visualization tools. On top of our theoretical results, we decided to provide such a tool to assist in further study of the topic. A copy of our report can be found <a href="/doc/bootstrap-percolation-report.pdf">here</a>.</p>
      </div>
    );
  }
}

export default AboutUs;
