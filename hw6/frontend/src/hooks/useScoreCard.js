import { createContext, useContext, useState } from 'react';

const ADD_MESSAGE_COLOR = '#3d84b8';
const REGULAR_MESSAGE_COLOR = '#2b2e4a';
const ERROR_MESSAGE_COLOR = '#fb3640';

//define context
const ScoreCardContext = createContext({
  messages: [],

  addCardMessage: () => {},
  addRegularMessage: () => {},
  addErrorMessage: () => {},
  addRegularQueryMessage: () => {},
  addErrorQueryMessage: () => {},
  clearMessage: () => {},
});

const makeMessage = (message, color, tabType) => {
  return { message, color, tabType };
};

//define context provider
const ScoreCardProvider = (props) => {
  const [messages, setMessages] = useState([]);

  const addCardMessage = (message) => {
    setMessages([...messages, makeMessage(message, ADD_MESSAGE_COLOR, "ADD")]);
  };

  const addRegularMessage = (...ms) => {
    setMessages(prev => [
      ...prev,
      ...ms.map((m) => makeMessage(m, REGULAR_MESSAGE_COLOR, "ADD")),
    ]);
  };

  const addErrorMessage = (message) => {
    setMessages([...messages, makeMessage(message, ERROR_MESSAGE_COLOR, "ADD")]);
  };

  const addRegularQueryMessage = (...ms) => {
    setMessages(prev => [
      ...prev,
      ...ms.map((m) => makeMessage(m, REGULAR_MESSAGE_COLOR, "QUERY")),
    ]);
  };

  const addErrorQueryMessage = (message) => {
    setMessages([...messages, makeMessage(message, ERROR_MESSAGE_COLOR, "QUERY")]);
  };

  const clearMessage = () => {
    setMessages([]);
  };

  return (
    <ScoreCardContext.Provider
      value={{
        messages,
        addCardMessage,
        addRegularMessage,
        addErrorMessage,
        addRegularQueryMessage,
        addErrorQueryMessage,
        clearMessage
      }}
      {...props}
    />
  );
};

//define context consumer
function useScoreCard() {
  return useContext(ScoreCardContext);
}

//export context provider & context consumer
export { ScoreCardProvider, useScoreCard };
