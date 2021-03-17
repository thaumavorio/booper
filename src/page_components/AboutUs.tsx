/*
 * This file is part of Booper, a bootstrap percolation visualization tool.
 * Copyright (C) 2020-2021 Connor Anderson <canderson@thaumavor.io>, Akshaj
 * Balasubramanian <bakshaj99@gmail.com>, Henry Poskanzer <hposkanzer@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import React, { Component } from "react";

class AboutUs extends Component {
  render(): JSX.Element {
    return (
      <div className="text-page">
        <h1>About Us</h1>
        <p>Booper is a visualization tool for bootstrap percolation</p>
        <p>Booper is free (libre) software built during a project at WPI. The source code is available on <a href="https://github.com/thaumavorio/booper">GitHub</a>
        </p>
        <p>Booper was made during a Major Qualifying Project (MQP), the equivalent of an undergraduate thesis, at <a href="https://wpi.edu">Worcester Polytechnic Institute</a> during the 2020-2021 academic year. The project was made up of three computer science and mathematical sciences students, Connor Anderson, Achu Balasubramanian, and Henry Poskanzer, and advised by <a href="https://web.cs.wpi.edu/~gsarkozy/">Gabor Sarkozy</a> and <a href="https://www.wpi.edu/people/faculty/dreichman">Daniel Reichman</a>.</p>
        <p>During our study of bootstrap percolation, we noticed a lack of visualization tools. On top of our theoretical results, we decided to provide such a tool to assist in further study of the topic. A copy of our report can be found <a href="/doc/bootstrap-percolation-report.pdf">here</a>.</p>
      </div>
    );
  }
}

export default AboutUs;
