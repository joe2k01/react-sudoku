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
                <h3>Errors: {this.props.state.errors}</h3>
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
                                    if(i <= outerUpBoundary && i >= outerLoBoundary && inner !== null) {
                                        if(j <= innerUpBoundary && j >= innerLoBoundary) {
                                            computedClass = "affected-box"
                                        }
                                    }

                                    if((this.props.state.boxes[i][j] !== "") && (this.props.state.boxes[i][j] !== this.props.state.solution[i][j])) {
                                        computedClass = computedClass.concat(" wrong");
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
        let mSudoku = this.populateSudoku();
        this.state = {
            // Sudoku has 81 boxes
            boxes: mSudoku.boxes,
            solution: mSudoku.solution,
            prohibitedIndexes: Array(9).fill().map(row => new Array(9).fill(false)),
            selectedOuter: null,
            selectedInner: null,
            numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            errors: 0,
        }
    }

    boxClick(i, j) {
        if(this.state.prohibitedIndexes[i][j]) {
            this.setState({
                selectedOuter: null,
                selectedInner: null,
            });
        } else {
            this.setState({
                selectedOuter: i,
                selectedInner: j,
            });
        }
    }

    btnClick(k) {
        if(this.state.selectedOuter !== null) {
            let tmpBoxes = this.state.boxes;
            tmpBoxes[this.state.selectedOuter][this.state.selectedInner] = this.state.numbers[k];
            this.setState({
                boxes: tmpBoxes,
            })

            let mErrors = this.state.errors;
            if(this.state.numbers[k] !== this.state.solution[this.state.selectedOuter][this.state.selectedInner]) {
                mErrors++;
                this.setState({
                    errors: mErrors,
                })
            }
        }
    }

    populateSudoku() {
        let solution = Array(9).fill().map(row => new Array(9).fill(""));
        let mSolution = Array(9).fill().map(row => new Array(9).fill(""));
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                
        // Shuffle array (Fisher-Yates algorithm)
        mSolution[0] = numbers;
        for(var i = 8; i > 0; i--) {
            var randomN = Math.floor(Math.random() * (i + 1));

            let tmp = mSolution[0][i];
            mSolution[0][i] = mSolution[0][randomN];
            mSolution[0][randomN] = tmp;
        }

        // Rotate by 3 next two rows, then rotate by 1. Repeat
        for(var j = 1; j < 9; j++) {
            mSolution[j] = mSolution[j - 1].slice();
            // Decide whether to rotate by 3 or one depending on row index.
            var rotation = (j % 3 === 0) ? 1 : 3;
            for(var k = 0; k < rotation; k++) {
                mSolution[j].push(mSolution[j].shift());
            }
        }

        
        // Give symmetric clues
        let mBoxes = Array(9).fill().map(row => new Array(9).fill(""));
        for(let row = 0; row < 9; row++) {
            mBoxes[row] = mSolution[row].slice();
        }
        let usedIndexes = [];
        for(var l = 0; l < 4; l++) {
            usedIndexes = [];
            for(var m = 0; m < 5; m++) {
                let randomIndex = Math.trunc(Math.random() * 9);
                
                while(usedIndexes.includes(randomIndex)) {
                    randomIndex = Math.trunc(Math.random() * 9);
                }
                usedIndexes.push(randomIndex);
                mBoxes[l][randomIndex] = "";
                mBoxes[8 - l][8 - randomIndex] = "";
            }
        }

        usedIndexes = [];
        for(var n = 0; n < 5; n++) {
            let randomIndex = Math.trunc(Math.random() * 9);
            
            while(usedIndexes.includes(randomIndex)) {
                randomIndex = Math.trunc(Math.random() * 9);
            }
            usedIndexes.push(randomIndex);
            mBoxes[4][randomIndex] = "";
        }
        
        return {
            'boxes': mBoxes,
            'solution': mSolution
        };
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