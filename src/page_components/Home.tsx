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

class Home extends Component {
  render(): JSX.Element {
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
