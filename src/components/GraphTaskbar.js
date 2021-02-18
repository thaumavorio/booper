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
import FirstPageIcon from "@material-ui/icons/FirstPage";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import PropTypes from "prop-types";
import {withStyles, withTheme} from "@material-ui/core/styles";


// const TOOLBAR_WIDTH = 300;

// Local Components
const TaskbarButton = withStyles(theme => ({
  root: {
    fontSize: "0.8rem",
    marginBottom: "5%",
    width: "80%",
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
      const rows = [
        [ 0,1,0,1,0 ],
        [ 1,0,0,0,1 ],
        [ 0,0,0,1,1 ],
        [ 1,0,1,0,1 ],
        [ 0,1,1,1,0 ]
      ];
      return (
        <Box>
          <Paper className='toolbar-surface' style={{marginRight: 10}}>
            <Box style={{paddingTop: "2%"}}>
              <Container>
                <Typography variant="h3">Graph</Typography>
                <Box display="flex" flexDirection="row" justifyContent="center">
                  <Tooltip title={
                    <React.Fragment>
                      <Typography gutterBottom variant="body2">
                      The adjacency matrix input should be in the format of a .csv file. The first row should contain
                      either a &lsquo;+&rsquo; or a &lsquo;-&rsquo;, indicating whether the node is initially infected or not, respectively.
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
                        The adjacency matrix input should be in the format of a .csv file. The first row should contain
                        either a &lsquo;+&rsquo; or a &lsquo;-&rsquo;, indicating whether the node is initially infected or not, respectively.
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
                </Box>
              </Container>
              <Divider variant = "middle"/>
              <Container>
                <Typography variant="h3">Seed Sets</Typography>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Tooltip title={
                    <React.Fragment>
                      <Typography variant="body2" gutterBottom>
                        Calculates and displays the smallest set of nodes needed to activate the entire graph
                      </Typography>
                    </React.Fragment>} placement="right">
                    <TaskbarButton variant="contained" onClick={this.getMinContagiousSet} data-tour="min-contagious-set-button">
                    Minimum Contagious Set
                    </TaskbarButton>
                  </Tooltip>
                  <Tooltip title={
                    <React.Fragment>
                      <Typography variant="body2" gutterBottom>
                        Calculates and displays the smallest set of nodes needed to activate the entire graph using a greedy algorithm.
                      </Typography>
                    </React.Fragment>} placement="right">
                    <TaskbarButton variant="contained" onClick={this.getGreedyContagiousSet} data-tour="greedy-contagious-set-button">
                    Greedy Contagious Set
                    </TaskbarButton>
                  </Tooltip>
                  <Tooltip title={
                    <React.Fragment>
                      <Typography variant="body2" gutterBottom>
                        Makes each node a seed independently at random with the probability p.
                      </Typography>
                    </React.Fragment>
                  } placement="right">
                    <TaskbarButton variant="contained" onClick={this.randomSeedSet} data-tour="random-seed-set-button">
                      <Box display="flex" flexDirection="row" alignItems="center" style={{justifyContent: "space-between"}}>
                        <div style={{width: "50%"}}>
                          <TextField label="probability" id="seed-probability"
                            type="number" InputProps={{ inputProps: { min: 0, max: 1, step: 0.1 } }}
                            defaultValue={0.5} onClick={this.stopPropagation} onMouseDown={this.stopPropagation}
                            variant="outlined" style={{marginTop: 5}} color="secondary"/>
                        </div>
                        <div style={{width: "50%", justifyContent: "center"}}>
                          p-Random Seed Set
                        </div>
                      </Box>
                    </TaskbarButton>
                  </Tooltip>
                </Box>
              </Container>
              <Divider variant="middle"/>
              <Container>
                <Typography variant="h3">Bootstrap Percolation</Typography>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <ButtonGroup
                    size="medium"
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
                    <Tooltip title={<React.Fragment>
                      <Typography variant="body2" gutterBottom>
                        Return to the first iteration
                      </Typography>
                    </React.Fragment>} placement="left" variant="body2">
                      <IconButton disabled={true}>
                        <FirstPageIcon/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={<React.Fragment>
                      <Typography variant="body2" gutterBottom>
                        Go back an iteration
                      </Typography>
                    </React.Fragment>} placement="left" variant="body2">
                      <IconButton disabled={true}>
                        <ChevronLeftIcon/>
                      </IconButton>
                    </Tooltip>
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
                  <Box display="flex" flexDirection="row" alignItems="center" data-tour="parameter-text-fields">
                    <TextField label="THRESHOLD" id="bootstrap-percolation-threshold"
                      type="number" InputProps={{ inputProps: { min: 1, step: 1 } }} classes={{ label: { root: { fontSize: "15px" }}}}
                      variant="outlined" fullWidth={true} onChange={this.updateBootstrapPercolationThreshold}
                      defaultValue={this.props.threshold} style={{margin: 5, marginTop: 15}} color="secondary"/>
                    <TextField label="PROBABILITY" type="number"
                      InputProps={{ inputProps: { min: 0, max: 1, step: 0.1 } }} classes={{ label: { root: { fontSize: "15px" }}}}
                      variant="outlined" fullWidth={true} onChange={this.updateBootstrapPercolationProbability}
                      defaultValue={1} style={{margin: 5, marginTop: 15}} color="secondary"/>
                  </Box>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={8} style={{textAlign: "right"}}>
                      <Typography variant="overline" gutterBottom>Iteration:</Typography>
                    </Grid>
                    <Grid item xs={4} style={{textAlign: "left"}}>
                      <Typography variant="caption">{this.props.iteration}</Typography>
                    </Grid>
                    <Grid item xs={8} style={{textAlign: "right"}}>
                      <Typography variant="overline" gutterBottom>Active Vertices:</Typography>
                    </Grid>
                    <Grid item xs={4} style={{textAlign: "left"}}>
                      <Typography variant="caption" gutterBottom>{this.props.activeVerticesCount}</Typography>
                    </Grid>
                    <Grid item xs={8} style={{textAlign: "right"}}>
                      <Typography variant="overline" gutterBottom>Inactive Vertices:</Typography>
                    </Grid>
                    <Grid item xs={4} style={{textAlign: "left"}}>
                      <Typography variant="caption" gutterBottom>{this.props.inactiveVerticesCount}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Container>
              <Divider variant="middle"/>
              <Container>
                <Typography variant="h3">Legend</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={8} style={{textAlign: "right"}}>
                    <Typography variant="overline" gutterBottom>Inactive</Typography>
                  </Grid>
                  <Grid item xs={4} style={{textAlign: "left", alignContent: "center"}}>
                    <div style={{width: 14, height: 14, marginTop: 7, borderRadius: "50%", display: "inline-block", backgroundColor: this.props.theme.palette.inactive.main}} />
                  </Grid>
                  <Grid item xs={8} style={{textAlign: "right"}}>
                    <Typography variant="overline" gutterBottom>Active</Typography>
                  </Grid>
                  <Grid item xs={4} style={{textAlign: "left"}}>
                    <div style={{width: 14, height: 14, marginTop: 7, borderRadius: "50%", display: "inline-block", backgroundColor: this.props.theme.palette.active.main}} />
                  </Grid>
                  <Grid item xs={8} style={{textAlign: "right"}}>
                    <Typography variant="overline" gutterBottom>Recently Activated</Typography>
                  </Grid>
                  <Grid item xs={4} style={{textAlign: "left"}}>
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
