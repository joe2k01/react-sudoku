import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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
            <div className="sudoku-container">
                <table>
                    <tbody>
                    {
                        this.props.state.boxes.map((row, i) =>
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

                                    return(
                                        <td className={`box ${computedClass}`} key={`${i}${j}`} onClick={() => this.props.boxClick(i, j)}>
                                            {this.props.state.boxes[i][j]}
                                        </td>
                                    )
                                })
                            }
                            </tr>
                        )
                    }
                    </tbody>
                </table>
                <div className='buttons-container'>
                    {
                        this.props.state.numbers.map((number, k) =>
                            <button key={`${number}Button`} onClick={() => this.props.btnClick(k)}>
                                {number}
                            </button>
                        )
                    }
                </div>

            </div>
        );
    }
}


class Sudoku extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Sudoku has 81 boxes, arrays are funny in this language
            boxes: Array(9).fill().map(row => new Array(9).fill("")),
            selectedOuter: null,
            selectedInner: null,
            numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        }
    }

    boxClick(i, j) {
        this.setState({
            selectedOuter: i,
            selectedInner: j,
        });
    }

    btnClick(k) {
        if(this.state.selectedOuter != null) {
            let tmpBoxes = this.state.boxes;
            tmpBoxes[this.state.selectedOuter][this.state.selectedInner] = this.state.numbers[k];
            this.setState({
                boxes: tmpBoxes,
            })
        }
    }

    render() {
        return (
            <div>
                <SudokuBoard
                    boxClick={(i, j) => this.boxClick(i, j)}
                    btnClick={(k) => this.btnClick(k)}
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