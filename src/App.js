import "./styles.css";
import {useReducer} from 'react';
import CalculatorDigitButton from "./CalculatorDigitButton";
import CalculatorOperationButton from "./CalculatorOperationButton";

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operations',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}){
  switch (type)
  {
    case ACTIONS.ADD_DIGIT:

     // 4 + 5 =
     //output => 9
     // now we type 2
     // it appends digit to previous result => 92
     // but it's not correct so 
     // after evaluating result 4 + 5 = 9
     // currentNumber = 9
     // when we type 2 then 
     //Instead of appending digit 2 with previous result
     // currentNumber should be overwrite with new digit
     // currentNumber  = 2
     // output => 2

      if(state.overwrite){
        return {
          ...state,
           currentNumber : payload.digit,
           overwrite : false,
         }
      } 

        //  if we have 0 in our currentNumber adding 0 to it will still be 0 
        //  so we can avoid appending 0 to zeros as 0000 == 0 and  0 == 0
      if(payload.digit == "0" && state.currentNumber == "0")
          return state;

      //  check if already we have "." operand in currentNumber adding one more will make invalid number
      //  ex valid number -> 2345.899
      //  invalid number -> 2345.678.3445   
      if(payload.digit == "." && state.currentNumber.includes("."))
          return state;   
          
       // for other digits you can add that to currentNumber 
       //if currentNumber is null asign it empty string   
       return {
        ...state,
        currentNumber : `${state.currentNumber || ""}${payload.digit}`
       }

       //Set all constants value to empty to clear output section
       case ACTIONS.CLEAR:
          return {}

       case ACTIONS.CHOOSE_OPERATION:

       //check if we only click on operation button
       // and previous and current numbers are null this operation can not be used
       // state cannot be changes therefore state is returned
          if(state.currentNumber == null && state.previousNumber == null)
             return state;

        //ex 4 * +
        // previousNumber = 4
        // operation = *
        // currentNumber = null
        // operation = +
        // output => 4 +     
        if(state.currentNumber == null){
          return{
            ...state,
            operation: payload.operation
          }
        }     

        //shift current number to previous number if previousNumber is null
        //ex 45 *   
        // currentNumber = 45
        // operand  = *   
          if(state.previousNumber == null){
            return {
              ...state,
              operation : payload.operation,
              previousNumber : state.currentNumber,
              currentNumber : null,
            } 
          }  
  
         //ex 4 * 5 + 
         // previousNumber = 4
         // Operation = *
         // currentNumber = 5
         // Operation = +
         //output = 20 +
         return {
          ...state,
          previousNumber : evaluate(state),
          operation : payload.operation,
          currentNumber : null,
         }

      case ACTIONS.EVALUATE:
         //ex 15 -
         //  previousNumber = 15
         //  operation = -
         //  currentNumber = null
         //  output => 15 - ("no change since all information for evaluation is not present")
          if(state.operation == null ||
            state.currentNumber == null ||
            state.previousNumber == null){
              return state;
          }

          // ex 23 - 3
          // previousNumber = 23
          // currentNumber = 3
          // operation = -
          // output = 20
          return {
            ...state,
           overwrite : true,
           currentNumber : evaluate(state),
           previousNumber : null,
           operation : null,
          }

        case ACTIONS.DELETE_DIGIT:

          // ex 4*5 = 20 
          // action delete
          // change currentNumber value and also change overwrite value to
          // false since currentNumber is overwrite
          if(state.overwrite) 
          {
            return {
              ...state,
              currentNumber: null,
              overwrite: false
            }
          } 

          //no currentNumber no change required
          if(state.currentNumber == null) return state

          //when we delete one digit from currentNumber it becomes null
          if(state.currentNumber.length === 1){
            return {...state, currentNumber : null}
          }

          //remove last digit from current number
          return {
            ...state,
            currentNumber : state.currentNumber.slice(0, -1)
          }


  }

}

const INTEGER_FORMATTER = new Intl.NumberFormat("es-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if(operand == null) return 
  const [integer, decimal] = operand.toString().split('.')
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}



function evaluate({previousNumber, currentNumber, operation}){
  const prev = parseFloat(previousNumber);
  const curr = parseFloat(currentNumber);

  if(isNaN(prev) || isNaN(curr)){
    return "";
  }

  let computation = "";

  switch(operation){
    case "+":
      computation = prev + curr;
      break;
    
    case "-":
       computation = prev - curr;
       break;  

    case "*":
       computation = prev * curr;
        break; 

    case "/":
        computation = prev / curr;
        break; 
  }

  return computation;
}

function App() {
  const [{previousNumber, currentNumber, operation}, dispatch] = useReducer(reducer, {});

  // dispatch({type: ACTIONS.ADD_DIGIT, payload: {digit: 1}});
  return (
    <div className="container">
      <div className="display">
        <div className="prevOperand">{formatOperand(previousNumber)} {operation}</div>
        <div className="currOperand">{formatOperand(currentNumber)}</div>
      </div>
      <button className="span" onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <CalculatorOperationButton operation="/" dispatch={dispatch}/>
      <CalculatorDigitButton digit="1" dispatch={dispatch}/>
      <CalculatorDigitButton digit="2" dispatch={dispatch}/>
      <CalculatorDigitButton digit="3" dispatch={dispatch}/>
      <CalculatorOperationButton operation="*" dispatch={dispatch}/>
      <CalculatorDigitButton digit="4" dispatch={dispatch}/>
      <CalculatorDigitButton digit="5" dispatch={dispatch}/>
      <CalculatorDigitButton digit="6" dispatch={dispatch}/>
      <CalculatorOperationButton operation="-" dispatch={dispatch}/>
      <CalculatorDigitButton digit="7" dispatch={dispatch}/>
      <CalculatorDigitButton digit="8" dispatch={dispatch}/>
      <CalculatorDigitButton digit="9" dispatch={dispatch}/>
      <CalculatorOperationButton operation="+" dispatch={dispatch}/>
      <CalculatorDigitButton digit="." dispatch={dispatch}/>
      <CalculatorDigitButton digit="0" dispatch={dispatch}/>
      <button className="span" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
