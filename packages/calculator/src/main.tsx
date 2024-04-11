import * as gui from "@nodegui/nodegui";
import { Accessor, SignalOptions, createEffect, createSignal } from "solid-js";
import {
  EventProps,
  QLabel,
  QMainWindow,
  QPushButton,
  QWidget,
  WidgetEventProps,
  WidgetRegistry,
  handleEvents,
  render,
} from "solid-nodegui";

function QDateTimeEdit(
  props: {
    id?: string;
    dateTime: gui.QDateTime;
  } & EventProps<gui.QDateTimeEditSignals> &
    WidgetEventProps
) {
  let node: gui.QDateTimeEdit;
  const local = handleEvents(() => node, props);
  // @ts-expect-error
  return <q-date-time-edit ref={node} {...local} />;
}

WidgetRegistry.registerWidget("q-date-time-edit", {
  widget: gui.QDateTimeEdit,
  setProperty(node, name, value, prev) {
    if (name === "dateTime") {
      node.setDateTime(value as gui.QDateTime);
      return true;
    }
  },
});

const styleSheet = `
  * {
    font-size: 20px;
    color: white;
  }

  QPushButton {
    min-width: '25%';
    height: 100%;
    border: 1px solid black;
  }

  QPushButton:pressed {
    background: grey;
  }

  #container {
    flex: 1;
    flex-direction: column;
  }

  #btnAC {
    min-width: '25%';
    border-right: 2px solid black;
  }

  #resultText {
    flex: 1;
    qproperty-alignment: 'AlignRight|AlignVCenter';
    padding-right: 5px;
    font-size: 40px;
  }

  #row-0, #row-1, #row-2, #row-3, #row-4 {
    flex: 1;
    justify-content: space-between;
    flex-direction: row;
  }

  #row-0 * {
    background: #1E1E1E;
  }

  #row-0 QPushButton:pressed {
    background: grey;
  }

  #row-1 QPushButton  {
    background: #2E2E2E;
  }

  #row-1 QPushButton:pressed {
    background: grey;
  }

  #row-2 QPushButton, #row-2 QPushButton, #row-3 QPushButton, #row-4 QPushButton  {
    background: #4B4B4B;
  }

  #row-2 QPushButton:pressed, #row-2 QPushButton:pressed, #row-3 QPushButton:pressed, #row-4 QPushButton:pressed  {
    background: grey;
  }

  valueBtn {
    background: #FD8D0E;
  }
  
  valueBtn:pressed {
    background: grey;
  }
`;

function OperatorButton(props: { text: string; onClick }) {
  const operatorStyleSheet = `
    QPushButton {
      background: #FD8D0E;
    }

    QPushButton:pressed {
      background: grey;
    }
  `;

  return (
    <QPushButton
      style={operatorStyleSheet}
      text={props.text}
      on:clicked={props.onClick}
    />
  );
}

function createReducer<T, ActionData extends Array<any>>(
  dispatcher: (state: T, ...args: ActionData) => T,
  initialValue: T,
  options?: SignalOptions<T>
): [accessor: Accessor<T>, dispatch: (...args: ActionData) => void] {
  const [state, setState] = createSignal(initialValue, options);

  return [
    state,
    (...args: ActionData) =>
      void setState((state) => dispatcher(state, ...args)),
  ];
}

interface State {
  display: string;
  total: number;
  pendingOp: string;
  valueBuffer: string;
}
interface Action {
  type: "operation" | "value";
  value: string;
}
const initialState: State = {
  display: "",
  total: 0,
  pendingOp: "~",
  valueBuffer: "",
};

function reducer(state: State, action: Action) {
  console.log("reducer", action);
  const newState = { ...state };
  switch (action.type) {
    case "operation": {
      switch (newState.pendingOp) {
        case "+": {
          newState.total =
            newState.total + parseFloat(state.valueBuffer || "0");
          break;
        }
        case "-": {
          newState.total =
            newState.total - parseFloat(state.valueBuffer || "0");
          break;
        }
        case "*": {
          newState.total =
            newState.total * parseFloat(state.valueBuffer || "0");
          break;
        }
        case "/": {
          newState.total =
            newState.total / parseFloat(state.valueBuffer || "1");
          break;
        }
        case "=": {
          break;
        }
        case "~": {
          newState.total = parseFloat(state.valueBuffer || "0");
          break;
        }
        default:
      }
      newState.valueBuffer = "";
      newState.display = action.value;
      if (action.value === "=") {
        const total = newState.total;
        Object.assign(newState, initialState);
        newState.total = total;
        newState.display = `${total}`;
      }
      if (action.value === "~") {
        Object.assign(newState, initialState);
      }
      newState.pendingOp = `${action.value}`;
      break;
    }
    case "value": {
      if (state.pendingOp === "=") {
        newState.pendingOp = "~";
      }
      if (!state.valueBuffer) {
        newState.display = action.value;
        newState.valueBuffer = `${action.value}`;
      } else {
        newState.display = `${state.display}` + `${action.value}`;
        newState.valueBuffer += `${action.value}`;
      }
      break;
    }
    default:
      throw new Error("Invalid operation");
  }
  return newState;
}

function App() {
  const [state, dispatch] = createReducer(reducer, initialState);
  const onOperator = (value: string) => () => {
    console.log("onOperator", value);
    dispatch({ type: "operation", value });
  };
  const onValue = (value: string) => () => {
    console.log("onValue", value);
    dispatch({ type: "value", value });
  };
  function onKeyRelease(e) {
    const keyEvt = new gui.QKeyEvent(e);
    console.log("onKeyRelease", keyEvt);
    const operatorKeys = ["~", "/", "*", "-", "=", "+"];
    const valueKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."];
    const keyText = keyEvt.text();
    if (operatorKeys.includes(keyText)) {
      dispatch({ type: "operation", value: keyText });
    } else if (valueKeys.includes(keyText)) {
      dispatch({ type: "value", value: keyText });
    }
  }

  createEffect(() => {
    console.log("result", state().display || "0");
  });

  const dateTime = new gui.QDateTime();

  return (
    <QMainWindow
      title="Calculator"
      maxWidth={500}
      maxHeight={700}
      minWidth={300}
      minHeight={400}
      style={styleSheet}
      on:KeyRelease={onKeyRelease}
    >
      <QWidget id="container" on:KeyRelease={console.log}>
        <QWidget id="row-0">
          <QPushButton id="btnAC" text="AC" on:clicked={onOperator("~")} />
          <QLabel id="resultText" text={state().display || "0"} />
        </QWidget>
        <QWidget id="row-1">
          <QPushButton id="valueBtn" text="7" on:clicked={onValue("7")} />
          <QPushButton id="valueBtn" text="8" on:clicked={onValue("8")} />
          <QPushButton id="valueBtn" text="9" on:clicked={onValue("9")} />
          <OperatorButton text="/" onClick={onOperator("/")} />
        </QWidget>
        <QWidget id="row-2">
          <QPushButton id="valueBtn" text="4" on:clicked={onValue("4")} />
          <QPushButton id="valueBtn" text="5" on:clicked={onValue("5")} />
          <QPushButton id="valueBtn" text="6" on:clicked={onValue("6")} />
          <OperatorButton text="x" onClick={onOperator("*")} />
        </QWidget>
        <QWidget id="row-3">
          <QPushButton id="valueBtn" text="1" on:clicked={onValue("1")} />
          <QPushButton id="valueBtn" text="2" on:clicked={onValue("2")} />
          <QPushButton id="valueBtn" text="3" on:clicked={onValue("3")} />
          <OperatorButton text="-" onClick={onOperator("-")} />
        </QWidget>
        <QWidget id="row-4">
          <QPushButton id="valueBtn" text="0" on:clicked={onValue("0")} />
          <QPushButton
            id="valueBtn"
            text="."
            enabled={!state().valueBuffer.includes(".")}
            on:clicked={onValue(".")}
          />
          <QPushButton id="opBtn" text="=" on:clicked={onOperator("=")} />
          <OperatorButton text="+" onClick={onOperator("+")} />
        </QWidget>
        <QWidget>
          <QDateTimeEdit
            dateTime={dateTime}
            on:dateTimeChanged={(qDateTime) => {
              console.log(
                qDateTime.date().year(),
                qDateTime.date().month(),
                qDateTime.date().day(),
                qDateTime.time().hour(),
                qDateTime.time().minute(),
                qDateTime.time().second()
              );
            }}
          />
        </QWidget>
      </QWidget>
    </QMainWindow>
  );
}

render(() => <App />);
