import { useContext } from "solid-js";
import { I18nSetterContext } from "../context/i18n";

const useLanguage = () => {
  return useContext(I18nSetterContext);
};

export default useLanguage;
