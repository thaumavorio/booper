import React, {Component} from "react";
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
  MenuItem,
  Paper,
  Select,
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
import {LoadingSpinnerComponent} from "./LoadingSpinnerComponent";
import PropTypes from "prop-types";


const TOOLBAR_WIDTH = 300;

// Start of local Components
const TaskbarButton = styled(Button)({
  fontSize: "11px",
  marginBottom: "10px",
  width: "100%"
});

const SeedSetSelect = styled(Select)({
  fontSize: "11px"
});

const SeedSetMenuItem = styled(MenuItem)({
  fontSize: "11px"
});

class GraphTaskbar extends Component {

  constructor(props){
    super(props);
    this.state = {
      helpOpen: false,
      seedAlgorithm: "minAlgorithm"
    };
  }

  // Start of functions from props to modify ForceGraph State

    readAdjacencyMatrix = (evt) => {
      this.props.readAdjacencyMatrix(evt);
    }

    getSeedSet = () => {
      if(this.state.seedAlgorithm === "greedyAlgorithm"){
        this.props.getGreedyContagiousSet();
      }
      else if(this.state.seedAlgorithm === "pRandomSet"){
        this.props.randomSeedSet();
      }
      else {
        this.props.getMinContagiousSet();
      }
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

    // End of functions from props to modify ForceGraph State

    // Start of Taskbar functions

    helpIconOpen = () => {
      this.setState({helpOpen: true});
    }

    helpIconClose = () => {
      this.setState({helpOpen: false});
    }

  toggleAlgorithmChoice = (event) => {
    this.setState({
      seedAlgorithm: event.target.value
    });
  }
  // End of Taskbar functions

  render() {
    return (
      <div>
        <LoadingSpinnerComponent/>
        <Paper className='toolbar-surface' elevation={10}>
          <Box style={{padding: 30}} width={TOOLBAR_WIDTH}>
            <Container>
              <h3>GRAPH</h3>
              <Box display="flex" flexDirection="row">
                <Button variant="outlined" component="label"
                  style={{fontSize: "12px", marginBottom: "10px", width: TOOLBAR_WIDTH * 0.8}}>
                    Upload Adjacency Matrix
                  <input id="uploadAdjacencyMatrix" type="file" accept=".csv" onChange={this.readAdjacencyMatrix}
                    hidden/>
                  <IconButton color="Info" variant="contained" component="label" onClick={this.helpIconOpen} onMouseDown={this.stopPropagation}>
                    <HelpIcon/>
                  </IconButton>
                </Button>
                <Dialog onClose={this.helpIconClose} open={this.state.helpOpen}>
                  <DialogTitle id="customized-dialog-title" onClose={this.helpIconClose}>
                      Uploading Adjacency Matrices
                  </DialogTitle>
                  <DialogContent dividers>
                    <Typography gutterBottom>
                        The adjacency matrix input should be in the format of a .csv file. The first row should contain
                        either a &lsquo;+&rsquo; or a &lsquo;-&rsquo;, indicating whether the node is initially infected
                        or not, respectively.
                    </Typography>
                    <Typography gutterBottom>
                        The adjacency matrix starts the row after, and this follows the normal format for an adjacency
                        matrix.
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
            <Divider variant="middle"/>
            <Container>
              <h3>SEED SETS</h3>
              <Tooltip
                title={"Calculates and displays the smallest set of nodes needed to activate the entire graph."}>
                <TaskbarButton variant="outlined" onClick={this.getSeedSet}>
                  {this.state.seedAlgorithm === "pRandomSet" ?
                    <Box display="flex" flexDirection="row">
                      <TextField label="p" id="seed-probability"
                        type="number" InputProps={{inputProps: {min: 0, max: 1, step: 0.1}}} fontSize={"11px"}
                        defaultValue={0.5} onClick={this.stopPropagation} onMouseDown={this.stopPropagation}
                        variant="filled"/>
                      <SeedSetSelect value={this.state.seedAlgorithm} onChange={this.toggleAlgorithmChoice}
                        onClick={this.stopPropagation} onMouseDown={this.stopPropagation}
                        variant="outlined">
                        <SeedSetMenuItem value={"minAlgorithm"}>Minimum Contagious Set</SeedSetMenuItem>
                        <SeedSetMenuItem value={"greedyAlgorithm"}>Greedy Contagious Set</SeedSetMenuItem>
                        <SeedSetMenuItem value={"pRandomSet"}>P-Random Seed Set</SeedSetMenuItem>
                      </SeedSetSelect>
                    </Box> :
                    <Box>
                      <SeedSetSelect value={this.state.seedAlgorithm} onChange={this.toggleAlgorithmChoice}
                        onClick={this.stopPropagation} onMouseDown={this.stopPropagation}
                        variant="outlined">
                        <SeedSetMenuItem value={"minAlgorithm"}>Minimum Contagious Set</SeedSetMenuItem>
                        <SeedSetMenuItem value={"greedyAlgorithm"}>Greedy Contagious Set</SeedSetMenuItem>
                        <SeedSetMenuItem value={"pRandomSet"}>P-Random Seed Set</SeedSetMenuItem>
                      </SeedSetSelect>
                    </Box>
                  }
                </TaskbarButton>
              </Tooltip>
            </Container>
            <Divider variant="middle"/>
            <Container>
              <h3>BOOTSTRAP PERCOLATION</h3>
              <Box display="flex" flexDirection="column" alignItems="center">
                <ButtonGroup
                  orientation="horizontal"
                  aria-label="horizontal contained primary button group"
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
                  <div>
                    <TextField id="bootstrap-percolation-threshold" label="Threshold" type="number"
                      InputProps={{inputProps: {min: 0}}} onChange={this.updateBootstrapPercolationThreshold}
                      defaultValue={this.props.threshold}/>
                  </div>
                </Box>
                <Typography variant="overline" gutterBottom>Iteration: {this.props.iteration}</Typography>
                <Typography variant="overline" gutterBottom>Active
                    Vertices: {this.props.activeVerticesCount}</Typography>
                <Typography variant="overline" gutterBottom>Inactive
                    Vertices: {this.props.inactiveVerticesCount}</Typography>
              </Box>
            </Container>
            <Divider variant="middle"/>
            <Container>
              <h3>LEGEND</h3>
              <div style={{textAlign: "left", marginLeft: TOOLBAR_WIDTH / 2 - 100}}>
                <div className='legend-entry legend-entry-inactive'/>
                  &nbsp;<Typography variant="overline" gutterBottom>Inactive Node</Typography>
                <br/>
                <div className='legend-entry legend-entry-active'/>
                  &nbsp;<Typography variant="overline" gutterBottom>Active Node</Typography>
                <br/>
                <div className='legend-entry legend-entry-recently-activated'/>
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
  threshold: PropTypes.number,
  iteration: PropTypes.number,
  activeVerticesCount: PropTypes.number,
  inactiveVerticesCount: PropTypes.number
};

export default GraphTaskbar;
