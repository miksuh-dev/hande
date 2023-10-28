import { useContext } from "solid-js";
import { ThemeContext } from "context/theme/index";

const useTheme = () => {
  return useContext(ThemeContext);
};

export default useTheme;
