import { createContext, useState } from "react";

const ToggleContext = createContext({});

const initialState = {
  sidebar: false,
  audio: true,
  video: true,
  screenshare: false,
  profile: false,
  whitboard: false,
};

export const ToggleProvider = ({ children }) => {
  const [toggleClicked, setToggleClicked] = useState(initialState);
  const [toggleSidebarOption, setToggleSidebarOption] = useState(true);

  const handleToggleClick = (clicked) =>
    setToggleClicked((prevState) => ({
      ...prevState,
      [clicked]: !prevState[clicked],
    }));

  return (
    <ToggleContext.Provider
      value={{
        toggleClicked,
        setToggleClicked,
        toggleSidebarOption,
        setToggleSidebarOption,
        handleToggleClick,
      }}
    >
      {children}
    </ToggleContext.Provider>
  );
};

export default ToggleContext;
