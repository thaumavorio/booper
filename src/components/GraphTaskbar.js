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
  Grid,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from "@material-ui/core";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
// import FirstPageIcon from "@material-ui/icons/FirstPage";
// import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import PropTypes from "prop-types";
import { withStyles, withTheme } from "@material-ui/core/styles";

// Local Components
const TaskbarButton = withStyles(theme => ({
  root: {
    fontSize: "0.8rem",
    marginBottom: "5%",
    width: "80%",
    paddingLeft: "12px",
    paddingRight: "12px",
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      background: theme.palette.primary.hover,
    }
  }
}))(Button);

class GraphTaskbar extends Component {
  constructor(props){
    super(props);
    this.state = {
      helpOpen: false,
    };
  }

  // Start of functions from props to modify ForceGraph State

    readAdjacencyMatrix = (evt) => {
      this.props.readAdjacencyMatrix(evt);
    }

    randomGraph = () => {
      this.props.randomGraph();
    }

    getMinContagiousSet = () => {
      this.props.getMinContagiousSet();
    }

    getGreedyContagiousSet = () => {
      this.props.getGreedyContagiousSet();
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
    // End of Taskbar functions

    render() {
      const rows = [
        [ 0,1,0,1,0 ],
        [ 1,0,0,0,1 ],
        [ 0,0,0,1,1 ],
        [ 1,0,1,0,1 ],
        [ 0,1,1,1,0 ]
      ];
      return (
        <Box>
          <Paper className='toolbar-surface' elevation={10}>
            <Box style={{paddingTop: "2%", paddingBottom: "2%", height: this.props.height, overflowY: "scroll"}}>
              <Container>
                <Typography variant="h3">Graph</Typography>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                  <Tooltip title={
                    <React.Fragment>
                      <Typography gutterBottom variant="body2">
                        The adjacency matrix input should be in the format of a .csv or .tsv file. The first row should contain one entry for each node in the desired graph:
                        either a &lsquo;+&rsquo; or a &lsquo;-&rsquo;, indicating whether the node is initially active or not, respectively.
                      </Typography>
                      <Typography gutterBottom variant="body2">
                        The adjacency matrix starts the row after, and this follows the normal format for an adjacency matrix.
                      </Typography>
                      <Typography gutterBottom variant="body2">
                        <Link onClick={this.helpIconOpen} color="secondary">
                          See more..
                        </Link>
                      </Typography>
                    </React.Fragment>
                  } interactive={true} placement="right">
                    <TaskbarButton variant="contained" component="label" data-tour="upload-adjacency-matrix-button">
                      Upload Adjacency Matrix
                      <input id="uploadAdjacencyMatrix" type="file" accept=".csv" onChange={this.readAdjacencyMatrix} hidden/>
                    </TaskbarButton>
                  </Tooltip>
                  <Dialog onClose={this.helpIconClose} open={this.state.helpOpen}>
                    <DialogTitle id="customized-dialog-title" onClose={this.helpIconClose}>
                      Uploading Adjacency Matrices
                    </DialogTitle>
                    <DialogContent dividers>
                      <Typography gutterBottom variant="body2">
                        The adjacency matrix input should be in the format of a .csv or .tsv file. The first row should contain one entry for each node in the desired graph:
                        either a &lsquo;+&rsquo; or a &lsquo;-&rsquo;, indicating whether the node is initially active or not, respectively.
                      </Typography>
                      <Typography gutterBottom variant="body2">
                        The adjacency matrix starts the row after, and this follows the normal format for an adjacency matrix.
                      </Typography>
                      <Typography gutterBottom variant="body2">
                        An example of an adjacency matrix input is available below:
                      </Typography>
                      <TableContainer component={Paper} style={{marginBottom: "10px"}}>
                        <Table color="secondary" size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell align="center">+</TableCell>
                              <TableCell align="center">-</TableCell>
                              <TableCell align="center">+</TableCell>
                              <TableCell align="center">-</TableCell>
                              <TableCell align="center">-</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rows.map((row) => (
                              <TableRow key={row}>
                                <TableCell align="center">
                                  {row[0]}
                                </TableCell>
                                <TableCell align="center">{row[1]}</TableCell>
                                <TableCell align="center">{row[2]}</TableCell>
                                <TableCell align="center">{row[3]}</TableCell>
                                <TableCell align="center">{row[4]}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Typography gutterBottom variant="body2">
                        <a href="example_graph.csv" download>Download the csv</a>
                      </Typography>
                    </DialogContent>
                  </Dialog>
                  <Tooltip title={
                    <React.Fragment>
                      <Typography variant="body2" gutterBottom>
                        Generates an Erdős-Rényi graph with the given number of nodes and the given number of edges. Chooses the edges uniformly at random from all edge sets of this size.
                      </Typography>
                    </React.Fragment>
                  } placement="right">
                    <TaskbarButton variant="contained" onClick={this.randomGraph} data-tour="random-graph-button">
                      <Box display="flex" flexDirection="row" alignItems="center" style={{justifyContent: "space-between"}}>
                        <Grid container spacing={1} justify="space-between">
                          <Grid item xs={12} lg={6} xl={4}>
                            <TextField label="nodes" id="num-nodes"
                              type="number" InputProps={{ inputProps: { min: 0, step: 1 } }}
                              defaultValue={5} onClick={this.stopPropagation} onMouseDown={this.stopPropagation}
                              variant="outlined" style={{marginTop: 5, textAlign: "left"}} color="secondary" size="small"/>
                          </Grid>
                          <Grid item xs={12} lg={6} xl={4}>
                            <TextField label="edges" id="num-edges"
                              type="number" InputProps={{ inputProps: { min: 0, step: 1 } }}
                              defaultValue={5} onClick={this.stopPropagation} onMouseDown={this.stopPropagation}
                              variant="outlined" style={{marginTop: 5, textAlign: "left"}} color="secondary" size="small"/>
                          </Grid>
                          <Grid item xs={12} xl={4}>
                            Random Graph
                          </Grid>
                        </Grid>
                      </Box>
                    </TaskbarButton>
                  </Tooltip>
                </Box>
              </Container>
              <Divider variant = "middle"/>
              <Container>
                <Typography variant="h3">Seed Sets</Typography>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Tooltip title={
                    <React.Fragment>
                      <Typography variant="body2" gutterBottom>
                        Calculates and displays the smallest set of nodes needed to activate the entire graph.
                      </Typography>
                    </React.Fragment>} placement="right">
                    <TaskbarButton variant="contained" onClick={this.getMinContagiousSet} data-tour="min-contagious-set-button">
                      Minimum Contagious Set
                    </TaskbarButton>
                  </Tooltip>
                  <Tooltip title={
                    <React.Fragment>
                      <Typography variant="body2" gutterBottom>
                        Approximates the smallest set of nodes needed to activate the entire graph using a greedy algorithm.
                      </Typography>
                    </React.Fragment>} placement="right">
                    <TaskbarButton variant="contained" onClick={this.getGreedyContagiousSet} data-tour="greedy-contagious-set-button">
                      Greedy Contagious Set
                    </TaskbarButton>
                  </Tooltip>
                  <Tooltip title={
                    <React.Fragment>
                      <Typography variant="body2" gutterBottom>
                        Chooses a seed set uniformly at random from all seed sets of the given size.
                      </Typography>
                    </React.Fragment>
                  } placement="right">
                    <TaskbarButton variant="contained" onClick={this.randomSeedSet} data-tour="random-seed-set-button">
                      <Box display="flex" flexDirection="row" alignItems="center" style={{justifyContent: "space-between"}}>
                        <Grid container spacing={1}>
                          <Grid item xs={12} lg={6} alignItems="left">
                            <TextField label="seeds" id="num-seeds"
                              type="number" InputProps={{ inputProps: { min: 0, step: 1 } }}
                              defaultValue={2} onClick={this.stopPropagation} onMouseDown={this.stopPropagation}
                              variant="outlined" style={{marginTop: 5, textAlign: "left"}} color="secondary" size="small"/>
                          </Grid>
                          <Grid item xs={12} lg={6}>
                            Random Seed Set
                          </Grid>
                        </Grid>
                      </Box>
                    </TaskbarButton>
                  </Tooltip>
                </Box>
              </Container>
              <Divider variant="middle"/>
              <Container>
                <Typography variant="h3">Bootstrap Percolation</Typography>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Box display="flex" flexDirection="row" alignItems="center" data-tour="parameter-text-fields">
                    <TextField label="THRESHOLD" id="bootstrap-percolation-threshold"
                      type="number" InputProps={{ inputProps: { min: 1, step: 1 } }} classes={{ label: { root: { fontSize: "15px" }}}}
                      variant="outlined" fullWidth={true} onChange={this.updateBootstrapPercolationThreshold}
                      defaultValue={this.props.threshold} style={{margin: 5, marginTop: 15}} color="secondary" size="small"/>
                    <TextField label="PROBABILITY" type="number"
                      InputProps={{ inputProps: { min: 0, max: 1, step: 0.1 } }} classes={{ label: { root: { fontSize: "15px" }}}}
                      variant="outlined" fullWidth={true} onChange={this.updateBootstrapPercolationProbability}
                      defaultValue={1} style={{margin: 5, marginTop: 15}} color="secondary" size="small"/>
                  </Box>
                  <ButtonGroup
                    size="large"
                    variant="outlined"
                    orientation="horizontal"
                    aria-label = "horizontal contained primary button group"
                    color="inherit"
                  >
                    <Tooltip title={
                      <React.Fragment>
                        <Typography variant="body2" gutterBottom>
                          Deactivate all vertices
                        </Typography>
                      </React.Fragment>} placement="left" variant="body2">
                      <IconButton onClick={this.resetInfections}>
                        <RotateLeftIcon/>
                      </IconButton>
                    </Tooltip>
                    {/* <Tooltip title={<React.Fragment>*/}
                    {/*  <Typography variant="body2" gutterBottom>*/}
                    {/*    Return to the first iteration*/}
                    {/*  </Typography>*/}
                    {/* </React.Fragment>} placement="left" variant="body2">*/}
                    {/*  <IconButton disabled={true}>*/}
                    {/*    <FirstPageIcon/>*/}
                    {/*  </IconButton>*/}
                    {/* </Tooltip>*/}
                    {/* <Tooltip title={<React.Fragment>*/}
                    {/*  <Typography variant="body2" gutterBottom>*/}
                    {/*    Go back an iteration*/}
                    {/*  </Typography>*/}
                    {/* </React.Fragment>} placement="left" variant="body2">*/}
                    {/*  <IconButton disabled={true}>*/}
                    {/*    <ChevronLeftIcon/>*/}
                    {/*  </IconButton>*/}
                    {/* </Tooltip>*/}
                    <Tooltip title={<React.Fragment>
                      <Typography variant="body2" gutterBottom>
                        Perform a single iteration
                      </Typography>
                    </React.Fragment>} placement="left" variant="body2">
                      <IconButton onClick={this.percolationIteration} data-tour="next-iteration-button">
                        <ChevronRightIcon/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={<React.Fragment>
                      <Typography variant="body2" gutterBottom>
                        Skip to the final iteration
                      </Typography>
                    </React.Fragment>} placement="left" variant="body2">
                      <IconButton onClick={this.finalPercolationIteration} data-tour="last-iteration-button">
                        <LastPageIcon/>
                      </IconButton>
                    </Tooltip>
                  </ButtonGroup>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={7} style={{textAlign: "right"}}>
                      <Typography variant="overline" gutterBottom>Iteration:</Typography>
                    </Grid>
                    <Grid item xs={5} style={{textAlign: "left"}}>
                      <Typography variant="caption">{this.props.iteration}</Typography>
                    </Grid>
                    <Grid item xs={7} style={{textAlign: "right"}}>
                      <Typography variant="overline" gutterBottom>Active Vertices:</Typography>
                    </Grid>
                    <Grid item xs={5} style={{textAlign: "left"}}>
                      <Typography variant="caption" gutterBottom>{this.props.activeVerticesCount}</Typography>
                    </Grid>
                    <Grid item xs={7} style={{textAlign: "right"}}>
                      <Typography variant="overline" gutterBottom>Inactive Vertices:</Typography>
                    </Grid>
                    <Grid item xs={5} style={{textAlign: "left"}}>
                      <Typography variant="caption" gutterBottom>{this.props.inactiveVerticesCount}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Container>
              <Divider variant="middle"/>
              <Container>
                <Typography variant="h3">Legend</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={7} style={{textAlign: "right"}}>
                    <Typography variant="overline" gutterBottom>Inactive</Typography>
                  </Grid>
                  <Grid item xs={5} style={{textAlign: "left", alignContent: "center"}}>
                    <div style={{width: 14, height: 14, marginTop: 7, borderRadius: "50%", display: "inline-block", backgroundColor: this.props.theme.palette.inactive.main}} />
                  </Grid>
                  <Grid item xs={7} style={{textAlign: "right"}}>
                    <Typography variant="overline" gutterBottom>Active</Typography>
                  </Grid>
                  <Grid item xs={5} style={{textAlign: "left"}}>
                    <div style={{width: 14, height: 14, marginTop: 7, borderRadius: "50%", display: "inline-block", backgroundColor: this.props.theme.palette.active.main}} />
                  </Grid>
                  <Grid item xs={7} style={{textAlign: "right"}}>
                    <Typography variant="overline" gutterBottom>Recently Activated</Typography>
                  </Grid>
                  <Grid item xs={5} style={{textAlign: "left"}}>
                    <div style={{width: 14, height: 14, marginTop: 7, borderRadius: "50%", display: "inline-block", backgroundColor: this.props.theme.palette.recentlyActive.main}}/>
                  </Grid>
                </Grid>
              </Container>
            </Box>
          </Paper>
        </Box>
      );
    }


}

GraphTaskbar.propTypes = {
  readAdjacencyMatrix: PropTypes.func,
  randomGraph: PropTypes.func,
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
  inactiveVerticesCount: PropTypes.number,
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      background: PropTypes.shape({
        main: PropTypes.string.isRequired
      }).isRequired,
      active: PropTypes.shape({
        main: PropTypes.string.isRequired
      }).isRequired,
      inactive: PropTypes.shape({
        main: PropTypes.string.isRequired
      }).isRequired,
      link: PropTypes.shape({
        main: PropTypes.string.isRequired
      }).isRequired,
      recentlyActive: PropTypes.shape({
        main: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  height: PropTypes.number.isRequired
};

export default withTheme(GraphTaskbar);
