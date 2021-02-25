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
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Switch,
  TextField,
  Tooltip,
  Typography
} from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { styled } from "@material-ui/core/styles";
import { LoadingSpinnerComponent } from "./LoadingSpinnerComponent";
import PropTypes from "prop-types";


const TOOLBAR_WIDTH = 300;

// Local Components
const TaskbarButton = styled(Button)({
  fontSize: "11px",
  marginBottom: "10px",
  width: "100%"
});

class GraphTaskbar extends Component {
  constructor(props){
    super(props);
    this.state = {
      helpOpen: false,
      useMinAlgorithm: true
    };
  }

  // Start of functions from props to modify ForceGraph State

    readAdjacencyMatrix = (evt) => {
      this.props.readAdjacencyMatrix(evt);
    }

    getContagiousSet = () => {
      if(this.state.useMinAlgorithm){
        this.props.getMinContagiousSet();
      }
      else {
        this.props.getGreedyContagiousSet();
      }
    }

    randomSeedSet = () => {
      this.props.randomSeedSet();
    }

    stopPropagation = (event) => {
      this.props.stopPropagation(event);
    }

    resetInfections = () => {
      this.props.resetInfections();
    }

    percolationIteration = () => {
      this.props.percolationIteration();
    }

    finalPercolationIteration = () => {
      this.props.finalPercolationIteration();
    }

    updateBootstrapPercolationThreshold = (evt) => {
      this.props.updateBootstrapPercolationThreshold(evt);
    }

    updateBootstrapPercolationProbability = (evt) => {
      this.props.updateBootstrapPercolationProbability(evt);
    }

    // End of functions from props to modify ForceGraph State

    // Start of Taskbar functions

    helpIconOpen = () => {
      this.setState({helpOpen: true});
    }

    helpIconClose = () => {
      this.setState({helpOpen: false});
    }

  toggleAlgorithmChoice = (event, value) => {
    // value is true when the user engages the switch to choose the greedy algorithm, false otherwise
    this.setState({
      useMinAlgorithm: !value
    });
  }
  // End of Taskbar functions

  render() {
    return (
      <div>
        <LoadingSpinnerComponent />
        <Paper className='toolbar-surface' elevation={10}>
          <Box style={{padding: 30}} width={TOOLBAR_WIDTH}>
            <Container>
              <h3>GRAPH</h3>
              <Box display="flex" flexDirection="row" data-tour="upload-adjacency-matrix-button">
                <Button variant="outlined" component="label" style={{  fontSize: "12px", marginBottom: "10px", width: TOOLBAR_WIDTH*0.8  }}>
                    Upload Adjacency Matrix
                  <input id="uploadAdjacencyMatrix" type="file" accept=".csv,.tsv" onChange={this.readAdjacencyMatrix} hidden />
                </Button>
                <IconButton color="Info" variant="contained" component="label" onClick={this.helpIconOpen}>
                  <HelpIcon/>
                </IconButton>
                <Dialog onClose={this.helpIconClose} open={this.state.helpOpen}>
                  <DialogTitle id="customized-dialog-title" onClose={this.helpIconClose}>
                                    Uploading Adjacency Matrices
                  </DialogTitle>
                  <DialogContent dividers>
                    <Typography gutterBottom>
                        The adjacency matrix input should be in the format of a .csv file. The first row should contain
                        either a &lsquo;+&rsquo; or a &lsquo;-&rsquo;, indicating whether the node is initially infected or not, respectively.
                    </Typography>
                    <Typography gutterBottom>
                        The adjacency matrix starts the row after, and this follows the normal format for an adjacency matrix.
                    </Typography>
                    <Typography gutterBottom>
                        An example of an adjacency matrix input is available below:
                    </Typography>
                    <Typography gutterBottom>
                      <a href="example_graph.csv" download>Example Adjacency Matrix Input</a>
                    </Typography>
                  </DialogContent>
                </Dialog>
              </Box>
            </Container>
            <Divider variant = "middle"/>
            <Container>
              <h3>SEED SETS</h3>
              <Box display="flex" flexDirection="column">
                <Box display="flex" flexDirection="row">
                  <Tooltip title={"Calculates and displays the smallest set of nodes needed to activate the entire graph."}>
                    <TaskbarButton variant="outlined" onClick={this.getContagiousSet} data-tour="contagious-set-button">
                      <Switch size="small" onChange={this.toggleAlgorithmChoice} onClick={this.stopPropagation} onMouseDown={this.stopPropagation}/>
                      { this.state.useMinAlgorithm ? "Minimum Contagious Set" : "Greedy Contagious Set" }
                    </TaskbarButton>
                  </Tooltip>
                </Box>
                <Box display="flex" flexDirection="row">
                  <Tooltip title={"Makes each node a seed independently at random with the probability p."}>
                    <TaskbarButton variant="outlined" onClick={this.randomSeedSet} data-tour="random-seed-set-button">
                      <TextField label="p" id="seed-probability"
                        type="number" InputProps={{ inputProps: { min: 0, max: 1, step: 0.1 }}}
                        defaultValue={0.5} onClick={this.stopPropagation} onMouseDown={this.stopPropagation} style={{ marginRight: 20}}
                        variant="filled"/>
                          p-Random Seed Set
                    </TaskbarButton>
                  </Tooltip>
                </Box>
              </Box>
            </Container>
            <Divider variant = "middle"/>
            <Container>
              <h3>BOOTSTRAP PERCOLATION</h3>
              <Box display="flex" flexDirection="column" alignItems="center">
                <ButtonGroup
                  orientation="horizontal"
                  aria-label = "horizontal contained primary button group"
                >
                  <Tooltip title={"Deactivate all vertices"}>
                    <IconButton onClick={this.resetInfections}>
                      <RotateLeftIcon/>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={"Return to the first iteration"}>
                    <IconButton disabled={true}>
                      <FirstPageIcon/>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={"Go back an iteration"}>
                    <IconButton disabled={true}>
                      <ChevronLeftIcon/>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={"Perform a single iteration"}>
                    <IconButton onClick={this.percolationIteration} data-tour="next-iteration-button">
                      <ChevronRightIcon/>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={"Skip to the final iteration"}>
                    <IconButton onClick={this.finalPercolationIteration} data-tour="last-iteration-button">
                      <LastPageIcon/>
                    </IconButton>
                  </Tooltip>
                </ButtonGroup>
                <Box display="flex" flexDirection="row" alignItems="center" data-tour="parameter-text-fields">
                  <div>
                    <TextField id="bootstrap-percolation-threshold" label="Threshold" type="number" InputProps={{ inputProps: { min: 0 }}} onChange={this.updateBootstrapPercolationThreshold} defaultValue={this.props.threshold} style={{width: "50%"}} />
                    <TextField label="Probability" type="number" InputProps={{ inputProps: { min: 0, max: 1 }}} onChange={this.updateBootstrapPercolationProbability} defaultValue={1} style={{width: "50%"}} />
                  </div>
                </Box>
                <Typography variant="overline" gutterBottom>Iteration: {this.props.iteration}</Typography>
                <Typography variant="overline" gutterBottom>Active Vertices: {this.props.activeVerticesCount}</Typography>
                <Typography variant="overline" gutterBottom>Inactive Vertices: {this.props.inactiveVerticesCount}</Typography>
              </Box>
            </Container>
            <Divider variant = "middle"/>
            <Container>
              <h3>LEGEND</h3>
              <div style={{textAlign:"left", marginLeft:TOOLBAR_WIDTH / 2 - 100}}>
                <div className='legend-entry legend-entry-inactive'></div>
                            &nbsp;<Typography variant="overline" gutterBottom>Inactive Node</Typography>
                <br/>
                <div className='legend-entry legend-entry-active'></div>
                            &nbsp;<Typography variant="overline" gutterBottom>Active Node</Typography>
                <br/>
                <div className='legend-entry legend-entry-recently-activated'></div>
                            &nbsp;<Typography variant="overline" gutterBottom>Recently Infected Node</Typography>
              </div>
            </Container>
          </Box>
        </Paper>
      </div>
    );
  }


}

GraphTaskbar.propTypes = {
  readAdjacencyMatrix: PropTypes.func,
  getMinContagiousSet: PropTypes.func,
  getGreedyContagiousSet: PropTypes.func,
  randomSeedSet: PropTypes.func,
  stopPropagation: PropTypes.func,
  resetInfections: PropTypes.func,
  percolationIteration: PropTypes.func,
  finalPercolationIteration: PropTypes.func,
  updateBootstrapPercolationThreshold: PropTypes.func,
  updateBootstrapPercolationProbability: PropTypes.func,
  threshold: PropTypes.number,
  iteration: PropTypes.number,
  activeVerticesCount: PropTypes.number,
  inactiveVerticesCount: PropTypes.number
};

export default GraphTaskbar;
