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

class GraphToolBar extends Component {

    constructor(){
        super();
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

    helpIconOpen = () => {
        this.setState({helpOpen: true})
    }

    helpIconClose = () => {
        this.setState({helpOpen: false})
    }


    render() {
        const TOOLBAR_WIDTH = 300;
        const INACTIVE_COLOR = "#5375e2";
        const ACTIVE_COLOR = "#f65868";
        const RECENTLY_INFECTED_COLOR = "#228b22";
        const TOOLBAR_COLOR = "#f5f5f5";
        return (
            <div>
                <Paper elevation={10} style={{margin: 20, backgroundColor: TOOLBAR_COLOR}}>
                    <Box component="span" display="flex" flexDirection="column" flexWrap="wrap" style={{padding: 10, justifyContent: "center"}} width={TOOLBAR_WIDTH}>
                        <h3>GRAPH</h3>
                        <Box display="flex" flexDirection="row" style={{margin: 10, marginTop: 0}}>
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
                        <Divider variant = "middle" color = "Primary"/>
                        <h3>SEED SETS</h3>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <ButtonGroup
                                orientation="horizontal"
                                aria-label = "horizontal contained primary button group"
                                variant = "contained"
                                style = {{margin: 10, marginTop: 0}}
                            >
                                <Tooltip title={"Calculates and displays the smallest set of nodes needed to activate the entire graph."}>
                                    <Button style={{ fontSize: '12px' }} variant="outlined" onClick={this.getMinContagiousSet}>
                                        <Typography variant="button">Minimum Contagious Set</Typography>
                                    </Button>
                                </Tooltip>
                                <Tooltip title={"Calculates and displays a set of nodes which would activate the entire graph using a greedy algorithm."}>
                                    <Button style={{ fontSize: '12px' }} variant="outlined" onClick={this.getGreedyContagiousSet}>
                                        <Typography variant="button">Greedy Contagious Set</Typography>
                                    </Button>
                                </Tooltip>
                            </ButtonGroup>
                            <Tooltip title={"Makes each node a seed independently at random with the given probability."}>
                                <Button style={{ margin: 10, marginRight: 0 }} color = "Primary" variant="outlined" onClick={this.randomSeedSet}>
                                    <Typography style={{ padding: 5 }} variant="button">Random Seed Set</Typography>
                                </Button>
                            </Tooltip>
                        </Box>
                        <Box display="flex" flexDirection="row" alignContent="center" style={{justifyContent: "center"}}>
                            <Typography variant="overline">Seed Probability:</Typography>
                            <input style={{ width: 100, height: 30, marginLeft: 5, marginBottom: 10}} placeholder="Specify p" id="seed-probability" type="number" min="0.00000000000" max="1.00000000000" onClick={this.stopPropagation} />
                        </Box>
                        <Divider variant = "middle" color = "Primary"/>
                        <h3>BOOTSTRAP PERCOLATION</h3>
                        <Box display="flex" flexDirection="column" alignItems="center" style={{justifyContent: "center"}}>
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
                            <Box display="flex" flexDirection="row" alignItems="center" style={{ padding:10, justifyContent: "center" }}>
                                <Typography variant="overline" gutterBottom>Threshold: </Typography>
                                <div class="input-thresh">
                                    <input style={{ width: 100, height: 30, marginLeft: 5, marginBottom: 10}} id="bootstrap-percolation-threshold" type="number" min="1" onChange={this.updateBootstrapPercolationThreshold} defaultValue={this.props.threshold}  />
                                </div>
                            </Box>
                            <Typography variant="subtitle1" gutterBottom>Iteration: {this.props.iteration}</Typography>
                            <Typography variant="subtitle1" gutterBottom>Active Vertices: {this.props.activeVerticesCount}</Typography>
                            <Typography variant="subtitle1" gutterBottom>Inactive Vertices: {this.props.inactiveVerticesCount}</Typography>
                        </Box>
                        <Divider variant = "middle" color = "Primary"/>
                        <h3 style={{marginBottom: 5}}>LEGEND</h3>
                        <div style={{textAlign:"left", marginLeft:TOOLBAR_WIDTH / 2 - 100}}>
                            <div style={{width:"10px", height:"10px", backgroundColor:INACTIVE_COLOR, borderRadius:"50%", display:"inline-block"}}></div>
                            &nbsp;<Typography variant="overline" gutterBottom>Inactive Node</Typography>
                            <br/>
                            <div style={{width:"10px", height:"10px", backgroundColor:ACTIVE_COLOR, borderRadius:"50%", display:"inline-block"}}></div>
                            &nbsp;<Typography variant="overline" gutterBottom>Active Node</Typography>
                            <br/>
                            <div style={{width:"10px", height:"10px", backgroundColor:RECENTLY_INFECTED_COLOR, borderRadius:"50%", display:"inline-block"}}></div>
                            &nbsp;<Typography variant="overline" gutterBottom>Recently Infected Node</Typography>
                        </div>
                    </Box>
                </Paper>
            </div>
        );
    }
}

export default GraphToolBar;