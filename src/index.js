import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Box(props) {
    return (
        <input type="number" min="0" max="9" value={props.value}/>
    );
}

class SudokuBoard extends React.Component {
    renderBox(i) {
        return(
            <Box
                value={this.props.boxes[i]}
            />
        )
    }

    render() {
        const mBoxes = Array(81).fill(null);
        for(let i = 0; i < 81; i++) {
            mBoxes[i] = this.renderBox(i);
            console.log(i);
        }

        const mLines = Array(9).fill(null);
        const line = Array(9).fill(null);
        let linesCount = 0;
        let lineCount = 0;
        // Generate 9x9 array
        for(let j = 0; j < 81; j++) {
            line[lineCount] = mBoxes[j];
            lineCount++;
            if(lineCount === 9) {
                mLines[linesCount] = line;
                linesCount++;
                lineCount = 0;
            }
        }

        return (
            <div>
                <table>
                    <tbody>
                    {
                        mLines.map(row =>
                            <tr>
                                {
                                    row.map(box =>
                                        <td>{box}</td>
                                    )
                                }
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}


class Sudoku extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Sudoku has 81 boxes
            boxes: Array(81).fill(""),
        }
    }

    render() {
        return (
            <div className="sudou">
                <div className="sudoku-board">
                    <SudokuBoard
                        boxes={this.state.boxes}
                    />
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Sudoku />,
    document.getElementById('root')
);