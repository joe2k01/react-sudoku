import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Box(props) {
    return (
        <button className="box" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class SudokuBoard extends React.Component {
    calculateBoundaries(inner, outer) {
        let innerUpBoundary = null;
        let innerLoBoundary = null;
        let outerUpBoundary = null;
        let outerLoBoundary = null;
        if(inner === 0 || inner === 1 || inner === 2) {
            innerLoBoundary = 0;
            innerUpBoundary = 2;
        }
        if(inner === 3 || inner === 4 || inner === 5) {
            innerLoBoundary = 3;
            innerUpBoundary = 5;
        }
        if(inner === 6 || inner === 7 || inner === 8) {
            innerLoBoundary = 6;
            innerUpBoundary = 8;
        }
        if(outer === 0 || outer === 1 || outer === 2) {
            outerLoBoundary = 0;
            outerUpBoundary = 2;
        }
        if(outer === 3 || outer === 4 || outer === 5) {
            outerLoBoundary = 3;
            outerUpBoundary = 5;
        }
        if(outer === 6 || outer === 7 || outer === 8) {
            outerLoBoundary = 6;
            outerUpBoundary = 8;
        }
        return [innerUpBoundary, innerLoBoundary, outerUpBoundary, outerLoBoundary];
    }
    render() {
        return (
            <table>
                <tbody>
                {
                    this.props.boxes.map((row, i) =>
                        <tr key={i + "r"}>
                        {
                            row.map((val, j) => {
                                let computedClass = "non-affected-box";
                                const inner = this.props.state.selectedInner;
                                const outer = this.props.state.selectedOuter;
                                if(i === outer ||
                                    j === inner) {
                                        computedClass = "affected-box"
                                }
                                
                                const [innerUpBoundary, innerLoBoundary, outerUpBoundary, outerLoBoundary] = this.calculateBoundaries(inner, outer);
                                
                                /* Affect the whole box */
                                if(i <= outerUpBoundary && i >= outerLoBoundary && inner != null) {
                                    if(j <= innerUpBoundary && j >= innerLoBoundary) {
                                        computedClass = "affected-box"
                                    }
                                }

                                if (j === 2 /* Third column */ ||
                                    j === 5 /* Sixth column */ ) {
                                    computedClass = computedClass.concat(" right-border");
                                }
                                if (i === 2 /* Third row */ ||
                                    i === 5 /* Sixth row */) {
                                    computedClass = computedClass.concat(" bottom-border");
                                }
                                return(
                                    <td className={computedClass} key={`${i}${j}`}>
                                        <Box
                                            value={this.props.boxes[i][j]}
                                            onClick={() => this.props.onClick(i, j)}
                                            key={`${i}${j}b`}
                                        />
                                    </td>
                                )
                            })
                        }
                        </tr>
                    )
                }
                </tbody>
            </table>
        );
    }
}


class Sudoku extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Sudoku has 81 boxes
            boxes: Array(9).fill(Array(9).fill("")),
            selectedOuter: null,
            selectedInner: null,
        }
    }

    handleClick(i, j) {
        this.setState({
            selectedOuter: i,
            selectedInner: j,
        });
    }

    render() {
        return (
            <div>
                <SudokuBoard
                    boxes={this.state.boxes}
                    onClick={(i, j) => this.handleClick(i, j)}
                    state={this.state}
                />
            </div>
        );
    }
}

ReactDOM.render(
    <Sudoku />,
    document.getElementById('root')
);