import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//================================
let ids = 0;
const ID = () => ++ids;
//================================

function Box(props) {
    return (
        <button className="box" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class SudokuBoard extends React.Component {
    render() {
        let outer;
        return (
            <div className="sudoku">
                {
                    this.props.boxes.map((row, i) => 
                        <div className="row" key={ID()}>
                            {
                                row.map((val, j) => 
                                <Box
                                    value={this.props.boxes[i][j]}
                                    onChange={() => this.props.onChange(i)}
                                    key={ID()}
                                />
                                )
                            }
                        </div>
                    )
                }
            </div>
        );
    }
}


class Sudoku extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Sudoku has 81 boxes
            boxes: Array(9).fill(Array(9).fill("")),
        }
    }

    handleChange(i) {

    }

    render() {
        return (
            <div className="sudou">
                <div className="sudoku-board">
                    <SudokuBoard
                        boxes={this.state.boxes}
                        onChange={(i) => this.handleChange(i)}
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