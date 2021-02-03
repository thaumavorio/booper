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
  IconButton, Link,
  Paper,
  TextField,
  Tooltip,
  Typography
} from "@material-ui/core";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import PropTypes from "prop-types";
import { withStyles, withTheme } from "@material-ui/core/styles";


const TOOLBAR_WIDTH = 300;

// Local Components
const TaskbarButton = withStyles(theme => ({
  root: {
    fontSize: "14px",
    marginBottom: "10px",
    width: "100%",
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
      useMinAlgorithm: true
    };
  }

  // Start of functions from props to modify ForceGraph State

    readAdjacencyMatrix = (evt) => {
      this.props.readAdjacencyMatrix(evt);
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
      return (
        <Box>
          <Paper className='toolbar-surface' elevation={5} style={{marginRight: 10}}>
            <Box style={{padding: 30}} width={TOOLBAR_WIDTH}>
              <Container>
                <h3>GRAPH</h3>
                <Box display="flex" flexDirection="row">
                  <Tooltip title={
                    <React.Fragment>
                      <Typography gutterBottom>
                      The adjacency matrix input should be in the format of a .csv file. The first row should contain
                      either a &lsquo;+&rsquo; or a &lsquo;-&rsquo;, indicating whether the node is initially infected or not, respectively.
                      </Typography>
                      <Typography gutterBottom>
                      The adjacency matrix starts the row after, and this follows the normal format for an adjacency matrix.
                      </Typography>
                      <Typography gutterBottom>
                        <Link onClick={this.helpIconOpen} style={{color: "white"}}>
                        See more..
                        </Link>
                      </Typography>
                    </React.Fragment>
                  } interactive={true} placement="right">
                    <TaskbarButton variant="contained" component="label">
                      Upload Adjacency Matrix
                      <input id="uploadAdjacencyMatrix" type="file" accept=".csv" onChange={this.readAdjacencyMatrix} hidden/>
                    </TaskbarButton>
                  </Tooltip>
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
                  <Tooltip title={"Calculates and displays the smallest set of nodes needed to activate the entire graph."}>
                    <TaskbarButton variant="contained" onClick={this.getMinContagiousSet}>
                    Minimum Contagious Set
                    </TaskbarButton>
                  </Tooltip>
                  <Tooltip title={"Calculates and displays the smallest set of nodes needed to activate the entire graph using a greedy algorithm."}>
                    <TaskbarButton variant="contained" onClick={this.getGreedyContagiousSet}>
                    Greedy Contagious Set
                    </TaskbarButton>
                  </Tooltip>
                  <Box display="flex" flexDirection="row">
                    <Tooltip title={"Makes each node a seed independently at random with the probability p."}>
                      <TaskbarButton variant="contained" onClick={this.randomSeedSet} style={{justifyContent: "space-between"}}>
                        <TextField label="probability" id="seed-probability"
                          type="number" InputProps={{ inputProps: { min: 0, max: 1, step: 0.1 } }} classes={{ label: { root: { fontSize: "15px" }}}}
                          defaultValue={0.5} onClick={this.stopPropagation} onMouseDown={this.stopPropagation}
                          variant="outlined" fullWidth={true} style={{marginTop: 5}} color="secondary"/>
                          p-Random Seed Set
                      </TaskbarButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Container>
              <Divider variant="middle"/>
              <Container>
                <h3>BOOTSTRAP PERCOLATION</h3>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <ButtonGroup
                    size="large"
                    variant="filled"
                    orientation="horizontal"
                    aria-label = "horizontal contained primary button group"
                    color="inherit"
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
                      <IconButton onClick={this.percolationIteration}>
                        <ChevronRightIcon/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={"Skip to the final iteration"}>
                      <IconButton onClick={this.finalPercolationIteration}>
                        <LastPageIcon/>
                      </IconButton>
                    </Tooltip>
                  </ButtonGroup>
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <TextField label="THRESHOLD" id="bootstrap-percolation-threshold"
                      type="number" InputProps={{ inputProps: { min: 1, step: 1 } }} classes={{ label: { root: { fontSize: "15px" }}}}
                      variant="outlined" fullWidth={true} onChange={this.updateBootstrapPercolationThreshold}
                      defaultValue={this.props.threshold} style={{margin: 5}} color="secondary"/>
                    <TextField label="PROBABILITY" type="number"
                      InputProps={{ inputProps: { min: 0, max: 1, step: 0.1 } }} classes={{ label: { root: { fontSize: "15px" }}}}
                      variant="outlined" fullWidth={true} onChange={this.updateBootstrapPercolationProbability}
                      defaultValue={1} style={{margin: 5}} color="secondary"/>
                  </Box>
                  <Typography variant="overline" style={{textAlign: "left"}} gutterBottom>Iteration: {this.props.iteration}</Typography>
                  <Typography variant="overline" align="center" gutterBottom>Active Vertices: {this.props.activeVerticesCount}</Typography>
                  <Typography variant="overline" align="right" gutterBottom>Inactive Vertices: {this.props.inactiveVerticesCount}</Typography>
                </Box>
              </Container>
              <Divider variant="middle"/>
              <Container>
                <h3>LEGEND</h3>
                <div style={{textAlign:"left", marginLeft:TOOLBAR_WIDTH / 2 - 100}}>
                  <div style={{width: 10, height: 10, borderRadius: "50%",
                    display: "inline-block", backgroundColor: this.props.theme.palette.inactive.main}}></div>
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
        </Box>
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
  }).isRequired
};

export default withTheme(GraphTaskbar);
