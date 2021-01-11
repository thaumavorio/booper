import React, {Component} from 'react';
import {
    Box,
    Button, ButtonGroup,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Paper, Tooltip,
    Typography
} from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import TextField from "@material-ui/core/TextField";

class GraphTaskbar extends Component {

    constructor(props){
        super(props);
        this.state = {
            helpOpen: false
        }
    }

    // Start of functions from props to modify ForceGraph State

    readAdjacencyMatrix = (evt) => {
        this.props.readAdjacencyMatrix(evt)
    }

    getMinContagiousSet = () => {
        this.props.getMinContagiousSet()
    }

    getGreedyContagiousSet = () => {
        this.props.getGreedyContagiousSet()
    }

    randomSeedSet = () => {
        this.props.randomSeedSet()
    }

    stopPropagation = (event) => {
        this.props.stopPropagation(event)
    }

    resetInfections = () => {
        this.props.resetInfections()
    }

    percolationIteration = () => {
        this.props.percolationIteration()
    }

    finalPercolationIteration = () => {
        this.props.finalPercolationIteration()
    }

    updateBootstrapPercolationThreshold = (evt) => {
        this.props.updateBootstrapPercolationThreshold(evt)
    }

    getThreshold = () => {
        return this.props.getThreshold()
    }

    getIteration = () => {
        this.props.getIteration()
    }

    getActiveVerticesCount = () => {
        this.props.getActiveVerticesCount()
    }

    getInactiveVerticesCount = () => {
        this.props.getInactiveVerticesCount()
    }


    // End of functions from props to modify ForceGraph State

    // Start of Taskbar functions

    helpIconOpen = () => {
        this.setState({helpOpen: true})
    }

    helpIconClose = () => {
        this.setState({helpOpen: false})
    }

    // End of Taskbar functions

    // Start of local Components




    render() {
        const TOOLBAR_WIDTH = 300;
        return (
            <div>
                <Paper className='toolbar-surface' elevation={10}>
                    <Box component="span" display="flex" flexDirection="column" flexWrap="wrap" style={{padding: 30, justifyContent: "center"}} width={TOOLBAR_WIDTH}>
                        <h3>GRAPH</h3>
                        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
                            <Button variant="outlined" component="label">
                                <Typography variant="button">Upload Adjacency Matrix</Typography>
                                <input id="uploadAdjacencyMatrix" type="file" accept=".csv" onChange={this.readAdjacencyMatrix} hidden />
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
                                        either a '+' or a '-', indicating whether the node is initially infected or not, respectively.
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
                        <Divider variant = "middle" color = "Primary" style={{marginTop: 10}}/>
                        <h3>SEED SETS</h3>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <ButtonGroup
                                orientation="horizontal"
                                aria-label = "horizontal contained primary button group"
                                variant = "contained"
                            >
                                <Tooltip title={"Calculates and displays the smallest set of nodes needed to activate the entire graph."}>
                                    <Button variant="outlined" onClick={this.getMinContagiousSet}>
                                        <Typography variant="button">Minimum Contagious Set</Typography>
                                    </Button>
                                </Tooltip>
                                <Tooltip title={"Calculates and displays a set of nodes which would activate the entire graph using a greedy algorithm."}>
                                    <Button variant="outlined" onClick={this.getGreedyContagiousSet}>
                                        <Typography variant="button">Greedy Contagious Set</Typography>
                                    </Button>
                                </Tooltip>
                            </ButtonGroup>
                            <Tooltip title={"Makes each node a seed independently at random with the given probability."}>
                                <Button variant="outlined" onClick={this.randomSeedSet}>
                                    <Typography variant="button">Random Seed Set</Typography>
                                </Button>
                            </Tooltip>
                            <div>
                                <TextField label="Seed Probability" placeholder="Specify p" id="seed-probability" type="number" InputProps={{ inputProps: { min: 0, max: 1 }}} defaultValue={0.5} onClick={this.stopPropagation} fullWidth={true}/>
                            </div>
                        </Box>
                        <Divider variant = "middle" color = "Primary"/>
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
                                    <TextField id="bootstrap-percolation-threshold" label="Threshold" type="number" InputProps={{ inputProps: { min: 0 }}} onChange={this.updateBootstrapPercolationThreshold} defaultValue={this.props.threshold}  />
                                </div>
                            </Box>
                            <Typography variant="subtitle1" gutterBottom>Iteration: {this.props.iteration}</Typography>
                            <Typography variant="subtitle1" gutterBottom>Active Vertices: {this.props.activeVerticesCount}</Typography>
                            <Typography variant="subtitle1" gutterBottom>Inactive Vertices: {this.props.inactiveVerticesCount}</Typography>
                        </Box>
                        <Divider variant = "middle" color = "Primary"/>
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
                    </Box>
                </Paper>
            </div>
        );
    }
}

export default GraphTaskbar;