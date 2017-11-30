import React from "react";
import RadioList from "./RadioList.jsx";
import { If } from "./functions.jsx";

// import questions
const quiz = require('../json/pre-test.json');

export default class PreTest extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            questions: quiz['pre-test'],
            UserChoices: new Array(9).fill(null),
            marked: false,
            correctCnt: 0
        }
        this.unlock = this.unlock.bind(this);
        this.handleChangeValue = this.handleChangeValue.bind(this);
        this.checkAnswers = this.checkAnswers.bind(this);
        this.isCorrect = this.isCorrect.bind(this);
    }

    unlock(){
        // determine which chapters to unlock
        const items = ['color', 'rgb', 'hex'];
        let unlockItems = [];
        let idx = 0;
        this.state.questions.forEach((sec, id) => {
            let cnt = 0;
            sec.questions.forEach((q) => {
                cnt += q.answer === this.state.UserChoices[idx];
                idx ++;
            });
            if (cnt == sec.questions.length) {
                unlockItems.push(items[id]);
            }
        });
        this.props.handleUnlock('pre-test', unlockItems);
        this.props.handleJump('index');
    }

    handleChangeValue(ansSet){
        let UserChoices = this.state.UserChoices;
        UserChoices[ansSet.qNum] = ansSet.ans;
        this.setState({UserChoices});
    }

    checkAnswers(){
        let cnt = 0;
        let idx = 0;
        this.state.questions.forEach((sec) => {
            sec.questions.forEach((q) => {
                cnt += q.answer === this.state.UserChoices[idx];
                idx ++;
            });
        });
        this.setState({correctCnt: cnt, marked: true});
    }

    isCorrect(idx){
        return this.state.questions[idx].answer === this.state.UserChoices[idx]
    }

    render(){
        let qIdx = -1;
        return(
            <div className={`mainWrapper questionsWrapper ${this.state.marked ? 'marked' : ''}`}>
                <h1>pre-test</h1>
                {this.state.questions.map((sec, idx) => {
                    let sec_correctCnt = 0;
                    return(
                        <div key={`section-${idx}`}>
                            <h2>{sec.title}</h2>
                            {sec.questions.map((q, id) => {
                                qIdx += 1;
                                const status = q.answer === this.state.UserChoices[qIdx] ? 'correct' : 'wrong';
                                return(
                                    <div className='questionItem' key={`questionBlock-${qIdx}`}>
                                        <h3 className={`question ${status}`}>{qIdx + 1}.{q.question}</h3>
                                        <RadioList
                                            name={`answers-${qIdx}`}
                                            qNum={qIdx}
                                            answer={q.answer}
                                            disabled={this.state.marked}
                                            checked={this.state.UserChoices[qIdx]}
                                            items={q.choices}
                                            onChangeValue={this.handleChangeValue}
                                            />
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
                <br/>
                <If condition={!this.state.marked}>
                    <button
                        className='mainBtn center'
                        onClick={this.checkAnswers}>
                        check answers
                    </button>
                </If>
                <If condition={this.state.marked}>
                        <p className='scoreText'>score: {this.state.correctCnt}/9</p>
                    <button
                        className='nextBtn mainBtn medium'
                        onClick={this.unlock}>
                        to index
                    </button>
                </If>
            </div>
        );
    }
}
